import { expect, test } from "@playwright/test";
import { openProblem } from "./helpers";

test("힌트는 순서대로만 열리고, 열기 전에 XP 변화를 알려 준다", async ({ page }) => {
  await openProblem(page, "stack-plate-tower");
  await page.getByRole("tab", { name: "힌트" }).click();

  const hints = page.getByRole("tabpanel", { name: "힌트" });
  // 2번부터는 앞 힌트를 먼저 열어야 한다
  await expect(hints.getByText("1번 힌트를 먼저 열어요")).toBeVisible();
  await expect(hints.getByRole("button", { name: "열기" })).toHaveCount(1);

  // 열기 전에 확인 창에서 XP 변화를 보여 준다. 취소하면 그대로다
  await hints.getByRole("button", { name: "열기" }).click();
  const dialog = page.getByRole("dialog", { name: "1번 힌트를 열까요?" });
  await expect(dialog).toContainText("XP");
  await dialog.getByRole("button", { name: "조금 더 생각할게요" }).click();
  await expect(dialog).toBeHidden();
  await expect(hints.getByText("힌트 1 · 유형")).toBeVisible();

  // 확인하면 1번 힌트 내용이 열리고 2번을 열 수 있게 된다
  await hints.getByRole("button", { name: "열기" }).click();
  await page.getByRole("dialog", { name: "1번 힌트를 열까요?" }).getByRole("button", { name: "열기" }).click();
  await expect(hints.getByText("힌트 1 · 어떤 구조일까요?")).toBeVisible();
  await expect(hints.getByText("2번 힌트를 먼저 열어요")).toBeVisible();
  await expect(hints.getByRole("button", { name: "열기" })).toHaveCount(1);

  // 연 힌트는 새로고침해도 열려 있다
  await page.reload();
  await page.getByRole("tab", { name: "힌트" }).click();
  await expect(page.getByRole("tabpanel", { name: "힌트" }).getByText("힌트 1 · 어떤 구조일까요?")).toBeVisible();
});
