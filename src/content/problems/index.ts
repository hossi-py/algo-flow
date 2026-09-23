import type { LevelNumber, PatternTag, Problem, TopicSlug } from "@/types";
import { flowerZones } from "./dfs/flower-zones";

/** 큐레이션 문제 전체. 새 문제는 여기에 추가하고 토픽의 레벨 problemSlugs에도 등록한다 */
export const PROBLEMS: readonly Problem[] = [flowerZones];

/** 목록 화면에서 쓰는 가벼운 요약 (테스트케이스·힌트 제외) */
export interface ProblemMeta {
  slug: string;
  title: string;
  summary: string;
  topic: TopicSlug;
  level: LevelNumber;
  estimatedMinutes: number;
  xp: number;
  patternTags: PatternTag[];
}

export function toProblemMeta(problem: Problem): ProblemMeta {
  return {
    slug: problem.slug,
    title: problem.title,
    summary: problem.summary,
    topic: problem.topic,
    level: problem.level,
    estimatedMinutes: problem.estimatedMinutes,
    xp: problem.xp,
    patternTags: problem.patternTags,
  };
}

const PROBLEMS_BY_SLUG = new Map(PROBLEMS.map((problem) => [problem.slug, problem]));

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS_BY_SLUG.get(slug);
}

export function getProblemMeta(slug: string): ProblemMeta | undefined {
  const problem = PROBLEMS_BY_SLUG.get(slug);
  return problem ? toProblemMeta(problem) : undefined;
}
