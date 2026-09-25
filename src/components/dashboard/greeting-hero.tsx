"use client";

import { Nodi } from "@/components/mascot/nodi";
import { ProgressBar } from "@/components/common/progress-bar";
import { NODI_GROWTH_LABELS } from "@/lib/progress/xp";
import type { LearnerSummary } from "@/hooks/use-progress";

function greeting(hour: number): string {
  if (hour >= 5 && hour < 11) return "좋은 아침이에요!";
  if (hour >= 11 && hour < 17) return "좋은 오후예요!";
  if (hour >= 17 && hour < 22) return "좋은 저녁이에요!";
  return "늦은 시간에도 반가워요!";
}

interface GreetingHeroProps {
  hour: number;
  learner: LearnerSummary;
  todayXp: number;
  dailyGoal: number;
}

export function GreetingHero({ hour, learner, todayXp, dailyGoal }: GreetingHeroProps) {
  const goalMet = todayXp >= dailyGoal;
  return (
    <section
      aria-labelledby="greeting-title"
      className="relative overflow-hidden rounded-xl border border-primary/40 bg-primary-soft p-5 text-foreground shadow-soft sm:p-7"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Nodi
          mood={goalMet ? "happy" : "idle"}
          growth={learner.growth}
          flowers={learner.flowers}
          size={120}
          className="self-center sm:self-auto"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h1 id="greeting-title" className="text-display text-foreground max-sm:text-h1">
              {greeting(hour)}
            </h1>
            <p className="mt-1 text-body text-muted-foreground">
              {goalMet ? "오늘 목표를 채웠어요. 노디 새싹이 쑥쑥 자라고 있어요." : "오늘도 한 칸만 전진해 볼까요?"}
            </p>
          </div>
          <div className="rounded-lg bg-card/80 p-4">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-small font-bold text-foreground">오늘의 목표</span>
              <span className="text-small font-bold text-primary-soft-foreground tabular">
                {Math.min(todayXp, dailyGoal)} / {dailyGoal} XP
              </span>
            </div>
            <ProgressBar value={todayXp / dailyGoal} label="오늘의 XP 목표 달성률" />
            <p className="mt-2 text-caption text-muted-foreground">
              사용자 Lv{learner.level.level} · 노디는 지금 {NODI_GROWTH_LABELS[learner.growth]} 단계예요
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
