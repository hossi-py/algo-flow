import { BINARY_SEARCH_CARDS, BINARY_SEARCH_QUIZ } from "@/content/concepts/binary-search";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const binarySearchTopic: Topic = {
  slug: "binary-search",
  order: 10,
  title: "이분 탐색",
  tagline: "가운데를 보고 절반씩 버리면, 100만 칸도 20번이면 찾아요",
  color: "plum",
  icon: "target",
  unlock: { type: "level-cleared", topic: "sorting", level: 3 },
  concept: defineConcept("binary-search", { cards: BINARY_SEARCH_CARDS, recognitionQuiz: BINARY_SEARCH_QUIZ }),
  levels: defineLevels("binary-search", [
    {
      title: "반씩 버리며 찾기",
      goal: "lo·mid·hi로 정렬된 목록과 수의 범위에서 값을 찾아요.",
      problemSlugs: ["binary-search-page-finder", "binary-search-updown", "binary-search-square-garden"],
    },
    {
      title: "경계 찾기",
      goal: "'x 이상인 첫 위치'로 개수와 가장 가까운 값을 구해요.",
      problemSlugs: ["binary-search-cutoff-count", "binary-search-range-count", "binary-search-nearest-station"],
    },
    {
      title: "답을 이분 탐색",
      goal: "'X로 가능한가?'를 확인하는 함수를 만들고 답의 범위를 반씩 줄여요.",
      problemSlugs: ["binary-search-cut-cables", "binary-search-tree-saw", "binary-search-eating-speed"],
    },
    {
      title: "최대의 최소",
      goal: "나누기·배치·시간 문제를 가능 여부 확인 + 이분 탐색으로 풀어요.",
      problemSlugs: ["binary-search-split-books", "binary-search-lantern-spacing", "binary-search-toy-workshop"],
    },
    {
      title: "이분 탐색 실전",
      goal: "개수 세기·회전 배열·가장 긴 증가 부분 수열에 이분 탐색을 응용해요.",
      problemSlugs: ["binary-search-kth-table", "binary-search-rotated-shelf", "binary-search-rising-path"],
    },
  ]),
  signalIds: ["sig-sorted-many-queries", "sig-first-true", "sig-max-min-answer"],
};
