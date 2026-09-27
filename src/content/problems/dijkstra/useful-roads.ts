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
        [0, 1, 1],
        [0, 2, 1],
        [1, 3, 1],
        [2, 3, 1],
        [1, 2, 5],
      ],
    ],
    expected: 4,
    explanation: "가장 빠른 길은 0 → 1 → 3과 0 → 2 → 3이에요. 1번과 2번을 잇는 도로만 빼고 4개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [
      3,
      [
        [0, 1, 2],
        [1, 2, 2],
        [0, 2, 4],
      ],
    ],
    expected: 3,
    explanation: "곧장 가도, 1번을 거쳐도 4분이라 도로 3개 모두 쓰여요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      2,
      [
        [0, 1, 1],
        [0, 1, 2],
      ],
    ],
    expected: 1,
    failureNote: "같은 두 마을 사이라도 느린 도로는 안 쓰여서 1이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [3, [[0, 1, 1]]],
    expected: 0,
    failureNote: "2번에 갈 수 없어서 0이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 1, 1],
        [0, 2, 1],
        [1, 3, 1],
        [2, 3, 1],
        [1, 2, 1],
      ],
    ],
    expected: 4,
    failureNote:
      "1번과 2번은 모두 가장 빠른 길 위에 있지만, 둘을 잇는 도로는 어느 가장 빠른 길에도 안 쓰여요. 답은 4예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      10000,
      [
        ...[
          ...Array.from({ length: 9900 }, (_, i) => [i, i + 100, 1]),
          ...Array.from({ length: 10000 }, (_, i) => i)
            .filter((i) => i % 100 !== 99)
            .map((i) => [i, i + 1, 1]),
        ],
        ...Array.from({ length: 9801 }, (_, i) => i)
          .filter((i) => i % 100 !== 99)
          .map((i) => [i, i + 101, 3]),
      ],
    ],
    expected: 19800,
    failureNote:
      "100 × 100 격자 모양 도로에 대각선 지름길(3분)을 더했어요. 대각선은 옆·아래 두 번(2분)보다 느려서 안 쓰여요.",
  },
]);

export const dijkstraUsefulRoads: Problem = {
  id: "c:dijkstra-useful-roads",
  slug: "dijkstra-useful-roads",
  source: "curated",
  topic: "dijkstra",
  level: 5,
  title: "가장 빠른 길에 쓰이는 도로",
  summary: "양 끝에서 다익스트라를 돌리면, 도로 하나가 최단 경로 위에 있는지 바로 알 수 있어요",
  statement: [
    "마을 `n`개와 양방향 도로 `roads`(`[a, b, t]`: `t`분)가 있어요.",
    "",
    "0번 마을에서 `n - 1`번 마을까지 가장 빨리 가는 길은 여러 가지일 수 있어요. 그중 **적어도 한 길에 쓰이는 도로**는 몇 개인지 반환해 주세요.",
    "",
    "0번에서 `n - 1`번으로 갈 수 없으면 `0`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 마을 수, `roads`: `[a, b, t]` 도로 목록이에요.",
  outputFormat: "가장 빠른 길에 쓰이는 도로 수",
  constraints: [
    "2 ≤ n ≤ 10,000",
    "0 ≤ roads의 길이 ≤ 30,000",
    "0 ≤ a, b < n, a ≠ b",
    "1 ≤ t ≤ 1,000",
    "같은 두 마을을 잇는 도로가 여러 개일 수 있어요 (따로 세요)",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "마을 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 비용] 양방향 길",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "쓰이는 도로 수" },
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
        "최단 시간 → 다익스트라. '이 도로가 최단 경로 위에 있나?'는 **양 끝에서 다익스트라**를 돌리면 바로 알 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "- `ds` = 0번에서의 최단 시간, `de` = `n - 1`번에서의 최단 시간, `D = ds[n - 1]`이에요.",
        "- 도로 `(u, v, t)`가 어떤 가장 빠른 길에 쓰이려면, 0 → u → v → 끝으로 가는 시간이 딱 `D`여야 해요.",
        "",
        "`ds[u] + t + de[v] == D` 또는 `ds[v] + t + de[u] == D`이면 세요. (도로는 양방향이라 두 방향을 모두 봐요)",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "ds = dijkstra(0);  de = dijkstra(n - 1);  D = ds[n - 1]",
        "if D == ∞: return 0",
        "count = 0",
        "for (u, v, t) in roads:",
        "    if ds[u] + t + de[v] == D or ds[v] + t + de[u] == D: count += 1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["도로 하나를 확인하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for u, v, t in roads:", "    if ds[u] + t + de[v] == D or ______:", "        count += 1"].join(
            "\n",
          ),
          javascript: [
            "for (const [u, v, t] of roads) {",
            "  if (ds[u] + t + de[v] === D || ______) count++;",
            "}",
          ].join("\n"),
          java: [
            "for (int[] r : roads) {",
            "    int u = r[0], v = r[1], t = r[2];",
            "    if (ds[u] + t + de[v] == total || ______) count++;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["path-restore"],
  signalIds: ["sig-weighted-route"],
  estimatedMinutes: 22,
  xp: 50,
};
