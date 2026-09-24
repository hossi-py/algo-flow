import { addDays, diffDays } from "@/lib/date";
import type {
  ActivityDay,
  ConceptProgress,
  EarnedBadge,
  LevelClear,
  LocalDate,
  ProblemKey,
  ProblemProgress,
  Topic,
  TopicSlug,
  UserProgress,
  UserStats,
} from "@/types";
import { CONCEPT_CARDS_XP, RECOGNITION_QUIZ_XP } from "./xp";

const earlier = (a: string | null, b: string | null) => (a === null ? b : b === null ? a : a < b ? a : b);
const later = (a: string, b: string) => (a > b ? a : b);

function mergeProblem(account: ProblemProgress, guest: ProblemProgress): ProblemProgress {
  const newer = guest.updatedAt > account.updatedAt ? guest : account;
  const bestRuntimes = [account.bestRuntimeMs, guest.bestRuntimeMs].filter((v): v is number => v !== null);
  return {
    ...account,
    status: account.status === "solved" || guest.status === "solved" ? "solved" : "attempted",
    attempts: account.attempts + guest.attempts,
    maxHintOpened: account.maxHintOpened >= guest.maxHintOpened ? account.maxHintOpened : guest.maxHintOpened,
    lastCode: newer.lastCode ?? account.lastCode ?? guest.lastCode,
    solvedAt: earlier(account.solvedAt, guest.solvedAt),
    bestRuntimeMs: bestRuntimes.length > 0 ? Math.min(...bestRuntimes) : null,
    // XP는 처음 푼 한 번만: 계정에서 이미 풀었으면 계정 기록을, 아니면 게스트가 받은 XP를 가져온다
    xpAwarded: account.status === "solved" ? account.xpAwarded : guest.xpAwarded,
    updatedAt: later(account.updatedAt, guest.updatedAt),
  };
}

function mergeConcept(account: ConceptProgress, guest: ConceptProgress): ConceptProgress {
  const quizBest =
    account.quizBestScore === null && guest.quizBestScore === null
      ? null
      : Math.max(account.quizBestScore ?? 0, guest.quizBestScore ?? 0);
  return {
    topic: account.topic,
    completedCardIds: [...new Set([...account.completedCardIds, ...guest.completedCardIds])],
    completedAt: earlier(account.completedAt, guest.completedAt),
    quizBestScore: quizBest,
    quizAttempts: account.quizAttempts + guest.quizAttempts,
    quizPerfectCount: (account.quizPerfectCount ?? 0) + (guest.quizPerfectCount ?? 0),
  };
}

function mergeActivity(a: ActivityDay[], b: ActivityDay[]): ActivityDay[] {
  const byDate = new Map<LocalDate, ActivityDay>();
  for (const day of [...a, ...b]) {
    const current = byDate.get(day.date);
    byDate.set(
      day.date,
      current
        ? {
            date: day.date,
            xpEarned: current.xpEarned + day.xpEarned,
            solvedCount: current.solvedCount + day.solvedCount,
          }
        : { ...day },
    );
  }
  return [...byDate.values()].sort((x, y) => x.date.localeCompare(y.date));
}

/** 활동일 목록으로 스트릭을 다시 계산한다 (XP ≥ 1인 날이 활동일) */
export function streaksFromActivity(
  activity: ActivityDay[],
): Pick<UserStats, "currentStreak" | "longestStreak" | "lastActiveDate"> {
  const days = activity
    .filter((d) => d.xpEarned > 0)
    .map((d) => d.date)
    .sort();
  if (days.length === 0) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = diffDays(days[i - 1]!, days[i]!) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const last = days.at(-1)!;
  let current = 1;
  while (days.includes(addDays(last, -current))) current += 1;
  return { currentStreak: current, longestStreak: longest, lastActiveDate: last };
}

/**
 * 게스트로 쌓은 진도를 계정 진도에 합친다 (로그인 직후 한 번).
 * 같은 문제·개념을 양쪽에서 끝냈으면 XP를 두 번 주지 않는다.
 */
export function mergeProgress(account: UserProgress, guest: UserProgress, topics: readonly Topic[]): UserProgress {
  let duplicateXp = 0;

  const problems: Partial<Record<ProblemKey, ProblemProgress>> = { ...account.problems };
  for (const [key, guestProblem] of Object.entries(guest.problems) as [ProblemKey, ProblemProgress | undefined][]) {
    if (!guestProblem) continue;
    const accountProblem = account.problems[key];
    if (!accountProblem) {
      problems[key] = guestProblem;
      continue;
    }
    if (accountProblem.status === "solved" && guestProblem.status === "solved") duplicateXp += guestProblem.xpAwarded;
    problems[key] = mergeProblem(accountProblem, guestProblem);
  }

  const concepts: Partial<Record<TopicSlug, ConceptProgress>> = { ...account.concepts };
  for (const [slug, guestConcept] of Object.entries(guest.concepts) as [TopicSlug, ConceptProgress | undefined][]) {
    if (!guestConcept) continue;
    const accountConcept = account.concepts[slug];
    if (!accountConcept) {
      concepts[slug] = guestConcept;
      continue;
    }
    const passScore = topics.find((t) => t.slug === slug)?.concept.passScore ?? 1;
    if (accountConcept.completedAt !== null && guestConcept.completedAt !== null) duplicateXp += CONCEPT_CARDS_XP;
    if ((accountConcept.quizBestScore ?? 0) >= passScore && (guestConcept.quizBestScore ?? 0) >= passScore) {
      duplicateXp += RECOGNITION_QUIZ_XP;
    }
    concepts[slug] = mergeConcept(accountConcept, guestConcept);
  }

  const clears = new Map<string, LevelClear>();
  for (const clear of [...account.levelClears, ...guest.levelClears]) {
    const key = `${clear.topic}:${clear.level}`;
    const current = clears.get(key);
    clears.set(key, current && current.clearedAt <= clear.clearedAt ? current : clear);
  }

  const badges = new Map<string, EarnedBadge>();
  for (const badge of [...account.badges, ...guest.badges]) {
    const current = badges.get(badge.badgeId);
    badges.set(badge.badgeId, current && current.earnedAt <= badge.earnedAt ? current : badge);
  }

  const activity = mergeActivity(account.activity, guest.activity);
  const streaks = streaksFromActivity(activity);

  return {
    userId: account.userId,
    stats: {
      xp: Math.max(0, account.stats.xp + guest.stats.xp - duplicateXp),
      currentStreak: streaks.currentStreak,
      longestStreak: Math.max(account.stats.longestStreak, guest.stats.longestStreak, streaks.longestStreak),
      lastActiveDate: streaks.lastActiveDate,
    },
    problems,
    concepts,
    levelClears: [...clears.values()].sort((a, b) => a.clearedAt.localeCompare(b.clearedAt)),
    activity,
    badges: [...badges.values()].sort((a, b) => a.earnedAt.localeCompare(b.earnedAt)),
  };
}

/** 게스트 진도에 합칠 내용이 있는지 */
export function hasProgress(progress: UserProgress): boolean {
  return (
    progress.stats.xp > 0 ||
    Object.keys(progress.problems).length > 0 ||
    Object.keys(progress.concepts).length > 0 ||
    progress.levelClears.length > 0
  );
}
