import {
  GitBranch,
  KeyRound,
  Layers,
  Radar,
  Repeat,
  Route,
  Share2,
  UsersRound,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { TOPIC_COLOR_CLASSES } from "@/content/topic-style";
import { cn } from "@/lib/utils";
import { LEVEL_STAGES, LEVEL_STAGE_LABELS, type LevelNumber, type Topic, type TopicIcon } from "@/types";

const TOPIC_ICONS: Record<TopicIcon, LucideIcon> = {
  plates: Layers,
  line: UsersRound,
  mirror: Repeat,
  map: Share2,
  dive: GitBranch,
  ripple: Radar,
  maze: Route,
  lockers: KeyRound,
};

export function TopicGlyph({ icon, ...props }: { icon: TopicIcon } & LucideProps) {
  const Icon = TOPIC_ICONS[icon];
  return <Icon aria-hidden {...props} />;
}

export function TopicChip({
  topic,
  className,
}: {
  topic: Pick<Topic, "title" | "color" | "icon">;
  className?: string;
}) {
  const color = TOPIC_COLOR_CLASSES[topic.color];
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-caption font-bold",
        color.surface,
        color.text,
        className,
      )}
    >
      <TopicGlyph icon={topic.icon} className="size-3.5" />
      {topic.title}
    </span>
  );
}

export function LevelBadge({
  level,
  showStage = true,
  className,
}: {
  level: LevelNumber;
  showStage?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-full bg-primary-soft px-2.5 text-caption font-bold text-primary-soft-foreground",
        className,
      )}
    >
      Lv{level}
      {showStage && <span className="font-semibold">· {LEVEL_STAGE_LABELS[LEVEL_STAGES[level]]}</span>}
    </span>
  );
}
