import type { Problem } from "@/types";

/**
 * 문제 화면으로 보낼 때 숨은 테스트의 입력·정답은 뺀다. 수만 칸짜리 스트레스 입력이
 * 페이지(HTML·RSC)에 그대로 실리지 않게 하려는 것. 제출할 때 withHiddenData로 다시 채운다.
 */
export function withoutHiddenData(problem: Problem): Problem {
  return {
    ...problem,
    testCases: problem.testCases.map((t) =>
      t.visibility === "hidden" ? { ...t, args: [], expected: null, deferred: true } : t,
    ),
  };
}

/** 빼고 보낸 숨은 테스트가 있으면, 채점 직전에 원래 문제를 불러와 채운다 */
export async function withHiddenData(problem: Problem): Promise<Problem> {
  if (!problem.testCases.some((t) => t.deferred)) return problem;
  const { getProblem } = await import("@/content/problems");
  return getProblem(problem.slug) ?? problem;
}
