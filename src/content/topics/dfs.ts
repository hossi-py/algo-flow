import { DFS_CARDS, DFS_QUIZ } from "@/content/concepts/dfs";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const dfsTopic: Topic = {
  slug: "dfs",
  order: 5,
  title: "DFS",
  tagline: "미로에서 한 길로 끝까지 가 보고, 막히면 돌아와요",
  color: "blossom",
  icon: "dive",
  unlock: { type: "level-cleared", topic: "graph-representation", level: 3 },
  concept: defineConcept("dfs", { cards: DFS_CARDS, recognitionQuiz: DFS_QUIZ }),
  levels: defineLevels("dfs", [
    {
      title: "깊이 우선 탐색이란?",
      goal: "DFS가 노드를 방문하는 순서를 손으로 따라가며 설명할 수 있어요.",
      problemSlugs: ["dfs-cave-order", "dfs-power-restore", "dfs-finish-order"],
    },
    {
      title: "그래프 DFS 구현",
      goal: "재귀와 스택 두 가지 방식으로 DFS와 방문 처리를 구현해요.",
      problemSlugs: ["dfs-maze-escape", "dfs-club-count", "dfs-one-way-tour"],
    },
    {
      title: "연결 요소 세기",
      goal: "격자와 그래프에서 이어진 덩어리를 찾아 개수와 크기를 셀 수 있어요.",
      problemSlugs: ["dfs-flower-zones", "dfs-radio-network", "dfs-forest-lakes"],
    },
    {
      title: "경로와 사이클 찾기",
      goal: "경로 존재 여부와 순환을 DFS로 판별해요.",
      problemSlugs: ["dfs-recipe-loop", "dfs-downhill-routes", "dfs-loop-trail"],
    },
    {
      title: "트리 DFS 응용",
      goal: "서브트리 크기·깊이 계산처럼 트리를 DFS로 다루는 실전 문제를 풀어요.",
      problemSlugs: ["dfs-team-size", "dfs-farthest-villages", "dfs-orchard-split"],
    },
  ]),
  signalIds: ["sig-connected-group", "sig-grid-neighbors", "sig-path-exists", "sig-tree-structure"],
};
