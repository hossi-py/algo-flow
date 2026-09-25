export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/** ISO 8601 UTC 시각. 예: "2026-09-23T01:00:00.000Z" */
export type IsoDateTime = string;
/** Asia/Seoul 기준 날짜. 예: "2026-09-23" */
export type LocalDate = string;

/** 지원 언어. 테스트케이스는 JSON이라 언어와 무관하게 공유된다 */
export const LANGUAGES = ["python", "javascript", "java"] as const;
export type Language = (typeof LANGUAGES)[number];

/** 모든 문제가 반드시 지원하는 언어. AI 생성 문제는 이 둘만 제공하고, Java는 큐레이션 문제에만 있다 */
export const CORE_LANGUAGES = ["python", "javascript"] as const;
export type CoreLanguage = (typeof CORE_LANGUAGES)[number];

/** 언어별 값. Python·JS는 필수, Java는 선택 */
export type LanguageMap<T> = Record<CoreLanguage, T> & { java?: T };

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
};

/** 이 언어 값이 있는지 (Java가 없는 문제·카드는 Java를 고를 수 없다) */
export function hasLanguage<T>(map: LanguageMap<T>, language: Language): boolean {
  return map[language] !== undefined;
}

/** 큐레이션 문제는 "c:<slug>", AI 생성 문제는 "g:<uuid>" */
export type ProblemKey = `c:${string}` | `g:${string}`;
