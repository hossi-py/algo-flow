import { canonicalJson } from "@/lib/runner/compare";
import { judge } from "@/lib/runner/judge";
import type { PythonRunner } from "@/lib/runner-node/node-runner";
import type {
  GenerationRequest,
  GenerationStatus,
  JsonValue,
  Problem,
  VerificationAttempt,
  VerificationStage,
} from "@/types";
import { buildProblem, GENERATED_RECURSION_LIMIT, GENERATED_TIME_LIMIT_MS, type ExecutedCase } from "./build-problem";
import { problemDraftSchema, type ProblemDraft } from "./schemas";
import { MAX_SOLUTION_CHARS } from "./static-check";

/**
 * AI 문제 생성 → 검증 파이프라인 (docs/02 §3.2).
 *   [1] 스키마  [2] 정적 검사  [3] 정답 코드 실행으로 expected 계산  [4] 결정성(다른 해시 시드로 재실행)
 *   [5] 품질 검사(케이스 구성, 알고리즘 이름 노출, 힌트4가 전체 정답인지, 완성 문제 재채점)
 * 실패하면 사유를 붙여 다시 생성하고, MAX_ATTEMPTS번 모두 실패하면 rejected.
 */

export const MAX_ATTEMPTS = 3;
/** 케이스당 정답 코드 실행 제한 (사용자 제한 시간의 1/4) */
export const CASE_TIME_LIMIT_MS = GENERATED_TIME_LIMIT_MS / 4;
/** 한 번의 검증에서 정답 코드 실행 시간 합계 상한 */
export const TOTAL_RUN_BUDGET_MS = 15_000;
/** 워커를 끊기 전 기다리는 시간 (느린 정답을 "시간 초과"와 구분해 알려 주기 위해 넉넉히) */
const HARD_TIMEOUT_MS = 2000;
const MAX_ARGS_CHARS = 100_000;
const MAX_EXPECTED_CHARS = 50_000;

/** 문제 본문에 알고리즘 이름을 쓰면 유형 인식 훈련이 안 되므로 막는다 */
const ALGORITHM_NAME_PATTERN =
  /\b(DFS|BFS)\b|깊이\s*우선|너비\s*우선|넓이\s*우선|백트래킹|backtracking|스택을\s*(사용|이용)|큐를\s*(사용|이용)|재귀를\s*(사용|이용)|해시를\s*(사용|이용)|이분\s*탐색|binary\s*search|동적\s*계획|dynamic\s*programming|\bDP\b|그리디|탐욕\s*(법|알고리즘)|greedy/i;

export interface DraftRequest {
  request: GenerationRequest;
  attempt: number;
  /** 직전 시도가 떨어진 이유 (첫 시도면 null) */
  previousFailure: { stage: VerificationStage; reason: string } | null;
}

export interface PipelineDeps {
  /** LLM에서 초안(JSON 값)을 받아 온다. 형식 검증은 파이프라인이 한다 */
  draft: (input: DraftRequest) => Promise<unknown>;
  /** 정답 코드 실행 (정적 검사 포함) */
  runner: PythonRunner;
  /** 결정성 검사용: 다른 PYTHONHASHSEED로 띄운 러너 */
  secondRunner: PythonRunner;
  onStatus?: (update: {
    status: Extract<GenerationStatus, "generating" | "verifying">;
    attempt: number;
    attempts: VerificationAttempt[];
  }) => void;
  now?: () => Date;
}

export type PipelineResult =
  | { status: "verified"; problem: Problem; solution: string; attempts: VerificationAttempt[] }
  | { status: "rejected"; attempts: VerificationAttempt[]; error: string };

/** LLM 응답을 초안으로 읽을 수 없을 때 draft()가 던진다 (잘린 출력, JSON 아님 등). 스키마 실패로 보고 다시 생성한다 */
export class DraftFormatError extends Error {}

class StageFailure extends Error {
  constructor(
    readonly stage: VerificationStage,
    reason: string,
  ) {
    super(reason);
  }
}

function describeOutcome(outcome: Awaited<ReturnType<PythonRunner["run"]>>): string {
  switch (outcome.kind) {
    case "ok":
      return "정상 종료";
    case "error":
      return `${outcome.error.type}: ${outcome.error.message}${outcome.error.line ? ` (${outcome.error.line}번째 줄)` : ""}`;
    case "timeout":
      return `${HARD_TIMEOUT_MS}ms 안에 끝나지 않음 (무한 루프이거나 너무 느림)`;
    case "crash":
      return `실행 엔진 오류: ${outcome.message}`;
  }
}

