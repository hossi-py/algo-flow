import { expect, test } from "@playwright/test";

test.describe("관리자 화면", () => {
  test("관리자가 아니면 관리자 화면이 있다는 것도 알 수 없다 (404)", async ({ page }) => {
    // 없는 주소의 404와 탭 제목까지 같아야 한다
    await page.goto("/no-such-page");
    const genericTitle = await page.title();
    for (const path of ["/admin", "/admin/users", "/admin/users/00000000-0000-4000-8000-000000000001"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByText("길을 잃었어요")).toBeVisible();
      await expect(page).toHaveTitle(genericTitle);
    }
  });

  test("마이페이지에 관리자 링크가 보이지 않는다", async ({ page }) => {
    await page.goto("/me");
    await expect(page.getByRole("heading", { name: "마이페이지" })).toBeVisible();
    await expect(page.getByRole("link", { name: "관리자 화면" })).toHaveCount(0);
  });
});
