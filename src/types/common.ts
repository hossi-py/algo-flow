export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/** ISO 8601 UTC 시각. 예: "2026-09-23T01:00:00.000Z" */
export type IsoDateTime = string;
/** Asia/Seoul 기준 날짜. 예: "2026-09-23" */
export type LocalDate = string;

/** MVP 지원 언어. 테스트케이스는 JSON이라 언어와 무관하게 공유된다 */
export const LANGUAGES = ["python", "javascript"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
};

/** 큐레이션 문제는 "c:<slug>", AI 생성 문제는 "g:<uuid>" */
export type ProblemKey = `c:${string}` | `g:${string}`;
