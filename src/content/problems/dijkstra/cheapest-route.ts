import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const dijkstraCheapestRoute: Problem = {
  id: "c:dijkstra-cheapest-route",
  slug: "dijkstra-cheapest-route",
  source: "curated",
  topic: "dijkstra",
  level: 1,
  title: "통행료가 가장 싼 길",
  summary: "출발 도시에서 도착 도시까지 통행료 합의 최솟값을 구해요",
  statement: [
    "도시 `n`개가 `0`번부터 `n - 1`번까지 있어요. `roads`의 `[a, b, c]`는 a번과 b번 도시를 잇는 양방향 길이고, 지날 때마다 통행료 `c`원을 내요.",
    "",
    "`s`번 도시에서 `e`번 도시까지 갈 때 내는 **통행료 합의 최솟값**을 반환해 주세요. 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 도시 수, `roads`: `[a, b, c]` 길 목록, `s`: 출발 도시, `e`: 도착 도시예요.",
  outputFormat: "통행료 합의 최솟값 (갈 수 없으면 -1)",
  constraints: ["1 ≤ n ≤ 10,000", "0 ≤ roads의 길이 ≤ 30,000", "0 ≤ a, b < n, a ≠ b", "1 ≤ c ≤ 1,000", "0 ≤ s, e < n"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "도시 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, c] 양방향 길",
      },
      { name: "s", type: { python: "int", javascript: "number", java: "int" }, description: "출발 도시" },
      { name: "e", type: { python: "int", javascript: "number", java: "int" }, description: "도착 도시" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "통행료 합의 최솟값" },
  },
  starterCode: {
    python: ["def solution(n, roads, s, e):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads, s, e) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] roads, int s, int e) {",
      "        int answer = 0;",
      "        return answer;",
      "    }",
      "}",
      "",
    ].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [
        5,
        [
          [0, 1, 2],
          [0, 2, 6],
          [1, 2, 3],
          [1, 3, 8],
          [2, 3, 1],
          [3, 4, 2],
          [2, 4, 7],
        ],
        0,
        4,
      ],
      expected: 8,
      explanation: "0 → 1 → 2 → 3 → 4로 2 + 3 + 1 + 2 = 8원이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        4,
        [
          [0, 1, 5],
          [2, 3, 5],
        ],
        0,
        3,
      ],
      expected: -1,
      explanation: "0번과 3번이 이어져 있지 않아 -1이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [3, [[0, 1, 4]], 2, 2],
      expected: 0,
      failureNote: "출발과 도착이 같으면 0원이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        3,
        [
          [0, 2, 50],
          [0, 1, 20],
          [1, 2, 20],
        ],
        0,
        2,
      ],
      expected: 40,
      failureNote: "곧장 가면 50원, 1번을 거치면 40원이라 40이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        4,
        [
          [3, 2, 1],
          [2, 1, 1],
          [1, 0, 1],
          [0, 3, 9],
        ],
        3,
        0,
      ],
      expected: 3,
      failureNote: "길은 양방향이에요. 3 → 2 → 1 → 0으로 3원이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        10000,
        [
          ...Array.from({ length: 9999 }, (_, i) => [i, i + 1, 1000]),
          ...Array.from({ length: 20000 }, (_, i) => {
            const a = (i * 7907) % 10000;
            const b = (a + 1 + ((i * 104729) % 9999)) % 10000;
            return [a, b, ((i * 7919) % 1000) + 1];
          }),
        ],
        17,
        9995,
      ],
      expected: 3048,
      failureNote: "도시 1만 개, 길 3만 개예요.",
    },
  ],
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
      body: ["길마다 통행료가 다르고, 합의 **최솟값**을 물어요 → **다익스트라**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `s`에서 다익스트라를 돌려요.",
        "2. `dist[e]`가 ∞면 -1, 아니면 그 값이 답이에요.",
        "",
        "`e`를 힙에서 꺼내는 순간 거리가 확정되니, 거기서 바로 멈춰도 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dist[s] = 0;  heap = [(0, s)]",
        "while heap:",
        "    d, v = pop(heap)",
        "    if v == e: return d          # 확정되면 끝",
        "    if d > dist[v]: continue",
        "    이웃의 거리 줄이기",
        "return -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["도착 도시를 꺼낼 때 멈추는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["d, v = heapq.heappop(heap)", "if ______:", "    return d", "if d > dist[v]:", "    continue"].join(
            "\n",
          ),
          javascript: ["const [d, v] = heap.pop();", "if (______) return d;", "if (d > dist[v]) continue;"].join("\n"),
          java: [
            "long[] top = heap.poll();",
            "long d = top[0];",
            "int v = (int) top[1];",
            "if (______) return (int) d;",
            "if (d > dist[v]) continue;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["weighted-shortest-path"],
  signalIds: ["sig-weighted-route"],
  visualization: {
    presets: [
      problemPreset(
        "dijkstra-cheapest-route-ex1",
        "dijkstra-basic",
        "0번에서 모든 도시까지",
        "힙에서 꺼낸 순서대로 거리가 확정돼요. 4번까지는 8원이에요.",
        [
          5,
          [
            [0, 1, 2],
            [0, 2, 6],
            [1, 2, 3],
            [1, 3, 8],
            [2, 3, 1],
            [3, 4, 2],
            [2, 4, 7],
          ],
          0,
        ],
      ),
    ],
  },
  estimatedMinutes: 15,
  xp: 10,
};