function parseDraft(raw: unknown): { draft: ProblemDraft; args: JsonValue[][] } {
  const parsed = problemDraftSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 5)
      .map((issue) => `${issue.path.join(".") || "(전체)"}: ${issue.message}`)
      .join("; ");
    throw new StageFailure("schema", `초안 형식이 맞지 않아요 — ${issues}`);
  }
  const draft = parsed.data;
  const args = draft.testInputs.map((input, index) => {
    if (input.argsJson.length > MAX_ARGS_CHARS) {
      throw new StageFailure("schema", `testInputs[${index}].argsJson이 너무 길어요 (${MAX_ARGS_CHARS}자 이하)`);
    }
    let value: unknown;
    try {
      value = JSON.parse(input.argsJson);
    } catch {
      throw new StageFailure("schema", `testInputs[${index}].argsJson이 올바른 JSON이 아니에요`);
    }
    if (!Array.isArray(value)) {
      throw new StageFailure("schema", `testInputs[${index}].argsJson은 인자 배열(JSON 배열)이어야 해요`);
    }
    if (value.length !== draft.params.length) {
      throw new StageFailure(
        "schema",
        `testInputs[${index}]의 인자 수(${value.length})가 params 수(${draft.params.length})와 달라요`,
      );
    }
    return value as JsonValue[];
  });
  const names = draft.params.map((p) => p.name);
  if (new Set(names).size !== names.length) throw new StageFailure("schema", "params 이름이 겹쳐요");
  return { draft, args };
}

async function executeAll(runner: PythonRunner, code: string, args: JsonValue[][]): Promise<ExecutedCase[]> {
  const executed: ExecutedCase[] = [];
  let spent = 0;
  for (const [index, caseArgs] of args.entries()) {
    const outcome = await runner.run(code, caseArgs, {
      recursionLimit: GENERATED_RECURSION_LIMIT,
      timeoutMs: HARD_TIMEOUT_MS,
    });
    if (outcome.kind !== "ok") {
      throw new StageFailure(
        "execution",
        `${index + 1}번째 테스트 입력에서 정답 코드 실패 — ${describeOutcome(outcome)}`,
      );
    }
    if (outcome.timeMs > CASE_TIME_LIMIT_MS) {
      throw new StageFailure(
        "execution",
        `${index + 1}번째 테스트 입력에서 정답 코드가 ${Math.round(outcome.timeMs)}ms 걸렸어요 (${CASE_TIME_LIMIT_MS}ms 이하여야 해요). 입력 크기를 줄이거나 더 빠른 풀이를 쓰세요`,
      );
    }
    spent += outcome.timeMs;
    if (spent > TOTAL_RUN_BUDGET_MS) {
      throw new StageFailure("execution", `정답 코드 실행 시간 합계가 ${TOTAL_RUN_BUDGET_MS}ms를 넘었어요`);
    }
    if (JSON.stringify(outcome.value).length > MAX_EXPECTED_CHARS) {
      throw new StageFailure(
        "execution",
        `${index + 1}번째 테스트의 반환값이 너무 커요 (${MAX_EXPECTED_CHARS}자 이하)`,
      );
    }
    executed.push({ args: caseArgs, expected: outcome.value });
  }
  return executed;
}

