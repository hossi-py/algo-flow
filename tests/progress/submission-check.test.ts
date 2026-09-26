import { describe, expect, it } from "vitest";
import { stackPlateTower } from "@/content/problems/stack/plate-tower";
import { checkSubmission } from "@/lib/progress/submission-check";

const total = stackPlateTower.testCases.length;
const ok = { verdict: "accepted", passed: total, total, code: "def solution(c):\n    return []\n" };

describe("제출 모순 검사", () => {
  it("정상 제출은 통과", () => {
    expect(checkSubmission(stackPlateTower, ok)).toBeNull();
    expect(checkSubmission(stackPlateTower, { ...ok, verdict: "wrong-answer", passed: total - 1 })).toBeNull();
    expect(checkSubmission(stackPlateTower, { ...ok, verdict: "syntax-error", passed: 0 })).toBeNull();
  });

  it("정답인데 다 통과하지 못했거나, 다 통과했는데 오답이면 거절", () => {
    expect(checkSubmission(stackPlateTower, { ...ok, passed: total - 1 })).toMatch(/모든 테스트/);
    expect(checkSubmission(stackPlateTower, { ...ok, verdict: "wrong-answer" })).toMatch(/정답이 아니에요/);
  });

  it("테스트 개수가 문제와 다르거나, 통과가 전체보다 많거나, 코드가 비면 거절", () => {
    expect(checkSubmission(stackPlateTower, { ...ok, passed: 1, total: 1 })).toMatch(/테스트 개수/);
    expect(checkSubmission(stackPlateTower, { ...ok, passed: total + 1 })).toMatch(/통과한 수/);
    expect(checkSubmission(stackPlateTower, { ...ok, code: "   \n" })).toMatch(/비어/);
  });
});
