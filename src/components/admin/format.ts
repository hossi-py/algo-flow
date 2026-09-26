/** 관리자 화면 표시용 (Asia/Seoul 기준) */
const DATE_TIME = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const DATE = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const NUMBER = new Intl.NumberFormat("ko-KR");

export function formatDateTime(value: string | null): string {
  return value ? DATE_TIME.format(new Date(value)) : "—";
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  // "2026-09-26" 같은 날짜만 있는 값은 그 날짜 그대로 보여 준다
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.replaceAll("-", ". ") + "." : DATE.format(new Date(value));
}

/** "09-26" 짧은 날짜 (차트 축) */
export function shortDay(day: string): string {
  return day.slice(5).replace("-", "/");
}

export function formatNumber(value: number): string {
  return NUMBER.format(value);
}

export const VERDICT_LABELS: Record<string, string> = {
  accepted: "정답",
  "wrong-answer": "오답",
  "runtime-error": "실행 오류",
  "time-limit-exceeded": "시간 초과",
  "syntax-error": "문법 오류",
  "internal-error": "엔진 오류",
};

export const LANGUAGE_LABELS: Record<string, string> = { python: "Python", javascript: "JavaScript", java: "Java" };
