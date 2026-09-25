import { expect, test } from "@playwright/test";
import {
  expectVerdict,
  getCode,
  openProblem,
  runExamples,
  selectLanguage,
  setCode,
  solution,
  submit,
  waitForEditor,
} from "./helpers";

test.describe("문제 풀이와 채점", () => {
  test("JavaScript 정답 제출 → 정답 처리, XP와 해결 수가 대시보드에 남는다", async ({ page }) => {
    await openProblem(page, "stack-plate-tower");
    await selectLanguage(page, "javascript");
    await setCode(page, solution("stack", "plate-tower", "javascript"));
    await submit(page);
    await expectVerdict(page, "정답이에요!");

    await page.goto("/");
    const stats = page.getByRole("region", { name: "학습 통계" });
    await expect(stats).toContainText(/경험치\s*10\s*XP/);
    await expect(stats).toContainText(/해결한 문제\s*1\s*개/);

    // 새로고침해도 게스트 진도가 남는다
    await page.reload();
    await expect(page.getByRole("region", { name: "학습 통계" })).toContainText(/해결한 문제\s*1\s*개/);
  });

  test("틀린 답 → 처음 틀린 케이스의 입력·기대값·실제값을 보여 준다", async ({ page }) => {
    await openProblem(page, "stack-plate-tower");
    await selectLanguage(page, "javascript");
    // pop을 무시하는 오답
    await setCode(
      page,
      [
        "function solution(commands) {",
        "  return commands.filter((c) => c.startsWith('push')).map((c) => Number(c.split(' ')[1]));",
        "}",
      ].join("\n"),
    );
    await submit(page);
    await expectVerdict(page, /거의 다 왔어요!/);
    const results = page.getByRole("list", { name: "테스트 결과" });
    // 처음 틀린 예제 1이 펼쳐져 입력과 두 값을 비교해 보여 준다
    await expect(results).toContainText("기대값[1, 3]");
    await expect(results).toContainText("내 코드의 반환값[1, 2, 3]");
  });

  test("무한 반복 → 시간 초과, 고친 뒤 바로 다시 실행된다", async ({ page }) => {
    await openProblem(page, "stack-plate-tower");
    await selectLanguage(page, "javascript");
    await setCode(page, "function solution(commands) {\n  while (true) {}\n}\n");
    await runExamples(page);
    await expectVerdict(page, "시간이 너무 오래 걸렸어요");

    await setCode(page, solution("stack", "plate-tower", "javascript"));
    await runExamples(page);
    await expectVerdict(page, "예제를 모두 통과했어요!");
  });

  test("Python 문법 오류 → 문법 오류 안내, 고치면 정답", async ({ page }) => {
    await openProblem(page, "stack-plate-tower");
    await selectLanguage(page, "python");
    await setCode(page, "def solution(commands)\n    return []\n");
    await runExamples(page);
    await expectVerdict(page, "문법 오류가 있어요");

    await setCode(page, solution("stack", "plate-tower", "python"));
    await submit(page);
    await expectVerdict(page, "정답이에요!");
  });

  test("작성 중인 코드는 새로고침해도 언어별로 남는다", async ({ page }) => {
    await openProblem(page, "stack-peek-record");
    await selectLanguage(page, "javascript");
    await setCode(page, "// 노디의 초안\nfunction solution(commands) {\n  return [];\n}\n");
    // 자동 저장이 끝날 시간을 준다
    await page.waitForTimeout(1500);

    await page.reload();
    await waitForEditor(page);
    await selectLanguage(page, "javascript");
    await expect.poll(() => getCode(page)).toContain("노디의 초안");

    // 다른 언어의 코드는 섞이지 않는다
    await selectLanguage(page, "python");
    await expect.poll(() => getCode(page)).not.toContain("노디의 초안");
  });

  test("Java 정답 제출 → 브라우저 JVM으로 채점해 정답 처리", async ({ page }) => {
    test.slow(); // CheerpJ 첫 로딩은 10~20초 걸린다
    await openProblem(page, "stack-plate-tower");
    await selectLanguage(page, "java");
    await setCode(page, solution("stack", "plate-tower", "java"));
    await submit(page);
    await expectVerdict(page, "정답이에요!", 180_000);
  });
});
