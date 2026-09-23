import { describe, expect, it } from "vitest";
import { TOPICS, getTopic } from "@/content/topics";
import { applyCardRead, applyQuizResult } from "@/lib/progress/concept";
import { CONCEPT_CARDS_XP, RECOGNITION_QUIZ_XP } from "@/lib/progress/xp";
import { createEmptyProgress } from "@/stores/progress-store";
import type { Topic, UserProgress } from "@/types";

const TODAY = "2026-09-24";
const NOW = "2026-09-24T01:00:00.000Z";

const stack = TOPICS[0]!;
const cardIds = stack.concept.cards.map((card) => card.id);

function readAll(progress: UserProgress, topic: Topic, topics: readonly Topic[] = TOPICS): UserProgress {
  return topic.concept.cards.reduce(
    (acc, card) => applyCardRead(acc, topic, card.id, topics, TODAY, NOW).progress,
    progress,
  );
}

describe("applyCardRead", () => {
  it("스택 개념 카드가 4장 이상 있다 (이 테스트의 전제)", () => {
    expect(cardIds.length).toBeGreaterThanOrEqual(4);
  });

  it("없는 카드나 이미 읽은 카드는 그대로 돌려준다", () => {
    const empty = createEmptyProgress();
    expect(applyCardRead(empty, stack, "no-such-card", TOPICS, TODAY, NOW).progress).toBe(empty);
    const once = applyCardRead(empty, stack, cardIds[0]!, TOPICS, TODAY, NOW).progress;
    const twice = applyCardRead(once, stack, cardIds[0]!, TOPICS, TODAY, NOW);
    expect(twice.progress).toBe(once);
    expect(twice.outcome.xpAwarded).toBe(0);
  });

  it("일부만 읽으면 기록만 하고 XP는 없다", () => {
    const { progress, outcome } = applyCardRead(createEmptyProgress(), stack, cardIds[1]!, TOPICS, TODAY, NOW);
    expect(progress.concepts.stack).toMatchObject({ completedCardIds: [cardIds[1]], completedAt: null });
    expect(outcome).toMatchObject({ xpAwarded: 0, cardsCompleted: false });
    expect(progress.stats.xp).toBe(0);
  });

  it("모든 카드를 처음 다 읽으면 XP·스트릭·활동을 기록하고, 순서는 커리큘럼 순서로 저장한다", () => {
    let progress = createEmptyProgress();
    const reversed = [...cardIds].reverse();
    let last = null;
    for (const id of reversed) {
      last = applyCardRead(progress, stack, id, TOPICS, TODAY, NOW);
      progress = last.progress;
    }
    expect(last?.outcome).toMatchObject({ xpAwarded: CONCEPT_CARDS_XP, cardsCompleted: true });
    expect(progress.concepts.stack).toMatchObject({ completedCardIds: cardIds, completedAt: NOW });
    expect(progress.stats).toMatchObject({ xp: CONCEPT_CARDS_XP, currentStreak: 1, lastActiveDate: TODAY });
    expect(progress.activity).toEqual([{ date: TODAY, xpEarned: CONCEPT_CARDS_XP, solvedCount: 0 }]);
  });

  it("다 읽은 뒤에 다시 읽어도 XP는 한 번만", () => {
    const done = readAll(createEmptyProgress(), stack);
    const again = applyCardRead(done, stack, cardIds[0]!, TOPICS, TODAY, NOW);
    expect(again.progress).toBe(done);
    expect(done.stats.xp).toBe(CONCEPT_CARDS_XP);
  });
});

describe("applyQuizResult", () => {
  it("통과 점수 미만: 시도와 최고 점수만 기록", () => {
    const { progress, outcome } = applyQuizResult(createEmptyProgress(), stack, 0.6, TOPICS, TODAY, NOW);
    expect(progress.concepts.stack).toMatchObject({ quizAttempts: 1, quizBestScore: 0.6 });
    expect(outcome).toMatchObject({ quizPassed: false, xpAwarded: 0 });
  });

  it("통과 기준(0.8)과 같은 점수면 통과하고 XP는 첫 통과에만", () => {
    const first = applyQuizResult(createEmptyProgress(), stack, stack.concept.passScore, TOPICS, TODAY, NOW);
    expect(first.outcome).toMatchObject({ quizPassed: true, xpAwarded: RECOGNITION_QUIZ_XP });
    const second = applyQuizResult(first.progress, stack, 1, TOPICS, TODAY, NOW);
    expect(second.outcome).toMatchObject({ quizPassed: false, xpAwarded: 0 });
    expect(second.progress.concepts.stack).toMatchObject({ quizAttempts: 2, quizBestScore: 1 });
    expect(second.progress.stats.xp).toBe(RECOGNITION_QUIZ_XP);
  });

  it("최고 점수는 내려가지 않고, 점수는 0~1로 자른다", () => {
    let progress = applyQuizResult(createEmptyProgress(), stack, 1.7, TOPICS, TODAY, NOW).progress;
    expect(progress.concepts.stack?.quizBestScore).toBe(1);
    progress = applyQuizResult(progress, stack, -2, TOPICS, TODAY, NOW).progress;
    expect(progress.concepts.stack).toMatchObject({ quizBestScore: 1, quizAttempts: 2 });
  });
});

