import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { TopicGlyph } from "@/components/common/topic-badges";
import { TOPIC_COLOR_CLASSES } from "@/content/topic-style";
import { cn } from "@/lib/utils";
import type { Topic, TopicView } from "@/types";
import { LevelSteps } from "./level-steps";

export function TopicDetailPanel({ topic, view, className }: { topic: Topic; view: TopicView; className?: string }) {
  const color = TOPIC_COLOR_CLASSES[topic.color];
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className={cn("flex items-center gap-3 rounded-lg p-4", color.surface, color.text)}>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card/70">
          <TopicGlyph icon={topic.icon} className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-h3">{topic.title}</p>
          <p className="text-small opacity-90">{topic.tagline}</p>
        </div>
      </div>
      {view.lockedReason && (
        <p className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-small text-foreground">
          <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          {view.lockedReason}
        </p>
      )}
      <LevelSteps topic={topic} levels={view.levels} />
      <PopButton asChild variant={view.status === "locked" ? "soft" : "primary"}>
        <Link href={`/topics/${topic.slug}`}>
          {view.status === "locked" ? "미리 둘러보기" : "토픽으로 가기"} <ArrowRight />
        </Link>
      </PopButton>
    </div>
  );
}
