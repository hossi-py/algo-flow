import { defineConfig, devices } from "@playwright/test";

/**
 * E2E 테스트 (pnpm test:e2e).
 * 프로덕션 빌드(next build → next start)를 3100번 포트에 띄워 실제 사용자 흐름을 확인한다.
 * 실행 엔진(Pyodide · CheerpJ)과 에디터(Monaco)를 CDN에서 받으므로 네트워크가 필요하다.
 */
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  // 엔진 첫 로딩(Pyodide 수 초, CheerpJ 10~20초)을 감안한 테스트당 제한
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile",
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    // AI·Supabase 키가 없어도 게스트로 모든 학습 흐름이 동작해야 한다
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
