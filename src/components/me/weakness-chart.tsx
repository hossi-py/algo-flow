import Link from "next/link";
import { WandSparkles } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { SectionTitle, SoftCard } from "@/components/common/soft-card";
import { Nodi } from "@/components/mascot/nodi";
import { PATTERN_LABELS } from "@/content/patterns";
import { aiLabHrefForPatterns, recommendable } from "@/lib/progress/recommend";
import { MIN_PROBLEMS_FOR_WEAKNESS, weaknessScores } from "@/lib/progress/weakness";
import { cn } from "@/lib/utils";
import type { PatternStat } from "@/types";

/** 패턴별 숙련도 (1 − 약점 점수) 가로 막대. 강한 패턴부터, 약한 패턴은 근거와 AI 문제 연결 */
export function WeaknessChart({ stats }: { stats: PatternStat[] | null }) {
  if (stats === null) {
    return <div className="h-56 animate-pulse rounded-lg bg-muted" aria-hidden />;
  }
  const scores = weaknessScores(stats);
  const weak = recommendable(scores);
  const pending = stats.filter((s) => s.problemsAttempted < MIN_PROBLEMS_FOR_WEAKNESS).length;
  const ordered = [...scores].sort((a, b) => a.score - b.score);

  return (
    <SoftCard className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <SectionTitle>유형별 숙련도</SectionTitle>
        <p className="text-caption text-muted-foreground">
          해결률 · 정답까지 연 힌트 · 제출 정답률로 계산해요. 문제를 {MIN_PROBLEMS_FOR_WEAKNESS}개 이상 풀어 본 유형만
          보여요.
        </p>
      </div>

      {ordered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Nodi mood="curious" size={72} decorative />
          <p className="text-small font-bold text-foreground">아직 분석할 만큼 풀지 않았어요</p>
          <p className="text-caption text-muted-foreground">
            {pending > 0
              ? `${pending}개 유형을 더 풀면 숙련도를 보여 드릴게요.`
              : "문제를 풀면 유형별 숙련도를 보여 드릴게요."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {ordered.map((item) => {
            const mastery = Math.round((1 - item.score) * 100);
            const isWeak = weak.some((w) => w.pattern === item.pattern);
            return (
              <li key={item.pattern} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2 text-small">
                  <span className={cn("font-bold", isWeak ? "text-danger-text" : "text-foreground")}>
                    {PATTERN_LABELS[item.pattern]}
                  </span>
                  <span className="text-caption text-muted-foreground tabular">숙련도 {mastery}</span>
                </div>
                <div
                  className="h-3 w-full overflow-hidden rounded-full bg-muted shadow-inset"
                  role="meter"
                  aria-label={`${PATTERN_LABELS[item.pattern]} 숙련도`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={mastery}
                >
                  <div
                    className={cn("h-full rounded-full", isWeak ? "bg-secondary" : "bg-primary-strong")}
                    style={{ width: `${Math.max(4, mastery)}%` }}
                  />
                </div>
                {isWeak && <p className="text-caption text-muted-foreground">{item.reasons.join(" · ")}</p>}
              </li>
            );
          })}
        </ul>
      )}

      {weak.length > 0 && (
        <PopButton asChild variant="soft" className="self-start">
          <Link href={aiLabHrefForPatterns(weak.map((w) => w.pattern))}>
            <WandSparkles />「{PATTERN_LABELS[weak[0]!.pattern]}」 맞춤 문제 받기
          </Link>
        </PopButton>
      )}
    </SoftCard>
  );
}
