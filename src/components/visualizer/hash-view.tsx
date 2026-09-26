"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatValue } from "@/lib/runner/format";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { HashEntryViz, HashSnapshot, HighlightTone } from "@/types";
import { TONE_STYLE } from "./tones";

function text(value: HashEntryViz["key"]): string {
  return typeof value === "string" ? value : formatValue(value, 40);
}

function Chip({
  entry,
  tone,
  showValue,
}: {
  entry: HashEntryViz;
  tone: HighlightTone | undefined;
  showValue: boolean;
}) {
  const style = tone ? TONE_STYLE[tone] : null;
  const Icon = style?.icon;
  return (
    <motion.span
      layout
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={spring.bouncy}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md border-2 px-2.5 font-mono text-small font-bold",
        style ? style.className : "border-border bg-card text-foreground",
      )}
    >
      {Icon && <Icon className="size-3.5 shrink-0" aria-hidden />}
      {text(entry.key)}
      {showValue && <span className="font-semibold opacity-80">: {text(entry.value)}</span>}
      {style && <span className="sr-only">({style.label})</span>}
    </motion.span>
  );
}

/** 칸(버킷)마다 줄을 서는 해시 테이블, 또는 키 → 값 표 */
export function HashView({ snapshot }: { snapshot: HashSnapshot }) {
  const toneOf = (id: string) => snapshot.highlights.find((h) => h.entryId === id)?.tone;
  const count = snapshot.buckets
    ? snapshot.buckets.reduce((sum, bucket) => sum + bucket.length, 0)
    : (snapshot.entries?.length ?? 0);

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-lg border border-border/70 bg-card/70 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-mono text-caption font-bold text-muted-foreground">{snapshot.title ?? "해시 테이블"}</h3>
        <span className="text-caption text-muted-foreground">{count}개</span>
      </div>

      {snapshot.hashing && (
        <p className="rounded-md bg-muted px-3 py-2 font-mono text-code-sm break-all text-foreground">
          hash(<strong>{snapshot.hashing.key}</strong>): {snapshot.hashing.formula}
        </p>
      )}

      {snapshot.buckets ? (
        <ol className="flex flex-col gap-1.5">
          {snapshot.buckets.map((bucket, index) => {
            const active = snapshot.activeBucket === index;
            return (
              <li
                key={index}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-md border-2 px-2 py-1",
                  active ? "border-primary-strong bg-primary-soft" : "border-transparent bg-muted/60",
                )}
              >
                <span
                  className={cn(
                    "w-9 shrink-0 text-center font-mono text-caption font-bold tabular",
                    active ? "text-primary-soft-foreground" : "text-muted-foreground",
                  )}
                >
                  {index}번
                </span>
                <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <AnimatePresence initial={false} mode="popLayout">
                    {bucket.map((entry, i) => (
                      <span key={entry.id} className="inline-flex items-center gap-1.5">
                        {i > 0 && (
                          <span className="text-caption text-muted-foreground" aria-hidden>
                            →
                          </span>
                        )}
                        <Chip entry={entry} tone={toneOf(entry.id)} showValue={false} />
                      </span>
                    ))}
                  </AnimatePresence>
                  {bucket.length === 0 && <span className="text-caption text-muted-foreground">비어 있음</span>}
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="flex min-h-12 flex-wrap content-start gap-1.5">
          <AnimatePresence initial={false} mode="popLayout">
            {(snapshot.entries ?? []).map((entry) => (
              <Chip key={entry.id} entry={entry} tone={toneOf(entry.id)} showValue />
            ))}
          </AnimatePresence>
          {(snapshot.entries ?? []).length === 0 && (
            <p className="py-2 text-caption text-muted-foreground">비어 있어요 {"{}"}</p>
          )}
        </div>
      )}
    </section>
  );
}
