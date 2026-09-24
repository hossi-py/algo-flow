"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_DAILY_GOAL_XP } from "@/lib/progress/xp";
import type { Language } from "@/types";

export const EDITOR_FONT_SIZES = [12, 13, 14, 15, 16, 18, 20] as const;

interface SettingsState {
  language: Language;
  editorFontSize: number;
  /** 하루 목표 XP (로그인 사용자는 프로필과 맞춘다) */
  dailyGoalXp: number;
  setLanguage: (language: Language) => void;
  setEditorFontSize: (size: number) => void;
  setDailyGoalXp: (xp: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "python",
      editorFontSize: 14,
      dailyGoalXp: DEFAULT_DAILY_GOAL_XP,
      setLanguage: (language) => set({ language }),
      setEditorFontSize: (size) => set({ editorFontSize: Math.min(22, Math.max(12, Math.round(size))) }),
      setDailyGoalXp: (xp) => set({ dailyGoalXp: Math.min(500, Math.max(10, Math.round(xp))) }),
    }),
    { name: "algo-flow:settings", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
