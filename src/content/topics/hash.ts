import { HASH_CARDS, HASH_QUIZ } from "@/content/concepts/hash";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const hashTopic: Topic = {
  slug: "hash",
  order: 8,
  title: "해시",
  tagline: "이름표로 번호를 계산해서, 사물함 한 칸으로 바로 가요",
  color: "sand",
  icon: "lockers",
  unlock: { type: "level-cleared", topic: "backtracking", level: 3 },
  concept: defineConcept("hash", { cards: HASH_CARDS, recognitionQuiz: HASH_QUIZ }),
  levels: defineLevels("hash", [
    {
      title: "있는지 바로 확인하기",
      goal: "set으로 '있다/없다'와 중복을 O(1)에 확인해요.",
      problemSlugs: ["hash-guest-list", "hash-first-repeat", "hash-sticker-album"],
    },
    {
      title: "개수 세기",
      goal: "dict로 키마다 개수를 세고, 두 개수 표를 비교해요.",
      problemSlugs: ["hash-class-vote", "hash-lost-camper", "hash-magazine-letter"],
    },
    {
      title: "짝 찾기",
      goal: "지금 값의 짝이 이미 나왔는지 해시에 물어봐서 이중 반복문을 없애요.",
      problemSlugs: ["hash-snack-pair", "hash-diff-pairs", "hash-secret-pattern"],
    },
    {
      title: "묶고 이어 보기",
      goal: "기준을 키로 삼아 같은 것끼리 묶고, set으로 이어지는 값을 찾아요.",
      problemSlugs: ["hash-anagram-groups", "hash-camping-gear", "hash-longest-run"],
    },
    {
      title: "누적 합과 해시",
      goal: "누적 합·마지막 위치를 dict에 기억해 구간 문제를 O(N)에 풀어요.",
      problemSlugs: ["hash-subarray-sum", "hash-snack-line", "hash-balanced-days"],
    },
  ]),
  signalIds: ["sig-seen-before", "sig-count-each", "sig-pair-target"],
};
