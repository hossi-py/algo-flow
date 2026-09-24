import { PATTERN_LABELS } from "@/content/patterns";
import type { IsoDateTime, PatternStat, PatternTag, SubmissionSummary, WeaknessScore } from "@/types";

/** 약점 분석에 필요한 제출 정보 */
export type WeaknessSubmission = Pick<
  SubmissionSummary,
  "problemKey" | "patternTags" | "verdict" | "hintsOpened" | "createdAt"
>;

/** 시도한 문제가 이보다 적은 패턴은 판단하지 않는다 (docs/04 §2) */
export const MIN_PROBLEMS_FOR_WEAKNESS = 2;

/**
 * 제출 기록 → 패턴별 통계. DB 뷰 user_pattern_stats와 같은 규칙:
 * 엔진 오류(internal-error)는 빼고, 한 제출의 패턴 태그마다 한 번씩 센다.
 */
export function computePatternStats(submissions: readonly WeaknessSubmission[]): PatternStat[] {
  const byPattern = new Map<
    PatternTag,
    { attempted: Set<string>; solved: Set<string>; count: number; accepted: number; hintSum: number; last: IsoDateTime }
  >();
  for (const submission of submissions) {
    if (submission.verdict === "internal-error") continue;
    const accepted = submission.verdict === "accepted";
    for (const pattern of new Set(submission.patternTags)) {
      const entry = byPattern.get(pattern) ?? {
        attempted: new Set<string>(),
        solved: new Set<string>(),
        count: 0,
        accepted: 0,
        hintSum: 0,
        last: submission.createdAt,
      };
      entry.attempted.add(submission.problemKey);
      entry.count += 1;
      if (accepted) {
        entry.solved.add(submission.problemKey);
        entry.accepted += 1;
        entry.hintSum += submission.hintsOpened;
      }
      if (submission.createdAt > entry.last) entry.last = submission.createdAt;
      byPattern.set(pattern, entry);
    }
  }
  return [...byPattern.entries()]
    .map(([pattern, e]) => ({
      pattern,
      problemsAttempted: e.attempted.size,
      problemsSolved: e.solved.size,
      submissions: e.count,
      acceptedSubmissions: e.accepted,
      avgHintsOnAccept: e.accepted > 0 ? e.hintSum / e.accepted : null,
      lastAttemptAt: e.last,
    }))
    .sort((a, b) => a.pattern.localeCompare(b.pattern));
}

const percent = (value: number) => `${Math.round(value * 100)}%`;

/**
 * 약점 점수 (0~1, 높을수록 약함):
 *   0.5 × (1 − 문제 해결률) + 0.3 × (정답까지 평균 힌트 단계 / 4) + 0.2 × (1 − 정답 제출 비율)
 * 아직 한 번도 맞히지 못한 패턴은 평균 힌트 항을 최댓값(1)으로 본다.
 */
export function weaknessScores(stats: readonly PatternStat[]): WeaknessScore[] {
  return stats
    .filter((s) => s.problemsAttempted >= MIN_PROBLEMS_FOR_WEAKNESS)
    .map((s) => {
      const solveRate = s.problemsSolved / s.problemsAttempted;
      const hintRatio = s.avgHintsOnAccept === null ? 1 : s.avgHintsOnAccept / 4;
      const acceptRate = s.submissions === 0 ? 0 : s.acceptedSubmissions / s.submissions;
      const score = 0.5 * (1 - solveRate) + 0.3 * hintRatio + 0.2 * (1 - acceptRate);
      const label = PATTERN_LABELS[s.pattern];
      const reasons = [
        `${label} 문제 ${s.problemsAttempted}개 중 ${s.problemsSolved}개 해결 (${percent(solveRate)})`,
        s.avgHintsOnAccept === null
          ? "아직 정답을 맞힌 적이 없어요"
          : `정답까지 평균 힌트 ${s.avgHintsOnAccept.toFixed(1)}단계`,
        `제출 ${s.submissions}번 중 정답 ${s.acceptedSubmissions}번 (${percent(acceptRate)})`,
      ];
      return { pattern: s.pattern, score: Math.round(score * 1000) / 1000, reasons, last: s.lastAttemptAt };
    })
    .sort((a, b) => b.score - a.score || b.last.localeCompare(a.last) || a.pattern.localeCompare(b.pattern))
    .map(({ pattern, score, reasons }) => ({ pattern, score, reasons }));
}

/** 가장 약한 패턴 n개 */
export function topWeaknesses(stats: readonly PatternStat[], count = 3): WeaknessScore[] {
  return weaknessScores(stats).slice(0, count);
}
