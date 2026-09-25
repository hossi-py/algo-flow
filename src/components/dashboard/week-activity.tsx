"use client";

import { Sprout } from "lucide-react";
import { SoftCard } from "@/components/common/soft-card";
import { WEEKDAY_LABELS, weekOf } from "@/lib/date";
import { xpOnDate } from "@/lib/progress/streak";
import { cn } from "@/lib/utils";
import type { ActivityDay, LocalDate } from "@/types";

export function WeekActivity({ today, activity }: { today: LocalDate; activity: ActivityDay[] }) {
  const days = weekOf(today);
  const activeCount = days.filter((date) => xpOnDate(activity, date) > 0).length;

  return (
    <SoftCard className="flex h-full flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-h3 text-foreground">이번 주 학습</h2>
        <span className="text-small font-semibold text-muted-foreground">{activeCount}/7일</span>
      </div>
      <ol className="grid grid-cols-7 gap-1.5">
        {days.map((date, index) => {
          const xp = xpOnDate(activity, date);
          const active = xp > 0;
          const isToday = date === today;
          const future = date > today;
          return (
            <li key={date} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid aspect-square w-full max-w-11 place-items-center rounded-full border-2",
                  active
                    ? "border-transparent bg-success text-success-foreground"
                    : "border-dashed border-border bg-muted",
                  isToday && "ring-2 ring-primary-strong ring-offset-2 ring-offset-card",
                  future && "opacity-50",
                )}
                aria-label={`${WEEKDAY_LABELS[index]}요일${isToday ? "(오늘)" : ""} ${active ? `${xp} XP 학습` : "학습 없음"}`}
                role="img"
              >
                {active && <Sprout className="size-4" aria-hidden />}
              </span>
              <span
                className={cn("text-caption", isToday ? "font-bold text-primary-strong" : "text-muted-foreground")}
                aria-hidden
              >
                {WEEKDAY_LABELS[index]}
              </span>
            </li>
          );
        })}
      </ol>
    </SoftCard>
  );
}
