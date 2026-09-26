"use client";

import { motion } from "motion/react";
import { formatValue } from "@/lib/runner/format";
import { cn } from "@/lib/utils";
import type { HighlightTone, TableSnapshot } from "@/types";
import { TONE_STYLE } from "./tones";

/** DP 표. 채운 칸은 값이, 아직 안 채운 칸은 점이 보인다. 강조한 칸은 색 + 아이콘으로 구분 */
export function TableView({ snapshot }: { snapshot: TableSnapshot }) {
  const toneOf = (row: number, col: number): HighlightTone | undefined =>
    snapshot.highlights.find((h) => h.row === row && h.col === col)?.tone;
  const cols = snapshot.cells[0]?.length ?? 0;
  const filled = snapshot.cells.flat().filter((cell) => cell !== null).length;

  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/70 bg-card/70 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-mono text-caption font-bold text-muted-foreground">{snapshot.title ?? "dp"}</h3>
        <span className="text-caption text-muted-foreground">
          {filled} / {snapshot.cells.length * cols}칸
        </span>
      </div>
      <div className="overflow-x-auto pb-1">
        <table className="border-separate border-spacing-1 font-mono text-small">
          <thead>
            <tr>
              <th aria-hidden />
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} scope="col" className="min-w-9 text-center text-[11px] font-semibold text-muted-foreground">
                  {snapshot.colLabels?.[c] ?? c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {snapshot.cells.map((row, r) => (
              <tr key={r}>
                <th scope="row" className="pr-1 text-right text-[11px] font-semibold text-muted-foreground">
                  {snapshot.rowLabels?.[r] ?? r}
                </th>
                {row.map((cell, c) => {
                  const tone = toneOf(r, c);
                  const style = tone ? TONE_STYLE[tone] : null;
                  const Icon = style?.icon;
                  return (
                    <td key={c} className="p-0">
                      <motion.span
                        key={cell === null ? "empty" : "filled"}
                        initial={cell === null ? false : { scale: 0.7, opacity: 0.4 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "flex h-9 min-w-9 items-center justify-center gap-0.5 rounded-md border-2 px-1 font-bold tabular",
                          style
                            ? style.className
                            : cell === null
                              ? "border-dashed border-border bg-transparent text-muted-foreground"
                              : "border-border bg-card text-foreground",
                        )}
                      >
                        {Icon && <Icon className="size-3 shrink-0" aria-hidden />}
                        {cell === null ? "·" : typeof cell === "string" ? cell : formatValue(cell, 12)}
                        {style && <span className="sr-only">({style.label})</span>}
                      </motion.span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
