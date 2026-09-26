import { GREEDY_CARDS, GREEDY_QUIZ } from "@/content/concepts/greedy";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const greedyTopic: Topic = {
  slug: "greedy",
  order: 12,
  title: "그리디",
  tagline: "매 순간 가장 좋아 보이는 것을 고르되, 반례부터 확인해요",
  color: "coral",
  icon: "coins",
  unlock: { type: "level-cleared", topic: "dp", level: 3 },
  concept: defineConcept("greedy", { cards: GREEDY_CARDS, recognitionQuiz: GREEDY_QUIZ }),
  levels: defineLevels("greedy", [
    {
      title: "지금 가장 좋은 것 고르기",
      goal: "큰 것부터, 싼 것부터처럼 한 가지 기준으로 욕심껏 골라요.",
      problemSlugs: ["greedy-change-coins", "greedy-snack-budget", "greedy-best-trade"],
    },
    {
      title: "정렬하고 고르기",
      goal: "어떤 기준으로 정렬해야 욕심이 맞는지 찾아요.",
      problemSlugs: ["greedy-shortest-first", "greedy-cookie-share", "greedy-rope-lift"],
    },
    {
      title: "구간과 도달 범위",
      goal: "끝나는 시각 순으로 구간을 고르고, 닿을 수 있는 범위를 늘려 가요.",
      problemSlugs: ["greedy-meeting-room", "greedy-balloon-arrows", "greedy-stone-jump"],
    },
    {
      title: "한 번 훑으며 판단하기",
      goal: "모자라면 다시 시작하고, 양쪽에서 두 번 훑어 조건을 맞춰요.",
      problemSlugs: ["greedy-fuel-loop", "greedy-fewest-jumps", "greedy-candy-line"],
    },
    {
      title: "그리디 실전",
      goal: "앞자리부터 크게 만들기, 구간 나누기, 순서 복원으로 실전 문제를 풀어요.",
      problemSlugs: ["greedy-biggest-after-erase", "greedy-letter-parts", "greedy-height-queue"],
    },
  ]),
  signalIds: ["sig-greedy-local-best", "sig-interval-max-count", "sig-running-reach"],
};
