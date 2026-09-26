// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConceptCardDeck } from "@/components/learn/concept-card-deck";
import { ConceptIllustration } from "@/components/learn/concept-illustration";
import { PatternSignalTrainer } from "@/components/learn/pattern-signal-trainer";
import { getTopic } from "@/content/topics";
import { createEmptyProgress, useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";
import type { IllustrationKey } from "@/types";

const stack = getTopic("stack")!;

beforeEach(() => {
  useProgressStore.setState({ progress: createEmptyProgress(), hydrated: true });
  useSettingsStore.setState({ language: "python" });
});
afterEach(cleanup);

describe("ConceptIllustration", () => {
  const keys: IllustrationKey[] = [
    "stack-plates",
    "stack-undo",
    "queue-line",
    "deque-train",
    "recursion-mirror",
    "recursion-dolls",
    "graph-map",
    "graph-matrix",
    "dfs-maze-dive",
    "bfs-ripple",
    "backtracking-tree",
    "hash-lockers",
    "hash-tally",
    "sorting-bars",
    "sorting-merge",
    "bsearch-halving",
    "bsearch-yes-no",
    "dp-memo-notebook",
    "dp-table-fill",
    "greedy-meetings",
    "greedy-counterexample",
    "tp-squeeze",
    "tp-window",
    "heap-tree",
    "heap-emergency",
    "dijkstra-map",
    "dijkstra-settle",
    "uf-groups",
    "topo-order",
    "cx-growth-curves",
    "cx-count-steps",
    "sim-robot-grid",
    "sim-rulebook",
  ];
  it.each(keys)("%s 그림이 설명과 함께 그려진다", (key) => {
    const { container } = render(<ConceptIllustration illustration={key} />);
    const svg = screen.getByRole("img");
    expect(svg.getAttribute("aria-label")?.length).toBeGreaterThan(5);
    expect(container.querySelectorAll("svg *").length).toBeGreaterThan(3);
  });
});

describe("ConceptCardDeck", () => {
  const cards = stack.concept.cards;

  it("←/→ 키와 버튼으로 카드를 넘긴다", () => {
    render(<ConceptCardDeck topic={stack} onFinish={() => {}} />);
    const deck = screen.getByRole("region", { name: /개념 카드/ });
    expect(screen.getByText(cards[0]!.title)).toBeTruthy();

    fireEvent.keyDown(deck, { key: "ArrowRight" });
    expect(screen.getByText(cards[1]!.title)).toBeTruthy();
    expect(screen.getByText(`카드 2 / ${cards.length}`)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "다음 카드" }));
    expect(screen.getByText(cards[2]!.title)).toBeTruthy();

    fireEvent.keyDown(deck, { key: "ArrowLeft" });
    expect(screen.getByText(`카드 2 / ${cards.length}`)).toBeTruthy();
  });

  it("마지막 카드에서는 다음 단계 버튼이 나온다", () => {
    const onFinish = vi.fn();
    render(<ConceptCardDeck topic={stack} onFinish={onFinish} />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${cards.length}번째 카드`) }));
    fireEvent.click(screen.getByRole("button", { name: /시각화 보기/ }));
    expect(onFinish).toHaveBeenCalledOnce();
  });

  it("보여 준 카드를 잠시 뒤 읽음으로 기록하고, 모두 읽으면 XP를 준다", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      render(<ConceptCardDeck topic={stack} onFinish={() => {}} />);
      const deck = screen.getByRole("region", { name: /개념 카드/ });
      // 바로 넘긴 카드는 읽음이 아니다
      fireEvent.keyDown(deck, { key: "ArrowRight" });
      vi.advanceTimersByTime(1000);
      expect(useProgressStore.getState().progress.concepts.stack?.completedCardIds).toEqual([cards[1]!.id]);

      fireEvent.keyDown(deck, { key: "ArrowLeft" });
      vi.advanceTimersByTime(1000);
      for (let i = 2; i < cards.length; i += 1) {
        fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${i + 1}번째 카드`) }));
        vi.advanceTimersByTime(1000);
      }
      const progress = useProgressStore.getState().progress;
      expect(progress.concepts.stack?.completedAt).not.toBeNull();
      expect(progress.stats.xp).toBe(10);
    } finally {
      vi.useRealTimers();
    }
  });

  it("코드 예시는 주력 언어로 시작하고, 카드에서 바꾼 언어는 주력 언어를 바꾸지 않는다", () => {
    useSettingsStore.getState().setLanguage("java");
    render(<ConceptCardDeck topic={stack} onFinish={() => {}} />);
    const withCode = cards.findIndex((card) => card.code);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${withCode + 1}번째 카드`) }));
    expect(document.querySelector("pre")?.textContent).toContain("ArrayDeque");
    fireEvent.click(screen.getByRole("radio", { name: "JavaScript" }));
    expect(document.querySelector("pre")?.textContent).toContain("stack.push");
    expect(useSettingsStore.getState().language).toBe("java");
    useSettingsStore.getState().setLanguage("python");
  });
});

describe("RecognitionQuiz", () => {
  const quiz = stack.concept.recognitionQuiz;
  const title = (slug: string) => getTopic(slug)!.title;

  function answer(pickWrongFirst: boolean) {
    quiz.forEach((question, i) => {
      const wrong = question.choices.find((c) => c !== question.answer)!;
      const pick = i === 0 && pickWrongFirst ? wrong : question.answer;
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${title(pick)}`) }));
      fireEvent.click(screen.getByRole("button", { name: /다음 문제|결과 보기/ }));
    });
  }

  it("답을 고르면 정답 근거 문구를 형광펜으로 칠하고 해설을 보여 준다", () => {
    render(<PatternSignalTrainer topic={stack} />);
    const first = quiz[0]!;
    expect(document.querySelector("blockquote mark")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${title(first.answer)}`) }));
    const marks = [...document.querySelectorAll("blockquote mark")].map((m) => m.textContent);
    expect(marks).toEqual(first.highlightPhrases);
    expect(screen.getByText("정답이에요!")).toBeTruthy();
    expect(screen.getByText(first.explanation)).toBeTruthy();
  });

  it("80% 이상이면 통과로 기록하고 XP를 준다", () => {
    render(<PatternSignalTrainer topic={stack} />);
    answer(true); // 5문항 중 4개 정답 = 0.8
    expect(screen.getByText(`${quiz.length}문제 중 ${quiz.length - 1}문제 정답`)).toBeTruthy();
    const progress = useProgressStore.getState().progress;
    expect(progress.concepts.stack).toMatchObject({ quizAttempts: 1, quizBestScore: 0.8 });
    expect(progress.stats.xp).toBe(15);
    expect(screen.getByRole("link", { name: /문제 풀러 가기/ }).getAttribute("href")).toBe("/topics/stack#levels");
  });

  it("다시 풀기를 누르면 처음 문제부터 새로 시작한다", () => {
    render(<PatternSignalTrainer topic={stack} />);
    answer(false);
    fireEvent.click(screen.getByRole("button", { name: /다시 풀기/ }));
    expect(screen.getByText(`문제 1 / ${quiz.length}`)).toBeTruthy();
    expect(useProgressStore.getState().progress.concepts.stack?.quizAttempts).toBe(1);
  });
});
