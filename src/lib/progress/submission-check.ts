import type { Problem } from "@/types";

/**
 * 제출 기록을 받기 전에 명백한 모순을 걸러 낸다 (채점은 브라우저에서 하므로, 조작된 요청을 막는 최소한의 검사).
 * 통과하지 못하면 거절 사유를, 괜찮으면 null.
 */
export function checkSubmission(
  problem: Pick<Problem, "testCases">,
  body: { verdict: string; passed: number; total: number; code: string },
): string | null {
  if (body.code.trim() === "") return "코드가 비어 있어요.";
  // 제출은 모든 테스트케이스를 채점하므로 전체 수가 문제와 같아야 한다
  if (body.total !== problem.testCases.length) return "테스트 개수가 문제와 맞지 않아요.";
  if (body.passed > body.total) return "통과한 수가 전체보다 많아요.";
  if (body.verdict === "accepted" && body.passed !== body.total) return "모든 테스트를 통과해야 정답이에요.";
  if (body.verdict !== "accepted" && body.passed === body.total) return "모든 테스트를 통과했는데 정답이 아니에요.";
  return null;
}
