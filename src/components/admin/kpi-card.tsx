import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { describeChange, formatNumber } from "./format";

export type Tone = "violet" | "peach" | "mint" | "sky" | "lemon" | "lilac";

/** 파스텔 아이콘 뱃지 색 (앱 디자인 토큰이라 다크 모드도 따라간다) */
export const TONE_BADGE: Record<Tone, string> = {
  violet: "bg-primary text-primary-foreground",
  lilac: "bg-primary-soft text-primary-soft-foreground",
  peach: "bg-secondary text-secondary-foreground",
  mint: "bg-accent text-accent-foreground",
  sky: "bg-info text-info-foreground",
  lemon: "bg-warning text-warning-foreground",
};

const CHANGE_STYLE = {
  up: { className: "bg-success text-success-foreground", Icon: ArrowUpRight },
  down: { className: "bg-muted text-muted-foreground", Icon: ArrowDownRight },
  flat: { className: "bg-muted text-muted-foreground", Icon: ArrowRight },
} as const;

/** 지난주 대비 변화 뱃지. 색만이 아니라 화살표·부호·설명 문장으로도 방향을 알린다 */
export function ChangeBadge({ current, previous, unit }: { current: number; previous: number; unit: string }) {
  const change = describeChange(current, previous, unit);
  const { className, Icon } = CHANGE_STYLE[change.direction];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-caption font-bold whitespace-nowrap tabular",
        className,
      )}
      title={change.description}
    >
      <span aria-hidden>{change.short}</span>
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">{change.description}</span>
    </span>
  );
}

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: Tone;
  /** 이번 주 vs 지난주 */
  weekly?: { current: number; previous: number; unit: string };
  hint?: ReactNode;
  /** 누르면 이동할 곳. 있을 때만 떠오르는 호버 효과를 준다 (눌리지 않는 카드가 떠오르면 눌러 보게 된다) */
  href?: string;
}

export function KpiCard({ label, value, icon: Icon, tone, weekly, hint, href }: KpiCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn("grid size-11 shrink-0 place-items-center rounded-2xl shadow-soft", TONE_BADGE[tone])}
          aria-hidden
        >
          <Icon className="size-5" strokeWidth={2.4} />
        </span>
        {weekly && <ChangeBadge {...weekly} />}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-small font-semibold text-muted-foreground">{label}</span>
        <span className="text-3xl leading-tight font-extrabold tracking-tight text-foreground tabular">
          {formatNumber(value)}
        </span>
      </div>
      {hint && <span className="text-caption text-muted-foreground">{hint}</span>}
    </>
  );
  const base = "flex h-full flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-soft sm:p-5";
  if (!href) return <div className={base}>{body}</div>;
  return (
    <Link
      href={href}
      className={cn(
        base,
        "transition-[transform,box-shadow] duration-200 outline-none hover:-translate-y-1 hover:shadow-float focus-visible:ring-4 focus-visible:ring-ring/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      {body}
    </Link>
  );
}
