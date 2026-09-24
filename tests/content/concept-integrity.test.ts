import { describe, expect, it } from "vitest";
import { getSignal } from "@/content/signals";
import { getTopic, TOPICS } from "@/content/topics";
import { LANGUAGES } from "@/types";

/** 트랙 C 분량 기준: 개념 카드 4–6장, 유형 인식 퀴즈 5문항 (docs/06) */
const WITH_CONCEPT = TOPICS.filter((topic) => topic.concept.cards.length > 0);

describe("개념 카드", () => {
  it("카드 id는 전체에서 겹치지 않는다", () => {
    const ids = WITH_CONCEPT.flatMap((topic) => topic.concept.cards.map((card) => card.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(WITH_CONCEPT.map((t) => [t.slug, t] as const))(
    "%s: 카드 4–6장, 핵심 포인트와 코드가 제대로 있다",
    (_, topic) => {
      const { cards } = topic.concept;
      expect(cards.length).toBeGreaterThanOrEqual(4);
      expect(cards.length).toBeLessThanOrEqual(6);
      for (const card of cards) {
        expect(card.keyPoints.length, card.id).toBeGreaterThan(0);
        if (card.code) for (const language of LANGUAGES) expect(card.code.code[language]?.trim(), card.id).toBeTruthy();
      }
    },
  );
});

describe("유형 인식 퀴즈", () => {
  it.each(WITH_CONCEPT.map((t) => [t.slug, t] as const))("%s: 5문항, 정답·신호·형광펜 문구가 올바르다", (_, topic) => {
    const quiz = topic.concept.recognitionQuiz;
    expect(quiz).toHaveLength(5);
    expect(new Set(quiz.map((q) => q.id)).size).toBe(quiz.length);
    for (const question of quiz) {
      expect(question.choices, question.id).toContain(question.answer);
      expect(new Set(question.choices).size, question.id).toBe(question.choices.length);
      for (const slug of question.choices) expect(getTopic(slug), `${question.id} → ${slug}`).toBeDefined();
      for (const id of question.signalIds) expect(getSignal(id), `${question.id} → ${id}`).toBeDefined();
      expect(question.highlightPhrases.length, question.id).toBeGreaterThan(0);
      for (const phrase of question.highlightPhrases) {
        expect(question.snippet, `${question.id}: "${phrase}"가 지문에 없어요`).toContain(phrase);
      }
    }
    // 대부분은 이 토픽이 정답이지만, 헷갈리는 다른 토픽을 가려내는 문항도 있어야 한다
    expect(quiz.filter((q) => q.answer === topic.slug).length).toBeGreaterThanOrEqual(3);
  });
});
