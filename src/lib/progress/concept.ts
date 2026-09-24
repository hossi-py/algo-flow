import type { ConceptProgress, IsoDateTime, LevelNumber, LocalDate, Topic, TopicSlug, UserProgress } from "@/types";
import { addActivityDay, applyActivity } from "./streak";
import { computeLevelView, isConceptComplete, isLevelCleared, isTopicUnlocked, meetsLevelClearRule } from "./unlock";
import { CONCEPT_CARDS_XP, RECOGNITION_QUIZ_XP } from "./xp";

export interface ConceptOutcome {
  xpAwarded: number;
  /** 개념 카드를 이번에 모두 읽었는지 */
  cardsCompleted: boolean;
  /** 퀴즈를 이번에 처음 통과했는지 */
  quizPassed: boolean;
  /** 개념 완료로 Lv1 조건을 채웠다면 */
  levelCleared: LevelNumber | null;
  unlockedTopic: TopicSlug | null;
}

const NO_CHANGE: ConceptOutcome = {
  xpAwarded: 0,
  cardsCompleted: false,
  quizPassed: false,
  levelCleared: null,
  unlockedTopic: null,
};

function baseConcept(topic: TopicSlug): ConceptProgress {
  return { topic, completedCardIds: [], completedAt: null, quizBestScore: null, quizAttempts: 0 };
}

function award(progress: UserProgress, xp: number, today: LocalDate): UserProgress {
  if (xp <= 0) return progress;
  return {
    ...progress,
    stats: applyActivity(progress.stats, today, xp),
    activity: addActivityDay(progress.activity, today, xp, 0),
  };
}

/** 개념 완료로 Lv1 클리어 조건(개념 + 문제)을 채웠는지 확인해 기록한다. 토픽이 잠겨 있으면 인정하지 않는다 */
function checkLevelOne(
  progress: UserProgress,
  topic: Topic,
  topics: readonly Topic[],
  now: IsoDateTime,
): { progress: UserProgress; levelCleared: LevelNumber | null; unlockedTopic: TopicSlug | null } {
  const level = topic.levels[0];
  const open = computeLevelView(progress, topic, level, isTopicUnlocked(progress, topic)).status !== "locked";
  if (!open || isLevelCleared(progress, topic.slug, 1) || !meetsLevelClearRule(progress, topic, level)) {
    return { progress, levelCleared: null, unlockedTopic: null };
  }
  const unlockedTopic =
    topics.find((t) => t.unlock.type === "level-cleared" && t.unlock.topic === topic.slug && t.unlock.level === 1)
      ?.slug ?? null;
  return {
    progress: { ...progress, levelClears: [...progress.levelClears, { topic: topic.slug, level: 1, clearedAt: now }] },
    levelCleared: 1,
    unlockedTopic,
  };
}

/** 개념 카드 한 장을 읽었다. 모든 카드를 처음 다 읽으면 XP */
export function applyCardRead(
  progress: UserProgress,
  topic: Topic,
  cardId: string,
  topics: readonly Topic[],
  today: LocalDate,
  now: IsoDateTime,
): { progress: UserProgress; outcome: ConceptOutcome } {
  const allIds = topic.concept.cards.map((card) => card.id);
  if (!allIds.includes(cardId)) return { progress, outcome: NO_CHANGE };
  const current = progress.concepts[topic.slug] ?? baseConcept(topic.slug);
  if (current.completedCardIds.includes(cardId)) return { progress, outcome: NO_CHANGE };

  const completedCardIds = allIds.filter((id) => id === cardId || current.completedCardIds.includes(id));
  const cardsCompleted = current.completedAt === null && completedCardIds.length === allIds.length;
  let next: UserProgress = {
    ...progress,
    concepts: {
      ...progress.concepts,
      [topic.slug]: { ...current, completedCardIds, completedAt: cardsCompleted ? now : current.completedAt },
    },
  };
  const xpAwarded = cardsCompleted ? CONCEPT_CARDS_XP : 0;
  next = award(next, xpAwarded, today);

  const level = cardsCompleted
    ? checkLevelOne(next, topic, topics, now)
    : { progress: next, levelCleared: null, unlockedTopic: null };
  return {
    progress: level.progress,
    outcome: {
      ...NO_CHANGE,
      xpAwarded,
      cardsCompleted,
      levelCleared: level.levelCleared,
      unlockedTopic: level.unlockedTopic,
    },
  };
}

/** 유형 인식 퀴즈 결과 (score: 0~1). 처음 통과하면 XP */
export function applyQuizResult(
  progress: UserProgress,
  topic: Topic,
  score: number,
  topics: readonly Topic[],
  today: LocalDate,
  now: IsoDateTime,
): { progress: UserProgress; outcome: ConceptOutcome } {
  const clamped = Math.min(1, Math.max(0, score));
  const current = progress.concepts[topic.slug] ?? baseConcept(topic.slug);
  const passedBefore = (current.quizBestScore ?? 0) >= topic.concept.passScore;
  const quizPassed = !passedBefore && clamped >= topic.concept.passScore;

  let next: UserProgress = {
    ...progress,
    concepts: {
      ...progress.concepts,
      [topic.slug]: {
        ...current,
        quizAttempts: current.quizAttempts + 1,
        quizBestScore: Math.max(current.quizBestScore ?? 0, clamped),
        quizPerfectCount: (current.quizPerfectCount ?? 0) + (clamped === 1 ? 1 : 0),
      },
    },
  };
  const xpAwarded = quizPassed ? RECOGNITION_QUIZ_XP : 0;
  next = award(next, xpAwarded, today);

  const level =
    quizPassed && isConceptComplete(next, topic)
      ? checkLevelOne(next, topic, topics, now)
      : { progress: next, levelCleared: null, unlockedTopic: null };
  return {
    progress: level.progress,
    outcome: {
      ...NO_CHANGE,
      xpAwarded,
      quizPassed,
      levelCleared: level.levelCleared,
      unlockedTopic: level.unlockedTopic,
    },
  };
}
