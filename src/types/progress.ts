import type { IsoDateTime, Language, LocalDate, ProblemKey } from "./common";
import type { LevelNumber, PatternTag, ProblemSource, TopicSlug } from "./content";
import type { TestCaseResult, Verdict } from "./judge";

export type HintsOpened = 0 | 1 | 2 | 3 | 4;

export interface Submission {
  id: string;
  userId: string;
  problemKey: ProblemKey;
  source: ProblemSource;
  topic: TopicSlug;
  level: LevelNumber;
  /** 제출 시점의 문제 태그 스냅샷 (약점 분석용) */
  patternTags: PatternTag[];
  language: Language;
  code: string;
  verdict: Verdict;
  passed: number;
  total: number;
  runtimeMs: number | null;
  hintsOpened: HintsOpened;
  failedTestCaseId: string | null;
  results: TestCaseResult[];
  createdAt: IsoDateTime;
}

/** 제출 기록 목록·약점 분석에 쓰는 가벼운 형태 (게스트는 localStorage, 로그인 사용자는 submissions 테이블) */
export type SubmissionSummary = Omit<Submission, "userId" | "code" | "results" | "failedTestCaseId"> & {
  /** 오래된 기록은 저장 공간을 아끼려고 코드를 지운다 */
  code: string | null;
};

export type ProblemStatus = "attempted" | "solved";

export interface ProblemProgress {
  problemKey: ProblemKey;
  source: ProblemSource;
  topic: TopicSlug;
  level: LevelNumber;
  status: ProblemStatus;
  attempts: number;
  maxHintOpened: HintsOpened;
  lastCode: string | null;
  solvedAt: IsoDateTime | null;
  bestRuntimeMs: number | null;
  xpAwarded: number;
  updatedAt: IsoDateTime;
}

export interface ConceptProgress {
  topic: TopicSlug;
  completedCardIds: string[];
  completedAt: IsoDateTime | null;
  /** 0~1 */
  quizBestScore: number | null;
  quizAttempts: number;
  /** 만점으로 끝낸 퀴즈 수 ("유형 탐정" 배지). 예전 게스트 데이터에는 없을 수 있다 */
  quizPerfectCount?: number;
}

export interface LevelClear {
  topic: TopicSlug;
  level: LevelNumber;
  clearedAt: IsoDateTime;
}

export interface UserStats {
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: LocalDate | null;
}

export interface ActivityDay {
  date: LocalDate;
  xpEarned: number;
  solvedCount: number;
}

export type BadgeId =
  | "first-accept"
  | "no-hint-lv3"
  | "streak-3"
  | "streak-7"
  | "streak-30"
  | "topic-master"
  | "signal-detective"
  | "ai-pioneer"
  | "never-give-up";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
}

export interface EarnedBadge {
  badgeId: BadgeId;
  earnedAt: IsoDateTime;
}

/** 게스트(localStorage)와 로그인 사용자(Supabase) 공통 진도 구조 */
export interface UserProgress {
  /** 게스트면 null */
  userId: string | null;
  stats: UserStats;
  concepts: Partial<Record<TopicSlug, ConceptProgress>>;
  problems: Partial<Record<ProblemKey, ProblemProgress>>;
  levelClears: LevelClear[];
  activity: ActivityDay[];
  badges: EarnedBadge[];
}

/* ── 저장하지 않고 계산하는 값 (lib/progress/unlock.ts) ── */

export type LevelStatus = "locked" | "available" | "in-progress" | "cleared";
export type TopicStatus = "locked" | "available" | "in-progress" | "mastered";

export interface LevelView {
  topic: TopicSlug;
  level: LevelNumber;
  status: LevelStatus;
  solved: number;
  required: number;
  total: number;
  /** 잠금 사유. 예: "Lv2를 클리어하면 열려요" */
  lockedReason: string | null;
}

export interface TopicView {
  topic: TopicSlug;
  status: TopicStatus;
  /** 0~1 */
  progress: number;
  levels: LevelView[];
  lockedReason: string | null;
}

/* ── 약점 분석 (lib/progress/weakness.ts) ── */

export interface PatternStat {
  pattern: PatternTag;
  problemsAttempted: number;
  problemsSolved: number;
  submissions: number;
  acceptedSubmissions: number;
  /** 정답 제출의 평균 힌트 단계 */
  avgHintsOnAccept: number | null;
  lastAttemptAt: IsoDateTime;
}

export interface WeaknessScore {
  pattern: PatternTag;
  /** 0~1, 높을수록 약함 */
  score: number;
  /** 사용자에게 보여줄 근거 문장 */
  reasons: string[];
}
