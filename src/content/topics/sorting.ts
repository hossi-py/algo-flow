import { SORTING_CARDS, SORTING_QUIZ } from "@/content/concepts/sorting";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const sortingTopic: Topic = {
  slug: "sorting",
  order: 9,
  title: "정렬",
  tagline: "기준을 정해 줄을 세우면, 보이지 않던 순서가 보여요",
  color: "slate",
  icon: "bars",
  unlock: { type: "level-cleared", topic: "hash", level: 3 },
  concept: defineConcept("sorting", { cards: SORTING_CARDS, recognitionQuiz: SORTING_QUIZ }),
  levels: defineLevels("sorting", [
    {
      title: "정렬하고 보기",
      goal: "정렬한 뒤 자리·이웃을 보는 것만으로 K번째 값과 가장 가까운 값을 찾아요.",
      problemSlugs: ["sorting-height-order", "sorting-kth-heaviest", "sorting-closest-gap"],
    },
    {
      title: "정렬의 속을 들여다보기",
      goal: "정렬된 두 줄 합치기, 개수 세어 정렬하기, 옆끼리 바꾸기를 직접 구현해요.",
      problemSlugs: ["sorting-merge-shelves", "sorting-score-ranks", "sorting-adjacent-swaps"],
    },
    {
      title: "정렬 기준 정하기",
      goal: "여러 기준(내림차순·동점 처리·숫자 부분)을 조합한 정렬 키를 만들어요.",
      problemSlugs: ["sorting-leaderboard", "sorting-photo-names", "sorting-word-dictionary"],
    },
    {
      title: "정렬 후 훑기",
      goal: "구간을 시작 순으로 정렬해 합치고, 정렬 뒤 두 포인터로 짝을 지어요.",
      problemSlugs: ["sorting-merge-bookings", "sorting-meeting-rooms", "sorting-raft-pairs"],
    },
    {
      title: "정렬 실전",
      goal: "병합 정렬로 뒤바뀐 쌍을 세고, 비교 규칙과 순위 매기기를 활용해요.",
      problemSlugs: ["sorting-inversions", "sorting-biggest-number", "sorting-rank-compress"],
    },
  ]),
  signalIds: ["sig-order-rule", "sig-neighbor-after-sort", "sig-intervals"],
};
