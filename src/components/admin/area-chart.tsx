"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { dayLabel, formatNumber, shortDay } from "./format";

export interface TrendPoint {
  day: string;
  value: number;
}

export type ChartTone = "violet" | "peach" | "mint" | "sky";

/** 선은 대비를 검증한 진한 단계(--chart-*), 면은 같은 계열의 파스텔 토큰 */
const TONES: Record<ChartTone, { line: string; fill: string }> = {
  violet: { line: "var(--chart-violet)", fill: "var(--primary)" },
  peach: { line: "var(--chart-peach)", fill: "var(--secondary)" },
  mint: { line: "var(--chart-mint)", fill: "var(--accent)" },
  sky: { line: "var(--chart-sky)", fill: "var(--info)" },
};

const W = 300;
const H = 100;
const TOP = 10;

/**
 * 튀어 오르지 않는 부드러운 곡선 (monotone cubic, Fritsch–Carlson).
 * 값이 그대로면 수평, 오르내림이 바뀌는 곳에서는 기울기 0이라 기준선 아래로 내려가지 않는다.
 */
export function smoothPath(points: { x: number; y: number }[]): string {
  const n = points.length;
  if (n === 0) return "";
  const first = points[0]!;
  if (n === 1) return `M${first.x},${first.y}`;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1]!.x - points[i]!.x;
    slope[i] = (points[i + 1]!.y - points[i]!.y) / dx[i]!;
  }
  const tangent: number[] = [slope[0]!];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1]!;
    const b = slope[i]!;
    tangent[i] =
      a * b <= 0 ? 0 : (3 * (dx[i - 1]! + dx[i]!)) / ((2 * dx[i]! + dx[i - 1]!) / a + (dx[i]! + 2 * dx[i - 1]!) / b);
  }
  tangent[n - 1] = slope[n - 2]!;
  let d = `M${first.x},${first.y}`;
  for (let i = 0; i < n - 1; i++) {
    const p = points[i]!;
    const q = points[i + 1]!;
    const h = dx[i]! / 3;
    d += `C${p.x + h},${p.y + tangent[i]! * h} ${q.x - h},${q.y - tangent[i + 1]! * h} ${q.x},${q.y}`;
  }
  return d;
}

/**
 * 한 지표의 최근 추이 (시리즈 하나라 범례 없이 제목이 이름을 대신한다).
 * 마우스·키보드(←/→)로 날짜를 옮기면 툴팁에 정확한 값이 나오고, 같은 값을 표로도 볼 수 있다.
 */
