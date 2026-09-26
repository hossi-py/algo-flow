"use client";

import { useId, useState } from "react";
import { formatNumber, shortDay } from "./format";

export interface TrendPoint {
  day: string;
  value: number;
}

/**
 * 한 지표의 날짜별 막대 차트 (시리즈 하나라 범례 없이 제목이 이름을 대신한다).
 * 막대: 최대 24px 폭, 위쪽 4px 둥근 끝, 2px 간격, 색은 --chart-trend (라이트·다크 각각 대비 검증).
 * 막대마다 마우스·키보드 포커스로 값을 보여 주고, 같은 값을 표로도 볼 수 있다.
 */
export function TrendChart({ title, points, unit }: { title: string; points: TrendPoint[]; unit: string }) {
  const [active, setActive] = useState<number | null>(null);
  const id = useId();
  const max = Math.max(1, ...points.map((p) => p.value));
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const latest = points.at(-1);
  const shown = active !== null ? points[active] : latest;

  return (
    <figure className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card p-4 shadow-soft">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-small font-bold text-foreground">{title}</span>
        <span className="text-caption text-muted-foreground tabular">
          {points.length}일 합계 {formatNumber(total)}
          {unit}
        </span>
      </figcaption>

      {/* 지금 가리킨(없으면 마지막) 날의 값 */}
      <p className="text-caption text-muted-foreground" aria-live="polite">
        {shown ? (
          <>
            <span className="text-h3 font-bold text-foreground tabular">{formatNumber(shown.value)}</span>
            <span className="ml-1">
              {unit} · {shortDay(shown.day)}
              {active === null ? " (오늘)" : ""}
            </span>
          </>
        ) : (
          "기록 없음"
        )}
      </p>

      <div
        className="flex h-24 items-end gap-0.5 border-b border-border"
        role="group"
        aria-label={`${title} 날짜별 막대`}
        onPointerLeave={() => setActive(null)}
      >
        {points.map((point, index) => (
          <button
            key={point.day}
            type="button"
            className="group flex h-full min-w-0 flex-1 items-end justify-center outline-none"
            aria-label={`${shortDay(point.day)} ${formatNumber(point.value)}${unit}`}
            aria-describedby={`${id}-table`}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            <span
              className="w-full max-w-6 rounded-t-[4px] bg-[var(--chart-trend)] transition-opacity group-hover:opacity-80 group-focus-visible:ring-2 group-focus-visible:ring-ring"
              style={{ height: point.value === 0 ? 0 : `${Math.max(4, (point.value / max) * 100)}%` }}
            />
          </button>
        ))}
      </div>
      <div className="flex justify-between text-caption text-muted-foreground tabular" aria-hidden>
        <span>{points[0] ? shortDay(points[0].day) : ""}</span>
        <span>{latest ? shortDay(latest.day) : ""}</span>
      </div>

      <details className="text-caption">
        <summary className="cursor-pointer text-muted-foreground">표로 보기</summary>
        <table id={`${id}-table`} className="mt-2 w-full tabular">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="font-semibold">날짜</th>
              <th className="text-right font-semibold">{title}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.day}>
                <td>{point.day}</td>
                <td className="text-right text-foreground">{formatNumber(point.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
