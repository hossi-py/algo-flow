"use client";

import { useEffect, useState } from "react";
import { localHour, toLocalDate } from "@/lib/date";
import type { LocalDate } from "@/types";

interface Clock {
  today: LocalDate;
  hour: number;
  nowIso: string;
}

function read(): Clock {
  const now = new Date();
  return { today: toLocalDate(now), hour: localHour(now), nowIso: now.toISOString() };
}

/**
 * Asia/Seoul 기준 오늘 날짜와 시각. 서버 렌더와 어긋나지 않도록 마운트 후에 값을 채우고,
 * 자정을 넘기면 갱신되도록 1분마다 다시 읽는다. 마운트 전에는 null.
 */
export function useToday(): Clock | null {
  const [clock, setClock] = useState<Clock | null>(null);
  useEffect(() => {
    const update = () =>
      setClock((previous) => {
        const next = read();
        return previous && previous.today === next.today && previous.hour === next.hour ? previous : next;
      });
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);
  return clock;
}
