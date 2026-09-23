"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Language } from "@/types";

export const EDITOR_FONT_SIZES = [12, 13, 14, 15, 16, 18, 20] as const;

interface SettingsState {
  language: Language;
  editorFontSize: number;
  setLanguage: (language: Language) => void;
  setEditorFontSize: (size: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "python",
      editorFontSize: 14,
      setLanguage: (language) => set({ language }),
      setEditorFontSize: (size) => set({ editorFontSize: Math.min(22, Math.max(12, Math.round(size))) }),
    }),
    { name: "algo-flow:settings", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
