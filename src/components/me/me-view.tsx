"use client";

import { useLearnerSummary, useProgress } from "@/hooks/use-progress";
import { useLearningRecord } from "@/hooks/use-learning-record";
import { useToday } from "@/hooks/use-today";
import { useAccountStore } from "@/stores/account-store";
import { ActivityHeatmap } from "./activity-heatmap";
import { BadgeShelf } from "./badge-shelf";
import { ProfileCard } from "./profile-card";
import { SettingsForm } from "./settings-form";
import { StatsOverview } from "./stats-overview";
import { SubmissionHistory } from "./submission-history";
import { WeaknessChart } from "./weakness-chart";

export function MeView() {
  const { progress, hydrated } = useProgress();
  const learner = useLearnerSummary();
  const clock = useToday();
  const status = useAccountStore((s) => s.status);
  const profile = useAccountStore((s) => s.profile);
  const syncing = useAccountStore((s) => s.syncing);
  const record = useLearningRecord();

  if (!hydrated || !clock || syncing) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true" aria-label="마이페이지를 불러오는 중">
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-56 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileCard learner={learner} status={status} profile={profile} />
      <StatsOverview progress={progress} />
      <ActivityHeatmap activity={progress.activity} today={clock.today} />
      <div className="grid gap-6 lg:grid-cols-2">
        <WeaknessChart stats={record.patternStats} />
        <SubmissionHistory submissions={record.submissions} />
      </div>
      {record.error && <p className="text-caption text-muted-foreground">{record.error}</p>}
      <BadgeShelf earned={progress.badges} />
      <SettingsForm />
    </div>
  );
}
