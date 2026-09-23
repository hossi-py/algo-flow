import Link from "next/link";
import { BookOpen, Code, Eye, Search, WandSparkles, type LucideIcon } from "lucide-react";
import { FEATURES, FEATURE_ETA, type FeatureKey } from "@/lib/features";
import { cn } from "@/lib/utils";
import type { TopicSlug } from "@/types";

interface FlowStep {
  label: string;
  description: string;
  icon: LucideIcon;
  feature: FeatureKey | null;
  href: (topic: TopicSlug) => string;
}

const STEPS: FlowStep[] = [
  {
    label: "개념 카드",
    description: "비유와 그림으로 이해해요",
    icon: BookOpen,
    feature: "learn",
    href: (t) => `/topics/${t}/learn`,
  },
  {
    label: "시각화 탐색",
    description: "한 단계씩 동작을 봐요",
    icon: Eye,
    feature: "learn",
    href: (t) => `/topics/${t}/learn#visualize`,
  },
  {
    label: "유형 인식",
    description: "문제 속 신호를 찾아요",
    icon: Search,
    feature: "learn",
    href: (t) => `/topics/${t}/learn#signals`,
  },
  { label: "문제 풀이", description: "힌트와 함께 풀어요", icon: Code, feature: null, href: () => "#levels" },
  {
    label: "AI 맞춤 문제",
    description: "약한 부분을 더 연습해요",
    icon: WandSparkles,
    feature: "aiLab",
    href: () => "/ai-lab",
  },
];

/** 각 토픽 공통 학습 흐름 5단계 */
export function LearningFlowStepper({ topic }: { topic: TopicSlug }) {
  return (
    <nav aria-label="학습 흐름">
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {STEPS.map((step, index) => {
          const enabled = step.feature === null || FEATURES[step.feature];
          const Icon = step.icon;
          const content = (
            <>
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full text-small font-bold",
                  enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-small font-bold text-foreground">
                  {index + 1}. {step.label}
                </span>
                <span className="block text-caption text-muted-foreground">
                  {enabled ? step.description : step.feature ? FEATURE_ETA[step.feature] : step.description}
                </span>
              </span>
            </>
          );
          const base = "flex h-full items-center gap-3 rounded-lg border p-3 sm:flex-col sm:items-start";
          return (
            <li key={step.label}>
              {enabled ? (
                <Link
                  href={step.href(topic)}
                  className={cn(
                    base,
                    "border-border/70 bg-card shadow-soft transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-ring/40 motion-reduce:transition-none",
                  )}
                >
                  {content}
                </Link>
              ) : (
                <div className={cn(base, "border-dashed border-border bg-card/50")} aria-disabled="true">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
