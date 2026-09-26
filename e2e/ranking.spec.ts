import { expect, test } from "@playwright/test";

test("랭킹 메뉴로 들어가면 이번 주 랭킹을 보여 준다 (로그인 기능이 없으면 곧 열린다고 안내)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "랭킹" }).click();
  await expect(page).toHaveURL(/\/ranking$/);
  await expect(page.getByRole("heading", { name: "이번 주 랭킹", level: 1 })).toBeVisible();
  // CI·로컬 E2E에는 Supabase가 없어서 랭킹을 만들 수 없다
  await expect(page.getByText("랭킹은 곧 열려요")).toBeVisible();
});
