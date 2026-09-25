"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addDays } from "@/lib/date";
import { TOPICS } from "@/content/topics";
import { cardAction, hintAction, quizAction, submitAction } from "@/lib/progress/actions";
import type { ConceptOutcome } from "@/lib/progress/concept";
import { connectProgressSink, pushProgress } from "@/lib/progress/remote";
import { addActivityDay, applyActivity } from "@/lib/progress/streak";
import type { SubmissionInput, SubmissionOutcome } from "@/lib/progress/submission";
import { useSubmissionLogStore } from "@/stores/submission-log-store";
import type {
  BadgeId,
  HintStep,
  IsoDateTime,
  JudgeResult,
  Language,
  LevelClear,
  LocalDate,
  Problem,
  Topic,
  TopicSlug,
  UserProgress,
} from "@/types";

export function createEmptyProgress(): UserProgress {
  return {
    userId: null,
    stats: { xp: 0, currentStreak: 0, longestStreak: 0, lastActiveDate: null },
    concepts: {},
    problems: {},
    levelClears: [],
    activity: [],
    badges: [],
  };
}

/**
 * 개발/검토용 예시 진도: 스택 ~ 그래프 표현 Lv3까지, DFS Lv2까지 클리어.
 * DFS Lv3(꽃밭 구역 나누기)을 푸는 중이고, 4일 연속 학습 중인 사용자.
 */
export function createDemoProgress(today: LocalDate, now: IsoDateTime): UserProgress {
  const clears: LevelClear[] = [];
  const clearUpTo = (topic: TopicSlug, maxLevel: 1 | 2 | 3) => {
    for (let level = 1; level <= maxLevel; level += 1) {
      clears.push({ topic, level: level as 1 | 2 | 3, clearedAt: now });
    }
  };
  clearUpTo("stack", 3);
  clearUpTo("queue-deque", 3);
  clearUpTo("recursion", 3);
  clearUpTo("graph-representation", 3);
  clearUpTo("dfs", 2);

  const activity = [
    { date: addDays(today, -6), xpEarned: 60, solvedCount: 2 },
    { date: addDays(today, -3), xpEarned: 45, solvedCount: 1 },
    { date: addDays(today, -2), xpEarned: 90, solvedCount: 3 },
    { date: addDays(today, -1), xpEarned: 30, solvedCount: 1 },
    { date: today, xpEarned: 20, solvedCount: 0 },
  ];

  return {
    userId: null,
    stats: { xp: 640, currentStreak: 4, longestStreak: 6, lastActiveDate: today },
    concepts: {},
    problems: {
      "c:dfs-flower-zones": {
        problemKey: "c:dfs-flower-zones",
        source: "curated",
        topic: "dfs",
        level: 3,
        status: "attempted",
        attempts: 2,
        maxHintOpened: 2,
        lastCode: null,
        solvedAt: null,
        bestRuntimeMs: null,
        xpAwarded: 0,
        updatedAt: now,
      },
    },
    levelClears: clears,
    activity,
    badges: [
      { badgeId: "first-accept", earnedAt: now },
      { badgeId: "streak-3", earnedAt: now },
    ],
  };
}

/** 제출을 서버·게스트 기록에 남길 때 필요한 채점 정보 */
export interface SubmissionDetails {
  judged: JudgeResult;
  code: string;
  language: Language;
}

export type SubmissionResult = SubmissionOutcome & { earnedBadges: BadgeId[] };
export type ConceptResult = ConceptOutcome & { earnedBadges: BadgeId[] };

