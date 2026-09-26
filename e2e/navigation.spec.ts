import { expect, test } from "@playwright/test";

test.describe("처음 온 게스트의 길 찾기", () => {
  test("대시보드 → 첫 토픽 → 문제 화면", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("처음 오셨군요!")).toBeVisible();
    const stats = page.getByRole("region", { name: "학습 통계" });
    await expect(stats).toContainText(/경험치\s*0\s*XP/);

    await page.getByRole("link", { name: "첫 토픽 보러 가기" }).click();
    await expect(page).toHaveURL(/\/topics\/stack$/);
    await expect(page.getByRole("heading", { name: "스택", level: 1 })).toBeVisible();
    // Lv1 문제는 열려 있고 Lv2부터는 잠겨 있다
    await expect(page.getByText("Lv1 클리어 후 열려요")).toBeVisible();

    await page.getByRole("link", { name: /접시 탑 쌓기/ }).click();
    await expect(page).toHaveURL(/\/problems\/stack-plate-tower$/);
    await expect(page.getByRole("heading", { name: "접시 탑 쌓기" }).first()).toBeVisible();
  });

  test("로드맵에는 11개 토픽이 있고 스택만 열려 있다", async ({ page }) => {
    await page.goto("/roadmap");
    const titles = [
      "스택",
      "큐 / 덱",
      "재귀 기초",
      "그래프와 트리 표현",
      "DFS",
      "BFS",
      "백트래킹",
      "해시",
      "정렬",
      "이분 탐색",
      "DP",
    ];
    for (const [i, title] of titles.entries()) {
      await expect(page.getByText(`${i + 1}. ${title}`, { exact: true })).toBeVisible();
    }
    await expect(page.getByText("시작할 수 있어요", { exact: true })).toHaveCount(1);
    await expect(page.getByText("잠겨 있어요", { exact: true })).toHaveCount(10);
    // 모든 토픽이 열려서 "곧 열리는 토픽" 영역은 없다
    await expect(page.getByRole("heading", { name: "곧 열리는 토픽" })).toHaveCount(0);
  });

  test("없는 주소는 안내 화면을 보여 준다", async ({ page }) => {
    const response = await page.goto("/problems/no-such-problem");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("길을 잃었어요")).toBeVisible();
    await page.getByRole("link", { name: "홈으로 돌아가기" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
