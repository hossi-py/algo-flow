import type { Problem } from "@/types/content";

export const dijkstraReachableInTime: Problem = {
  id: "c:dijkstra-reachable-in-time",
  slug: "dijkstra-reachable-in-time",
  source: "curated",
  topic: "dijkstra",
  level: 2,
  title: "제시간에 배달할 수 있는 마을",
  summary: "최단 시간을 모두 구한 뒤 제한 시간 안인 마을만 세요",
  statement: [
    "빵집은 **0번 마을**에 있어요. 마을 `n`개와 양방향 길 `roads`(`[a, b, t]`: `t`분)가 있어요.",
    "",
    "빵은 `limit`분 안에 도착해야 따뜻해요. 가장 빠른 길로 갔을 때 **`limit`분 이하**로 닿는 마을은 몇 개인지 반환해 주세요. 0번 마을도 세요.",
  ].join("\n"),
  inputFormat: "`n`: 마을 수, `roads`: `[a, b, t]` 길 목록, `limit`: 제한 시간이에요.",
  outputFormat: "제한 시간 안에 닿는 마을 수",
  constraints: [
    "1 ≤ n ≤ 10,000",
    "0 ≤ roads의 길이 ≤ 30,000",
    "0 ≤ a, b < n, a ≠ b",
    "1 ≤ t ≤ 1,000",
    "0 ≤ limit ≤ 10,000,000",
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
      { name: "limit", type: { python: "int", javascript: "number", java: "int" }, description: "제한 시간" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "닿는 마을 수" },
  },
  starterCode: {
    python: ["def solution(n, roads, limit):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads, limit) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] roads, int limit) {",
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
          [0, 1, 1],
          [1, 2, 2],
          [0, 2, 4],
          [2, 3, 1],
          [3, 4, 5],
        ],
        4,
      ],
      expected: 4,
      explanation: "가장 빠른 시간은 0, 1, 3, 4, 9분이에요. 4분 이하는 네 곳이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        3,
        [
          [0, 1, 1],
          [1, 2, 1],
        ],
        0,
      ],
      expected: 1,
      explanation: "0분이면 빵집 마을만 돼서 1이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        3,
        [
          [0, 2, 10],
          [0, 1, 3],
          [1, 2, 3],
        ],
        6,
      ],
      expected: 3,
      failureNote: "2번은 곧장 10분이지만 돌아가면 6분이라 들어가요. 답은 3이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [
        4,
        [
          [1, 2, 1],
          [2, 3, 1],
        ],
        100,
      ],
      expected: 1,
      failureNote: "0번에서 나가는 길이 없어서 1이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        4,
        [
          [0, 1, 5],
          [0, 2, 5],
          [0, 3, 6],
        ],
        5,
      ],
      expected: 3,
      failureNote: "딱 5분인 마을도 들어가요. 0·1·2번 세 곳이에요.",
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
            const a = (i * 104729) % 10000;
            const b = (a + 1 + ((i * 7907) % 9999)) % 10000;
            return [a, b, ((i * 7919) % 1000) + 1];
          }),
        ],
        5000,
      ],
      expected: 10000,
      failureNote: "마을 1만 개, 길 3만 개예요.",
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
      body: [
        "길마다 시간이 다른 지도에서 **가장 빠른 시간**이 필요해요 → **다익스트라**로 모든 마을까지의 시간을 구해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 0번에서 다익스트라를 돌려 `dist`를 구해요.",
        "2. `dist[v] ≤ limit`인 마을 수를 세요. 갈 수 없는 마을(∞)은 자연히 빠져요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "dist = dijkstra(graph, 0)", "return count(d <= limit for d in dist)", "~~~"].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["마을을 세는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["dist = dijkstra(graph, 0)", "return sum(1 for d in dist if ______)"].join("\n"),
          javascript: ["const dist = dijkstra(graph, 0);", "return dist.filter((d) => ______).length;"].join("\n"),
          java: [
            "long[] dist = dijkstra(graph, 0);",
            "int count = 0;",
            "for (long d : dist) if (______) count++;",
            "return count;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["weighted-shortest-path"],
  signalIds: ["sig-weighted-route"],
  estimatedMinutes: 12,
  xp: 20,
};
