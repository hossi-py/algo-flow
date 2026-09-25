import type { Badge, BadgeId } from "@/types";

/** 배지 정의 (supabase/migrations/20260924000001_badges.sql과 같다) */
export const BADGES: readonly Badge[] = [
  { id: "first-accept", name: "첫 새싹", description: "첫 문제를 맞혔어요", icon: "sprout" },
  { id: "no-hint-lv3", name: "혼자서도 척척", description: "Lv3 이상 문제를 힌트 없이 풀었어요", icon: "sparkles" },
  { id: "streak-3", name: "사흘의 약속", description: "3일 연속으로 학습했어요", icon: "flame" },
  { id: "streak-7", name: "일주일 개근", description: "7일 연속으로 학습했어요", icon: "flame-2" },
  { id: "streak-30", name: "한 달의 숲", description: "30일 연속으로 학습했어요", icon: "trees" },
  { id: "topic-master", name: "토픽 마스터", description: "한 토픽의 Lv5를 클리어했어요", icon: "crown" },
  {
    id: "signal-detective",
    name: "유형 탐정",
    description: "유형 인식 퀴즈를 만점으로 5번 통과했어요",
    icon: "search",
  },
  { id: "ai-pioneer", name: "AI 개척자", description: "AI가 만든 맞춤 문제를 처음 풀었어요", icon: "wand" },
  { id: "never-give-up", name: "끈기왕", description: "5번 이상 도전한 끝에 정답을 맞혔어요", icon: "mountain" },
];

const BADGES_BY_ID = new Map(BADGES.map((badge) => [badge.id, badge]));

export function getBadge(id: BadgeId): Badge {
  const badge = BADGES_BY_ID.get(id);
  if (!badge) throw new Error(`알 수 없는 배지예요: ${id}`);
  return badge;
}
