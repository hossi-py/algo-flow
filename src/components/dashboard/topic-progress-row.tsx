"use client";

import Link from "next/link";
import { Crown, Lock } from "lucide-react";
import { ProgressRing } from "@/components/common/progress-ring";
import { TopicGlyph } from "@/components/common/topic-badges";
import { TOPIC_COLOR_CLASSES, TOPIC_STATUS_LABELS } from "@/content/topic-style";
import { TOPICS } from "@/content/topics";
import { cn } from "@/lib/utils";
import type { TopicView } from "@/types";

export function TopicProgressRow({ views }: { views: TopicView[] }) {
  return (
    <section aria-labelledby="topic-row-title" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 id="topic-row-title" className="text-h3 text-foreground">
          토픽별 진행도
        </h2>
        <Link href="/roadmap" className="text-small font-semibold text-primary-strong hover:underline">
          로드맵 전체 보기
        </Link>
      </div>
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pt-1 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 xl:grid-cols-7">
        {TOPICS.map((topic) => {
          const view = views.find((v) => v.topic === topic.slug);
          if (!view) return null;
          const color = TOPIC_COLOR_CLASSES[topic.color];
          const locked = view.status === "locked";
          return (
            <li key={topic.slug} className="w-36 shrink-0 snap-start lg:w-auto">
              <Link
                href={`/topics/${topic.slug}`}
                className={cn(
                  "flex h-full flex-col items-center gap-2 rounded-lg border border-border/70 bg-card p-4 text-center shadow-soft outline-none",
                  "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-ring/40 motion-reduce:transition-none",
                )}
              >
                <ProgressRing
                  value={view.progress}
                  size={68}
                  strokeWidth={6}
                  label={`${topic.title} 진행률`}
                  indicatorClassName={locked ? "text-muted-foreground" : color.text}
                >
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-full",
                      locked ? "bg-muted text-muted-foreground" : [color.surface, color.text],
                    )}
                  >
                    {locked ? (
                      <Lock className="size-5" aria-hidden />
                    ) : view.status === "mastered" ? (
                      <Crown className="size-5" aria-hidden />
                    ) : (
                      <TopicGlyph icon={topic.icon} className="size-5" />
                    )}
                  </span>
                </ProgressRing>
                <span className="text-small font-bold text-foreground">{topic.title}</span>
                <span className="text-caption text-muted-foreground">{TOPIC_STATUS_LABELS[view.status]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
