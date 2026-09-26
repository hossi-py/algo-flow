import { expect, test } from "@playwright/test";

test("섞어 풀기: 토픽을 숨긴 문제의 유형을 고르고 결과를 본다", async ({ page }) => {
  await page.goto("/roadmap");
  await page.getByRole("link", { name: "섞어 풀기" }).click();
  await expect(page.getByRole("heading", { name: "섞어 풀기", level: 1 })).toBeVisible();

  await page.getByRole("button", { name: "섞어서 시작하기" }).click();
  for (let i = 1; i <= 5; i++) {
    await expect(page.getByText(`${i} / 5`)).toBeVisible();
    // 보기 네 개 중 첫 번째를 고르면 정답 여부와 근거 신호가 보인다
    const choices = page.getByRole("group", { name: "어떤 알고리즘을 떠올려야 할까요?" }).getByRole("button");
    await expect(choices).toHaveCount(4);
    await choices.first().click();
    await expect(page.getByText(/정답이에요!|아쉬워요/)).toBeVisible();
    await page.getByRole("button", { name: i === 5 ? "결과 보기" : "다음 문제" }).click();
  }

  await expect(page.getByText(/5문제 중 \d문제 맞혔어요/)).toBeVisible();
  await page.getByRole("button", { name: "처음으로" }).click();
  // 지난 기록이 남는다
  await expect(page.getByText(/1번 도전해서 5문제 중/)).toBeVisible();
});
