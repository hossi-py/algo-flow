import type { TopicColor, TopicStatus } from "@/types";

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  locked: "잠겨 있어요",
  available: "시작할 수 있어요",
  "in-progress": "학습 중",
  mastered: "마스터!",
};

/**
 * Tailwind는 클래스 문자열을 정적으로 스캔하므로 동적으로 조합하지 않고 전부 적어 둔다.
 */
export const TOPIC_COLOR_CLASSES: Record<
  TopicColor,
  { surface: string; text: string; ring: string; stroke: string; fill: string }
> = {
  peach: {
    surface: "bg-topic-peach",
    text: "text-topic-peach-foreground",
    ring: "ring-topic-peach-foreground/30",
    stroke: "stroke-topic-peach-foreground",
    fill: "fill-topic-peach",
  },
  mint: {
    surface: "bg-topic-mint",
    text: "text-topic-mint-foreground",
    ring: "ring-topic-mint-foreground/30",
    stroke: "stroke-topic-mint-foreground",
    fill: "fill-topic-mint",
  },
  lilac: {
    surface: "bg-topic-lilac",
    text: "text-topic-lilac-foreground",
    ring: "ring-topic-lilac-foreground/30",
    stroke: "stroke-topic-lilac-foreground",
    fill: "fill-topic-lilac",
  },
  sky: {
    surface: "bg-topic-sky",
    text: "text-topic-sky-foreground",
    ring: "ring-topic-sky-foreground/30",
    stroke: "stroke-topic-sky-foreground",
    fill: "fill-topic-sky",
  },
  blossom: {
    surface: "bg-topic-blossom",
    text: "text-topic-blossom-foreground",
    ring: "ring-topic-blossom-foreground/30",
    stroke: "stroke-topic-blossom-foreground",
    fill: "fill-topic-blossom",
  },
  lemon: {
    surface: "bg-topic-lemon",
    text: "text-topic-lemon-foreground",
    ring: "ring-topic-lemon-foreground/30",
    stroke: "stroke-topic-lemon-foreground",
    fill: "fill-topic-lemon",
  },
  sage: {
    surface: "bg-topic-sage",
    text: "text-topic-sage-foreground",
    ring: "ring-topic-sage-foreground/30",
    stroke: "stroke-topic-sage-foreground",
    fill: "fill-topic-sage",
  },
  sand: {
    surface: "bg-topic-sand",
    text: "text-topic-sand-foreground",
    ring: "ring-topic-sand-foreground/30",
    stroke: "stroke-topic-sand-foreground",
    fill: "fill-topic-sand",
  },
  slate: {
    surface: "bg-topic-slate",
    text: "text-topic-slate-foreground",
    ring: "ring-topic-slate-foreground/30",
    stroke: "stroke-topic-slate-foreground",
    fill: "fill-topic-slate",
  },
  plum: {
    surface: "bg-topic-plum",
    text: "text-topic-plum-foreground",
    ring: "ring-topic-plum-foreground/30",
    stroke: "stroke-topic-plum-foreground",
    fill: "fill-topic-plum",
  },
  teal: {
    surface: "bg-topic-teal",
    text: "text-topic-teal-foreground",
    ring: "ring-topic-teal-foreground/30",
    stroke: "stroke-topic-teal-foreground",
    fill: "fill-topic-teal",
  },
  coral: {
    surface: "bg-topic-coral",
    text: "text-topic-coral-foreground",
    ring: "ring-topic-coral-foreground/30",
    stroke: "stroke-topic-coral-foreground",
    fill: "fill-topic-coral",
  },
  indigo: {
    surface: "bg-topic-indigo",
    text: "text-topic-indigo-foreground",
    ring: "ring-topic-indigo-foreground/30",
    stroke: "stroke-topic-indigo-foreground",
    fill: "fill-topic-indigo",
  },
};
