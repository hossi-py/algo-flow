import { describe, expect, it } from "vitest";
import { getProblem } from "@/content/problems";
import { withHiddenData, withoutHiddenData } from "@/content/problems/hidden-data";

describe("숨은 테스트 데이터 나눠 보내기", () => {
  const problem = getProblem("bfs-nearest-store")!;

  it("페이지로 보낼 때는 숨은 테스트의 입력·정답을 빼고, 예제는 그대로 둔다", () => {
    const light = withoutHiddenData(problem);
    expect(light.testCases).toHaveLength(problem.testCases.length);
    for (const [i, t] of light.testCases.entries()) {
      if (t.visibility === "example") expect(t).toEqual(problem.testCases[i]);
      else
        expect(t).toMatchObject({
          args: [],
          expected: null,
          deferred: true,
          failureNote: problem.testCases[i]!.failureNote,
        });
    }
    expect(JSON.stringify(light).length).toBeLessThan(JSON.stringify(problem).length / 50);
  });

  it("제출할 때는 원래 문제를 불러와 숨은 테스트를 채운다", async () => {
    expect(await withHiddenData(withoutHiddenData(problem))).toBe(problem);
    const custom = { ...problem, slug: "ai-made" };
    expect(await withHiddenData(custom)).toBe(custom);
  });
});
