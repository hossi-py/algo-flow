"use client";

import Link from "next/link";
import { ChevronRight, CircleCheck, Loader, TriangleAlert } from "lucide-react";
import { LevelBadge, TopicChip } from "@/components/common/topic-badges";
import { PATTERN_LABELS } from "@/content/patterns";
import { getTopic } from "@/content/topics";
import type { GeneratedProblemSummary } from "@/lib/ai/views";
import { cn } from "@/lib/utils";
import type { ProblemKey, ProblemProgress } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function GeneratedProblemList({
  problems,
  progress,
}: {
  problems: GeneratedProblemSummary[];
  progress: Partial<Record<ProblemKey, ProblemProgress>>;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {problems.map((item) => {
        const topic = getTopic(item.topic);
        const solved = progress[`g:${item.id}`]?.status === "solved";
        const verified = item.status === "verified";
        const inProgress = item.status === "queued" || item.status === "generating" || item.status === "verifying";
        const body = (
          <>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {topic && <TopicChip topic={topic} />}
                <LevelBadge level={item.level} showStage={false} />
                {solved && (
                  <span className="inline-flex h-7 items-center gap-1 rounded-full bg-success px-2.5 text-caption font-bold text-success-foreground">
                    <CircleCheck className="size-3.5" aria-hidden />
                    해결
                  </span>
                )}
              </div>
              <p className={cn("truncate text-body font-bold", verified ? "text-foreground" : "text-muted-foreground")}>
                {verified
                  ? item.title
                  : inProgress
                    ? "만드는 중…"
                    : item.status === "rejected"
                      ? "검증을 통과하지 못한 문제"
                      : "만들지 못한 문제"}
              </p>
              <p className="flex flex-wrap gap-x-2 text-caption text-muted-foreground">
                <span>{dateFormatter.format(new Date(item.createdAt))}</span>
                {item.patternTags.length > 0 && (
                  <span>· {item.patternTags.map((tag) => PATTERN_LABELS[tag]).join(", ")}</span>
                )}
              </p>
            </div>
            {verified ? (
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            ) : inProgress ? (
              <Loader
                className="size-5 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none"
                aria-hidden
              />
            ) : (
              <TriangleAlert className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            )}
          </>
        );
        const className = "flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-soft";
        return (
          <li key={item.id}>
            {verified ? (
              <Link
                href={`/ai-lab/problems/${item.id}`}
                className={cn(
                  className,
                  "transition-[transform,box-shadow] outline-none hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-4 focus-visible:ring-ring/40 motion-reduce:hover:translate-y-0",
                )}
              >
                {body}
              </Link>
            ) : (
              <div className={cn(className, "opacity-80")}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
