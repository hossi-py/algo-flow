import type { LocalDate } from "@/types";

/** 학습일 계산 기준 시간대 */
export const APP_TIME_ZONE = "Asia/Seoul";

const localDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const hourFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIME_ZONE,
  hour: "numeric",
  hourCycle: "h23",
});

/** Date → Asia/Seoul 기준 "YYYY-MM-DD" */
export function toLocalDate(date: Date): LocalDate {
  return localDateFormatter.format(date);
}

/** Asia/Seoul 기준 시(0~23) */
export function localHour(date: Date): number {
  return Number(hourFormatter.format(date));
}

function parseLocalDate(value: LocalDate): number {
  const [y, m, d] = value.split("-").map(Number);
  if (y === undefined || m === undefined || d === undefined || [y, m, d].some(Number.isNaN)) {
    throw new Error(`잘못된 날짜 형식이에요: ${value}`);
  }
  return Date.UTC(y, m - 1, d);
}

function formatUtcDate(ms: number): LocalDate {
  return new Date(ms).toISOString().slice(0, 10);
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(value: LocalDate, days: number): LocalDate {
  return formatUtcDate(parseLocalDate(value) + days * DAY_MS);
}

/** b - a (일 단위) */
export function diffDays(a: LocalDate, b: LocalDate): number {
  return Math.round((parseLocalDate(b) - parseLocalDate(a)) / DAY_MS);
}

/** 0 = 월요일 … 6 = 일요일 */
export function weekdayIndex(value: LocalDate): number {
  const sundayBased = new Date(parseLocalDate(value)).getUTCDay();
  return (sundayBased + 6) % 7;
}

/** value가 속한 주의 월~일 7일 */
export function weekOf(value: LocalDate): LocalDate[] {
  const monday = addDays(value, -weekdayIndex(value));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;
