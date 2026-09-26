"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { BarsSnapshot, HighlightTone } from "@/types";
import { TONE_STYLE } from "./tones";

const HEIGHT = 128;

/** 값의 크기를 막대 높이로. 같은 id의 막대는 자리를 바꿀 때 미끄러지듯 움직인다 */
export function BarsView({ snapshot }: { snapshot: BarsSnapshot }) {
  const max = Math.max(1, ...snapshot.items.map((item) => Number(item.value)));
  const toneOf = (id: string): HighlightTone | undefined => snapshot.highlights.find((h) => h.itemId === id)?.tone;
  const sorted = new Set(snapshot.sorted);
  const range = snapshot.range ?? null;

  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/70 bg-card/70 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-mono text-caption font-bold text-muted-foreground">{snapshot.title ?? "배열"}</h3>
        <span className="text-caption text-muted-foreground">
          {snapshot.sorted.length > 0 ? `확정 ${snapshot.sorted.length}개` : `${snapshot.items.length}개`}
        </span>
      </div>
      <ol className="flex items-end gap-1.5 overflow-x-auto pt-5 pb-1" style={{ minHeight: HEIGHT + 48 }}>
        {snapshot.items.map((item, index) => {
          const value = Number(item.value);
          const tone = toneOf(item.id);
          const style = tone ? TONE_STYLE[tone] : null;
          const Icon = style?.icon;
          const outside = range !== null && (index < range[0] || index > range[1]);
          const labels = snapshot.pointers.filter((p) => p.index === index).map((p) => p.label);
          return (
            <motion.li
              key={item.id}
              layout
              transition={spring.bouncy}
              className={cn("flex min-w-9 flex-1 flex-col items-center gap-1", outside && "opacity-35")}
            >
              <span className="flex items-center gap-0.5 font-mono text-caption font-bold text-foreground tabular">
                {Icon && <Icon className="size-3" aria-hidden />}
                {value}
                {style && <span className="sr-only">({style.label})</span>}
                {!style && sorted.has(item.id) && <span className="sr-only">(확정)</span>}
              </span>
              <motion.span
                aria-hidden
                animate={{ height: Math.max(6, (value / max) * HEIGHT) }}
                transition={spring.bouncy}
                className={cn(
                  "w-full rounded-t-md border-2",
                  style
                    ? style.className
                    : sorted.has(item.id)
                      ? "border-success-text bg-success"
                      : "border-border bg-muted",
                )}
              />
              <span className="font-mono text-[11px] text-muted-foreground tabular">{index}</span>
              <span className="h-4 text-caption font-bold whitespace-nowrap text-primary-strong">
                {labels.join(" · ")}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
