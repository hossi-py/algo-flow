"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatValue } from "@/lib/runner/format";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CallFrame, JsonValue } from "@/types";

/** 함수 호출 프레임. 맨 위가 지금 실행 중인 호출 */
export function CallStackView({ frames }: { frames: CallFrame[] }) {
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/70 bg-card/70 p-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-caption font-bold text-muted-foreground">호출 스택</h3>
        <span className="text-caption text-muted-foreground">깊이 {frames.length}</span>
      </div>
      <ol className="flex flex-col gap-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {[...frames].reverse().map((frame) => (
            <motion.li
              key={frame.id}
              layout
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={spring.bouncy}
              className={cn(
                "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border-2 px-2.5 py-1.5",
                frame.status === "active"
                  ? "border-primary-strong bg-primary-soft text-primary-soft-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              <span className="font-mono text-code-sm font-bold">{frame.label}</span>
              {frame.status === "active" && <span className="text-caption font-bold">← 실행 중</span>}
              <span className="flex flex-wrap gap-1">
                {Object.entries(frame.locals).map(([key, value]) => (
                  <span key={key} className="rounded-xs bg-card/80 px-1.5 font-mono text-[11px] text-foreground">
                    {key}={formatValue(value, 40)}
                  </span>
                ))}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {frames.length === 0 && <li className="py-1 text-caption text-muted-foreground">실행 중인 호출이 없어요</li>}
      </ol>
    </section>
  );
}

export function VariablesView({ variables }: { variables: Record<string, JsonValue> }) {
  const entries = Object.entries(variables);
  if (entries.length === 0) return null;
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/70 bg-card/70 p-3">
      <h3 className="text-caption font-bold text-muted-foreground">변수</h3>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1">
        {entries.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="font-mono text-code-sm text-muted-foreground">{key}</dt>
            <dd className="font-mono text-code-sm font-semibold break-all text-foreground">
              {formatValue(value, 240)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** 현재 줄을 강조하고, 강조된 줄이 보이도록 패널 안에서만 스크롤한다 */
export function PseudocodeView({ lines, current }: { lines: string[]; current: number | null }) {
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list || current === null) return;
    const line = list.children[current - 1] as HTMLElement | undefined;
    if (!line) return;
    const top = line.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + line.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: Math.max(0, top - list.clientHeight / 3), behavior: "smooth" });
    }
  }, [current]);

  return (
    <section className="flex min-w-0 flex-col gap-2">
      <h3 className="text-caption font-bold text-muted-foreground">의사코드</h3>
      <ol
        ref={listRef}
        className="max-h-72 overflow-auto rounded-md border bg-muted py-2 font-mono text-code-sm text-foreground shadow-inset"
      >
        {lines.map((line, i) => {
          const active = current === i + 1;
          return (
            <li
              key={i}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex gap-3 border-l-4 px-3 whitespace-pre transition-colors duration-150",
                active
                  ? "border-primary-strong bg-primary-soft font-bold text-primary-soft-foreground"
                  : "border-transparent",
              )}
            >
              <span className="w-5 shrink-0 text-right text-muted-foreground select-none">{i + 1}</span>
              <span>{line}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
