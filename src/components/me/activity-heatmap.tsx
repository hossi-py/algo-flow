import { SectionTitle, SoftCard } from "@/components/common/soft-card";
import { addDays, weekdayIndex, WEEKDAY_LABELS } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { ActivityDay, LocalDate } from "@/types";

const WEEKS = 12;

/** XP 양에 따른 칸 농도 (primary 한 가지 색의 진하기) */
function level(xp: number): 0 | 1 | 2 | 3 | 4 {
  if (xp <= 0) return 0;
  if (xp < 20) return 1;
  if (xp < 50) return 2;
  if (xp < 100) return 3;
  return 4;
}

const LEVEL_CLASS = ["bg-muted", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary-strong"] as const;

/** 최근 12주 잔디 (열 = 주, 행 = 월~일) */
export function ActivityHeatmap({ activity, today }: { activity: ActivityDay[]; today: LocalDate }) {
  const byDate = new Map(activity.map((day) => [day.date, day]));
  const lastMonday = addDays(today, -weekdayIndex(today));
  const firstMonday = addDays(lastMonday, -(WEEKS - 1) * 7);
  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(firstMonday, w * 7 + d)),
  );
  const activeDays = weeks.flat().filter((date) => (byDate.get(date)?.xpEarned ?? 0) > 0).length;

  return (
    <SoftCard className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <SectionTitle>최근 12주 학습</SectionTitle>
        <p className="text-caption text-muted-foreground">{activeDays}일 동안 공부했어요</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="grid shrink-0 grid-rows-7 gap-1 text-[10px] leading-4 text-muted-foreground" aria-hidden>
          {WEEKDAY_LABELS.map((label, i) => (
            <span key={label} className={cn("h-4", i % 2 === 1 && "invisible")}>
              {label}
            </span>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-1" role="list" aria-label="날짜별 학습량">
          {weeks.flat().map((date) => {
            const day = byDate.get(date);
            const xp = day?.xpEarned ?? 0;
            const future = date > today;
            return (
              <span
                key={date}
                role="listitem"
                title={future ? undefined : `${date} · ${xp}XP${day?.solvedCount ? ` · ${day.solvedCount}문제` : ""}`}
                aria-label={future ? `${date} (아직)` : `${date} ${xp}XP`}
                className={cn("size-4 rounded-[4px]", future ? "bg-transparent" : LEVEL_CLASS[level(xp)])}
              />
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 text-caption text-muted-foreground" aria-hidden>
        적게
        {LEVEL_CLASS.map((cls) => (
          <span key={cls} className={cn("size-3 rounded-[3px]", cls)} />
        ))}
        많이
      </div>
    </SoftCard>
  );
}
