import { HEAP_CARDS, HEAP_QUIZ } from "@/content/concepts/heap";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const heapTopic: Topic = {
  slug: "heap",
  order: 14,
  title: "힙 (우선순위 큐)",
  tagline: "응급실처럼, 먼저 온 순서가 아니라 가장 급한 것부터 꺼내요",
  color: "lemon",
  icon: "heap",
  unlock: { type: "level-cleared", topic: "two-pointers", level: 3 },
  concept: defineConcept("heap", { cards: HEAP_CARDS, recognitionQuiz: HEAP_QUIZ }),
  levels: defineLevels("heap", [
    {
      title: "가장 작은 것부터 꺼내기",
      goal: "힙에 넣고 꺼내며 가장 작은(큰) 값을 빠르게 다뤄요.",
      problemSlugs: ["heap-smallest-k", "heap-last-stone", "heap-kth-largest"],
    },
    {
      title: "꺼내고 다시 넣기",
      goal: "가장 작은 것을 꺼내 합치거나, 가까운 것부터 골라요.",
      problemSlugs: ["heap-merge-piles", "heap-nearly-sorted", "heap-closest-trees"],
    },
    {
      title: "상위 K개와 여러 줄",
      goal: "크기 K인 힙과, 여러 줄을 한 번에 합치는 힙을 써요.",
      problemSlugs: ["heap-top-words", "heap-merge-shelves", "heap-matrix-kth"],
    },
    {
      title: "힙으로 순서 정하기",
      goal: "도착 순서가 아니라 조건 순서로 작업을 처리해요.",
      problemSlugs: ["heap-task-order", "heap-best-projects", "heap-no-repeat-string"],
    },
    {
      title: "힙 실전",
      goal: "힙 두 개로 중앙값을 구하고, 그리디와 함께 최선을 골라요.",
      problemSlugs: ["heap-running-median", "heap-fewest-refuels", "heap-course-plan"],
    },
  ]),
  signalIds: ["sig-repeated-min", "sig-top-k", "sig-running-median"],
};
