import { z } from "zod";
import { LANGUAGES, PATTERN_TAGS, TOPIC_SLUGS, type BadgeId } from "@/types";

/** 진도 API 요청 본문 검증. 게스트 병합 본문은 사용자가 보낸 값이라 형식과 범위를 엄격히 본다 */

const BADGE_IDS = [
  "first-accept",
  "no-hint-lv3",
  "streak-3",
  "streak-7",
  "streak-30",
  "topic-master",
  "signal-detective",
  "ai-pioneer",
  "never-give-up",
] as const satisfies readonly BadgeId[];

const problemKey = z.string().regex(/^(c|g):[A-Za-z0-9_-]{1,80}$/);
const isoDateTime = z.iso.datetime({ offset: true });
const localDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const level = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
const hints = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
const verdict = z.enum([
  "accepted",
  "wrong-answer",
  "runtime-error",
  "time-limit-exceeded",
  "syntax-error",
  "internal-error",
]);
const count = z.number().int().min(0).max(1_000_000);

const testCaseResult = z
  .object({
    testCaseId: z.string().max(40),
    visibility: z.enum(["example", "hidden"]),
    verdict: z.enum(["passed", "failed", "runtime-error", "time-limit-exceeded", "not-run"]),
    timeMs: z.number().nullable(),
    revealed: z.boolean(),
  })
  .passthrough();

export const submitBodySchema = z.object({
  problemKey,
  verdict,
  passed: count,
  total: z.number().int().min(1).max(1000),
  runtimeMs: z.number().min(0).max(600_000).nullable(),
  language: z.enum(LANGUAGES),
  code: z.string().max(20_000),
  results: z.array(testCaseResult).max(200),
});

export const hintBodySchema = z.object({
  problemKey,
  step: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

export const conceptBodySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("card"), topic: z.enum(TOPIC_SLUGS), cardId: z.string().min(1).max(80) }),
  z.object({ kind: z.literal("quiz"), topic: z.enum(TOPIC_SLUGS), score: z.number().min(0).max(1) }),
]);

const problemProgress = z.object({
  problemKey,
  source: z.enum(["curated", "generated"]),
  topic: z.enum(TOPIC_SLUGS),
  level,
  status: z.enum(["attempted", "solved"]),
  attempts: count,
  maxHintOpened: hints,
  lastCode: z.string().max(20_000).nullable(),
  solvedAt: isoDateTime.nullable(),
  bestRuntimeMs: z.number().min(0).nullable(),
  xpAwarded: z.number().int().min(0).max(1000),
  updatedAt: isoDateTime,
});

const conceptProgress = z.object({
  topic: z.enum(TOPIC_SLUGS),
  completedCardIds: z.array(z.string().max(80)).max(50),
  completedAt: isoDateTime.nullable(),
  quizBestScore: z.number().min(0).max(1).nullable(),
  quizAttempts: count,
  quizPerfectCount: count.optional(),
});

export const guestProgressSchema = z.object({
  userId: z.null(),
  stats: z.object({
    xp: count,
    currentStreak: count,
    longestStreak: count,
    lastActiveDate: localDate.nullable(),
  }),
  concepts: z.partialRecord(z.enum(TOPIC_SLUGS), conceptProgress),
  problems: z.record(problemKey, problemProgress),
  levelClears: z.array(z.object({ topic: z.enum(TOPIC_SLUGS), level, clearedAt: isoDateTime })).max(35),
  activity: z.array(z.object({ date: localDate, xpEarned: count, solvedCount: count })).max(3660),
  badges: z.array(z.object({ badgeId: z.enum(BADGE_IDS), earnedAt: isoDateTime })).max(BADGE_IDS.length),
});

export const guestSubmissionSchema = z.object({
  id: z.string().max(60),
  problemKey,
  source: z.enum(["curated", "generated"]),
  topic: z.enum(TOPIC_SLUGS),
  level,
  patternTags: z.array(z.enum(PATTERN_TAGS)).max(5),
  language: z.enum(LANGUAGES),
  code: z.string().max(20_000).nullable(),
  verdict,
  passed: count,
  total: z.number().int().min(1).max(1000),
  runtimeMs: z.number().min(0).nullable(),
  hintsOpened: hints,
  createdAt: isoDateTime,
});

export const mergeBodySchema = z.object({
  progress: guestProgressSchema,
  submissions: z.array(guestSubmissionSchema).max(500),
});

export const profilePatchSchema = z
  .object({
    nickname: z.string().trim().min(1).max(20),
    dailyGoalXp: z.number().int().min(10).max(500),
    theme: z.enum(["light", "dark", "system"]),
    editorFontSize: z.number().int().min(12).max(22),
    preferredLanguage: z.enum(LANGUAGES),
    showInRanking: z.boolean(),
  })
  .partial();
