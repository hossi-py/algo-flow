import { CircleCheck, Flame, Lightbulb, Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ProblemProgress, UserProgress } from "@/types";

function Tile({
  icon,
  tone,
  label,
  value,
  unit,
}: {
  icon: ReactNode;
  tone: string;
  label: string;
  value: string;
  unit: string;
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
    </div>
  );
}

export function StatsOverview({ progress }: { progress: UserProgress }) {
  const solved = Object.values(progress.problems).filter((p): p is ProblemProgress => p?.status === "solved");
  const noHint = solved.filter((p) => p.maxHintOpened === 0).length;
  const noHintRatio = solved.length === 0 ? 0 : Math.round((noHint / solved.length) * 100);

  return (
    <section aria-label="학습 통계" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile
        icon={<Star className="size-4 fill-current" />}
        tone="bg-warning text-warning-foreground"
        label="총 XP"
        value={progress.stats.xp.toLocaleString("ko-KR")}
        unit="XP"
      />
      <Tile
        icon={<CircleCheck className="size-4" />}
        tone="bg-success text-success-foreground"
        label="해결한 문제"
        value={String(solved.length)}
        unit="개"
      />
      <Tile
        icon={<Flame className="size-4 fill-current" />}
        tone="bg-secondary text-secondary-foreground"
        label="최장 스트릭"
        value={String(progress.stats.longestStreak)}
        unit="일"
      />
      <Tile
        icon={<Lightbulb className="size-4" />}
        tone="bg-info text-info-foreground"
        label="힌트 없이 푼 비율"
        value={String(noHintRatio)}
        unit="%"
      />
    </section>
  );
}
