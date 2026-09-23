"use client";

import { useCallback } from "react";
import { getTopic } from "@/content/topics";
import type { ConceptOutcome } from "@/lib/progress/concept";
import { LEVEL_CLEAR_DELAY_MS, useCelebrationStore } from "@/stores/celebration-store";
import type { Topic } from "@/types";

/** 개념 학습 결과(XP · Lv1 클리어)를 워크스페이스 제출과 같은 연출로 알린다 */
export function useConceptCelebration(topic: Topic) {
  const celebrate = useCelebrationStore((s) => s.celebrate);
  return useCallback(
    (outcome: ConceptOutcome, headline: { title: string; message: string }) => {
      if (outcome.xpAwarded > 0) {
        celebrate({ ...headline, xp: outcome.xpAwarded, mood: "happy", color: topic.color });
      }
      if (outcome.levelCleared) {
        const unlocked = outcome.unlockedTopic ? getTopic(outcome.unlockedTopic) : undefined;
        window.setTimeout(() => {
          celebrate({
            title: `Lv${outcome.levelCleared} 클리어!`,
            message: unlocked ? `「${unlocked.title}」 토픽이 새로 열렸어요` : "다음 레벨이 열렸어요",
            mood: "cheer",
            color: topic.color,
          });
        }, LEVEL_CLEAR_DELAY_MS);
      }
    },
    [celebrate, topic.color],
  );
}
