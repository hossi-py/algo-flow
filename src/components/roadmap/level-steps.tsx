import { Check, CircleDashed, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVEL_STAGE_LABELS, type LevelStatus, type LevelView, type Topic } from "@/types";

const STATUS_STYLE: Record<LevelStatus, { icon: typeof Check; circle: string; label: string }> = {
  cleared: { icon: Check, circle: "bg-success text-success-foreground", label: "클리어" },
  "in-progress": { icon: Play, circle: "bg-primary text-primary-foreground", label: "진행 중" },
  available: { icon: CircleDashed, circle: "bg-primary-soft text-primary-soft-foreground", label: "도전 가능" },
  locked: { icon: Lock, circle: "bg-muted text-muted-foreground", label: "잠김" },
};

export function levelStatusText(view: LevelView): string {
  if (view.status === "locked") return view.lockedReason ?? "잠겨 있어요";
  if (view.status === "cleared") return "클리어했어요";
  if (view.total === 0) return "문제 준비 중이에요";
  return `${view.solved}/${view.required}문제 해결하면 클리어`;
}

/** Lv1~Lv5 세로 단계 표시 */
export function LevelSteps({ topic, levels }: { topic: Topic; levels: LevelView[] }) {
  return (
    <ol className="flex flex-col">
      {levels.map((view, index) => {
        const level = topic.levels[index];
        if (!level) return null;
        const style = STATUS_STYLE[view.status];
        const Icon = style.icon;
        const last = index === levels.length - 1;
        return (
          <li key={view.level} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-10 bottom-0 left-[1.125rem] w-0.5 -translate-x-1/2 rounded-full",
                  view.status === "cleared" ? "bg-success-text/50" : "bg-border",
                )}
              />
            )}
            <span className={cn("relative grid size-9 shrink-0 place-items-center rounded-full", style.circle)}>
              <Icon className="size-4" aria-hidden />
              <span className="sr-only">{style.label}</span>
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-small font-bold text-foreground">
                Lv{view.level} · {level.title}
              </p>
              <p className="text-caption text-muted-foreground">
                {LEVEL_STAGE_LABELS[level.stage]} · {levelStatusText(view)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
