import { BFS_CARDS, BFS_QUIZ } from "@/content/concepts/bfs";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const bfsTopic: Topic = {
  slug: "bfs",
  order: 6,
  title: "BFS",
  tagline: "물결처럼, 가까운 곳부터 한 겹씩 퍼져 나가요",
  color: "lemon",
  icon: "ripple",
  unlock: { type: "level-cleared", topic: "dfs", level: 3 },
  concept: defineConcept("bfs", { cards: BFS_CARDS, recognitionQuiz: BFS_QUIZ }),
  levels: defineLevels("bfs", [
    {
      title: "너비 우선 탐색이란?",
      goal: "BFS가 거리 순서로 방문하는 이유를 DFS와 비교해 설명할 수 있어요.",
      problemSlugs: ["bfs-news-order", "bfs-friend-distance"],
    },
    {
      title: "큐로 BFS 구현",
      goal: "큐와 방문 배열로 BFS를 구현하고, 방문 표시 시점을 정확히 지켜요.",
      problemSlugs: ["bfs-exact-hops", "bfs-pigeon-post"],
    },
    {
      title: "최단 거리 구하기",
      goal: "가중치 없는 그래프·격자에서 최단 거리와 최소 횟수를 구해요.",
      problemSlugs: ["bfs-maze-shortest", "bfs-frog-leaps"],
    },
    {
      title: "동시에 퍼지기",
      goal: "시작점이 여러 개인 멀티 소스 BFS를 구현해요.",
      problemSlugs: ["bfs-rumor-days", "bfs-nearest-shelter"],
    },
    {
      title: "상태 공간 BFS",
      goal: "칸 대신 상태를 노드로 보는 실전 최소 횟수 문제를 풀어요.",
      problemSlugs: ["bfs-safe-dial", "bfs-two-buckets"],
    },
  ]),
  signalIds: ["sig-shortest-steps", "sig-spread-simultaneous", "sig-grid-neighbors"],
};
