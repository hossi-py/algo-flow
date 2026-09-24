"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SubmissionSummary } from "@/types";

/** 게스트 제출 기록 (약점 분석·제출 기록 화면용). 로그인하면 계정으로 옮기고 비운다 */
const MAX_ENTRIES = 300;
/** localStorage 용량을 아끼려고 최근 몇 개만 코드를 남긴다 */
const KEEP_CODE = 30;

interface SubmissionLogState {
  entries: SubmissionSummary[];
  add: (entry: SubmissionSummary) => void;
  clear: () => void;
}

export const useSubmissionLogStore = create<SubmissionLogState>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) =>
        set((state) => ({
          // 최신이 앞
          entries: [entry, ...state.entries]
            .slice(0, MAX_ENTRIES)
            .map((item, index) => (index < KEEP_CODE ? item : { ...item, code: null })),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: "algo-flow:submissions", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
