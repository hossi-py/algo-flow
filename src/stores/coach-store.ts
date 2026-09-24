"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CoachMeta } from "@/lib/ai/schemas";
import type { HintsOpened, IsoDateTime, MascotMood, ProblemKey } from "@/types";

export interface CoachThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** 이 메시지 시점에 열려 있던 힌트 단계 */
  hintLevel: HintsOpened;
  mood?: MascotMood;
  followUps?: string[];
  suggestHintStep?: number | null;
  /** 답변을 받지 못함 (다시 보내기 표시) */
  failed?: boolean;
  createdAt: IsoDateTime;
}

/** 문제마다 최근 대화만 남긴다 */
const MAX_MESSAGES_PER_PROBLEM = 40;

interface CoachState {
  threads: Partial<Record<ProblemKey, CoachThreadMessage[]>>;
  append: (problemKey: ProblemKey, message: CoachThreadMessage) => void;
  patch: (problemKey: ProblemKey, id: string, patch: Partial<CoachThreadMessage>) => void;
  remove: (problemKey: ProblemKey, id: string) => void;
  clear: (problemKey: ProblemKey) => void;
}

/** 게스트의 AI 코치 대화 (로그인 사용자는 서버에도 저장된다) */
export const useCoachStore = create<CoachState>()(
  persist(
    (set) => ({
      threads: {},
      append: (problemKey, message) =>
        set((state) => ({
          threads: {
            ...state.threads,
            [problemKey]: [...(state.threads[problemKey] ?? []), message].slice(-MAX_MESSAGES_PER_PROBLEM),
          },
        })),
      patch: (problemKey, id, patch) =>
        set((state) => ({
          threads: {
            ...state.threads,
            [problemKey]: (state.threads[problemKey] ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m)),
          },
        })),
      remove: (problemKey, id) =>
        set((state) => ({
          threads: { ...state.threads, [problemKey]: (state.threads[problemKey] ?? []).filter((m) => m.id !== id) },
        })),
      clear: (problemKey) =>
        set((state) => {
          const threads = { ...state.threads };
          delete threads[problemKey];
          return { threads };
        }),
    }),
    { name: "algo-flow:coach", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);

export function metaPatch(meta: CoachMeta): Partial<CoachThreadMessage> {
  return { mood: meta.mood, followUps: meta.followUps, suggestHintStep: meta.suggestHintStep };
}