async function checkQuality(
  runner: PythonRunner,
  draft: ProblemDraft,
  problem: Problem,
  solution: string,
): Promise<void> {
  const examples = problem.testCases.filter((t) => t.visibility === "example").length;
  const hidden = problem.testCases.length - examples;
  if (examples < 2 || examples > 3)
    throw new StageFailure("quality", `예제 케이스는 2~3개여야 해요 (지금 ${examples}개)`);
  if (hidden < 4) throw new StageFailure("quality", `숨은 케이스는 4개 이상이어야 해요 (지금 ${hidden}개)`);
  if (!draft.testInputs.some((t) => t.purpose === "edge")) {
    throw new StageFailure("quality", "경계값(purpose: edge) 케이스가 하나 이상 있어야 해요");
  }
  const outputs = new Set(problem.testCases.map((t) => canonicalJson(t.expected)));
  if (outputs.size === 1) {
    throw new StageFailure("quality", "모든 테스트의 기대값이 같아요. 서로 다른 답이 나오는 입력을 섞어 주세요");
  }
  const inputs = new Set(problem.testCases.map((t) => canonicalJson(t.args)));
  if (inputs.size !== problem.testCases.length) throw new StageFailure("quality", "똑같은 테스트 입력이 중복돼요");

  const exposed = [draft.title, draft.summary, draft.statement].find((text) => ALGORITHM_NAME_PATTERN.test(text));
  if (exposed) {
    throw new StageFailure("quality", "제목·요약·문제 설명에 알고리즘 이름이나 풀이 방법을 직접 쓰면 안 돼요");
  }

  const run = (code: string) =>
    judge({
      problem,
      mode: "submit",
      execute: (args) =>
        runner.run(code, args, { recursionLimit: GENERATED_RECURSION_LIMIT, timeoutMs: HARD_TIMEOUT_MS }),
    });

  // 힌트 4가 그대로 정답이면 안 된다 (빈칸이 있어 실행이 안 되거나, 틀려야 정상)
  const keyCode = problem.hints[3].code?.code.python;
  if (keyCode && /^\s*def\s+solution\s*\(/m.test(keyCode)) {
    const hintResult = await run(keyCode);
    if (hintResult.verdict === "accepted") {
      throw new StageFailure("quality", "힌트 4의 코드가 그대로 정답이에요. 핵심 부분만 빈칸을 남겨 보여 주세요");
    }
  }

  // 완성된 문제를 정답 코드로 다시 채점해 실제로 풀리는지 확인
  const final = await run(solution);
  if (final.verdict !== "accepted") {
    throw new StageFailure("quality", `완성된 문제를 정답 코드로 채점했더니 ${final.verdict}가 나왔어요`);
  }
}

export async function runGenerationPipeline(
  id: string,
  request: GenerationRequest,
  deps: PipelineDeps,
): Promise<PipelineResult> {
  const now = deps.now ?? (() => new Date());
  const attempts: VerificationAttempt[] = [];
  let previousFailure: DraftRequest["previousFailure"] = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    deps.onStatus?.({ status: "generating", attempt, attempts: [...attempts] });
    const started = now().getTime();
    let stage: VerificationStage = "schema";
    try {
      let raw: unknown;
      try {
        raw = await deps.draft({ request, attempt, previousFailure });
      } catch (error) {
        if (error instanceof DraftFormatError) throw new StageFailure("schema", error.message);
        throw error;
      }
      deps.onStatus?.({ status: "verifying", attempt, attempts: [...attempts] });
      const { draft, args } = parseDraft(raw);

      stage = "static-check";
      const solution = draft.referenceSolution;
      if (solution.length > MAX_SOLUTION_CHARS) {
        throw new StageFailure(stage, `정답 코드가 너무 길어요 (${MAX_SOLUTION_CHARS}자 이하)`);
      }
      const issues = await deps.runner.check(solution);
      if (issues.length > 0) throw new StageFailure(stage, `정답 코드 정적 검사 실패 — ${issues.join("; ")}`);

      stage = "execution";
      const executed = await executeAll(deps.runner, solution, args);

      stage = "determinism";
      const again = await executeAll(deps.secondRunner, solution, args);
      const unstable = executed.findIndex(
        (run, index) => canonicalJson(run.expected) !== canonicalJson(again[index]?.expected ?? null),
      );
      if (unstable !== -1) {
        throw new StageFailure(
          stage,
          `${unstable + 1}번째 테스트에서 정답 코드를 두 번 실행한 결과가 달라요. set·dict 순서나 무작위에 의존하지 않게 고치세요`,
        );
      }

      stage = "quality";
      const problem = buildProblem(id, request, draft, executed);
      await checkQuality(deps.runner, draft, problem, solution);

      attempts.push({
        attempt,
        stage: "quality",
        ok: true,
        reason: null,
        durationMs: now().getTime() - started,
        at: now().toISOString(),
      });
      return { status: "verified", problem, solution, attempts };
    } catch (error) {
      const failure =
        error instanceof StageFailure
          ? error
          : new StageFailure(
              stage,
              `검증 중 예상하지 못한 오류: ${error instanceof Error ? error.message : String(error)}`,
            );
      attempts.push({
        attempt,
        stage: failure.stage,
        ok: false,
        reason: failure.message,
        durationMs: now().getTime() - started,
        at: now().toISOString(),
      });
      previousFailure = { stage: failure.stage, reason: failure.message };
    }
  }

  return {
    status: "rejected",
    attempts,
    error: `검증을 ${MAX_ATTEMPTS}번 모두 통과하지 못했어요. 마지막 사유: ${previousFailure?.reason ?? "알 수 없음"}`,
  };
}
