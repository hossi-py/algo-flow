import { expect, test } from "@playwright/test";

test.describe("에러 모니터링", () => {
  test("처리되지 않은 브라우저 에러를 개인정보를 뺀 채 /api/errors로 보고한다", async ({ page }) => {
    // sendBeacon의 Blob 본문은 Playwright가 읽지 못해서, 보낸 내용을 페이지에 따로 남긴다
    await page.addInitScript(() => {
      const sent: Blob[] = [];
      (window as unknown as { __beacons: Blob[] }).__beacons = sent;
      const original = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = (url, data) => {
        if (data instanceof Blob) sent.push(data);
        return original(url, data);
      };
    });
    await page.goto("/topics/stack?ref=secret");
    const reported = page.waitForRequest(
      (request) => request.url().endsWith("/api/errors") && request.method() === "POST",
    );
    await page.evaluate(() => {
      setTimeout(() => {
        throw new Error("E2E 확인용 에러 nodi@example.com");
      }, 0);
    });
    const request = await reported;
    const [text] = await page.evaluate(() =>
      Promise.all((window as unknown as { __beacons: Blob[] }).__beacons.map((blob) => blob.text())),
    );
    const body = JSON.parse(text ?? "{}") as Record<string, unknown>;
    // 브라우저는 경로만 보내고(쿼리 제외), 이메일은 서버가 저장하기 전에 가린다
    expect(body).toMatchObject({ source: "client", path: "/topics/stack" });
    expect(String(body.message)).toContain("E2E 확인용 에러");
    const response = await request.response();
    expect(response?.status()).toBe(204);
  });

  test("형식이 틀린 보고는 거절한다", async ({ request }) => {
    const response = await request.post("/api/errors", { data: { source: "server", message: "사칭" } });
    expect(response.status()).toBe(400);
  });
});
