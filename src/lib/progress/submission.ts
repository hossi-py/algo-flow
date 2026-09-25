import type {
  HintStep,
  HintsOpened,
  IsoDateTime,
  LevelNumber,
  LocalDate,
  Problem,
  ProblemProgress,
  Topic,
  TopicSlug,
  UserProgress,
  Verdict,
} from "@/types";
import { addActivityDay, applyActivity } from "./streak";
import { computeLevelView, isLevelCleared, isTopicUnlocked, meetsLevelClearRule } from "./unlock";
import { problemXp } from "./xp";

function baseProgress(problem: Problem, now: IsoDateTime): ProblemProgress {
  return {
    problemKey: problem.id,
    source: problem.source,
    topic: problem.topic,
    level: problem.level,
    status: "attempted",
    attempts: 0,
    maxHintOpened: 0,
    lastCode: null,
    solvedAt: null,
    bestRuntimeMs: null,
    xpAwarded: 0,
    updatedAt: now,
  };
}

/** 힌트를 연다. 순서대로만 열 수 있으므로 step은 지금까지 연 단계 + 1 이하여야 한다 */
export function applyHintOpen(
  progress: UserProgress,
  problem: Problem,
  step: HintStep,
  now: IsoDateTime,
): UserProgress {
  const current = progress.problems[problem.id] ?? baseProgress(problem, now);
  if (step > current.maxHintOpened + 1) {
    throw new Error(`${current.maxHintOpened + 1}번 힌트를 먼저 열어야 해요`);
  }
  if (step <= current.maxHintOpened) return progress;
  return {
    ...progress,
    problems: {
      ...progress.problems,
      [problem.id]: { ...current, maxHintOpened: step as HintsOpened, updatedAt: now },
    },
  };
}

export interface SubmissionInput {
  problem: Problem;
  verdict: Verdict;
  runtimeMs: number | null;
  today: LocalDate;
  now: IsoDateTime;
}

export interface SubmissionOutcome {
  /** 이번 제출로 처음 정답을 맞혔는지 */
  firstSolve: boolean;
  xpAwarded: number;
  /** 이번 제출로 클리어한 레벨 */
  levelCleared: LevelNumber | null;
  /** 레벨 클리어로 새로 열린 토픽 */
  unlockedTopic: TopicSlug | null;
}

/**
 * 제출 결과를 진도에 반영한다: 시도 횟수, 첫 정답 XP(힌트 감소 적용), 스트릭·일별 활동, 레벨 클리어, 토픽 해제.
 * 채점 도중 엔진이 실패한 제출(internal-error)은 시도로 세지 않는다.
 * 잠긴 레벨의 문제를 맞히면 XP는 받지만 레벨 클리어로는 인정하지 않는다.
 */
export function applySubmission(
  progress: UserProgress,
  input: SubmissionInput,
  topics: readonly Topic[],
): { progress: UserProgress; outcome: SubmissionOutcome } {
  const noChange: SubmissionOutcome = { firstSolve: false, xpAwarded: 0, levelCleared: null, unlockedTopic: null };
  if (input.verdict === "internal-error") return { progress, outcome: noChange };

  const { problem, now, today } = input;
  const current = progress.problems[problem.id] ?? baseProgress(problem, now);
  const accepted = input.verdict === "accepted";
  const firstSolve = accepted && current.status !== "solved";
  const xpAwarded = firstSolve ? problemXp(problem.xp, current.maxHintOpened, problem.hints) : 0;

  const bestRuntimeMs =
    accepted && input.runtimeMs !== null
      ? Math.round(current.bestRuntimeMs === null ? input.runtimeMs : Math.min(current.bestRuntimeMs, input.runtimeMs))
      : current.bestRuntimeMs;

  const nextProblem: ProblemProgress = {
    ...current,
    attempts: current.attempts + 1,
    status: accepted || current.status === "solved" ? "solved" : "attempted",
    solvedAt: firstSolve ? now : current.solvedAt,
    bestRuntimeMs,
    xpAwarded: current.xpAwarded + xpAwarded,
    updatedAt: now,
  };

  let next: UserProgress = {
    ...progress,
    problems: { ...progress.problems, [problem.id]: nextProblem },
  };

  if (xpAwarded > 0) {
    next = {
      ...next,
      stats: applyActivity(next.stats, today, xpAwarded),
      activity: addActivityDay(next.activity, today, xpAwarded, 1),
    };
  }

  let levelCleared: LevelNumber | null = null;
  let unlockedTopic: TopicSlug | null = null;
  const topic = topics.find((t) => t.slug === problem.topic);
  const level = topic?.levels[problem.level - 1];
  // 잠긴 레벨의 문제를 미리 풀어도 XP는 주지만, 레벨 클리어(다음 토픽 해제)로는 인정하지 않는다
  const levelOpen =
    topic && level
      ? computeLevelView(progress, topic, level, isTopicUnlocked(progress, topic)).status !== "locked"
      : false;
  if (firstSolve && topic && level && levelOpen && problem.source === "curated") {
    if (!isLevelCleared(next, topic.slug, level.level) && meetsLevelClearRule(next, topic, level)) {
      next = { ...next, levelClears: [...next.levelClears, { topic: topic.slug, level: level.level, clearedAt: now }] };
      levelCleared = level.level;
      unlockedTopic =
        topics.find(
          (t) => t.unlock.type === "level-cleared" && t.unlock.topic === topic.slug && t.unlock.level === level.level,
        )?.slug ?? null;
    }
  }

  return { progress: next, outcome: { firstSolve, xpAwarded, levelCleared, unlockedTopic } };
}
