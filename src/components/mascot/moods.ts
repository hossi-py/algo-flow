import type { MascotMood, TopicColor } from "@/types";

export const MASCOT_MOODS: readonly MascotMood[] = [
  "idle",
  "happy",
  "cheer",
  "thinking",
  "oops",
  "sleepy",
  "curious",
  "loading",
];

/** 스크린 리더용 설명 */
export const MOOD_LABELS: Record<MascotMood, string> = {
  idle: "노디가 웃고 있어요",
  happy: "노디가 기뻐서 뛰어올라요",
  cheer: "노디가 두 팔을 들고 축하해요",
  thinking: "노디가 고개를 갸웃하며 생각해요",
  oops: "노디가 땀을 흘리며 멋쩍어해요",
  sleepy: "노디가 꾸벅꾸벅 졸고 있어요",
  curious: "노디가 눈을 반짝이며 궁금해해요",
  loading: "노디가 데굴데굴 구르고 있어요",
};

export type EyeShape = "dot" | "arc" | "chevron" | "closed" | "sparkle" | "lookUp";
export type MouthShape = "smile" | "open" | "flat" | "wavy" | "small-o";
export type ArmPose = "rest" | "up" | "down" | "chin";

export const MOOD_FACE: Record<MascotMood, { eyes: EyeShape; mouth: MouthShape; arms: ArmPose }> = {
  idle: { eyes: "dot", mouth: "smile", arms: "rest" },
  happy: { eyes: "arc", mouth: "open", arms: "up" },
  cheer: { eyes: "arc", mouth: "open", arms: "up" },
  thinking: { eyes: "lookUp", mouth: "flat", arms: "chin" },
  oops: { eyes: "chevron", mouth: "wavy", arms: "down" },
  sleepy: { eyes: "closed", mouth: "small-o", arms: "down" },
  curious: { eyes: "sparkle", mouth: "smile", arms: "rest" },
  loading: { eyes: "dot", mouth: "smile", arms: "rest" },
};

/**
 * 마스터한 토픽의 꽃 색. 캐릭터 색이라 다크모드에서도 바뀌지 않는다.
 */
export const FLOWER_COLORS: Record<TopicColor, string> = {
  peach: "#ffb89a",
  mint: "#8fddbf",
  lilac: "#c9b0ff",
  sky: "#9ed3ff",
  blossom: "#ffa8c9",
  lemon: "#ffe07a",
  sage: "#b9d98e",
  sand: "#e3c296",
};