export function AreaChart({
  title,
  unit,
  points,
  tone,
  summary = "sum",
}: {
  title: string;
  unit: string;
  points: TrendPoint[];
  tone: ChartTone;
  /** 제목 옆 큰 숫자: 기간 합계, 또는 하루 평균 (활동 회원처럼 날마다 같은 사람이 겹치는 지표) */
  summary?: "sum" | "average";
}) {
  const [active, setActive] = useState<number | null>(null);
  const [tableOpen, setTableOpen] = useState(false);
  const plotRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const { line, fill } = TONES[tone];

  const n = points.length;
  const max = Math.max(1, ...points.map((p) => p.value));
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const headline = summary === "sum" ? total : n > 0 ? Math.round((total / n) * 10) / 10 : 0;
  const headlineLabel = summary === "sum" ? `${n}일 합계` : "하루 평균";
  const coords = points.map((p, i) => ({
    x: n === 1 ? W / 2 : (i / (n - 1)) * W,
    y: H - (p.value / max) * (H - TOP),
  }));
  const linePath = smoothPath(coords);
  const areaPath = n > 0 ? `${linePath}L${coords.at(-1)!.x},${H}L${coords[0]!.x},${H}Z` : "";
  const today = points.at(-1);
  const current = active !== null ? points[active] : undefined;
  const leftPct = active !== null && n > 1 ? (active / (n - 1)) * 100 : 50;

  const pick = (event: PointerEvent<HTMLDivElement>) => {
    const box = plotRef.current?.getBoundingClientRect();
    if (!box || n === 0) return;
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    setActive(Math.round(ratio * (n - 1)));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (n === 0) return;
    const at = active ?? n - 1;
    const next =
      event.key === "ArrowLeft"
        ? Math.max(0, at - 1)
        : event.key === "ArrowRight"
          ? Math.min(n - 1, at + 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
  };

  return (
    <figure className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-soft">
      <figcaption className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-small font-semibold text-muted-foreground">{title}</span>
          <span className="text-2xl font-extrabold tracking-tight text-foreground tabular">
            {formatNumber(headline)}
            <span className="ml-1 text-small font-semibold text-muted-foreground">
              {unit} · {headlineLabel}
            </span>
          </span>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-caption font-semibold text-muted-foreground tabular">
          오늘 {formatNumber(today?.value ?? 0)}
        </span>
      </figcaption>

      <div
        ref={plotRef}
        role="group"
        tabIndex={0}
        aria-label={`${title} 최근 ${n}일 추이. 왼쪽·오른쪽 화살표로 날짜를 옮겨요`}
        aria-describedby={`${id}-table`}
        className="relative h-28 cursor-crosshair rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
        onPointerMove={pick}
        onPointerDown={pick}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive((at) => at ?? n - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: fill, stopOpacity: 0.95 }} />
              <stop offset="100%" style={{ stopColor: fill, stopOpacity: 0.08 }} />
            </linearGradient>
          </defs>
          <line x1="0" y1={H} x2={W} y2={H} stroke="var(--border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={areaPath} fill={`url(#${id}-fill)`} />
          <path
            d={linePath}
            fill="none"
            stroke={line}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {current && active !== null && (
          <>
            {/* 세로 안내선과 점 (SVG는 늘어나므로 점은 HTML로 그려 둥근 모양을 지킨다) */}
            <span
              className="pointer-events-none absolute inset-y-0 w-px bg-border"
              style={{ left: `${leftPct}%` }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card shadow-soft"
              style={{
                left: `${leftPct}%`,
                top: `${(coords[active]!.y / H) * 100}%`,
                backgroundColor: line,
              }}
              aria-hidden
            />
            <div
              role="status"
              className={cn(
                "pointer-events-none absolute -top-2 z-10 flex -translate-y-full flex-col rounded-2xl border border-border/60 bg-card px-3 py-2 whitespace-nowrap shadow-float",
                active === 0 ? "translate-x-0" : active === n - 1 ? "-translate-x-full" : "-translate-x-1/2",
              )}
              style={{ left: `${leftPct}%` }}
            >
              <span className="flex items-center gap-1.5 text-small font-extrabold text-foreground tabular">
                <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: line }} aria-hidden />
                {formatNumber(current.value)}
                {unit}
              </span>
              <span className="text-caption text-muted-foreground">{dayLabel(current.day)}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between text-caption text-muted-foreground tabular">
        <span>{points[0] ? shortDay(points[0].day) : ""}</span>
        <button
          type="button"
          aria-expanded={tableOpen}
          aria-controls={`${id}-table-wrap`}
          onClick={() => setTableOpen((open) => !open)}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold outline-none hover:bg-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/40"
        >
          표로 보기
          <ChevronDown
            className={cn("size-3.5 transition-transform motion-reduce:transition-none", tableOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        <span>{today ? shortDay(today.day) : ""}</span>
      </div>

      {/* 아코디언: grid-rows 0fr ↔ 1fr로 높이를 부드럽게 바꾼다. 닫혀 있으면 키보드로도 들어가지 않는다 */}
      <div
        id={`${id}-table-wrap`}
        className={cn(
          "-mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          tableOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
        inert={!tableOpen}
      >
        <div className="overflow-hidden">
          <table id={`${id}-table`} className="mt-2 w-full text-caption tabular">
            <caption className="sr-only">
              {title} 날짜별 {unit}
            </caption>
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 font-semibold">날짜</th>
                <th className="py-1 text-right font-semibold">{title}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.day} className="border-t border-border/60">
                  <td className="py-1">{dayLabel(point.day)}</td>
                  <td className="py-1 text-right font-semibold text-foreground">{formatNumber(point.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}
