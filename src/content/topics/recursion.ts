import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const recursionTopic: Topic = {
  slug: "recursion",
  order: 3,
  title: "재귀 기초",
  tagline: "마주 보는 거울처럼, 자기 자신을 다시 불러요",
  color: "lilac",
  icon: "mirror",
  unlock: { type: "level-cleared", topic: "queue-deque", level: 3 },
  concept: defineConcept("recursion"),
  levels: defineLevels("recursion", [
    {
      title: "재귀란?",
      goal: "함수가 자기 자신을 부를 때 호출 스택이 어떻게 쌓이고 풀리는지 설명할 수 있어요.",
      problemSlugs: [],
    },
    {
      title: "종료 조건과 호출",
      goal: "종료 조건과 재귀 호출, 두 부분으로 함수를 설계할 수 있어요.",
      problemSlugs: [],
    },
    { title: "점화식을 코드로", goal: "팩토리얼·피보나치처럼 식으로 정의된 문제를 재귀로 옮겨요.", problemSlugs: [] },
    { title: "나눠서 정복하기", goal: "문제를 절반으로 나눠 풀고 합치는 분할 정복을 구현해요.", problemSlugs: [] },
    {
      title: "재귀 트리로 생각하기",
      goal: "재귀 호출 트리를 그려 시간 복잡도를 예측하고 실전 문제를 풀어요.",
      problemSlugs: [],
    },
  ]),
  signalIds: ["sig-self-similar", "sig-nested-structure", "sig-shrink-by-one"],
};
