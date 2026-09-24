import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const backtrackingTopic: Topic = {
  slug: "backtracking",
  order: 7,
  title: "백트래킹",
  tagline: "갈림길마다 하나씩 골라 보고, 아니면 되돌아와요",
  color: "sage",
  icon: "maze",
  unlock: { type: "level-cleared", topic: "bfs", level: 3 },
  concept: defineConcept("backtracking"),
  levels: defineLevels("backtracking", [
    {
      title: "선택하고 되돌리기",
      goal: "고르기 → 더 깊이 → 되돌리기 흐름을 선택 트리로 설명할 수 있어요.",
      problemSlugs: [],
    },
    { title: "순열 만들기", goal: "사용 여부 배열로 모든 순서를 만들어 내는 코드를 구현해요.", problemSlugs: [] },
    { title: "조합과 부분집합", goal: "시작 인덱스를 넘겨 중복 없이 조합·부분집합을 만들어요.", problemSlugs: [] },
    { title: "가지치기", goal: "답이 될 수 없는 가지를 일찍 잘라 탐색량을 줄여요.", problemSlugs: [] },
    { title: "제약 만족 문제", goal: "N-Queen 같은 제약 조건 탐색 실전 문제를 풀어요.", problemSlugs: [] },
  ]),
  signalIds: ["sig-all-cases", "sig-small-n", "sig-placement-constraint"],
};
