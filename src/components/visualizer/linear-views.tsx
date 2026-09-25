"use client";

import { AnimatePresence, motion } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { HighlightTone, LinearSnapshot, SequenceSnapshot, VizItem } from "@/types";
import { TONE_STYLE } from "./tones";

function toneOf(highlights: { itemId: string; tone: HighlightTone }[], id: string): HighlightTone | undefined {
  return highlights.find((h) => h.itemId === id)?.tone;
}

function display(item: VizItem): string {
  return typeof item.value === "string" ? item.value : JSON.stringify(item.value);
}

function Cell({ item, tone, className }: { item: VizItem; tone: HighlightTone | undefined; className?: string }) {
  const style = tone ? TONE_STYLE[tone] : null;
  const Icon = style?.icon;
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center gap-1 rounded-md border-2 px-3 font-mono text-small font-bold",
        style ? style.className : "border-border bg-card text-foreground",
        className,
      )}
    >
      {Icon && <Icon className="size-3.5 shrink-0" aria-hidden />}
      {display(item)}
      {style && <span className="sr-only">({style.label})</span>}
    </span>
  );
}

function Panel({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/70 bg-card/70 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-mono text-caption font-bold text-muted-foreground">{title}</h3>
        {hint && <span className="text-caption text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

/** 접시처럼 아래에서 위로 쌓이는 스택. 넣은 값은 위에서 떨어지고, 꺼낸 값은 위로 사라진다 */
export function StackView({ snapshot, fallbackTitle = "스택" }: { snapshot: LinearSnapshot; fallbackTitle?: string }) {
  const labelFor = (id: string) => snapshot.pointerLabels.find((p) => p.itemId === id)?.label;
  return (
    <Panel title={snapshot.title ?? fallbackTitle} hint={`${snapshot.items.length}개`}>
      <div className="flex min-h-24 flex-col-reverse items-center gap-1.5 pb-1">
        <div className="h-1.5 w-40 max-w-full rounded-full bg-border" aria-hidden />
        <AnimatePresence initial={false} mode="popLayout">
          {snapshot.items.map((item) => {
            const label = labelFor(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ y: -28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={spring.bouncy}
                className="relative flex w-40 max-w-full justify-center"
              >
                <Cell item={item} tone={toneOf(snapshot.highlights, item.id)} className="h-9 w-full" />
                {label && (
                  <span className="absolute top-1/2 left-full ml-2 -translate-y-1/2 text-caption font-bold whitespace-nowrap text-primary-strong">
                    ← {label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {snapshot.items.length === 0 && <p className="py-2 text-caption text-muted-foreground">비어 있어요</p>}
      </div>
    </Panel>
  );
}

/** 왼쪽이 front, 오른쪽이 rear인 줄 (큐·덱 공용) */
export function LineView({ snapshot, fallbackTitle }: { snapshot: LinearSnapshot; fallbackTitle: string }) {
  const labelFor = (id: string) => snapshot.pointerLabels.find((p) => p.itemId === id)?.label;
  return (
    <Panel title={snapshot.title ?? fallbackTitle} hint={`${snapshot.items.length}개 · 왼쪽이 앞`}>
      <div className="flex min-h-16 items-start gap-1.5 overflow-x-auto pt-1 pb-6">
        <AnimatePresence initial={false} mode="popLayout">
          {snapshot.items.map((item) => {
            const label = labelFor(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={spring.bouncy}
                className="relative shrink-0"
              >
                <Cell item={item} tone={toneOf(snapshot.highlights, item.id)} className="h-10 min-w-10" />
                {label && (
                  <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 text-caption font-bold whitespace-nowrap text-primary-strong">
                    {label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {snapshot.items.length === 0 && <p className="py-2 text-caption text-muted-foreground">비어 있어요</p>}
      </div>
    </Panel>
  );
}

/** 문자열·배열을 칸으로. 처리한 칸은 흐리게, 지금 칸은 강조 */
export function SequenceView({ snapshot }: { snapshot: SequenceSnapshot }) {
  return (
    <Panel title={snapshot.label}>
      <ol className="flex flex-wrap gap-1.5">
        {snapshot.items.map((item, index) => {
          const tone = toneOf(snapshot.highlights, item.id);
          const done = index < snapshot.done && tone === undefined;
          return (
            <li key={item.id} className="flex flex-col items-center gap-0.5">
              <span className="font-mono text-[11px] text-muted-foreground tabular">{index}</span>
              <Cell
                item={item}
                tone={tone}
                className={cn(
                  "h-9 min-w-9",
                  done && "opacity-45",
                  index === snapshot.cursor && !tone && "ring-2 ring-primary-strong",
                )}
              />
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
