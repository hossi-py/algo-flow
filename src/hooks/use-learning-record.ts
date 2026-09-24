"use client";

import { useEffect, useMemo, useState } from "react";
import type { SubmissionsResponse, WeaknessResponse } from "@/lib/progress/account";
import { computePatternStats } from "@/lib/progress/weakness";
import { useAccountStore } from "@/stores/account-store";
import { useProgressStore } from "@/stores/progress-store";
import { useSubmissionLogStore } from "@/stores/submission-log-store";
import type { PatternStat, SubmissionSummary } from "@/types";

export interface LearningRecord {
  /** null이면 불러오는 중 */
  submissions: SubmissionSummary[] | null;
  patternStats: PatternStat[] | null;
  error: string | null;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`불러오지 못했어요 (${response.status})`);
  return (await response.json()) as T;
}

/**
 * 제출 기록과 패턴별 통계. 로그인 사용자는 서버(submissions 테이블·user_pattern_stats 뷰),
 * 게스트는 이 브라우저의 제출 기록으로 같은 계산을 한다.
 */
export function useLearningRecord(limit = 30): LearningRecord {
  const status = useAccountStore((s) => s.status);
  const userId = useAccountStore((s) => s.userId);
  const progress = useProgressStore((s) => s.progress);
  const localEntries = useSubmissionLogStore((s) => s.entries);
  const [remote, setRemote] = useState<{ key: string; record: LearningRecord } | null>(null);

  const isUser = status === "user" && progress.userId !== null && progress.userId === userId;
  // 진도가 바뀌면(제출 반영 등) 다시 불러온다
  const remoteKey = isUser
    ? `${userId}:${progress.stats.xp}:${Object.values(progress.problems).reduce((n, p) => n + (p?.attempts ?? 0), 0)}`
    : "";

  useEffect(() => {
    if (!remoteKey) return;
    let cancelled = false;
    Promise.all([
      getJson<SubmissionsResponse>(`/api/progress/submissions?limit=${limit}`),
      getJson<WeaknessResponse>("/api/progress/weakness"),
    ])
      .then(([submissions, weakness]) => {
        if (!cancelled) {
          setRemote({
            key: remoteKey,
            record: { submissions: submissions.submissions, patternStats: weakness.stats, error: null },
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRemote({
            key: remoteKey,
            record: {
              submissions: [],
              patternStats: [],
              error: error instanceof Error ? error.message : "불러오지 못했어요",
            },
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [limit, remoteKey]);

  const local = useMemo<LearningRecord>(
    () => ({ submissions: localEntries.slice(0, limit), patternStats: computePatternStats(localEntries), error: null }),
    [limit, localEntries],
  );

  if (status === "loading") return { submissions: null, patternStats: null, error: null };
  if (!isUser) return local;
  // 새로 불러오는 동안에는 이전 결과를 그대로 보여 준다
  return remote?.record ?? { submissions: null, patternStats: null, error: null };
}
