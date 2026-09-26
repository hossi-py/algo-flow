// README 스크린샷: 개발 서버(기본 http://localhost:3000)를 띄운 상태에서
//   node scripts/readme-screenshots.mjs [baseURL]
// 예시 진도는 개발용 도구로 불러오므로 pnpm dev(개발 서버)에서만 동작해요.
import { readFileSync, mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = "docs/images";
mkdirSync(OUT, { recursive: true });

// 개발 서버 표시(Next.js 배지·개발용 도구)는 캡처에서 숨긴다
const HIDE_DEV = `nextjs-portal, [aria-label^="개발용 도구"] { display: none !important; }`;

const browser = await chromium.launch();

async function newPage(theme, height = 800) {
  const context = await browser.newContext({
    viewport: { width: 1280, height },
    deviceScaleFactor: 1.5,
    colorScheme: theme,
    locale: "ko-KR",
  });
  await context.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
  return { context, page: await context.newPage() };
}

async function settle(page) {
  await page.addStyleTag({ content: HIDE_DEV });
  await page.waitForTimeout(1200);
}

/** 예시 진도(스택~그래프 표현 Lv3, DFS Lv2 클리어)를 불러온다 */
async function loadDemo(page) {
  await page.goto(`${BASE}/`);
  await page.getByRole("button", { name: "개발용 도구 열기" }).click();
  await page.getByRole("button", { name: "예시 진도 불러오기" }).click();
  await page.getByRole("button", { name: "개발용 도구 닫기" }).click();
}

/* 1) 로드맵 */
{
  const { context, page } = await newPage("light");
  await loadDemo(page);
  await page.goto(`${BASE}/roadmap`);
  await page.getByText("5. DFS", { exact: true }).waitFor();
  await settle(page);
  await page.screenshot({ path: `${OUT}/roadmap.png` });

  await context.close();
}

/* 2) 개념 학습 시각화: DFS 격자 칠하기 몇 단계 진행 (플레이어가 다 보이게 화면을 길게) */
{
  const { context, page } = await newPage("light", 1180);
  await loadDemo(page);
  await page.goto(`${BASE}/topics/dfs/learn#visualize`);
  const grid = page.getByRole("button", { name: /꽃밭|격자/ }).first();
  await grid.waitFor({ timeout: 30_000 });
  await grid.click();
  const next = page.getByRole("button", { name: "다음 단계" });
  for (let i = 0; i < 9; i++) await next.click();
  await page
    .getByText("입력을 바꿔서 직접 실험해 보기")
    .first()
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await settle(page);
  await page.screenshot({ path: `${OUT}/visualize.png`, clip: { x: 0, y: 0, width: 1280, height: 1050 } });
  await context.close();
}

/* 3) 문제 풀이 (다크 모드): 모범 답안을 Python으로 제출해 정답 화면 */
{
  const { context, page } = await newPage("dark");
  await loadDemo(page);
  await page.goto(`${BASE}/problems/dfs-flower-zones`);
  await page.waitForFunction(() => window.monaco?.editor.getEditors()[0]?.getModel() != null, null, {
    timeout: 60_000,
  });
  const code = readFileSync("content-solutions/dfs/flower-zones.py", "utf8");
  await page.evaluate((value) => window.monaco.editor.getEditors()[0].getModel().setValue(value), code);
  await page.getByRole("button", { name: /^제출/ }).click();
  await page.getByText("정답이에요!").first().waitFor({ timeout: 120_000 });
  // 축하 연출(배지·레벨 클리어)이 사라질 때까지 기다린다
  await page
    .getByText(/배지 획득|클리어/)
    .first()
    .waitFor({ state: "hidden", timeout: 20_000 })
    .catch(() => undefined);
  await page.waitForTimeout(1500);
  await settle(page);
  await page.screenshot({ path: `${OUT}/workspace.png` });
  await context.close();
}

await browser.close();
console.log("saved to", OUT);
