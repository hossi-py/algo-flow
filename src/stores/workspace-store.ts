"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Language, ProblemKey } from "@/types";

/** 문제·언어별 코드 초안 키 */
export function draftKey(problemKey: ProblemKey, language: Language): string {
  return `${problemKey}::${language}`;
}

interface WorkspaceState {
  drafts: Record<string, string>;
  setDraft: (problemKey: ProblemKey, language: Language, code: string) => void;
  clearDraft: (problemKey: ProblemKey, language: Language) => void;
}

/** 코드 초안은 진도와 분리해 저장한다 (진도 데이터를 가볍게 유지) */
export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      drafts: {},
      setDraft: (problemKey, language, code) =>
        set((state) => ({ drafts: { ...state.drafts, [draftKey(problemKey, language)]: code } })),
      clearDraft: (problemKey, language) =>
        set((state) => {
          const drafts = { ...state.drafts };
          delete drafts[draftKey(problemKey, language)];
          return { drafts };
        }),
    }),
    { name: "algo-flow:drafts", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
