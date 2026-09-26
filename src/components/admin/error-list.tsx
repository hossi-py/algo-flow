"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Nodi } from "@/components/mascot/nodi";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ErrorGroupRow } from "@/lib/admin/queries";
import { cn } from "@/lib/utils";
import { formatDateTime, formatNumber, relativeTime } from "./format";

/** 출처별 파스텔 뱃지 (글자로도 출처를 적어 색만으로 구분하지 않는다) */
const SOURCES: Record<string, { label: string; className: string }> = {
  client: { label: "브라우저", className: "bg-danger text-danger-foreground" },
  server: { label: "서버", className: "bg-secondary text-secondary-foreground" },
  boundary: { label: "에러 화면", className: "bg-primary-soft text-primary-soft-foreground" },
  engine: { label: "채점 엔진", className: "bg-info text-info-foreground" },
};

export function SourceBadge({ source }: { source: string }) {
  const style = SOURCES[source] ?? { label: source, className: "bg-muted text-muted-foreground" };
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-0.5 text-caption font-bold whitespace-nowrap", style.className)}
    >
      {style.label}
    </span>
  );
}

/** 말줄임 + 마우스·포커스 툴팁으로 전체 내용 (터치 화면에서는 행을 눌러 펼친다) */
function Truncated({ text, className }: { text: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("block truncate", className)}>{text}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-md rounded-xl text-small break-words whitespace-pre-wrap">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export function ErrorList({ errors, now }: { errors: ErrorGroupRow[]; now: number }) {
  const [open, setOpen] = useState<string | null>(null);

  if (errors.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
        <Nodi mood="cheer" size={96} decorative />
        <p className="text-h3 text-foreground">깨끗해요! 🥳</p>
        <p className="text-small text-muted-foreground">기록된 에러가 없어요. 모든 시스템이 정상 작동 중이에요.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {errors.map((error) => {
        const key = `${error.fingerprint}-${error.source}`;
        const expanded = open === key;
        return (
          <li key={key} className="rounded-2xl border border-border/60 bg-card shadow-soft">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : key)}
              className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 rounded-2xl px-4 py-3 text-left outline-none hover:bg-muted/40 focus-visible:ring-4 focus-visible:ring-ring/40 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,14rem)_auto_auto]"
            >
              <SourceBadge source={error.source} />
              <Truncated text={error.message} className="min-w-0 text-small font-semibold text-foreground" />
              <Truncated
                text={error.path ?? "—"}
                className="hidden min-w-0 font-mono text-caption text-muted-foreground sm:block"
              />
              <span
                className="hidden text-caption whitespace-nowrap text-muted-foreground sm:inline"
                title={formatDateTime(error.lastSeen)}
              >
                {relativeTime(error.lastSeen, now)}
              </span>
              <span className="flex items-center gap-1">
                <span className="rounded-full bg-muted px-2 py-0.5 text-caption font-bold text-foreground tabular">
                  ×{formatNumber(error.occurrences)}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform motion-reduce:transition-none",
                    expanded && "rotate-180",
                  )}
                  aria-hidden
                />
              </span>
            </button>
            {expanded && (
              <dl className="grid gap-x-4 gap-y-1 border-t border-border/60 px-4 py-3 text-caption sm:grid-cols-[auto_1fr]">
                <dt className="font-semibold text-muted-foreground">메시지</dt>
                <dd className="break-words whitespace-pre-wrap text-foreground">{error.message}</dd>
                <dt className="font-semibold text-muted-foreground">경로</dt>
                <dd className="font-mono break-all text-foreground">{error.path ?? "—"}</dd>
                <dt className="font-semibold text-muted-foreground">처음 · 마지막</dt>
                <dd className="text-foreground tabular">
                  {formatDateTime(error.firstSeen)} · {formatDateTime(error.lastSeen)}
                </dd>
                <dt className="font-semibold text-muted-foreground">배포 버전</dt>
                <dd className="font-mono text-foreground">{error.release ?? "—"}</dd>
              </dl>
            )}
          </li>
        );
      })}
    </ul>
  );
}
