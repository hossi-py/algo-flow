import { expect, test } from "@playwright/test";

test.describe("개념 학습", () => {
  test("개념 카드를 넘기고, 시각화를 한 단계씩 재생한다", async ({ page }) => {
    await page.goto("/topics/stack/learn");

    // 카드 넘기기
    await expect(page.getByLabel(/장 중 1번째/)).toBeVisible();
    await page.getByRole("button", { name: "다음 카드" }).click();
    await expect(page.getByLabel(/장 중 2번째/)).toBeVisible();
    await page.getByRole("button", { name: "이전 카드" }).click();
    await expect(page.getByLabel(/장 중 1번째/)).toBeVisible();

    // 시각화: 다음 단계를 누르면 스텝 번호가 바뀐다
    await page.goto("/topics/stack/learn#visualize");
    const next = page.getByRole("button", { name: "다음 단계" }).first();
    await next.scrollIntoViewIfNeeded();
    const step = page.getByText(/^\d+\s*\/\s*\d+$/).first();
    const before = await step.textContent();
    await next.click();
    await expect(step).not.toHaveText(before ?? "");
  });

  test("유형 인식 퀴즈에서 보기를 고르면 해설을 보고 다음 문제로 넘어간다", async ({ page }) => {
    await page.goto("/topics/stack/learn#signals");
    const choices = page.getByRole("group", { name: "보기" });
    await choices.scrollIntoViewIfNeeded();
    const progress = page.getByRole("progressbar", { name: "퀴즈 진행" });
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    await choices.getByRole("button").first().click();
    // 고르면 진행이 한 칸 늘고, 해설과 함께 다음 문제로 넘어갈 수 있다
    await expect(progress).toHaveAttribute("aria-valuenow", "1");
    await expect(page.getByRole("button", { name: /다음 문제/ })).toBeVisible();
  });
});
