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

const DAY_LABEL = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
  timeZone: "UTC",
});

/** "2026-09-24" → "9월 24일 (목)" (날짜만 있는 값이라 UTC로 읽어야 하루가 밀리지 않는다) */
export function dayLabel(day: string): string {
  const parts = DAY_LABEL.formatToParts(new Date(`${day}T00:00:00Z`));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("month")} ${get("day")}일 (${get("weekday")})`;
}

/** "3분 전" · "5시간 전" · "2일 전" (그보다 오래되면 날짜) */
export function relativeTime(value: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(value).getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return formatDate(value);
}

export interface Change {
  direction: "up" | "down" | "flat";
  /** 뱃지에 쓰는 짧은 글자: "+12%", "+3", "±0" */
  short: string;
  /** 화면 낭독기·툴팁용 문장 */
  description: string;
}

/**
 * 이번 주와 지난주를 비교한다. 작은 수의 %는 과장되기 쉬워서(1 → 3이 +200%)
 * 지난주가 10 미만이면 %가 아니라 개수 차이로 보여 준다.
 */
export function describeChange(current: number, previous: number, unit: string): Change {
  const diff = current - previous;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "±";
  const usePercent = previous >= 10;
  const amount = usePercent ? `${Math.round((Math.abs(diff) / previous) * 100)}%` : `${Math.abs(diff)}`;
  const short = `${sign}${amount}`;
  const description =
    direction === "flat"
      ? `지난주와 같아요 (이번 주 ${formatNumber(current)}${unit})`
      : `지난주 ${formatNumber(previous)}${unit} → 이번 주 ${formatNumber(current)}${unit}`;
  return { direction, short, description };
}
