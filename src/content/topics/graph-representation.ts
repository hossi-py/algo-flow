import type { Topic } from "@/types";
import { defineConcept, defineLevels } from "./define";

export const graphRepresentationTopic: Topic = {
  slug: "graph-representation",
  order: 4,
  title: "그래프와 트리 표현",
  tagline: "지하철 노선도처럼, 점과 선으로 관계를 그려요",
  color: "sky",
  icon: "map",
  unlock: { type: "level-cleared", topic: "recursion", level: 3 },
  concept: defineConcept("graph-representation"),
  levels: defineLevels("graph-representation", [
    { title: "노드와 간선", goal: "방향·무방향 그래프와 트리의 차이를 그림으로 설명할 수 있어요.", problemSlugs: [] },
    {
      title: "인접 리스트 만들기",
      goal: "간선 목록을 인접 리스트로 바꾸는 코드를 막힘없이 쓸 수 있어요.",
      problemSlugs: [],
    },
    {
      title: "인접 행렬과 비교",
      goal: "인접 행렬과 인접 리스트 중 상황에 맞는 표현을 고를 수 있어요.",
      problemSlugs: [],
    },
    {
      title: "여러 형태의 입력 다루기",
      goal: "부모 배열, 격자처럼 다양한 입력을 그래프로 해석해요.",
      problemSlugs: [],
    },
    {
      title: "차수와 연결 관계",
      goal: "차수·이웃 정보로 그래프의 성질을 분석하는 실전 문제를 풀어요.",
      problemSlugs: [],
    },
  ]),
  signalIds: ["sig-relations-given", "sig-degree", "sig-matrix-given"],
};
