"use client";

import { StreakFlame, XpPill } from "@/components/common/stat-pills";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useProgress } from "@/hooks/use-progress";
import { useToday } from "@/hooks/use-today";
import { visibleStreak } from "@/lib/progress/streak";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";

export function TopBar({ className }: { className?: string }) {
  const { progress, hydrated } = useProgress();
  const clock = useToday();
  const ready = hydrated && clock !== null;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6 md:border-b-0 md:bg-transparent md:backdrop-blur-none lg:px-8",
        className,
      )}
    >
      <div className="md:hidden">
        <Brand wordmarkClassName="hidden min-[400px]:inline" />
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-2">
        {ready ? (
          <>
            <StreakFlame days={visibleStreak(progress.stats, clock.today)} />
            <XpPill xp={progress.stats.xp} />
          </>
        ) : (
          <div className="flex gap-2" aria-hidden>
            <span className="h-9 w-16 animate-pulse rounded-full bg-muted" />
            <span className="h-9 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        )}
        <div className="md:hidden">
          <ThemeToggle />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
