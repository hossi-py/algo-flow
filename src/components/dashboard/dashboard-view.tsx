"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLearningRecord } from "@/hooks/use-learning-record";
import { recommendable } from "@/lib/progress/recommend";
import { weaknessScores } from "@/lib/progress/weakness";
import { useLearnerSummary, useNextStep, useProgress, useTopicViews } from "@/hooks/use-progress";
import { useToday } from "@/hooks/use-today";
import { riseIn } from "@/lib/motion";
import { visibleStreak, xpOnDate } from "@/lib/progress/streak";
import { useSettingsStore } from "@/stores/settings-store";
import type { ProblemProgress } from "@/types";
import { ContinueCard } from "./continue-card";
import { GreetingHero } from "./greeting-hero";
import { RecommendCard } from "./recommend-card";
import { SignalOfTheDay } from "./signal-of-the-day";
import { StatStrip } from "./stat-strip";
import { TopicProgressRow } from "./topic-progress-row";
import { WeekActivity } from "./week-activity";

export function DashboardView() {
  const { progress, hydrated } = useProgress();
  const clock = useToday();
  const views = useTopicViews();
  const nextStep = useNextStep();
  const learner = useLearnerSummary();
  const reduceMotion = useReducedMotion();
  const dailyGoal = useSettingsStore((s) => s.dailyGoalXp);
  const record = useLearningRecord();
  const weakest = record.patternStats ? recommendable(weaknessScores(record.patternStats))[0] : undefined;

  const { inProgress, solvedCount } = useMemo(() => {
    const entries = Object.values(progress.problems).filter((p): p is ProblemProgress => p !== undefined);
    const attempted = entries
      .filter((p) => p.status === "attempted" && p.source === "curated")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return { inProgress: attempted[0] ?? null, solvedCount: entries.filter((p) => p.status === "solved").length };
  }, [progress.problems]);

  if (!hydrated || !clock) return <DashboardSkeleton />;

  const isFirstVisit = progress.stats.xp === 0 && Object.keys(progress.problems).length === 0;
  const sections = [
    <GreetingHero
      key="hero"
      hour={clock.hour}
      learner={learner}
      todayXp={xpOnDate(progress.activity, clock.today)}
      dailyGoal={dailyGoal}
    />,
    <div key="main" className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <ContinueCard inProgress={inProgress} nextStep={nextStep} isFirstVisit={isFirstVisit} />
      </div>
      <div className="lg:col-span-2">
        <WeekActivity today={clock.today} activity={progress.activity} />
      </div>
    </div>,
    <StatStrip
      key="stats"
      streak={visibleStreak(progress.stats, clock.today)}
      longestStreak={progress.stats.longestStreak}
      xp={progress.stats.xp}
      level={learner.level}
      solvedCount={solvedCount}
    />,
    ...(weakest ? [<RecommendCard key="recommend" weakest={weakest} />] : []),
    <TopicProgressRow key="topics" views={views} />,
    <SignalOfTheDay key="signal" today={clock.today} />,
  ];

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section, index) => (
        <motion.div
          key={section.key ?? index}
          variants={riseIn}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          custom={index}
        >
          {section}
        </motion.div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="대시보드를 불러오는 중">
      <div className="h-56 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="h-56 animate-pulse rounded-lg bg-muted lg:col-span-3" />
        <div className="h-56 animate-pulse rounded-lg bg-muted lg:col-span-2" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
