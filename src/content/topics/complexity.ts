import { COMPLEXITY_CARDS, COMPLEXITY_QUIZ } from "@/content/concepts/complexity";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const complexityTopic: Topic = {
  slug: "complexity",
  order: 0,
  title: "시간 복잡도 입문",
  tagline: "풀기 전에, 입력이 커지면 몇 번 계산할지 먼저 어림해요",
  color: "slate",
  icon: "timer",
  unlock: { type: "always" },
  concept: defineConcept("complexity", { cards: COMPLEXITY_CARDS, recognitionQuiz: COMPLEXITY_QUIZ }),
  levels: defineLevels("complexity", [
    {
      title: "공식으로 한 번에 (O(1))",
      goal: "반복문을 식 하나로 바꿔요.",
      problemSlugs: ["cx-count-multiples", "cx-range-sums", "cx-handshakes"],
    },
    {
      title: "한 번 훑기 (O(N))",
      goal: "모든 쌍 대신, 필요한 값을 기억하며 한 번만 훑어요.",
      problemSlugs: ["cx-best-trade", "cx-prefix-queries", "cx-same-color-pairs"],
    },
    {
      title: "절반씩 줄이기 (O(log N))",
      goal: "문제의 크기를 절반씩 줄여 아주 큰 수도 금방 끝내요.",
      problemSlugs: ["cx-halving-steps", "cx-fast-power", "cx-gcd"],
    },
    {
      title: "제곱근까지만 (O(√N))",
      goal: "짝을 이루는 약수를 이용해 √N까지만 봐요.",
      problemSlugs: ["cx-count-divisors", "cx-is-prime", "cx-prime-factors"],
    },
    {
      title: "제한 보고 고르기",
      goal: "입력 제한에 맞는 방법을 골라 느린 풀이를 빠르게 바꿔요.",
      problemSlugs: ["cx-max-subarray", "cx-count-primes", "cx-balanced-split"],
    },
  ]),
  signalIds: ["sig-huge-n", "sig-all-pairs-slow", "sig-input-size"],
};
