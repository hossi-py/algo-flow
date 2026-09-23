"use client";

import { Check, Flower2, Footprints, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GridSnapshot } from "@/types";

/** 구역 번호별 색 (1번 구역부터 순서대로) */
const ZONE_CLASSES = [
  "bg-topic-blossom text-topic-blossom-foreground border-topic-blossom-foreground/40",
  "bg-topic-sky text-topic-sky-foreground border-topic-sky-foreground/40",
  "bg-topic-lemon text-topic-lemon-foreground border-topic-lemon-foreground/40",
  "bg-topic-lilac text-topic-lilac-foreground border-topic-lilac-foreground/40",
  "bg-topic-mint text-topic-mint-foreground border-topic-mint-foreground/40",
  "bg-topic-peach text-topic-peach-foreground border-topic-peach-foreground/40",
];

const CHECK_ICON = { go: Check, blocked: X, visited: RotateCcw } as const;
const CHECK_TEXT = { go: "갈 수 있음", blocked: "막힘", visited: "이미 방문" } as const;

function cellClass(ch: string, zone: number, isMaze: boolean): string {
  if (isMaze) {
    if (ch === "#") return "bg-muted-foreground/70 border-transparent";
    if (zone === 2) return "bg-success text-success-foreground border-success-text/50";
    if (zone === 1) return "bg-info text-info-foreground border-info-text/40";
    if (ch === "S") return "bg-primary-soft text-primary-soft-foreground border-primary-strong/50";
    if (ch === "E") return "bg-warning text-warning-foreground border-warning-text/50";
    return "bg-card border-border";
  }
  if (ch !== "1") return "bg-muted border-transparent";
  if (zone > 0) return ZONE_CLASSES[(zone - 1) % ZONE_CLASSES.length]!;
  return "bg-card text-success-text border-success-text/40";
}

export function GridView({ snapshot }: { snapshot: GridSnapshot }) {
  const rows = snapshot.cells.length;
  const cols = snapshot.cells[0]?.length ?? 0;
  const isMaze = snapshot.cells.some((row) => /[SE.#]/.test(row));
  const [cr, cc] = snapshot.cursor ?? [-1, -1];
  const [kr, kc] = snapshot.checking ?? [-1, -1];

  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/70 bg-card/70 p-3">
      <div
        role="grid"
        aria-label={`${rows}×${cols} 격자`}
        className="mx-auto grid w-full gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: `${cols * 3.4}rem` }}
      >
        {snapshot.cells.map((row, r) => (
          <div key={r} role="row" className="contents">
            {[...row].map((ch, c) => {
              const zone = snapshot.zone[r]?.[c] ?? 0;
              const distance = snapshot.distance?.[r]?.[c] ?? null;
              const isCursor = r === cr && c === cc;
              const isChecking = r === kr && c === kc;
              const CheckIcon = isChecking && snapshot.checkResult ? CHECK_ICON[snapshot.checkResult] : null;
              const label = [
                `(${r}, ${c})`,
                isMaze ? { "#": "벽", S: "출발", E: "도착", ".": "길" }[ch] : ch === "1" ? "꽃" : "빈 땅",
                zone > 0 && !isMaze ? `${zone}번 구역` : null,
                distance !== null ? `거리 ${distance}` : null,
                isCursor ? "현재 위치" : null,
                isChecking && snapshot.checkResult ? CHECK_TEXT[snapshot.checkResult] : null,
              ]
                .filter(Boolean)
                .join(", ");
              return (
                <div
                  key={c}
                  role="gridcell"
                  aria-label={label}
                  className={cn(
                    "relative grid aspect-square place-items-center rounded-sm border-2 text-caption font-bold transition-colors duration-200",
                    cellClass(ch, zone, isMaze),
                    isCursor && "ring-3 ring-primary-strong ring-offset-1 ring-offset-card",
                    isChecking && "outline-2 outline-offset-1 outline-primary-strong outline-dashed",
                  )}
                >
                  {!isMaze && ch === "1" && zone === 0 && <Flower2 className="size-[45%]" aria-hidden />}
                  {!isMaze && zone > 0 && <span className="tabular">{zone}</span>}
                  {isMaze && (ch === "S" || ch === "E") && distance === null && <span>{ch}</span>}
                  {isMaze && distance !== null && <span className="tabular">{distance}</span>}
                  {isCursor && (
                    <Footprints
                      className="absolute -top-1.5 -left-1.5 size-4 rounded-full bg-card p-0.5 text-primary-strong shadow-soft"
                      aria-hidden
                    />
                  )}
                  {CheckIcon && (
                    <CheckIcon
                      className={cn(
                        "absolute -right-1.5 -bottom-1.5 size-4 rounded-full bg-card p-0.5 shadow-soft",
                        snapshot.checkResult === "go" && "text-success-text",
                        snapshot.checkResult === "blocked" && "text-danger-text",
                        snapshot.checkResult === "visited" && "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <ul
        className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-caption text-muted-foreground"
        aria-label="범례"
      >
        <li className="inline-flex items-center gap-1">
          <Footprints className="size-3.5 text-primary-strong" aria-hidden />
          현재 칸
        </li>
        <li className="inline-flex items-center gap-1">
          <Check className="size-3.5 text-success-text" aria-hidden />갈 수 있음
        </li>
        <li className="inline-flex items-center gap-1">
          <X className="size-3.5 text-danger-text" aria-hidden />
          막힘
        </li>
        <li className="inline-flex items-center gap-1">
          <RotateCcw className="size-3.5" aria-hidden />
          이미 방문
        </li>
        {isMaze ? (
          <li className="inline-flex items-center gap-1">
            <span className="inline-block size-3 rounded-xs bg-success" aria-hidden />
            최단 경로
          </li>
        ) : (
          <li className="inline-flex items-center gap-1">
            <span className="inline-block size-3 rounded-xs bg-topic-blossom" aria-hidden />
            숫자 = 구역 번호
          </li>
        )}
      </ul>
    </section>
  );
}
