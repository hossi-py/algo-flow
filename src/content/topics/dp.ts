import { DP_CARDS, DP_QUIZ } from "@/content/concepts/dp";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const dpTopic: Topic = {
  slug: "dp",
  order: 11,
  title: "DP",
  tagline: "한 번 푼 답은 표에 적어 두고, 작은 답을 모아 큰 답을 만들어요",
  color: "teal",
  icon: "table",
  unlock: { type: "level-cleared", topic: "binary-search", level: 3 },
  concept: defineConcept("dp", { cards: DP_CARDS, recognitionQuiz: DP_QUIZ }),
  levels: defineLevels("dp", [
    {
      title: "1차원 표 채우기",
      goal: "dp[i]의 뜻을 정하고, 앞 칸들로 점화식을 세워 표를 채워요.",
      problemSlugs: ["dp-stair-ways", "dp-stepping-stones", "dp-acorn-houses"],
    },
    {
      title: "격자 DP",
      goal: "위·왼쪽 칸에서 답을 가져오는 2차원 표를 채워요.",
      problemSlugs: ["dp-forest-paths", "dp-min-trail", "dp-fruit-pyramid"],
    },
    {
      title: "고를까 말까",
      goal: "동전·배낭처럼 물건을 넣을지 말지를 표로 비교해요.",
      problemSlugs: ["dp-coin-ways", "dp-fewest-coins", "dp-picnic-bag"],
    },
    {
      title: "문자열과 수열 DP",
      goal: "연속 구간과 두 문자열 표로 최대 합·공통 부분·편집 거리를 구해요.",
      problemSlugs: ["dp-best-streak", "dp-common-song", "dp-word-edit"],
    },
    {
      title: "DP 실전",
      goal: "상태를 나눈 DP와 구간을 자르는 DP로 실전 문제를 풀어요.",
      problemSlugs: ["dp-berry-market", "dp-palindrome-cuts", "dp-secret-message"],
    },
  ]),
  signalIds: ["sig-count-ways-mod", "sig-overlapping-subproblems", "sig-best-choice-sequence"],
};
