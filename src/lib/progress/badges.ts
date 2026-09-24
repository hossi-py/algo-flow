import type { BadgeId, EarnedBadge, HintsOpened, IsoDateTime, Problem, ProblemProgress, UserProgress } from "@/types";

/** 배지를 줄지 판단할 때 함께 보는 방금 일어난 일 (상태만으로는 알 수 없는 조건용) */
export type BadgeEvent =
  | {
      type: "first-solve";
      problem: Pick<Problem, "level" | "source">;
      /** 이번 정답을 포함한 제출 횟수 */
      attempts: number;
      /** 정답을 맞힌 시점까지 연 힌트 단계 */
      hintsOpened: HintsOpened;
    }
  | { type: "none" };

const PERFECT_QUIZZES_FOR_DETECTIVE = 5;
const GIVE_UP_ATTEMPTS = 5;

function solvedProblems(progress: UserProgress): ProblemProgress[] {
  return Object.values(progress.problems).filter((p): p is ProblemProgress => p?.status === "solved");
}

/** 진도 상태만 보고 판단할 수 있는 배지 */
function stateBadges(progress: UserProgress): BadgeId[] {
  const earned: BadgeId[] = [];
  const solved = solvedProblems(progress);
  if (solved.length > 0) earned.push("first-accept");
  const streak = Math.max(progress.stats.longestStreak, progress.stats.currentStreak);
  if (streak >= 3) earned.push("streak-3");
  if (streak >= 7) earned.push("streak-7");
  if (streak >= 30) earned.push("streak-30");
  if (progress.levelClears.some((clear) => clear.level === 5)) earned.push("topic-master");
  const perfect = Object.values(progress.concepts).reduce((sum, c) => sum + (c?.quizPerfectCount ?? 0), 0);
  if (perfect >= PERFECT_QUIZZES_FOR_DETECTIVE) earned.push("signal-detective");
  if (solved.some((p) => p.source === "generated")) earned.push("ai-pioneer");
  return earned;
}

function eventBadges(event: BadgeEvent): BadgeId[] {
  if (event.type !== "first-solve") return [];
  const earned: BadgeId[] = [];
  if (event.problem.level >= 3 && event.hintsOpened === 0) earned.push("no-hint-lv3");
  if (event.attempts >= GIVE_UP_ATTEMPTS) earned.push("never-give-up");
  if (event.problem.source === "generated") earned.push("ai-pioneer");
  return earned;
}

/** 새로 얻은 배지를 진도에 더한다. 이미 가진 배지는 다시 주지 않는다 */
export function awardBadges(
  progress: UserProgress,
  event: BadgeEvent,
  now: IsoDateTime,
): { progress: UserProgress; earned: BadgeId[] } {
  const owned = new Set(progress.badges.map((b) => b.badgeId));
  const earned = [...new Set([...stateBadges(progress), ...eventBadges(event)])].filter((id) => !owned.has(id));
  if (earned.length === 0) return { progress, earned };
  const added: EarnedBadge[] = earned.map((badgeId) => ({ badgeId, earnedAt: now }));
  return { progress: { ...progress, badges: [...progress.badges, ...added] }, earned };
}
