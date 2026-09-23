"use client";

import { create } from "zustand";
import type { MascotMood, TopicColor } from "@/types";

export interface Celebration {
  id: number;
  title: string;
  message?: string;
  xp?: number;
  mood: Extract<MascotMood, "happy" | "cheer">;
  /** 파티클 색 (토픽 색). 없으면 여러 색 */
  color?: TopicColor;
}

interface CelebrationState {
  current: Celebration | null;
  celebrate: (celebration: Omit<Celebration, "id">) => void;
  dismiss: () => void;
}

let nextId = 1;

export const useCelebrationStore = create<CelebrationState>()((set) => ({
  current: null,
  celebrate: (celebration) => set({ current: { ...celebration, id: nextId++ } }),
  dismiss: () => set({ current: null }),
}));
