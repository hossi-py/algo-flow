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

/** 첫 연출(정답·XP)이 끝난 뒤 레벨 클리어 연출을 이어서 띄우기까지의 간격 */
export const LEVEL_CLEAR_DELAY_MS = 2600;

let nextId = 1;

export const useCelebrationStore = create<CelebrationState>()((set) => ({
  current: null,
  celebrate: (celebration) => set({ current: { ...celebration, id: nextId++ } }),
  dismiss: () => set({ current: null }),
}));
