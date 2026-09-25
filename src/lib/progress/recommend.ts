import { topicOfPattern } from "@/content/patterns";
import { SIGNALS } from "@/content/signals";
import type { PatternTag, WeaknessScore } from "@/types";

/** 이 점수 이상이면 "약점"으로 보고 추천한다 */
export const WEAKNESS_THRESHOLD = 0.3;

/** 약한 패턴을 연습할 AI 랩 주소 (토픽·패턴·관련 신호를 미리 채움) */
export function aiLabHrefForPatterns(patterns: PatternTag[]): string {
  const first = patterns[0];
  if (!first) return "/ai-lab";
  const topic = topicOfPattern(first);
  const samePatterns = patterns.filter((p) => topicOfPattern(p) === topic).slice(0, 3);
  const signals = SIGNALS.filter((s) => s.patterns.some((p) => samePatterns.includes(p)))
    .map((s) => s.id)
    .slice(0, 3);
  const params = new URLSearchParams({ topic, patterns: samePatterns.join(",") });
  if (signals.length > 0) params.set("signals", signals.join(","));
  return `/ai-lab?${params.toString()}`;
}

/** 추천할 만큼 약한 패턴만 */
export function recommendable(scores: WeaknessScore[]): WeaknessScore[] {
  return scores.filter((s) => s.score >= WEAKNESS_THRESHOLD);
}
