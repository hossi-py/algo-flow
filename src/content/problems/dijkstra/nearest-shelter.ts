import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      5,
      [
        [0, 1, 2],
        [1, 2, 2],
        [2, 3, 2],
        [3, 4, 2],
        [0, 4, 9],
      ],
      [0, 3],
    ],
    expected: [0, 2, 2, 0, 2],
    explanation: "1번은 0번 대피소까지 2분, 2번은 3번 대피소까지 2분, 4번은 3번까지 2분이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [3, [[0, 1, 5]], [2]],
    expected: [-1, -1, 0],
    explanation: "0번과 1번은 대피소가 있는 2번에 못 가서 -1이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [2, [[0, 1, 3]], [0, 1]],
    expected: [0, 0],
    failureNote: "모두 대피소 마을이면 [0, 0]이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 1, 10],
        [1, 2, 1],
        [2, 3, 1],
      ],
      [0, 3],
    ],
    expected: [0, 2, 1, 0],
    failureNote: "1번은 0번 대피소가 길 하나(10분)지만 3번 대피소가 2분이라 더 가까워요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1, 4],
        [1, 2, 4],
        [2, 3, 4],
      ],
      [1],
    ],
    expected: [4, 0, 4, 8],
    failureNote: "대피소가 하나면 보통 다익스트라와 같아요: [4, 0, 4, 8].",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      10000,
      [
        ...Array.from({ length: 9999 }, (_, i) => [i, i + 1, 1]),
        ...Array.from({ length: 9998 }, (_, i) => [i, i + 2, 3]),
      ],
      Array.from({ length: 100 }, (_, i) => i * 100),
    ],
    expected: Array.from({ length: 10000 }, (_, i) => (i >= 9900 ? i % 100 : Math.min(i % 100, 100 - (i % 100)))),
    failureNote: "대피소 100곳이에요. 대피소마다 다익스트라를 따로 돌리면 100번이라 느려요.",
  },
]);

export const dijkstraNearestShelter: Problem = {
  id: "c:dijkstra-nearest-shelter",
  slug: "dijkstra-nearest-shelter",
  source: "curated",
  topic: "dijkstra",
  level: 3,
  title: "가장 가까운 대피소",
  summary: "대피소를 모두 거리 0으로 힙에 넣고 한 번에 다익스트라를 돌려요",
  statement: [
    "마을 `n`개와 양방향 길 `roads`(`[a, b, t]`: `t`분)가 있어요. `shelters`에 적힌 마을에는 대피소가 있어요.",
    "",
    "마을마다 **가장 가까운 대피소**까지 가장 빨리 가는 시간을 번호 순서대로 담아 반환해 주세요. 대피소가 있는 마을은 0이고, 어느 대피소에도 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 마을 수, `roads`: `[a, b, t]` 길 목록, `shelters`: 대피소가 있는 마을이에요.",
  outputFormat: "마을별 가장 가까운 대피소까지의 시간 (갈 수 없으면 -1)",
  constraints: [
    "1 ≤ n ≤ 10,000",
    "0 ≤ roads의 길이 ≤ 30,000",
    "1 ≤ t ≤ 1,000",
    "1 ≤ shelters의 길이 ≤ n, 번호는 겹치지 않아요",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "마을 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 시간] 양방향 길",
      },
      {
        name: "shelters",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "대피소 마을",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "마을별 시간" },
  },
  starterCode: {
    python: ["def solution(n, roads, shelters):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads, shelters) {", "  let answer = [];", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public int[] solution(int n, int[][] roads, int[] shelters) {",
      "        int[] answer = new int[n];",
      "        return answer;",
      "    }",
      "}",
      "",
    ].join("\n"),
  },
  get testCases() {
    return testCases();
  },
  judge: {
    timeLimitMs: 2000,
    compare: { type: "exact" },
    recursionLimit: 3000,
    revealFirstFailure: true,
  },
  hints: [
    {
      step: 1,
      kind: "pattern",
      title: "어떤 유형일까요?",
      body: [
        "비용이 다른 길의 최단 시간 → 다익스트라. 그런데 출발점이 **여러 곳**이고, 가장 가까운 한 곳만 알면 돼요 → **여러 출발점 다익스트라**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "대피소마다 따로 돌리지 말고, **모든 대피소를 거리 0으로 한꺼번에** 힙에 넣고 시작해요.",
        "",
        "모든 대피소와 0분 길로 이어진 '가상의 출발점' 하나에서 다익스트라를 돌리는 것과 같아요. 그래서 한 번이면 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for s in shelters: dist[s] = 0;  push(heap, (0, s))",
        "보통의 다익스트라",
        "∞는 -1로 바꿔 반환",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["출발점을 넣는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "dist = [INF] * n",
            "heap = []",
            "for s in shelters:",
            "    dist[s] = 0",
            "    heap.append(______)",
          ].join("\n"),
          javascript: [
            "const dist = new Array(n).fill(Infinity);",
            "for (const s of shelters) {",
            "  dist[s] = 0;",
            "  heap.push(______);",
            "}",
          ].join("\n"),
          java: ["for (int s : shelters) {", "    dist[s] = 0;", "    heap.offer(______);", "}"].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["reverse-or-multi-source"],
  signalIds: ["sig-weighted-route"],
  estimatedMinutes: 15,
  xp: 30,
};
