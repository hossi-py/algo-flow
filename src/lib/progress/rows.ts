import type {
  BadgeId,
  ConceptProgress,
  HintsOpened,
  IsoDateTime,
  Language,
  LevelClear,
  LevelNumber,
  PatternStat,
  PatternTag,
  ProblemKey,
  ProblemProgress,
  ProblemSource,
  SubmissionSummary,
  TopicSlug,
  UserProgress,
  Verdict,
} from "@/types";

/**
 * Supabase 테이블 행 ↔ UserProgress 변환, 그리고 두 진도의 차이를 RPC가 받는 변경 목록(p_changes)으로 만든다.
 * (supabase/migrations/20260924000000_progress_rpc.sql의 형식과 같다)
 */

export interface StatsRow {
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  revision: number | string;
}
export interface ActivityRow {
  activity_date: string;
  xp_earned: number;
  solved_count: number;
}
export interface ProblemRow {
  problem_key: string;
  source: ProblemSource;
  topic_slug: string;
  level: number;
  status: "attempted" | "solved";
  attempts: number;
  max_hint_opened: number;
  last_code: string | null;
  solved_at: string | null;
  best_runtime_ms: number | null;
  xp_awarded: number;
  updated_at?: string;
}
export interface ConceptRow {
  topic_slug: string;
  completed_card_ids: string[];
  completed_at: string | null;
  quiz_best_score: number | string | null;
  quiz_attempts: number;
  quiz_perfect_count: number;
}
export interface LevelClearRow {
  topic_slug: string;
  level: number;
  cleared_at: string;
}
export interface BadgeRow {
  badge_id: string;
  earned_at: string;
}
export interface SubmissionRow {
  id?: string;
  problem_key: string;
  source: ProblemSource;
  topic_slug: string;
  level: number;
  pattern_tags: string[];
  language: Language;
  code: string | null;
  verdict: Verdict;
  passed: number;
  total: number;
  runtime_ms: number | null;
  hints_opened: number;
  failed_test_case_id?: string | null;
  results?: unknown;
  created_at: string;
}
export interface PatternStatRow {
  pattern: string;
  problems_attempted: number | string;
  problems_solved: number | string;
  submissions: number | string;
  accepted_submissions: number | string;
  avg_hints_on_accept: number | string | null;
  last_attempt_at: string;
}

export interface ProgressRows {
  stats: StatsRow;
  activity: ActivityRow[];
  problems: ProblemRow[];
  concepts: ConceptRow[];
  levelClears: LevelClearRow[];
  badges: BadgeRow[];
}

/** 날짜·시각 문자열을 ISO(UTC)로 맞춘다 (드라이버마다 형식이 달라서) */
export function iso(value: string | Date): IsoDateTime;
export function iso(value: string | Date | null): IsoDateTime | null;
export function iso(value: string | Date | null): IsoDateTime | null {
  return value === null ? null : new Date(value).toISOString();
}

/** date 컬럼 → "YYYY-MM-DD" (문자열이면 그대로, Date면 UTC 기준) */
function localDate(value: string | Date): string {
  return typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
}