interface ProgressState {
  progress: UserProgress;
  /** localStorage에서 불러오기를 마쳤는지 (마치기 전에는 스켈레톤을 보여준다) */
  hydrated: boolean;
  setHydrated: () => void;
  /** XP 획득 → 통계·스트릭·일별 활동을 한 번에 갱신 */
  awardXp: (amount: number, today: LocalDate, solvedDelta?: number) => void;
  /** 힌트 열기 (순서대로만) */
  openHint: (problem: Problem, step: HintStep, now: IsoDateTime) => void;
  /**
   * 제출 결과 반영. 첫 정답·레벨 클리어·새 배지를 돌려준다.
   * 로그인 상태면 서버에도 기록하고(서버 결과로 다시 맞춤), 게스트면 이 브라우저의 제출 기록에 남긴다.
   */
  recordSubmission: (input: SubmissionInput, details?: SubmissionDetails) => SubmissionResult;
  /** 개념 카드 한 장을 읽음. 모든 카드를 처음 다 읽으면 XP */
  readConceptCard: (topic: Topic, cardId: string, today: LocalDate, now: IsoDateTime) => ConceptResult;
  /** 유형 인식 퀴즈 한 번을 끝까지 풂 (score: 0~1). 처음 통과하면 XP */
  recordQuiz: (topic: Topic, score: number, today: LocalDate, now: IsoDateTime) => ConceptResult;
  /** 서버가 계산한 진도로 덮어쓴다 (로그인 사용자) */
  replace: (progress: UserProgress) => void;
  loadDemo: (today: LocalDate, now: IsoDateTime) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: createEmptyProgress(),
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      awardXp: (amount, today, solvedDelta = 0) =>
        set((state) => ({
          progress: {
            ...state.progress,
            stats: applyActivity(state.progress.stats, today, amount),
            activity: addActivityDay(state.progress.activity, today, amount, solvedDelta),
          },
        })),
      openHint: (problem, step, now) => {
        const before = get().progress;
        const progress = hintAction(before, problem, step, now);
        if (progress === before) return;
        set({ progress });
        if (before.userId !== null) void pushProgress("/api/progress/hint", { problemKey: problem.id, step });
      },
      recordSubmission: (input, details) => {
        const before = get().progress;
        const hintsOpened = before.problems[input.problem.id]?.maxHintOpened ?? 0;
        const { progress, outcome, earnedBadges } = submitAction(before, input, TOPICS);
        set({ progress });
        if (details && input.verdict !== "internal-error") {
          const { judged, code, language } = details;
          if (before.userId !== null) {
            void pushProgress("/api/progress/submit", {
              problemKey: input.problem.id,
              verdict: judged.verdict,
              passed: judged.passed,
              total: judged.total,
              runtimeMs: input.runtimeMs,
              language,
              code,
              results: judged.results.map((r) => ({ ...r, stdout: "" })),
            });
          } else {
            useSubmissionLogStore.getState().add({
              id: crypto.randomUUID(),
              problemKey: input.problem.id,
              source: input.problem.source,
              topic: input.problem.topic,
              level: input.problem.level,
              patternTags: input.problem.patternTags,
              language,
              code,
              verdict: judged.verdict,
              passed: judged.passed,
              total: judged.total,
              runtimeMs: input.runtimeMs,
              hintsOpened,
              createdAt: input.now,
            });
          }
        }
        return { ...outcome, earnedBadges };
      },
      readConceptCard: (topic, cardId, today, now) => {
        const before = get().progress;
        const { progress, outcome, earnedBadges } = cardAction(before, topic, cardId, TOPICS, today, now);
        if (progress !== before) {
          set({ progress });
          if (before.userId !== null) {
            void pushProgress("/api/progress/concept", { kind: "card", topic: topic.slug, cardId });
          }
        }
        return { ...outcome, earnedBadges };
      },
      recordQuiz: (topic, score, today, now) => {
        const before = get().progress;
        const { progress, outcome, earnedBadges } = quizAction(before, topic, score, TOPICS, today, now);
        set({ progress });
        if (before.userId !== null)
          void pushProgress("/api/progress/concept", { kind: "quiz", topic: topic.slug, score });
        return { ...outcome, earnedBadges };
      },
      replace: (progress) => set({ progress }),
      loadDemo: (today, now) => set({ progress: createDemoProgress(today, now) }),
      reset: () => set({ progress: createEmptyProgress() }),
    }),
    {
      name: "algo-flow:progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ progress: state.progress }),
      // SSR과 첫 렌더를 일치시키기 위해 ProgressHydrator가 마운트 후 직접 불러온다
      skipHydration: true,
    },
  ),
);

connectProgressSink((progress) => useProgressStore.getState().replace(progress));
