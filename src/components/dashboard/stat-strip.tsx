"use client";

import { CircleCheck, Flame, Star } from "lucide-react";
import type { ReactNode } from "react";
import { ProgressBar } from "@/components/common/progress-bar";
import type { LevelProgress } from "@/lib/progress/xp";
import { cn } from "@/lib/utils";

function StatTile({
  icon,
  label,
  value,
  unit,
  footer,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  footer: ReactNode;
  tone: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-full", tone)} aria-hidden>
          {icon}
        </span>
        <span className="text-small font-semibold text-muted-foreground">{label}</span>
      </div>
      <p className="text-h1 text-foreground tabular">
        {value}
        <span className="ml-1 text-small font-semibold text-muted-foreground">{unit}</span>
      </p>
      <div className="text-caption text-muted-foreground">{footer}</div>
    </div>
  );
}

interface StatStripProps {
  streak: number;
  longestStreak: number;
  xp: number;
  level: LevelProgress;
  solvedCount: number;
}

export function StatStrip({ streak, longestStreak, xp, level, solvedCount }: StatStripProps) {
  return (
    <section aria-label="학습 통계" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatTile
        icon={<Flame className="size-4 fill-current" />}
        tone="bg-secondary text-secondary-foreground"
        label="연속 학습"
        value={String(streak)}
        unit="일"
        footer={`최장 기록 ${longestStreak}일`}
      />
      <StatTile
        icon={<Star className="size-4 fill-current" />}
        tone="bg-warning text-warning-foreground"
        label="경험치"
        value={xp.toLocaleString("ko-KR")}
        unit="XP"
        footer={
          <div className="flex flex-col gap-1.5">
            <ProgressBar value={level.ratio} label={`Lv${level.level + 1}까지 진행률`} className="h-2" />
            <span>
              Lv{level.level + 1}까지 {level.needed - level.current} XP
            </span>
          </div>
        }
      />
      <StatTile
        icon={<CircleCheck className="size-4" />}
        tone="bg-success text-success-foreground"
        label="해결한 문제"
        value={String(solvedCount)}
        unit="개"
        footer="힌트 없이 풀면 XP를 전부 받아요"
      />
    </section>
  );
}