export function rowsToProgress(userId: string, rows: ProgressRows): UserProgress {
  const problems: UserProgress["problems"] = {};
  for (const row of rows.problems) {
    const key = row.problem_key as ProblemKey;
    problems[key] = {
      problemKey: key,
      source: row.source,
      topic: row.topic_slug as TopicSlug,
      level: row.level as LevelNumber,
      status: row.status,
      attempts: row.attempts,
      maxHintOpened: row.max_hint_opened as HintsOpened,
      lastCode: row.last_code,
      solvedAt: iso(row.solved_at),
      bestRuntimeMs: row.best_runtime_ms,
      xpAwarded: row.xp_awarded,
      updatedAt: iso(row.updated_at ?? new Date(0).toISOString()),
    };
  }
  const concepts: UserProgress["concepts"] = {};
  for (const row of rows.concepts) {
    const topic = row.topic_slug as TopicSlug;
    concepts[topic] = {
      topic,
      completedCardIds: [...row.completed_card_ids],
      completedAt: iso(row.completed_at),
      quizBestScore: row.quiz_best_score === null ? null : Number(row.quiz_best_score),
      quizAttempts: row.quiz_attempts,
      quizPerfectCount: row.quiz_perfect_count,
    };
  }
  return {
    userId,
    stats: {
      xp: rows.stats.xp,
      currentStreak: rows.stats.current_streak,
      longestStreak: rows.stats.longest_streak,
      lastActiveDate: rows.stats.last_active_date === null ? null : localDate(rows.stats.last_active_date),
    },
    concepts,
    problems,
    levelClears: rows.levelClears
      .map((row) => ({
        topic: row.topic_slug as TopicSlug,
        level: row.level as LevelNumber,
        clearedAt: iso(row.cleared_at),
      }))
      .sort((a, b) => a.clearedAt.localeCompare(b.clearedAt)),
    activity: rows.activity
      .map((row) => ({ date: localDate(row.activity_date), xpEarned: row.xp_earned, solvedCount: row.solved_count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    badges: rows.badges
      .map((row) => ({ badgeId: row.badge_id as BadgeId, earnedAt: iso(row.earned_at) }))
      .sort((a, b) => a.earnedAt.localeCompare(b.earnedAt)),
  };
}

/* ───────────── 변경 목록 ───────────── */

export type ConceptChangeRow = Omit<ConceptRow, "quiz_best_score"> & { quiz_best_score: number | null };

export interface ProgressChanges {
  stats?: { xp: number; current_streak: number; longest_streak: number; last_active_date: string | null };
  activity: ActivityRow[];
  problems: ProblemRow[];
  concepts: ConceptChangeRow[];
  level_clears: LevelClearRow[];
  badges: BadgeRow[];
}

function problemRow(p: ProblemProgress): ProblemRow {
  return {
    problem_key: p.problemKey,
    source: p.source,
    topic_slug: p.topic,
    level: p.level,
    status: p.status,
    attempts: p.attempts,
    max_hint_opened: p.maxHintOpened,
    last_code: p.lastCode,
    solved_at: p.solvedAt,
    best_runtime_ms: p.bestRuntimeMs,
    xp_awarded: p.xpAwarded,
  };
}

function conceptRow(c: ConceptProgress): ConceptChangeRow {
  return {
    topic_slug: c.topic,
    completed_card_ids: c.completedCardIds,
    completed_at: c.completedAt,
    quiz_best_score: c.quizBestScore,
    quiz_attempts: c.quizAttempts,
    quiz_perfect_count: c.quizPerfectCount ?? 0,
  };
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** prev → next로 바뀐(또는 새로 생긴) 행만 모은다 */
export function progressChanges(prev: UserProgress, next: UserProgress): ProgressChanges {
  const changes: ProgressChanges = { activity: [], problems: [], concepts: [], level_clears: [], badges: [] };

  if (!same(prev.stats, next.stats)) {
    changes.stats = {
      xp: next.stats.xp,
      current_streak: next.stats.currentStreak,
      longest_streak: next.stats.longestStreak,
      last_active_date: next.stats.lastActiveDate,
    };
  }
  const prevDays = new Map(prev.activity.map((d) => [d.date, d]));
  for (const day of next.activity) {
    if (!same(prevDays.get(day.date), day)) {
      changes.activity.push({ activity_date: day.date, xp_earned: day.xpEarned, solved_count: day.solvedCount });
    }
  }
  for (const [key, problem] of Object.entries(next.problems) as [ProblemKey, ProblemProgress | undefined][]) {
    if (!problem) continue;
    const before = prev.problems[key];
    // updatedAt은 DB 트리거가 관리하므로 비교에서 뺀다
    if (!before || !same(problemRow(before), problemRow(problem))) changes.problems.push(problemRow(problem));
  }
  for (const [slug, concept] of Object.entries(next.concepts) as [TopicSlug, ConceptProgress | undefined][]) {
    if (!concept) continue;
    const before = prev.concepts[slug];
    if (!before || !same(conceptRow(before), conceptRow(concept))) changes.concepts.push(conceptRow(concept));
  }
  const prevClears = new Set(prev.levelClears.map((c) => `${c.topic}:${c.level}`));
  for (const clear of next.levelClears as LevelClear[]) {
    if (!prevClears.has(`${clear.topic}:${clear.level}`)) {
      changes.level_clears.push({ topic_slug: clear.topic, level: clear.level, cleared_at: clear.clearedAt });
    }
  }
  const prevBadges = new Set(prev.badges.map((b) => b.badgeId));
  for (const badge of next.badges) {
    if (!prevBadges.has(badge.badgeId)) changes.badges.push({ badge_id: badge.badgeId, earned_at: badge.earnedAt });
  }
  return changes;
}

export function isEmptyChanges(changes: ProgressChanges): boolean {
  return (
    !changes.stats &&
    changes.activity.length === 0 &&
    changes.problems.length === 0 &&
    changes.concepts.length === 0 &&
    changes.level_clears.length === 0 &&
    changes.badges.length === 0
  );
}

/* ───────────── 제출 기록 · 패턴 통계 ───────────── */

export function submissionToRow(
  s: SubmissionSummary & { results?: unknown; failedTestCaseId?: string | null },
): SubmissionRow {
  return {
    problem_key: s.problemKey,
    source: s.source,
    topic_slug: s.topic,
    level: s.level,
    pattern_tags: s.patternTags,
    language: s.language,
    code: s.code,
    verdict: s.verdict,
    passed: s.passed,
    total: s.total,
    runtime_ms: s.runtimeMs === null ? null : Math.round(s.runtimeMs),
    hints_opened: s.hintsOpened,
    failed_test_case_id: s.failedTestCaseId ?? null,
    results: s.results ?? [],
    created_at: s.createdAt,
  };
}

export function rowToSubmission(row: SubmissionRow & { id: string }): SubmissionSummary {
  return {
    id: row.id,
    problemKey: row.problem_key as ProblemKey,
    source: row.source,
    topic: row.topic_slug as TopicSlug,
    level: row.level as LevelNumber,
    patternTags: row.pattern_tags as PatternTag[],
    language: row.language,
    code: row.code,
    verdict: row.verdict,
    passed: row.passed,
    total: row.total,
    runtimeMs: row.runtime_ms,
    hintsOpened: row.hints_opened as HintsOpened,
    createdAt: iso(row.created_at),
  };
}

export function rowToPatternStat(row: PatternStatRow): PatternStat {
  return {
    pattern: row.pattern as PatternTag,
    problemsAttempted: Number(row.problems_attempted),
    problemsSolved: Number(row.problems_solved),
    submissions: Number(row.submissions),
    acceptedSubmissions: Number(row.accepted_submissions),
    avgHintsOnAccept: row.avg_hints_on_accept === null ? null : Number(row.avg_hints_on_accept),
    lastAttemptAt: iso(row.last_attempt_at),
  };
}
