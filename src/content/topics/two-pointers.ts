import { TWO_POINTERS_CARDS, TWO_POINTERS_QUIZ } from "@/content/concepts/two-pointers";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const twoPointersTopic: Topic = {
  slug: "two-pointers",
  order: 13,
  title: "두 포인터",
  tagline: "손가락 두 개를 한 방향으로만 옮기면, 모든 쌍을 보지 않아도 돼요",
  color: "indigo",
  icon: "pointers",
  unlock: { type: "level-cleared", topic: "greedy", level: 3 },
  concept: defineConcept("two-pointers", { cards: TWO_POINTERS_CARDS, recognitionQuiz: TWO_POINTERS_QUIZ }),
  levels: defineLevels("two-pointers", [
    {
      title: "양 끝과 같은 방향",
      goal: "양 끝에서 좁히거나, 읽기·쓰기 손가락으로 제자리에서 걸러요.",
      problemSlugs: ["two-pointers-palindrome-note", "two-pointers-sorted-pair", "two-pointers-unique-stamps"],
    },
    {
      title: "두 줄을 함께 훑기",
      goal: "정렬된 수, 두 문자열을 손가락 두 개로 한 번에 훑어요.",
      problemSlugs: ["two-pointers-sorted-squares", "two-pointers-zeros-back", "two-pointers-hidden-word"],
    },
    {
      title: "고정 길이 창",
      goal: "길이 k인 창을 넣고 빼며 옮겨 합·개수를 바로 구해요.",
      problemSlugs: ["two-pointers-best-k-days", "two-pointers-good-weeks", "two-pointers-anagram-spots"],
    },
    {
      title: "늘였다 줄이는 창",
      goal: "조건을 채울 때까지 늘리고, 채우면 줄여서 가장 짧게·길게 만들어요.",
      problemSlugs: ["two-pointers-shortest-enough", "two-pointers-fruit-basket", "two-pointers-water-box"],
    },
    {
      title: "두 포인터 실전",
      goal: "세 수의 합, 모든 글자를 품는 창, 빗물 담기로 실전 문제를 풀어요.",
      problemSlugs: ["two-pointers-three-closest", "two-pointers-cover-window", "two-pointers-rain-garden"],
    },
  ]),
  signalIds: ["sig-sorted-pair-ends", "sig-contiguous-window", "sig-in-place"],
};
