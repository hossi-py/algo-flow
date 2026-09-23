"use client";

import { Lock } from "lucide-react";
import { ProgressRing } from "@/components/common/progress-ring";
import { LevelBadge, TopicGlyph } from "@/components/common/topic-badges";
import { Nodi } from "@/components/mascot/nodi";
import { levelStatusText } from "@/components/roadmap/level-steps";
import { getProblemMeta, type ProblemMeta } from "@/content/problems";
import { TOPIC_COLOR_CLASSES, TOPIC_STATUS_LABELS } from "@/content/topic-style";
import { getTopic } from "@/content/topics";
import { useProgress, useTopicViews } from "@/hooks/use-progress";
import { curatedKey } from "@/lib/progress/unlock";
import { cn } from "@/lib/utils";
import type { TopicSlug } from "@/types";
import { LearningFlowStepper } from "./learning-flow-stepper";
import { ProblemListItem } from "./problem-list-item";
import { SignalPreview } from "./signal-preview";

export function TopicView({ slug }: { slug: TopicSlug }) {
  const topic = getTopic(slug);
  const { progress, hydrated } = useProgress();
  const views = useTopicViews();
  const view = views.find((v) => v.topic === slug);

  if (!topic) return null;
  const color = TOPIC_COLOR_CLASSES[topic.color];

  return (
    <div className="flex flex-col gap-8">
      <header
        className={cn(
          "flex flex-col gap-4 rounded-xl p-5 shadow-soft sm:flex-row sm:items-center sm:p-7",
          color.surface,
        )}
      >
        <span className={cn("grid size-16 shrink-0 place-items-center rounded-full bg-card/70", color.text)}>
          <TopicGlyph icon={topic.icon} className="size-8" />
        </span>
        <div className={cn("min-w-0 flex-1", color.text)}>
          <p className="text-small font-bold opacity-90">토픽 {topic.order}</p>
          <h1 className="text-h1">{topic.title}</h1>
          <p className="mt-1 text-body">{topic.tagline}</p>
        </div>
        {hydrated && view && (
          <div className={cn("flex items-center gap-3", color.text)}>
            <ProgressRing
              value={view.progress}
              size={72}
              strokeWidth={7}
              label={`${topic.title} 진행률`}
              indicatorClassName={color.text}
              trackClassName="text-card/70"
            >
              <span className="text-small font-bold tabular">{Math.round(view.progress * 100)}%</span>
            </ProgressRing>
            <span className="text-small font-bold">{TOPIC_STATUS_LABELS[view.status]}</span>
          </div>
        )}
      </header>

      {hydrated && view?.lockedReason && (
        <p className="flex items-center gap-2 rounded-lg border border-dashed bg-card px-4 py-3 text-body text-foreground">
          <Lock className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          아직 잠겨 있어요. {view.lockedReason}. 미리 둘러볼 수는 있어요.
        </p>
      )}

      <LearningFlowStepper topic={topic.slug} />

      <SignalPreview signalIds={topic.signalIds} />

      <section id="levels" aria-labelledby="levels-title" className="flex scroll-mt-20 flex-col gap-4">
        <h2 id="levels-title" className="text-h2 text-foreground">
          레벨별 문제
        </h2>
        {topic.levels.map((level, index) => {
          const levelView = view?.levels[index];
          const problems = level.problemSlugs.map(getProblemMeta).filter((p): p is ProblemMeta => p !== undefined);
          const locked = levelView?.status === "locked";
          return (
            <article
              key={level.level}
              className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <LevelBadge level={level.level} />
                <h3 className="text-h3 text-foreground">{level.title}</h3>
              </div>
              <p className="text-small text-muted-foreground">{level.goal}</p>
              {hydrated && levelView && (
                <p
                  className={cn("text-caption font-semibold", locked ? "text-muted-foreground" : "text-primary-strong")}
                >
                  {levelStatusText(levelView)}
                </p>
              )}
              {problems.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {problems.map((problem) => (
                    <li key={problem.slug}>
                      <ProblemListItem
                        problem={problem}
                        progress={progress.problems[curatedKey(problem.slug)]}
                        locked={locked}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed bg-card/50 px-4 py-3">
                  <Nodi mood="sleepy" size={44} decorative />
                  <p className="text-small text-muted-foreground">
                    <span className="font-bold text-foreground">문제를 준비하고 있어요.</span> 노디가 이 레벨 문제를
                    열심히 만들고 있어요.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
