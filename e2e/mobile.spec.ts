import { expect, test } from "@playwright/test";
import { expectVerdict, selectLanguage, setCode, solution, submit, waitForEditor } from "./helpers";

test.describe("모바일 (Pixel 7)", () => {
  test("대시보드와 로드맵에 가로 스크롤이 없다", async ({ page }) => {
    for (const path of ["/", "/roadmap", "/topics/stack", "/topics/stack/learn"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });

  test("문제 화면은 탭으로 전환하며 풀 수 있다", async ({ page }) => {
    await page.goto("/problems/stack-plate-tower");
    const views = page.getByRole("tablist").first();
    // 모바일은 문제·코드·시각화를 탭으로 나눠 보여 주고, 에디터는 코드 탭에서 뜬다
    await views.getByRole("tab", { name: "코드" }).click();
    await waitForEditor(page);
    await selectLanguage(page, "javascript");
    await setCode(page, solution("stack", "plate-tower", "javascript"));
    await submit(page);
    await expectVerdict(page, "정답이에요!");

    await views.getByRole("tab", { name: "시각화" }).click();
    await expect(page.getByRole("button", { name: "다음 단계" }).first()).toBeVisible();
  });
});
