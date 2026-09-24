import {
  Crown,
  Flame,
  FlameKindling,
  Mountain,
  Search,
  Sparkles,
  Sprout,
  Trees,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { SectionTitle, SoftCard } from "@/components/common/soft-card";
import { BADGES } from "@/content/badges";
import { cn } from "@/lib/utils";
import type { EarnedBadge } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  sprout: Sprout,
  sparkles: Sparkles,
  flame: Flame,
  "flame-2": FlameKindling,
  trees: Trees,
  crown: Crown,
  search: Search,
  wand: WandSparkles,
  mountain: Mountain,
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric" });

export function BadgeShelf({ earned }: { earned: EarnedBadge[] }) {
  const byId = new Map(earned.map((badge) => [badge.badgeId, badge]));
  return (
    <SoftCard className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <SectionTitle>배지</SectionTitle>
        <p className="text-caption text-muted-foreground tabular">
          {byId.size}/{BADGES.length}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BADGES.map((badge) => {
          const got = byId.get(badge.id);
          const Icon = ICONS[badge.icon] ?? Sparkles;
          return (
            <li
              key={badge.id}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-center",
                got ? "bg-card shadow-soft" : "border-dashed bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "grid size-12 place-items-center rounded-full",
                  got ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground/60",
                )}
                aria-hidden
              >
                <Icon className="size-6" />
              </span>
              <span className={cn("text-small font-bold", got ? "text-foreground" : "text-muted-foreground")}>
                {badge.name}
                {!got && <span className="sr-only"> (아직 못 받음)</span>}
              </span>
              <span className="text-caption text-muted-foreground">{badge.description}</span>
              {got && (
                <span className="text-caption font-semibold text-muted-foreground">
                  {dateFormatter.format(new Date(got.earnedAt))} 획득
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </SoftCard>
  );
}