describe("개념 완료로 Lv1 클리어", () => {
  // 실제 커리큘럼은 Lv1 문제가 아직 없고 다음 토픽은 Lv3에서 열리므로, 조건을 채울 수 있는 가상 토픽을 쓴다
  const withProblem: Topic = {
    ...stack,
    levels: [
      { ...stack.levels[0], problemSlugs: ["stack-demo"] },
      ...stack.levels.slice(1),
    ] as unknown as Topic["levels"],
  };
  const follower: Topic = { ...TOPICS[1]!, unlock: { type: "level-cleared", topic: "stack", level: 1 } };
  const topics = [withProblem, follower];

  function solvedDemo(): UserProgress {
    const progress = createEmptyProgress();
    return {
      ...progress,
      problems: {
        "c:stack-demo": {
          problemKey: "c:stack-demo",
          source: "curated",
          topic: "stack",
          level: 1,
          status: "solved",
          attempts: 1,
          maxHintOpened: 0,
          lastCode: null,
          solvedAt: NOW,
          bestRuntimeMs: 3,
          xpAwarded: 10,
          updatedAt: NOW,
        },
      },
    };
  }

  it("문제 해결 + 카드 완독 + 퀴즈 통과가 모두 갖춰지는 순간 클리어하고 다음 토픽을 연다", () => {
    const afterCards = readAll(solvedDemo(), withProblem, topics);
    expect(afterCards.levelClears).toEqual([]); // 퀴즈가 남아 있다
    const { progress, outcome } = applyQuizResult(afterCards, withProblem, 1, topics, TODAY, NOW);
    expect(outcome).toMatchObject({ quizPassed: true, levelCleared: 1, unlockedTopic: follower.slug });
    expect(progress.levelClears).toEqual([{ topic: "stack", level: 1, clearedAt: NOW }]);
  });

  it("퀴즈를 먼저 통과했다면 마지막 카드를 읽는 순간 클리어", () => {
    const quizFirst = applyQuizResult(solvedDemo(), withProblem, 1, topics, TODAY, NOW).progress;
    expect(quizFirst.levelClears).toEqual([]);
    let progress = quizFirst;
    let lastOutcome = null;
    for (const id of cardIds) {
      const result = applyCardRead(progress, withProblem, id, topics, TODAY, NOW);
      progress = result.progress;
      lastOutcome = result.outcome;
    }
    expect(lastOutcome).toMatchObject({ cardsCompleted: true, levelCleared: 1 });
  });

  it("문제를 아직 못 풀었으면 개념만으로는 클리어하지 않는다", () => {
    const progress = applyQuizResult(
      readAll(createEmptyProgress(), withProblem, topics),
      withProblem,
      1,
      topics,
      TODAY,
      NOW,
    );
    expect(progress.outcome.levelCleared).toBeNull();
    expect(progress.progress.levelClears).toEqual([]);
  });

  it("잠긴 토픽은 개념을 미리 공부해도 레벨 클리어로 인정하지 않는다 (XP는 받음)", () => {
    // 카드·퀴즈가 있는 DFS를 "스택 Lv1 클리어 후 열림"으로 바꿔 잠가 둔다
    const dfs = getTopic("dfs")!;
    const lockedTopic: Topic = {
      ...dfs,
      unlock: { type: "level-cleared", topic: "stack", level: 1 },
      levels: [{ ...dfs.levels[0], problemSlugs: ["dfs-demo"] }, ...dfs.levels.slice(1)] as unknown as Topic["levels"],
    };
    const solved: UserProgress = {
      ...createEmptyProgress(),
      problems: {
        "c:dfs-demo": { ...solvedDemo().problems["c:stack-demo"]!, problemKey: "c:dfs-demo", topic: "dfs" },
      },
    };
    const cards = readAll(solved, lockedTopic, [withProblem, lockedTopic]);
    const { progress, outcome } = applyQuizResult(cards, lockedTopic, 1, [withProblem, lockedTopic], TODAY, NOW);
    expect(outcome).toMatchObject({ quizPassed: true, levelCleared: null });
    expect(progress.levelClears).toEqual([]);
    expect(progress.stats.xp).toBe(CONCEPT_CARDS_XP + RECOGNITION_QUIZ_XP);
  });
});
