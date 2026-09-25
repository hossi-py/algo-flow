"use client";

import { Crown, Lock } from "lucide-react";
import { motion } from "motion/react";
import { ProgressRing } from "@/components/common/progress-ring";
import { TopicGlyph } from "@/components/common/topic-badges";
import { TOPIC_COLOR_CLASSES, TOPIC_STATUS_LABELS } from "@/content/topic-style";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Topic, TopicView } from "@/types";

interface TopicNodeProps {
  topic: Topic;
  view: TopicView;
  selected: boolean;
  onSelect: () => void;
}

export function TopicNode({ topic, view, selected, onSelect }: TopicNodeProps) {
  const color = TOPIC_COLOR_CLASSES[topic.color];
  const locked = view.status === "locked";

  return (
    <div className="flex w-36 flex-col items-center gap-2 text-center">
      <motion.button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${topic.order}. ${topic.title} — ${TOPIC_STATUS_LABELS[view.status]}, 진행률 ${Math.round(view.progress * 100)}%`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        transition={spring.bouncy}
        className={cn(
          "relative rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
          selected && "ring-4 ring-primary-strong/60 ring-offset-4 ring-offset-background",
        )}
      >
        <ProgressRing
          value={view.progress}
          size={100}
          strokeWidth={7}
          label={`${topic.title} 진행률`}
          indicatorClassName={locked ? "text-muted-foreground" : color.text}
          trackClassName="text-card"
        >
          <span
            className={cn(
              "grid size-[4.75rem] place-items-center rounded-full border-4 border-card shadow-soft",
              locked ? "bg-muted text-muted-foreground" : [color.surface, color.text],
            )}
          >
            <TopicGlyph icon={topic.icon} className={cn("size-8", locked && "opacity-50")} />
          </span>
        </ProgressRing>
        {locked && (
          <span className="absolute -top-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-card bg-muted text-muted-foreground shadow-soft">
            <Lock className="size-4" aria-hidden />
          </span>
        )}
        {view.status === "mastered" && (
          <span className="absolute -top-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-card bg-warning text-warning-foreground shadow-soft">
            <Crown className="size-4" aria-hidden />
          </span>
        )}
      </motion.button>
      <div className="rounded-md bg-background/80 px-2 backdrop-blur-sm">
        <p className="text-small font-bold text-foreground">
          <span className="text-muted-foreground">{topic.order}. </span>
          {topic.title}
        </p>
        <p className="text-caption text-muted-foreground">{TOPIC_STATUS_LABELS[view.status]}</p>
      </div>
    </div>
  );
}
