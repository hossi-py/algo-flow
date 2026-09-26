/** 랭킹 주간: 월요일 ~ 일요일 (Asia/Seoul) */

const SEOUL_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" });

/** 한국 날짜 "YYYY-MM-DD" */
export function seoulToday(now = new Date()): string {
  return SEOUL_DATE.format(now);
}

function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekRange(today: string): { start: string; end: string } {
  const weekday = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0=일 … 6=토
  const start = addDays(today, -((weekday + 6) % 7));
  return { start, end: addDays(start, 6) };
}

/** 다음 주 월요일 0시(한국)까지 남은 시간 */
export function untilReset(now = new Date()): { days: number; hours: number } {
  const { end } = weekRange(seoulToday(now));
  const reset = new Date(`${addDays(end, 1)}T00:00:00+09:00`).getTime();
  const hours = Math.max(0, Math.floor((reset - now.getTime()) / 3_600_000));
  return { days: Math.floor(hours / 24), hours: hours % 24 };
}
