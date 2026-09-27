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
        [0, 1, 3],
        [1, 2, 3],
        [2, 3, 1],
        [0, 2, 5],
        [1, 3, 5],
        [0, 3, 4],
      ],
      1,
      2,
    ],
    expected: 7,
    explanation: "0 → 1 → 2 → 3으로 3 + 3 + 1 = 7분이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [
      4,
      [
        [0, 1, 1],
        [2, 3, 1],
      ],
      1,
      2,
    ],
    expected: -1,
    explanation: "1번과 2번이 이어져 있지 않아 -1이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 1],
      ],
      2,
      1,
    ],
    expected: 3,
    failureNote: "a = 2, b = 1이지만 순서는 상관없어요. 1번 먼저 들르면 3분이에요 (2번 먼저면 5분).",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      5,
      [
        [0, 1, 1],
        [1, 2, 5],
        [1, 3, 2],
        [1, 4, 1],
      ],
      2,
      3,
    ],
    expected: 16,
    failureNote: "막다른 마을에 들렀다 되돌아와야 해요. 0 → 1 → 2 → 1 → 3 → 1 → 4로 16분이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [
      3,
      [
        [0, 1, 2],
        [1, 2, 2],
      ],
      0,
      2,
    ],
    expected: 4,
    failureNote: "출발·도착 마을도 들를 마을일 수 있어요. 4분이에요.",
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
      3333,
      6666,
    ],
    expected: 6133,
    failureNote: "마을 1만 개예요. 다익스트라는 세 번이면 충분해요.",
  },
]);

export const dijkstraMustVisit: Problem = {
  id: "c:dijkstra-must-visit",
  slug: "dijkstra-must-visit",
  source: "curated",
  topic: "dijkstra",
  level: 5,
  title: "꼭 들러야 하는 두 마을",
  summary: "출발점·두 마을에서 다익스트라를 한 번씩 돌려 두 순서를 비교해요",
  statement: [
    "마을 `n`개와 양방향 길 `roads`(`[a, b, t]`: `t`분)가 있어요.",
    "",
    "0번 마을에서 `n - 1`번 마을까지 가는데, 가는 도중에 `a`번과 `b`번 마을에 **꼭 들러야** 해요. 들르는 순서는 상관없고, 같은 마을이나 길을 여러 번 지나도 돼요.",
    "",
    "가장 빨리 도착하는 시간을 반환해 주세요. 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 마을 수, `roads`: `[a, b, t]` 길 목록, `a`와 `b`: 꼭 들를 마을이에요.",
  outputFormat: "가장 빠른 도착 시간 (갈 수 없으면 -1)",
  constraints: ["2 ≤ n ≤ 10,000", "0 ≤ roads의 길이 ≤ 30,000", "1 ≤ t ≤ 1,000", "0 ≤ a, b < n, a ≠ b"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "마을 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 비용] 양방향 길",
      },
      { name: "a", type: { python: "int", javascript: "number", java: "int" }, description: "꼭 들를 마을" },
      { name: "b", type: { python: "int", javascript: "number", java: "int" }, description: "꼭 들를 마을" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "가장 빠른 도착 시간" },
  },
  starterCode: {
    python: ["def solution(n, roads, a, b):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads, a, b) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] roads, int a, int b) {",
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
      body: ["최단 시간 → 다익스트라. 꼭 들를 곳이 있으면 길을 **구간으로 나눠** 각 구간의 최단 시간을 더해요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "들르는 순서는 두 가지뿐이에요.",
        "",
        "- 0 → a → b → 끝",
        "- 0 → b → a → 끝",
        "",
        "0번, a번, b번에서 다익스트라를 **한 번씩** 돌리면 모든 구간의 최단 시간을 알 수 있어요. (길이 양방향이라 a → b와 b → a는 같아요)",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "d0, da, db = dijkstra(0), dijkstra(a), dijkstra(b)",
        "first = d0[a] + da[b] + db[n-1]",
        "second = d0[b] + db[a] + da[n-1]",
        "answer = min(first, second)   # ∞면 -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["두 순서를 비교하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "d0, da, db = dijkstra(graph, 0), dijkstra(graph, a), dijkstra(graph, b)",
            "first = d0[a] + da[b] + db[n - 1]",
            "second = ______",
            "best = min(first, second)",
          ].join("\n"),
          javascript: [
            "const d0 = dijkstra(graph, 0), da = dijkstra(graph, a), db = dijkstra(graph, b);",
            "const first = d0[a] + da[b] + db[n - 1];",
            "const second = ______;",
            "const best = Math.min(first, second);",
          ].join("\n"),
          java: [
            "long[] d0 = dijkstra(graph, 0), da = dijkstra(graph, a), db = dijkstra(graph, b);",
            "long first = d0[a] + da[b] + db[n - 1];",
            "long second = ______;",
            "long best = Math.min(first, second);",
          ].join("\n"),
        },
        caption: "∞를 Long.MAX_VALUE / 4로 두면 세 개를 더해도 넘치지 않아요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["weighted-shortest-path"],
  signalIds: ["sig-weighted-route"],
  estimatedMinutes: 20,
  xp: 50,
};
