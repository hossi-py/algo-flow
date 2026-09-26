import type { Problem } from "@/types/content";

export const dijkstraCouponFare: Problem = {
  id: "c:dijkstra-coupon-fare",
  slug: "dijkstra-coupon-fare",
  source: "curated",
  topic: "dijkstra",
  level: 4,
  title: "반값 쿠폰 한 장",
  summary: "(도시, 쿠폰을 썼는지)를 노드로 보면 두 배 크기 그래프의 다익스트라예요",
  statement: [
    "도시 `n`개가 양방향 기차 노선 `roads`로 이어져 있어요. `[a, b, c]`는 a번과 b번 도시 사이 요금이 `c`원이라는 뜻이에요.",
    "",
    "0번 도시에서 `n - 1`번 도시로 가요. 가방에 **반값 쿠폰이 한 장** 있어서, 노선 하나의 요금을 `c // 2`원(소수점 아래 버림)으로 낼 수 있어요. 쿠폰은 안 써도 돼요.",
    "",
    "내는 요금 합의 **최솟값**을 반환해 주세요. 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 도시 수, `roads`: `[a, b, c]` 노선 목록이에요.",
  outputFormat: "요금 합의 최솟값 (갈 수 없으면 -1)",
  constraints: ["1 ≤ n ≤ 10,000", "0 ≤ roads의 길이 ≤ 30,000", "0 ≤ a, b < n, a ≠ b", "1 ≤ c ≤ 1,000"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "도시 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 비용] 양방향 길",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "요금 합의 최솟값" },
  },
  starterCode: {
    python: ["def solution(n, roads):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] roads) {",
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
        4,
        [
          [0, 1, 10],
          [1, 3, 10],
          [0, 2, 3],
          [2, 3, 15],
        ],
      ],
      expected: 10,
      explanation: "0 → 2 → 3에서 15원 노선에 쿠폰을 쓰면 3 + 7 = 10원이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [2, [[0, 1, 9]]],
      expected: 4,
      explanation: "노선 하나에 쿠폰을 써서 9 // 2 = 4원이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [1, []],
      expected: 0,
      failureNote: "이미 도착해 있어서 0원이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [3, [[0, 1, 2]]],
      expected: -1,
      failureNote: "2번 도시로 가는 노선이 없어 -1이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        4,
        [
          [0, 1, 2],
          [1, 2, 2],
          [2, 3, 2],
          [0, 3, 9],
        ],
      ],
      expected: 4,
      failureNote:
        "쿠폰 없이는 2 + 2 + 2 = 6원 길이 싸지만, 곧장 가는 9원에 쿠폰을 쓰면 4원이에요. 쿠폰 없는 최단 경로에 쿠폰을 쓰면(5원) 틀려요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "basic",
      args: [
        3,
        [
          [0, 1, 1],
          [1, 2, 20],
          [0, 2, 30],
        ],
      ],
      expected: 11,
      failureNote: "0 → 1 → 2에서 20원에 쿠폰을 써 1 + 10 = 11원이에요.",
    },
    {
      id: "hid-5",
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
      ],
      expected: 1803,
      failureNote:
        "도시 1만 개, 노선 3만 개예요. 노선마다 쿠폰을 써 보고 다익스트라를 다시 돌리면 3만 번이라 너무 느려요.",
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
        "최소 요금 → 다익스트라. 그런데 '쿠폰을 썼는지'에 따라 앞으로 낼 수 있는 요금이 달라요 → **상태를 더한 다익스트라**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`(도시, used)`를 하나의 노드로 봐요. `used`는 쿠폰을 이미 썼으면 1, 아니면 0이에요.",
        "",
        "- `(v, used)` → `(w, used)`: 요금 `c`",
        "- `(v, 0)` → `(w, 1)`: 요금 `c // 2` (여기서 쿠폰을 써요)",
        "",
        "노드가 2배인 그래프에서 다익스트라를 돌리고, `dist[n-1][0]`과 `dist[n-1][1]` 중 작은 값이 답이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dist[0][0] = 0;  heap = [(0, 0, 0)]",
        "while heap:",
        "    d, v, used = pop(heap)",
        "    if d > dist[v][used]: continue",
        "    for (w, c) in graph[v]:",
        "        relax(w, used, d + c)",
        "        if used == 0: relax(w, 1, d + c // 2)",
        "return min(dist[n-1][0], dist[n-1][1])",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["쿠폰을 쓰는 이동을 넣는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for w, c in graph[v]:",
            "    relax(d + c, w, used)",
            "    if used == 0:",
            "        relax(______, w, 1)",
          ].join("\n"),
          javascript: [
            "for (const [w, c] of graph[v]) {",
            "  relax(d + c, w, used);",
            "  if (used === 0) relax(______, w, 1);",
            "}",
          ].join("\n"),
          java: [
            "for (int[] x : graph.get(v)) {",
            "    relax(d + x[1], x[0], used);",
            "    if (used == 0) relax(______, x[0], 1);",
            "}",
          ].join("\n"),
        },
        caption: "dist[도시][used]: used는 쿠폰을 썼으면 1이에요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["state-dijkstra"],
  signalIds: ["sig-route-with-state"],
  estimatedMinutes: 22,
  xp: 40,
};
