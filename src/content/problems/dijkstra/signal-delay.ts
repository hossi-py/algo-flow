import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      4,
      [
        [1, 0, 1],
        [1, 2, 1],
        [2, 3, 1],
      ],
      1,
    ],
    expected: 2,
    explanation: "0번과 2번은 1초, 3번은 2초에 받아요. 가장 늦은 2초예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [2, [[0, 1, 1]], 1],
    expected: -1,
    explanation: "1번에서 0번으로 가는 연결이 없어서 -1이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1, [], 0],
    expected: 0,
    failureNote: "봉화대가 하나면 바로 0초예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      3,
      [
        [0, 1, 10],
        [0, 2, 1],
        [2, 1, 2],
      ],
      0,
    ],
    expected: 3,
    failureNote: "1번은 곧장 10초보다 2번을 거쳐 3초가 빨라요. 답은 3이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      3,
      [
        [1, 0, 1],
        [2, 1, 1],
      ],
      0,
    ],
    expected: -1,
    failureNote: "연결이 모두 거꾸로라 0번에서는 아무 데도 못 가요. -1이에요.",
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
      0,
    ],
    expected: 5467,
    failureNote: "봉화대 1만 개, 연결 3만 개예요.",
  },
]);

export const dijkstraSignalDelay: Problem = {
  id: "c:dijkstra-signal-delay",
  slug: "dijkstra-signal-delay",
  source: "curated",
  topic: "dijkstra",
  level: 1,
  title: "봉화 신호 퍼뜨리기",
  summary: "한쪽 방향 신호가 모든 봉화대에 닿는 시간은 가장 늦게 닿는 곳의 최단 시간이에요",
  statement: [
    "봉화대 `n`개가 `0`번부터 `n - 1`번까지 있어요. `links`의 `[a, b, t]`는 a번 봉화대의 불빛이 **b번 쪽으로만** 보이고, 신호가 닿는 데 `t`초 걸린다는 뜻이에요.",
    "",
    "`start`번 봉화대에서 신호를 올리면, 신호를 받은 봉화대도 곧바로 불을 올려요.",
    "",
    "**모든 봉화대**가 신호를 받는 데 걸리는 시간을 반환해 주세요. 끝내 신호를 못 받는 봉화대가 있으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 봉화대 수, `links`: `[a, b, t]` 한쪽 방향 연결, `start`: 처음 불을 올리는 봉화대예요.",
  outputFormat: "모든 봉화대가 신호를 받는 시간 (못 받는 곳이 있으면 -1)",
  constraints: ["1 ≤ n ≤ 10,000", "0 ≤ links의 길이 ≤ 30,000", "0 ≤ a, b < n, a ≠ b", "1 ≤ t ≤ 1,000", "0 ≤ start < n"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "봉화대 수" },
      {
        name: "links",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, t] 한쪽 방향 연결",
      },
      { name: "start", type: { python: "int", javascript: "number", java: "int" }, description: "처음 봉화대" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "모두 신호를 받는 시간" },
  },
  starterCode: {
    python: ["def solution(n, links, start):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, links, start) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] links, int start) {",
      "        int answer = 0;",
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
        "연결마다 걸리는 시간이 달라요. 신호는 모든 길로 동시에 퍼지니, 각 봉화대가 받는 시각은 **최단 시간**이에요 → **다익스트라**",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 연결은 **한쪽 방향**이에요. `graph[a]`에만 `(b, t)`를 넣어요.",
        "2. `start`에서 다익스트라로 모든 봉화대의 최단 시간을 구해요.",
        "3. ∞가 하나라도 있으면 -1, 아니면 가장 큰 값이 답이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "graph[a].append((b, t))   # 한쪽 방향만",
        "dist = dijkstra(graph, start)",
        "if ∞ in dist: return -1",
        "return max(dist)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["마지막에 답을 고르는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["dist = dijkstra(graph, start)", "longest = max(dist)", "return -1 if ______ else longest"].join(
            "\n",
          ),
          javascript: [
            "const dist = dijkstra(graph, start);",
            "const longest = Math.max(...dist);",
            "return ______ ? -1 : longest;",
          ].join("\n"),
          java: [
            "long[] dist = dijkstra(graph, start);",
            "long longest = 0;",
            "for (long d : dist) longest = Math.max(longest, d);",
            "return ______ ? -1 : (int) longest;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["weighted-shortest-path"],
  signalIds: ["sig-weighted-route"],
  estimatedMinutes: 15,
  xp: 10,
};
