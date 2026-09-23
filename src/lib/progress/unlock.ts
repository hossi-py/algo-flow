import type { Level, LevelNumber, LevelView, ProblemKey, Topic, TopicSlug, TopicView, UserProgress } from "@/types";

/** 잠금 계산에 필요한 "사실" 데이터만 */
export type ProgressFacts = Pick<UserProgress, "levelClears" | "problems" | "concepts">;

export function curatedKey(slug: string): ProblemKey {
  return `c:${slug}`;
}

export function isLevelCleared(facts: ProgressFacts, topic: TopicSlug, level: LevelNumber): boolean {
  return facts.levelClears.some((clear) => clear.topic === topic && clear.level === level);
}

export function solvedCount(facts: ProgressFacts, level: Level): number {
  return level.problemSlugs.filter((slug) => facts.problems[curatedKey(slug)]?.status === "solved").length;
}

function attemptedCount(facts: ProgressFacts, level: Level): number {
  return level.problemSlugs.filter((slug) => facts.problems[curatedKey(slug)] !== undefined).length;
}

/** 개념 카드를 모두 보고 유형 인식 퀴즈를 통과했는지 */
export function isConceptComplete(facts: ProgressFacts, topic: Topic): boolean {
  const concept = facts.concepts[topic.slug];
  if (!concept || concept.completedAt === null) return false;
  if (topic.concept.recognitionQuiz.length === 0) return true;
  return (concept.quizBestScore ?? 0) >= topic.concept.passScore;
}

/**
 * 레벨 클리어 조건을 만족하는지 (제출·개념 완료 직후 호출해 levelClears에 기록할지 결정).
 * 문제가 아직 하나도 없는 레벨은 클리어할 수 없다.
 */
export function meetsLevelClearRule(facts: ProgressFacts, topic: Topic, level: Level): boolean {
  if (level.problemSlugs.length === 0) return false;
  if (solvedCount(facts, level) < requiredCount(level)) return false;
  if (level.clearRule.requiresConcept && !isConceptComplete(facts, topic)) return false;
  return true;
}

/** 필요한 해결 수. 문제 수보다 많이 요구하지 않는다 */
export function requiredCount(level: Level): number {
  return level.problemSlugs.length === 0
    ? level.clearRule.minSolved
    : Math.min(level.clearRule.minSolved, level.problemSlugs.length);
}

export function isTopicUnlocked(facts: ProgressFacts, topic: Topic): boolean {
  if (topic.unlock.type === "always") return true;
  return isLevelCleared(facts, topic.unlock.topic, topic.unlock.level);
}

function topicLockedReason(topic: Topic, topicsBySlug: Map<TopicSlug, Topic>): string | null {
  if (topic.unlock.type === "always") return null;
  const prerequisite = topicsBySlug.get(topic.unlock.topic);
  const name = prerequisite?.title ?? topic.unlock.topic;
  return `${name} Lv${topic.unlock.level}을 클리어하면 열려요`;
}

export function computeLevelView(facts: ProgressFacts, topic: Topic, level: Level, topicUnlocked: boolean): LevelView {
  const solved = solvedCount(facts, level);
  const base = {
    topic: topic.slug,
    level: level.level,
    solved,
    required: requiredCount(level),
    total: level.problemSlugs.length,
  };

  if (isLevelCleared(facts, topic.slug, level.level)) {
    return { ...base, status: "cleared", lockedReason: null };
  }
  if (!topicUnlocked) {
    return { ...base, status: "locked", lockedReason: "토픽이 아직 잠겨 있어요" };
  }
  if (level.level > 1) {
    const previous = (level.level - 1) as LevelNumber;
    if (!isLevelCleared(facts, topic.slug, previous)) {
      return { ...base, status: "locked", lockedReason: `Lv${previous}을 클리어하면 열려요` };
    }
  }
  const started = attemptedCount(facts, level) > 0;
  return { ...base, status: started ? "in-progress" : "available", lockedReason: null };
}

export function computeTopicView(facts: ProgressFacts, topic: Topic, topicsBySlug: Map<TopicSlug, Topic>): TopicView {
  const unlocked = isTopicUnlocked(facts, topic);
  const levels = topic.levels.map((level) => computeLevelView(facts, topic, level, unlocked));

  const progress =
    levels.reduce((sum, view) => {
      if (view.status === "cleared") return sum + 1;
      if (view.required === 0) return sum;
      return sum + Math.min(view.solved / view.required, 1) * 0.9;
    }, 0) / levels.length;

  const mastered = levels[levels.length - 1]?.status === "cleared";
  const started = levels.some((view) => view.status === "cleared" || view.status === "in-progress");

  let status: TopicView["status"];
  if (mastered) status = "mastered";
  else if (!unlocked) status = "locked";
  else if (started) status = "in-progress";
  else status = "available";

  return {
    topic: topic.slug,
    status,
    progress,
    levels,
    lockedReason: unlocked ? null : topicLockedReason(topic, topicsBySlug),
  };
}

export function computeTopicViews(facts: ProgressFacts, topics: readonly Topic[]): TopicView[] {
  const bySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  return topics.map((topic) => computeTopicView(facts, topic, bySlug));
}

export interface NextStep {
  topic: TopicSlug;
  level: LevelNumber;
  /** 이 레벨에서 아직 풀지 않은 첫 문제 (없으면 null) */
  problemSlug: string | null;
}

/**
 * 로드맵 순서대로 가장 먼저 만나는 "열려 있지만 클리어 안 한" 레벨.
 * 풀 문제가 있는 레벨을 우선하고, 그런 레벨이 없으면 문제 준비 중인 레벨이라도 돌려준다.
 */
export function findNextStep(facts: ProgressFacts, topics: readonly Topic[]): NextStep | null {
  const views = computeTopicViews(facts, topics);
  const candidates: { topic: Topic; level: Level }[] = [];
  for (const topic of topics) {
    const view = views.find((v) => v.topic === topic.slug);
    if (!view) continue;
    for (const levelView of view.levels) {
      if (levelView.status !== "available" && levelView.status !== "in-progress") continue;
      const level = topic.levels[levelView.level - 1];
      if (level) candidates.push({ topic, level });
    }
  }

  const unsolvedSlug = (level: Level) =>
    level.problemSlugs.find((slug) => facts.problems[curatedKey(slug)]?.status !== "solved") ?? null;

  const withProblem = candidates.find(({ level }) => unsolvedSlug(level) !== null);
  const chosen = withProblem ?? candidates[0];
  if (!chosen) return null;
  return { topic: chosen.topic.slug, level: chosen.level.level, problemSlug: unsolvedSlug(chosen.level) };
}
