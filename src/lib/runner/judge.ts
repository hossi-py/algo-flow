import type {
  CaseVerdict,
  CodeError,
  JsonValue,
  JudgeMode,
  JudgeResult,
  Problem,
  TestCase,
  TestCaseResult,
  Verdict,
} from "@/types";
import { isAnswerCorrect } from "./compare";

/** 케이스 하나를 실행한 결과 (워커·Node 하네스 공통 형태) */
export type ExecOutcome =
  | { kind: "ok"; value: JsonValue; stdout: string; timeMs: number }
  | { kind: "error"; phase: "compile" | "runtime"; error: CodeError; stdout: string; timeMs: number }
  | { kind: "timeout"; timeMs: number }
  /** 실행 엔진 자체가 실패 (로딩 실패, 워커 충돌 등) */
  | { kind: "crash"; message: string };

export type CaseExecutor = (args: JsonValue[], testCase: TestCase) => Promise<ExecOutcome>;

export interface JudgeOptions {
  problem: Pick<Problem, "testCases" | "judge">;
  mode: JudgeMode;
  execute: CaseExecutor;
  /** 케이스 하나가 끝날 때마다 (완료 개수, 전체 개수) */
  onProgress?: (done: number, total: number) => void;
}

const VERDICT_BY_CASE: Record<Exclude<CaseVerdict, "passed" | "not-run">, Verdict> = {
  failed: "wrong-answer",
  "runtime-error": "runtime-error",
  "time-limit-exceeded": "time-limit-exceeded",
};

export function casesForMode(testCases: TestCase[], mode: JudgeMode): TestCase[] {
  return mode === "run" ? testCases.filter((t) => t.visibility === "example") : testCases;
}

/**
 * 테스트케이스를 순서대로 실행해 채점한다.
 * - 문법 오류: 첫 케이스에서 멈추고 syntax-error
 * - 시간 초과: 그 케이스를 TLE로 표시하고 나머지는 미실행
 * - 제출 모드에서 숨은 케이스는 통과 여부만 보여 주고, 처음 틀린 케이스 하나만 내용 공개 (문제 설정에 따라)
 * - 최종 판정은 처음으로 통과하지 못한 케이스의 종류를 따른다
 */
export async function judge({ problem, mode, execute, onProgress }: JudgeOptions): Promise<JudgeResult> {
  const cases = casesForMode(problem.testCases, mode);
  const results: TestCaseResult[] = [];
  let firstFailureRevealed = false;
  let stopReason: "compile" | "timeout" | "crash" | null = null;
  let compileError: CodeError | undefined;
  let crashMessage: string | null = null;
  let totalTimeMs = 0;

  for (const [index, testCase] of cases.entries()) {
    const base = { testCaseId: testCase.id, visibility: testCase.visibility };

    if (stopReason) {
      results.push({ ...base, verdict: "not-run", timeMs: null, stdout: "", revealed: false });
      continue;
    }

    const outcome = await execute(testCase.args, testCase);
    const isExample = testCase.visibility === "example";

    let verdict: CaseVerdict;
    let result: TestCaseResult;
    switch (outcome.kind) {
      case "ok": {
        verdict = isAnswerCorrect(outcome.value, testCase.expected, problem.judge.compare) ? "passed" : "failed";
        result = {
          ...base,
          verdict,
          timeMs: outcome.timeMs,
          stdout: outcome.stdout,
          revealed: false,
          actual: outcome.value,
        };
        totalTimeMs += outcome.timeMs;
        break;
      }
      case "error": {
        verdict = "runtime-error";
        result = {
          ...base,
          verdict,
          timeMs: outcome.timeMs,
          stdout: outcome.stdout,
          revealed: false,
          error: outcome.error,
        };
        totalTimeMs += outcome.timeMs;
        if (outcome.phase === "compile") {
          stopReason = "compile";
          compileError = outcome.error;
        }
        break;
      }
      case "timeout": {
        verdict = "time-limit-exceeded";
        result = { ...base, verdict, timeMs: outcome.timeMs, stdout: "", revealed: false };
        totalTimeMs += outcome.timeMs;
        stopReason = "timeout";
        break;
      }
      case "crash": {
        verdict = "not-run";
        result = { ...base, verdict, timeMs: null, stdout: "", revealed: false };
        stopReason = "crash";
        crashMessage = outcome.message;
        break;
      }
    }

    // 입력·기대값 공개 여부
    const failed = verdict !== "passed" && verdict !== "not-run";
    let revealed = isExample;
    if (!isExample && failed && !firstFailureRevealed && problem.judge.revealFirstFailure) {
      revealed = true;
    }
    if (failed && !firstFailureRevealed) firstFailureRevealed = true;

    if (revealed) {
      result = { ...result, revealed: true, args: testCase.args, expected: testCase.expected };
    } else if (!isExample) {
      // 숨은 케이스의 실제 출력·print는 입력을 짐작하게 하므로 숨긴다
      result = { ...result, actual: undefined, stdout: "" };
    }

    results.push(result);
    onProgress?.(index + 1, cases.length);
  }

  const passed = results.filter((r) => r.verdict === "passed").length;
  let verdict: Verdict;
  if (crashMessage !== null) {
    verdict = "internal-error";
  } else if (stopReason === "compile") {
    verdict = "syntax-error";
  } else {
    const firstBad = results
      .map((r) => r.verdict)
      .find((v): v is keyof typeof VERDICT_BY_CASE => v !== "passed" && v !== "not-run");
    verdict = firstBad ? VERDICT_BY_CASE[firstBad] : "accepted";
  }

  return {
    mode,
    verdict,
    passed,
    total: cases.length,
    results,
    totalTimeMs,
    ...(compileError ? { compileError } : {}),
    ...(crashMessage !== null ? { engineError: crashMessage } : {}),
  };
}
