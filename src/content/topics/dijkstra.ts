import { DIJKSTRA_CARDS, DIJKSTRA_QUIZ } from "@/content/concepts/dijkstra";
import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const dijkstraTopic: Topic = {
  slug: "dijkstra",
  order: 15,
  title: "다익스트라 (최단 경로)",
  tagline: "내비게이션처럼, 지금까지 가장 가까운 곳부터 거리를 확정해요",
  color: "sky",
  icon: "route",
  unlock: { type: "level-cleared", topic: "heap", level: 3 },
  concept: defineConcept("dijkstra", { cards: DIJKSTRA_CARDS, recognitionQuiz: DIJKSTRA_QUIZ }),
  levels: defineLevels("dijkstra", [
    {
      title: "가장 가까운 곳부터 확정하기",
      goal: "힙으로 가장 가까운 노드를 꺼내며 최단 거리를 구해요.",
      problemSlugs: ["dijkstra-delivery-time", "dijkstra-signal-delay", "dijkstra-cheapest-route"],
    },
    {
      title: "지도를 그래프로 바꾸기",
      goal: "격자를 그래프로 보고, 지나온 길을 되짚어요.",
      problemSlugs: ["dijkstra-grid-cost", "dijkstra-route-path", "dijkstra-reachable-in-time"],
    },
    {
      title: "출발점과 비용 규칙 바꾸기",
      goal: "간선을 뒤집거나 출발점을 여러 개 두고, 합 대신 최댓값을 줄여요.",
      problemSlugs: ["dijkstra-party-roundtrip", "dijkstra-nearest-shelter", "dijkstra-gentle-hike"],
    },
    {
      title: "상태를 더한 최단 경로",
      goal: "(노드, 상태)를 새 노드로 보고, 최단 경로의 수도 세요.",
      problemSlugs: ["dijkstra-coupon-fare", "dijkstra-limited-transfers", "dijkstra-count-routes"],
    },
    {
      title: "다익스트라 실전",
      goal: "여러 번 돌린 다익스트라를 조합하고, 0과 1 비용도 다뤄요.",
      problemSlugs: ["dijkstra-must-visit", "dijkstra-wall-break", "dijkstra-useful-roads"],
    },
  ]),
  signalIds: ["sig-weighted-route", "sig-route-with-state", "sig-worst-edge"],
};
