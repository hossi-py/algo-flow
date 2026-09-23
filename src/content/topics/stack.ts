import { STACK_CARDS, STACK_QUIZ } from "@/content/concepts/stack";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const stackTopic: Topic = {
  slug: "stack",
  order: 1,
  title: "스택",
  tagline: "접시 쌓기처럼, 마지막에 올린 것을 먼저 꺼내요",
  color: "peach",
  icon: "plates",
  unlock: { type: "always" },
  concept: defineConcept("stack", { cards: STACK_CARDS, recognitionQuiz: STACK_QUIZ }),
  levels: defineLevels("stack", [
    {
      title: "스택이 뭘까?",
      goal: "push · pop · peek이 어떻게 움직이는지 그림으로 설명할 수 있어요.",
      problemSlugs: [],
    },
    {
      title: "스택 직접 만들기",
      goal: "리스트(배열)로 스택 연산을 구현하고 빈 스택을 안전하게 다룰 수 있어요.",
      problemSlugs: [],
    },
    {
      title: "괄호 짝 맞추기",
      goal: "짝이 맞아야 하는 구조를 보면 스택을 떠올리고 바로 구현할 수 있어요.",
      problemSlugs: [],
    },
    {
      title: "되돌리기와 직전 값",
      goal: "실행 취소, 직전 값과의 비교처럼 가장 최근 것을 다루는 문제를 풀어요.",
      problemSlugs: [],
    },
    {
      title: "모노토닉 스택",
      goal: "다음으로 큰 수 유형을 O(N)으로 해결하는 코딩테스트 문제를 풀어요.",
      problemSlugs: [],
    },
  ]),
  signalIds: ["sig-bracket-pair", "sig-latest-first"],
};
