import { addDays, diffDays } from "@/lib/date";
import type { ActivityDay, LocalDate, UserStats } from "@/types";

/**
 * 오늘 XP를 얻었을 때의 새 통계.
 * 마지막 활동일이 오늘이면 유지, 어제면 +1, 그 외(처음 포함)는 1로 시작한다.
 */
export function applyActivity(stats: UserStats, today: LocalDate, xpEarned: number): UserStats {
  if (xpEarned <= 0) return stats;

  let currentStreak: number;
  if (stats.lastActiveDate === today) {
    currentStreak = Math.max(1, stats.currentStreak);
  } else if (stats.lastActiveDate !== null && diffDays(stats.lastActiveDate, today) === 1) {
    currentStreak = stats.currentStreak + 1;
  } else {
    currentStreak = 1;
  }

  return {
    xp: stats.xp + xpEarned,
    currentStreak,
    longestStreak: Math.max(stats.longestStreak, currentStreak),
    lastActiveDate: today,
  };
}

/** 화면에 보여줄 스트릭. 어제까지 이어졌으면 오늘 아직 안 했어도 유지로 보여주고, 그보다 오래되면 0 */
export function visibleStreak(stats: UserStats, today: LocalDate): number {
  if (stats.lastActiveDate === null) return 0;
  const gap = diffDays(stats.lastActiveDate, today);
  return gap === 0 || gap === 1 ? stats.currentStreak : 0;
}

/** 오늘 학습했는지 */
export function isActiveToday(stats: UserStats, today: LocalDate): boolean {
  return stats.lastActiveDate === today;
}

/** 오늘까지 활동 기록을 누적한 새 배열 */
export function addActivityDay(
  activity: ActivityDay[],
  today: LocalDate,
  xpEarned: number,
  solvedDelta: number,
): ActivityDay[] {
  const existing = activity.find((day) => day.date === today);
  if (existing) {
    return activity.map((day) =>
      day.date === today
        ? { ...day, xpEarned: day.xpEarned + xpEarned, solvedCount: day.solvedCount + solvedDelta }
        : day,
    );
  }
  return [...activity, { date: today, xpEarned, solvedCount: solvedDelta }].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function xpOnDate(activity: ActivityDay[], date: LocalDate): number {
  return activity.find((day) => day.date === date)?.xpEarned ?? 0;
}

/** 최근 n일(오늘 포함) 날짜 목록, 오래된 날부터 */
export function recentDates(today: LocalDate, days: number): LocalDate[] {
  return Array.from({ length: days }, (_, i) => addDays(today, i - days + 1));
}
