"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { tallyByTopic, type PracticeAnswer } from "@/lib/practice/session";
import type { IsoDateTime, TopicSlug } from "@/types";

/** 최근 기록은 이만큼만 남긴다 */
const MAX_SESSIONS = 20;

export interface PracticeSessionRecord {
  finishedAt: IsoDateTime;
  total: number;
  correct: number;
}

interface PracticeState {
  /** 토픽별 누적: 몇 번 나왔고 몇 번 맞혔나 */
  perTopic: Partial<Record<TopicSlug, { seen: number; correct: number }>>;
  sessions: PracticeSessionRecord[];
  record: (answers: PracticeAnswer[], finishedAt: IsoDateTime) => void;
}

/** 섞어 풀기 기록 (이 브라우저에만 저장. XP·랭킹과는 상관없다) */
export const usePracticeStore = create<PracticeState>()(
  persist(
    (set) => ({
      perTopic: {},
      sessions: [],
      record: (answers, finishedAt) =>
        set((state) => {
          if (answers.length === 0) return state;
          const perTopic = { ...state.perTopic };
          for (const [topic, { seen, correct }] of tallyByTopic(answers)) {
            const before = perTopic[topic] ?? { seen: 0, correct: 0 };
            perTopic[topic] = { seen: before.seen + seen, correct: before.correct + correct };
          }
          const session = {
            finishedAt,
            total: answers.length,
            correct: answers.filter((a) => a.picked === a.topic).length,
          };
          return { perTopic, sessions: [session, ...state.sessions].slice(0, MAX_SESSIONS) };
        }),
    }),
    { name: "algo-flow:practice", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
