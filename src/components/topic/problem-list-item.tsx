import Link from "next/link";
import { CircleCheck, CircleDashed, CircleDot, Clock, Lightbulb, Lock, Star } from "lucide-react";
import type { ProblemMeta } from "@/content/problems";
import { FEATURES, FEATURE_ETA } from "@/lib/features";
import { cn } from "@/lib/utils";
import type { ProblemProgress } from "@/types";

interface ProblemListItemProps {
  problem: ProblemMeta;
  progress: ProblemProgress | undefined;
  locked: boolean;
}

export function ProblemListItem({ problem, progress, locked }: ProblemListItemProps) {
  const solved = progress?.status === "solved";
  const attempted = progress?.status === "attempted";
  const StatusIcon = locked ? Lock : solved ? CircleCheck : attempted ? CircleDot : CircleDashed;
  const statusLabel = locked ? "잠김" : solved ? "해결" : attempted ? "도전 중" : "아직 안 풀었어요";
  const openable = FEATURES.workspace && !locked;

  const body = (
    <>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full",
          solved
            ? "bg-success text-success-foreground"
            : attempted
              ? "bg-primary-soft text-primary-soft-foreground"
              : "bg-muted text-muted-foreground",
        )}
      >
        <StatusIcon className="size-5" aria-hidden />
        <span className="sr-only">{statusLabel}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-bold text-foreground">{problem.title}</span>
        <span className="block text-small text-muted-foreground">{problem.summary}</span>
        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-caption text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />약 {problem.estimatedMinutes}분
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" aria-hidden />
            {problem.xp} XP
          </span>
          {progress && progress.maxHintOpened > 0 && (
            <span className="inline-flex items-center gap-1">
              <Lightbulb className="size-3.5" aria-hidden />
              힌트 {progress.maxHintOpened}/4
            </span>
          )}
        </span>
      </span>
      {!openable && !locked && (
        <span className="hidden shrink-0 rounded-full bg-muted px-2.5 py-1 text-caption font-semibold text-muted-foreground sm:inline">
          {FEATURE_ETA.workspace}
        </span>
      )}
    </>
  );

  const base = "flex items-center gap-3 rounded-lg border border-border/70 bg-card p-4";
  if (openable) {
    return (
      <Link
        href={`/problems/${problem.slug}`}
        className={cn(
          base,
          "shadow-soft transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-ring/40 motion-reduce:transition-none",
        )}
      >
        {body}
      </Link>
    );
  }
  return (
    <div className={cn(base, locked && "opacity-60")} aria-disabled="true">
      {body}
    </div>
  );
}
