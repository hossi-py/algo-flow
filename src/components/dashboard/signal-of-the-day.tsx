"use client";

import { Search } from "lucide-react";
import { SoftCard } from "@/components/common/soft-card";
import { TopicChip } from "@/components/common/topic-badges";
import { SIGNALS } from "@/content/signals";
import { getTopic } from "@/content/topics";
import { diffDays } from "@/lib/date";
import type { LocalDate } from "@/types";

/** 날짜마다 바뀌는 "오늘의 유형 신호" — 문제를 보고 알고리즘을 떠올리는 연습 */
export function SignalOfTheDay({ today }: { today: LocalDate }) {
  const index = ((diffDays("2026-01-01", today) % SIGNALS.length) + SIGNALS.length) % SIGNALS.length;
  const signal = SIGNALS[index];
  if (!signal) return null;

  return (
    <SoftCard className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-info text-info-foreground" aria-hidden>
          <Search className="size-4" />
        </span>
        <h2 className="text-h3 text-foreground">오늘의 유형 신호</h2>
      </div>
      <p className="text-body font-semibold text-foreground">
        문제에 <mark className="rounded-xs bg-warning px-1 text-warning-foreground">“{signal.phrase}”</mark> 표현이
        보이면?
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-small text-muted-foreground">의심해 볼 알고리즘</span>
        {signal.suspects.map((slug) => {
          const topic = getTopic(slug);
          return topic ? <TopicChip key={slug} topic={topic} /> : null;
        })}
      </div>
      <p className="text-small text-muted-foreground">{signal.reason}</p>
      {signal.caution && (
        <p className="rounded-md bg-muted px-3 py-2 text-small text-foreground">
          <span className="font-bold">함정 주의 · </span>
          {signal.caution}
        </p>
      )}
    </SoftCard>
  );
}
