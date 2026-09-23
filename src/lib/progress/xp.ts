import type { HintSet, HintsOpened, LevelNumber } from "@/types";

/** 레벨별 문제 기본 XP (docs/04 §2) */
export const BASE_XP_BY_LEVEL: Record<LevelNumber, number> = {
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  5: 50,
};

/** 힌트를 n단계까지 열었을 때의 기본 누적 감소율 (문제에 힌트 정보가 없을 때 사용) */
export const DEFAULT_HINT_PENALTY: Record<Exclude<HintsOpened, 0>, number> = {
  1: 0.05,
  2: 0.15,
  3: 0.3,
  4: 0.5,
};

export const CONCEPT_CARDS_XP = 10;
export const RECOGNITION_QUIZ_XP = 15;

/** 첫 정답 시 지급할 XP. 힌트를 열었으면 마지막으로 연 힌트의 감소율을 적용하고, 최소 1XP */
export function problemXp(baseXp: number, maxHintOpened: HintsOpened, hints?: HintSet): number {
  if (maxHintOpened === 0) return baseXp;
  const rate = hints ? hints[maxHintOpened - 1].xpPenaltyRate : DEFAULT_HINT_PENALTY[maxHintOpened];
  return Math.max(1, Math.round(baseXp * (1 - rate)));
}

/** 사용자 레벨 n에 도달하기 위한 누적 XP = 25 × n × (n − 1) */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return 25 * level * (level - 1);
}

export function userLevel(xp: number): number {
  const safeXp = Math.max(0, xp);
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * safeXp) / 25)) / 2));
  while (xpRequiredForLevel(level + 1) <= safeXp) level += 1;
  while (level > 1 && xpRequiredForLevel(level) > safeXp) level -= 1;
  return level;
}

export interface LevelProgress {
  level: number;
  /** 현재 레벨 안에서 모은 XP */
  current: number;
  /** 다음 레벨까지 필요한 이 레벨 구간의 XP */
  needed: number;
  /** 0~1 */
  ratio: number;
}

export function levelProgress(xp: number): LevelProgress {
  const level = userLevel(xp);
  const floor = xpRequiredForLevel(level);
  const ceil = xpRequiredForLevel(level + 1);
  const current = Math.max(0, xp) - floor;
  const needed = ceil - floor;
  return { level, current, needed, ratio: needed === 0 ? 0 : current / needed };
}

export type NodiGrowth = "sprout" | "leaves" | "bud" | "bloom";

/** 사용자 레벨 1–3 떡잎 · 4–6 본잎 · 7–9 꽃봉오리 · 10+ 만개 */
export function nodiGrowth(level: number): NodiGrowth {
  if (level >= 10) return "bloom";
  if (level >= 7) return "bud";
  if (level >= 4) return "leaves";
  return "sprout";
}

export const NODI_GROWTH_LABELS: Record<NodiGrowth, string> = {
  sprout: "떡잎",
  leaves: "본잎",
  bud: "꽃봉오리",
  bloom: "만개",
};

/** 게스트·신규 사용자의 기본 일일 목표 (profiles.daily_goal_xp 기본값과 동일) */
export const DEFAULT_DAILY_GOAL_XP = 30;
