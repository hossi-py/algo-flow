import type { Problem } from "@/types/content";

export const dijkstraPartyRoundtrip: Problem = {
  id: "c:dijkstra-party-roundtrip",
  slug: "dijkstra-party-roundtrip",
  source: "curated",
  topic: "dijkstra",
  level: 3,
  title: "파티에 갔다 돌아오기",
  summary: "모두가 한 곳으로 가는 시간은 간선을 뒤집은 그래프에서 한 번에 구해요",
  statement: [
    "마을 `n`개가 한쪽 방향 길 `roads`로 이어져 있어요. `[a, b, t]`는 **a번에서 b번으로만** 갈 수 있고 `t`분 걸린다는 뜻이에요.",
    "",
    "오늘 `x`번 마을에서 파티가 열려요. 모든 마을의 친구가 각자 가장 빠른 길로 `x`번에 갔다가, 다시 가장 빠른 길로 자기 마을에 돌아와요. (가는 길과 오는 길은 다를 수 있어요)",
    "",
    "오가는 데 **가장 오래 걸리는 친구**의 시간을 반환해 주세요. 어느 마을에서든 `x`번에 갔다 올 수 있어요.",
  ].join("\n"),
  inputFormat: "`n`: 마을 수, `roads`: `[a, b, t]` 한쪽 방향 길, `x`: 파티 마을이에요.",
  outputFormat: "가장 오래 걸리는 친구의 왕복 시간",
  constraints: [
    "1 ≤ n ≤ 10,000",
    "0 ≤ roads의 길이 ≤ 30,000",
    "0 ≤ a, b < n, a ≠ b",
    "1 ≤ t ≤ 1,000",
    "모든 마을에서 x번에 갔다 올 수 있어요",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "마을 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, t] 한쪽 방향 길",
      },
      { name: "x", type: { python: "int", javascript: "number", java: "int" }, description: "파티 마을" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "가장 긴 왕복 시간" },
  },
  starterCode: {
    python: ["def solution(n, roads, x):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads, x) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] roads, int x) {",
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
          [0, 1, 4],
          [0, 2, 2],
          [0, 3, 7],
          [1, 0, 1],
          [1, 2, 5],
          [2, 0, 1],
          [2, 3, 4],
          [3, 1, 3],
        ],
        1,
      ],
      expected: 10,
      explanation: "3번 친구가 가는 데 3분, 오는 데 1 → 0 → 2 → 3으로 1 + 2 + 4 = 7분, 합 10분으로 가장 길어요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [1, [], 0],
      expected: 0,
      explanation: "파티 마을 한 곳뿐이면 0이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        3,
        [
          [0, 1, 1],
          [1, 2, 1],
          [2, 0, 1],
        ],
        0,
      ],
      expected: 3,
      failureNote: "한 방향 고리예요. 1번은 가는 데 2분, 오는 데 1분 → 3분. 2번도 3분이라 3이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        2,
        [
          [0, 1, 5],
          [1, 0, 7],
        ],
        1,
      ],
      expected: 12,
      failureNote: "0번 친구가 5분 가고 7분 와서 12예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        3,
        [
          [0, 1, 10],
          [1, 0, 10],
          [0, 2, 1],
          [2, 1, 1],
          [1, 2, 20],
          [2, 0, 1],
        ],
        1,
      ],
      expected: 12,
      failureNote:
        "0번은 0 → 2 → 1(2분), 1 → 0(10분)으로 12예요. 2번은 1분 가고 1 → 0 → 2로 11분 와서 12예요. 답은 12예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        10000,
        [
          ...Array.from({ length: 10000 }, (_, i) => [i, (i + 1) % 10000, 1000]),
          ...Array.from({ length: 20000 }, (_, i) => {
            const a = (i * 7907) % 10000;
            const b = (a + 1 + ((i * 104729) % 9999)) % 10000;
            return [a, b, ((i * 7919) % 1000) + 1];
          }),
        ],
        123,
      ],
      expected: 11962,
      failureNote: "마을 1만 개예요. 마을마다 다익스트라를 한 번씩 돌리면 1만 번이라 너무 느려요.",
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
        "비용이 다른 길의 최단 시간 → 다익스트라. 그런데 '**모두가 한 곳으로**' 가는 시간이 필요해요 → **간선을 뒤집은 그래프**를 떠올려요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "- **오는 길** (x → 각 마을): 원래 그래프에서 `x`로 다익스트라 한 번.",
        "- **가는 길** (각 마을 → x): 모든 길을 **뒤집은** 그래프에서 `x`로 다익스트라 한 번. 뒤집은 그래프에서 x → v의 최단 거리가 원래 그래프의 v → x예요.",
        "",
        "두 결과를 더한 값의 최댓값이 답이에요. 다익스트라는 두 번만 돌려요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "graph[a].append((b, t));  reverse[b].append((a, t))",
        "back = dijkstra(graph, x)     # x → v",
        "go = dijkstra(reverse, x)     # v → x",
        "return max(go[v] + back[v])",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["뒤집은 그래프를 만드는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for a, b, t in roads:",
            "    graph[a].append((b, t))",
            "    reverse[______].append((______, t))",
          ].join("\n"),
          javascript: [
            "for (const [a, b, t] of roads) {",
            "  graph[a].push([b, t]);",
            "  reverse[______].push([______, t]);",
            "}",
          ].join("\n"),
          java: [
            "for (int[] r : roads) {",
            "    graph.get(r[0]).add(new int[] {r[1], r[2]});",
            "    reverse.get(______).add(new int[] {______, r[2]});",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["reverse-or-multi-source"],
  signalIds: ["sig-weighted-route"],
  estimatedMinutes: 20,
  xp: 30,
};
