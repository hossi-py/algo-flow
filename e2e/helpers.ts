import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

type Language = "python" | "javascript" | "java";

const EXT: Record<Language, string> = { python: "py", javascript: "js", java: "java" };
const LABEL: Record<Language, RegExp> = {
  python: /^Python/,
  javascript: /^JavaScript/,
  java: /^Java( \(주력 언어\))?$/,
};

/** content-solutions/의 모범 답안 */
export function solution(topic: string, name: string, language: Language): string {
  return readFileSync(path.join(__dirname, "..", "content-solutions", topic, `${name}.${EXT[language]}`), "utf8");
}

/** 문제 화면을 열고 에디터가 뜰 때까지 기다린다 */
export async function openProblem(page: Page, slug: string) {
  await page.goto(`/problems/${slug}`);
  await waitForEditor(page);
}

/** 지금 에디터에 떠 있는 모델 (언어마다 모델이 따로 있어서 getModels()[0]이 아니다) */
interface MonacoModel {
  getValue(): string;
  setValue(value: string): void;
  getLanguageId(): string;
}
interface MonacoWindow {
  monaco?: { editor: { getEditors(): { getModel(): MonacoModel | null }[] } };
}

export async function waitForEditor(page: Page) {
  await page.waitForFunction(() => {
    const monaco = (window as unknown as MonacoWindow).monaco;
    return !!monaco && monaco.editor.getEditors()[0]?.getModel() != null;
  });
}

export async function selectLanguage(page: Page, language: Language) {
  await page.getByRole("group", { name: "풀이 언어" }).getByRole("button", { name: LABEL[language] }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as MonacoWindow).monaco?.editor.getEditors()[0]?.getModel()?.getLanguageId(),
      ),
    )
    .toBe(language);
}

/** 에디터 내용을 바꾼다 (사용자가 입력한 것처럼 onChange가 불린다) */
export async function setCode(page: Page, code: string) {
  await page.evaluate((value) => {
    (window as unknown as MonacoWindow).monaco?.editor.getEditors()[0]?.getModel()?.setValue(value);
  }, code);
}

export async function getCode(page: Page): Promise<string> {
  return page.evaluate(
    () => (window as unknown as MonacoWindow).monaco?.editor.getEditors()[0]?.getModel()?.getValue() ?? "",
  );
}

export async function runExamples(page: Page) {
  await page.getByRole("button", { name: /^예제 실행/ }).click();
}

export async function submit(page: Page) {
  await page.getByRole("button", { name: /^제출/ }).click();
}

/** 판정 배너 제목 (엔진 로딩까지 기다려야 해서 넉넉히 잡는다) */
export async function expectVerdict(page: Page, title: string | RegExp, timeout = 90_000) {
  await expect(page.getByText(title).first()).toBeVisible({ timeout });
}
