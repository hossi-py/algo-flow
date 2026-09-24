"use client";

import { create } from "zustand";
import { getBadge } from "@/content/badges";
import type { BadgeId, MascotMood, TopicColor } from "@/types";

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

/**
 * 새로 얻은 배지를 차례로 축하한다. 앞선 연출(정답·레벨 클리어)이 있으면 그 뒤에 이어서.
 * @param after 앞에 몇 개의 연출이 예약돼 있는지
 */
export function celebrateBadges(earned: readonly BadgeId[], after = 0) {
  earned.forEach((id, index) => {
    const badge = getBadge(id);
    window.setTimeout(
      () =>
        useCelebrationStore.getState().celebrate({
          title: `배지 획득: ${badge.name}`,
          message: badge.description,
          mood: "cheer",
        }),
      (after + index) * LEVEL_CLEAR_DELAY_MS,
    );
  });
}
