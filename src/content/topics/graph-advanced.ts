import { GRAPH_ADVANCED_CARDS, GRAPH_ADVANCED_QUIZ } from "@/content/concepts/graph-advanced";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const graphAdvancedTopic: Topic = {
  slug: "graph-advanced",
  order: 16,
  title: "그래프 심화 (유니온 파인드·위상 정렬)",
  tagline: "그룹은 대표끼리 합치고, 할 일은 먼저 할 것부터 줄 세워요",
  color: "mint",
  icon: "network",
  unlock: { type: "level-cleared", topic: "dijkstra", level: 3 },
  concept: defineConcept("graph-advanced", { cards: GRAPH_ADVANCED_CARDS, recognitionQuiz: GRAPH_ADVANCED_QUIZ }),
  levels: defineLevels("graph-advanced", [
    {
      title: "합치고 찾기",
      goal: "유니온 파인드로 그룹을 합치고, 같은 그룹인지와 고리를 확인해요.",
      problemSlugs: ["uf-friend-groups", "uf-same-group", "uf-first-cycle"],
    },
    {
      title: "그룹 다루기",
      goal: "그룹의 크기를 세고, 조건을 그룹으로 바꾸고, 새 칸이 생길 때마다 그룹을 세요.",
      problemSlugs: ["uf-group-sizes", "uf-equations", "uf-online-islands"],
    },
    {
      title: "모두 잇는 가장 싼 방법",
      goal: "크루스칼로 최소 신장 트리를 만들고 조금씩 바꿔 써요.",
      problemSlugs: ["mst-min-cable", "mst-power-plants", "mst-split-villages"],
    },
    {
      title: "먼저 할 일부터",
      goal: "위상 정렬로 순서를 정하고, 고리를 찾고, 걸리는 시간을 채워요.",
      problemSlugs: ["topo-course-order", "topo-can-finish", "topo-build-time"],
    },
    {
      title: "그래프 심화 실전",
      goal: "순서 DP, 거꾸로 합치기, 좌표로 주어진 최소 신장 트리를 풀어요.",
      problemSlugs: ["topo-semester", "uf-reverse-cuts", "mst-manhattan"],
    },
  ]),
  signalIds: ["sig-merge-groups", "sig-connect-all-cheap", "sig-prerequisites"],
};
