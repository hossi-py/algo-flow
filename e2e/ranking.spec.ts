import { expect, test } from "@playwright/test";

test("랭킹 메뉴로 들어가면 이번 주 랭킹을 보여 준다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "랭킹" }).click();
  await expect(page).toHaveURL(/\/ranking$/);
  await expect(page.getByRole("heading", { name: "이번 주 랭킹", level: 1 })).toBeVisible();
  // Supabase가 없으면 곧 열린다는 안내, 있으면 빈 랭킹 안내 또는 순위 목록이 보인다
  await expect(page.getByText(/랭킹은 곧 열려요|이번 주 첫 번째 주인공이 되어 보세요!|^1위/).first()).toBeVisible();
});
