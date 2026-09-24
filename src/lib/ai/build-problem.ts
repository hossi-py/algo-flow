import { SIGNALS } from "@/content/signals";
import { BASE_XP_BY_LEVEL, DEFAULT_HINT_PENALTY } from "@/lib/progress/xp";
import type { GenerationRequest, HintSet, JsonValue, LanguageMap, ParamSpec, Problem, TestCase } from "@/types";
import type { ProblemDraft } from "./schemas";

/** AI 생성 문제의 채점 설정. 정답 코드는 제한 시간의 1/4 안에 끝나야 통과시킨다 */
export const GENERATED_TIME_LIMIT_MS = 2000;
export const GENERATED_RECURSION_LIMIT = 3000;

export function starterCode(params: ParamSpec[]): LanguageMap<string> {
  const names = params.map((p) => p.name).join(", ");
  return {
    python: [`def solution(${names}):`, "    answer = None", "    return answer", ""].join("\n"),
    javascript: [`function solution(${names}) {`, "  let answer = null;", "  return answer;", "}", ""].join("\n"),
  };
}

function hintSet(draft: ProblemDraft): HintSet {
  const [h1, h2, h3, h4] = draft.hints;
  const code = (hint: ProblemDraft["hints"][number]) => (hint.code ? { code: { ...hint.code } } : undefined);
  const base = (hint: ProblemDraft["hints"][number], step: 1 | 2 | 3 | 4) => ({
    title: hint.title,
    body: hint.body,
    xpPenaltyRate: DEFAULT_HINT_PENALTY[step],
    ...(code(hint) ? { code: code(hint) } : {}),
  });
  return [
    { step: 1, kind: "pattern", ...base(h1, 1) },
    { step: 2, kind: "approach", ...base(h2, 2) },
    { step: 3, kind: "pseudocode", ...base(h3, 3) },
    { step: 4, kind: "key-code", ...base(h4, 4) },
  ];
}

export interface ExecutedCase {
  args: JsonValue[];
  expected: JsonValue;
}

/** 검증을 통과한 초안 + 정답 코드로 계산한 기대값 → 문제 */
export function buildProblem(
  id: string,
  request: GenerationRequest,
  draft: ProblemDraft,
  executed: ExecutedCase[],
): Problem {
  const params: ParamSpec[] = draft.params.map((p) => ({ name: p.name, type: p.type, description: p.description }));
  let exampleNo = 0;
  let hiddenNo = 0;
  const testCases: TestCase[] = draft.testInputs.map((input, index) => {
    const run = executed[index];
    if (!run) throw new Error(`${index + 1}번 케이스의 실행 결과가 없어요`);
    const example = input.visibility === "example";
    const testCase: TestCase = {
      id: example ? `ex-${++exampleNo}` : `hid-${++hiddenNo}`,
      visibility: input.visibility,
      purpose: input.purpose,
      args: run.args,
      expected: run.expected,
    };
    if (example) testCase.explanation = input.note;
    else testCase.failureNote = input.note;
    return testCase;
  });
  // 예제가 먼저 보이도록 정렬 (원래 순서는 유지)
  testCases.sort((a, b) => Number(a.visibility === "hidden") - Number(b.visibility === "hidden"));

  const validSignals = new Set(SIGNALS.map((s) => s.id));

  return {
    id: `g:${id}`,
    slug: id,
    source: "generated",
    topic: request.topic,
    level: request.level,
    title: draft.title,
    summary: draft.summary,
    statement: draft.statement,
    inputFormat: draft.inputFormat,
    outputFormat: draft.outputFormat,
    constraints: draft.constraints,
    signature: { name: "solution", params, returns: draft.returns },
    starterCode: starterCode(params),
    testCases,
    judge: {
      timeLimitMs: GENERATED_TIME_LIMIT_MS,
      compare: { type: draft.compare },
      recursionLimit: GENERATED_RECURSION_LIMIT,
      revealFirstFailure: true,
    },
    hints: hintSet(draft),
    patternTags: draft.patternTags,
    signalIds: draft.signalIds.filter((sid) => validSignals.has(sid)),
    estimatedMinutes: draft.estimatedMinutes,
    xp: BASE_XP_BY_LEVEL[request.level],
  };
}
