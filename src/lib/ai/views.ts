import type { GeneratedProblem, LevelNumber, PatternTag, TopicSlug } from "@/types";

/** 클라이언트에 내려 주는 생성 문제 (소유자 id 제외. 정답 코드는 애초에 레코드에 없다) */
export type GeneratedProblemView = Omit<GeneratedProblem, "ownerId">;

export function toView(record: GeneratedProblem): GeneratedProblemView {
  return {
    id: record.id,
    status: record.status,
    request: record.request,
    problem: record.problem,
    attempts: record.attempts,
    model: record.model,
    error: record.error,
    createdAt: record.createdAt,
    verifiedAt: record.verifiedAt,
  };
}

/** 목록용 요약 */
export interface GeneratedProblemSummary {
  id: string;
  status: GeneratedProblem["status"];
  topic: TopicSlug;
  level: LevelNumber;
  title: string | null;
  summary: string | null;
  patternTags: PatternTag[];
  createdAt: string;
}

export function toSummary(record: GeneratedProblem): GeneratedProblemSummary {
  return {
    id: record.id,
    status: record.status,
    topic: record.request.topic,
    level: record.request.level,
    title: record.problem?.title ?? null,
    summary: record.problem?.summary ?? null,
    patternTags: record.problem?.patternTags ?? record.request.focusPatterns,
    createdAt: record.createdAt,
  };
}
