"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addDays } from "@/lib/date";
import { TOPICS } from "@/content/topics";
import { applyCardRead, applyQuizResult, type ConceptOutcome } from "@/lib/progress/concept";
import { addActivityDay, applyActivity } from "@/lib/progress/streak";
import {
  applyHintOpen,
  applySubmission,
  type SubmissionInput,
  type SubmissionOutcome,
} from "@/lib/progress/submission";
import type { HintStep, IsoDateTime, LevelClear, LocalDate, Problem, Topic, TopicSlug, UserProgress } from "@/types";

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

interface ProgressState {
  progress: UserProgress;
  /** localStorage에서 불러오기를 마쳤는지 (마치기 전에는 스켈레톤을 보여준다) */
  hydrated: boolean;
  setHydrated: () => void;
  /** XP 획득 → 통계·스트릭·일별 활동을 한 번에 갱신 */
  awardXp: (amount: number, today: LocalDate, solvedDelta?: number) => void;
  /** 힌트 열기 (순서대로만) */
  openHint: (problem: Problem, step: HintStep, now: IsoDateTime) => void;
  /** 제출 결과 반영. 첫 정답·레벨 클리어 여부를 돌려준다 */
  recordSubmission: (input: SubmissionInput) => SubmissionOutcome;
  /** 개념 카드 한 장을 읽음. 모든 카드를 처음 다 읽으면 XP */
  readConceptCard: (topic: Topic, cardId: string, today: LocalDate, now: IsoDateTime) => ConceptOutcome;
  /** 유형 인식 퀴즈 한 번을 끝까지 풂 (score: 0~1). 처음 통과하면 XP */
  recordQuiz: (topic: Topic, score: number, today: LocalDate, now: IsoDateTime) => ConceptOutcome;
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
      openHint: (problem, step, now) =>
        set((state) => ({ progress: applyHintOpen(state.progress, problem, step, now) })),
      recordSubmission: (input) => {
        const { progress, outcome } = applySubmission(get().progress, input, TOPICS);
        set({ progress });
        return outcome;
      },
      readConceptCard: (topic, cardId, today, now) => {
        const { progress, outcome } = applyCardRead(get().progress, topic, cardId, TOPICS, today, now);
        if (progress !== get().progress) set({ progress });
        return outcome;
      },
      recordQuiz: (topic, score, today, now) => {
        const { progress, outcome } = applyQuizResult(get().progress, topic, score, TOPICS, today, now);
        set({ progress });
        return outcome;
      },
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
