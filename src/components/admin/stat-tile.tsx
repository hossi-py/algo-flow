import type { ReactNode } from "react";
import { formatNumber } from "./format";

/** KPI 타일: 라벨 · 값 · 보조 설명 */
export function StatTile({ label, value, hint }: { label: string; value: number; hint?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/70 bg-card p-4 shadow-soft">
      <span className="text-small font-semibold text-muted-foreground">{label}</span>
      <span className="text-h2 text-foreground tabular">{formatNumber(value)}</span>
      {hint && <span className="text-caption text-muted-foreground">{hint}</span>}
    </div>
  );
}
