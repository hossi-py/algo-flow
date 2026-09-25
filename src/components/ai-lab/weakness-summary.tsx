import { TrendingDown } from "lucide-react";
import { SectionTitle, SoftCard } from "@/components/common/soft-card";
import { PATTERN_LABELS } from "@/content/patterns";
import { MIN_PROBLEMS_FOR_WEAKNESS } from "@/lib/progress/weakness";
import type { WeaknessScore } from "@/types";

/** 약한 패턴 Top3 (막대 + 근거) */
export function WeaknessSummary({ weaknesses }: { weaknesses: WeaknessScore[] | null }) {
  if (weaknesses === null) return <div className="h-32 animate-pulse rounded-lg bg-muted" aria-hidden />;

  return (
    <SoftCard className="flex flex-col gap-4">
      <SectionTitle className="flex items-center gap-2">
        <TrendingDown className="size-5 text-secondary-foreground" aria-hidden />
        약한 유형 Top 3
      </SectionTitle>
      {weaknesses.length === 0 ? (
        <p className="text-small text-muted-foreground">
          유형마다 문제를 {MIN_PROBLEMS_FOR_WEAKNESS}개 이상 풀면 약한 유형을 찾아 드려요. 지금은 원하는 조건으로 만들어
          보세요.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {weaknesses.map((item, index) => (
            <li key={item.pattern} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-small font-bold text-foreground">
                  {index + 1}. {PATTERN_LABELS[item.pattern]}
                </span>
                <span className="text-caption text-muted-foreground tabular">약점 {Math.round(item.score * 100)}</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-muted shadow-inset"
                role="meter"
                aria-label={`${PATTERN_LABELS[item.pattern]} 약점 점수`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(item.score * 100)}
              >
                <div
                  className="h-full rounded-full bg-secondary"
                  style={{ width: `${Math.max(4, item.score * 100)}%` }}
                />
              </div>
              <p className="text-caption text-muted-foreground">{item.reasons.join(" · ")}</p>
            </li>
          ))}
        </ol>
      )}
    </SoftCard>
  );
}
