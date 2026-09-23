"use client";

import { useMemo } from "react";
import { TOPICS } from "@/content/topics";
import { computeTopicViews, findNextStep, type NextStep } from "@/lib/progress/unlock";
import { levelProgress, nodiGrowth, type LevelProgress, type NodiGrowth } from "@/lib/progress/xp";
import { useProgressStore } from "@/stores/progress-store";
import type { TopicColor, TopicView, UserProgress } from "@/types";

export function useProgress(): { progress: UserProgress; hydrated: boolean } {
  const progress = useProgressStore((state) => state.progress);
  const hydrated = useProgressStore((state) => state.hydrated);
  return { progress, hydrated };
}

export function useTopicViews(): TopicView[] {
  const { progress } = useProgress();
  return useMemo(() => computeTopicViews(progress, TOPICS), [progress]);
}

export function useNextStep(): NextStep | null {
  const { progress } = useProgress();
  return useMemo(() => findNextStep(progress, TOPICS), [progress]);
}

export interface LearnerSummary {
  level: LevelProgress;
  growth: NodiGrowth;
  /** Lv5까지 마스터한 토픽의 꽃 */
  flowers: TopicColor[];
}

export function useLearnerSummary(): LearnerSummary {
  const { progress } = useProgress();
  const views = useTopicViews();
  return useMemo(() => {
    const level = levelProgress(progress.stats.xp);
    const flowers = TOPICS.filter((topic) => views.find((v) => v.topic === topic.slug)?.status === "mastered").map(
      (topic) => topic.color,
    );
    return { level, growth: nodiGrowth(level.level), flowers };
  }, [progress.stats.xp, views]);
}
