import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const mstMinCable: Problem = {
  id: "c:mst-min-cable",
  slug: "mst-min-cable",
  source: "curated",
  topic: "graph-advanced",
  level: 3,
  title: "모든 집에 인터넷을",
  summary: "싼 케이블부터 보며, 아직 이어지지 않은 두 집만 이어요 (크루스칼)",
  statement: [
    "집 `n`채가 있어요. `cables`의 `[a, b, c]`는 a번과 b번 집을 비용 `c`로 이을 수 있는 케이블이에요.",
    "",
    "모든 집이 케이블을 따라 서로 이어지도록 케이블을 골라 깔 때, 드는 **비용 합의 최솟값**을 반환해 주세요. 어떻게 해도 모두 이을 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 집 수, `cables`: `[a, b, c]` 케이블 후보예요.",
  outputFormat: "비용 합의 최솟값 (못 이으면 -1)",
  constraints: ["1 ≤ n ≤ 10,000", "0 ≤ cables의 길이 ≤ 50,000", "0 ≤ a, b < n, a ≠ b", "1 ≤ c ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "집 수" },
      {
        name: "cables",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 비용] 케이블 후보",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "비용 합의 최솟값" },
  },
  starterCode: {
    python: ["def solution(n, cables):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, cables) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] cables) {",
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
          [0, 1, 1],
          [1, 2, 2],
          [2, 3, 1],
          [0, 3, 4],
          [0, 2, 3],
        ],
      ],
      expected: 4,
      explanation: "0-1(1), 2-3(1), 1-2(2)를 골라 4예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [3, [[0, 1, 5]]],
      expected: -1,
      explanation: "2번 집에 닿는 케이블이 없어서 -1이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [1, []],
      expected: 0,
      failureNote: "집이 하나면 깔 게 없어서 0이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        2,
        [
          [0, 1, 7],
          [0, 1, 3],
        ],
      ],
      expected: 3,
      failureNote: "같은 두 집 사이 후보가 둘이면 싼 3만 골라요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        4,
        [
          [0, 1, 10],
          [1, 2, 1],
          [2, 3, 1],
          [3, 0, 1],
        ],
      ],
      expected: 3,
      failureNote: "1 + 1 + 1 = 3이에요. 10짜리는 고리만 만들어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        10000,
        [
          ...Array.from({ length: 9999 }, (_, i) => [i, i + 1, 10000]),
          ...Array.from({ length: 40000 }, (_, i) => {
            const a = (i * 104729) % 10000;
            const b = (a + 1 + ((i * 7907) % 9999)) % 10000;
            return [a, b, ((i * 7919) % 10000) + 1];
          }),
        ],
      ],
      expected: 25120451,
      failureNote: "집 1만 채, 후보 5만 개예요.",
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
        "**모든 곳을 잇는** 최소 비용 → **최소 신장 트리**, 크루스칼이에요. (두 곳 사이 최단 경로가 아니에요)",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 케이블을 비용이 싼 순서로 정렬해요.",
        "2. 싼 것부터 보며 두 집이 **다른 그룹**이면 잇고(union) 비용을 더해요. 같은 그룹이면 고리만 생기니 건너뛰어요.",
        "3. 케이블을 `n − 1`개 골랐으면 모두 이어진 거예요. 끝까지 못 고르면 -1이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "cables.sort(key=비용)",
        "for a, b, c in cables:",
        "    if union(a, b): total += c;  picked += 1",
        "return total if picked == n - 1 else -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["싼 케이블부터 고르는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for a, b, c in sorted(cables, key=lambda x: x[2]):",
            "    if ______:",
            "        total += c",
            "        picked += 1",
          ].join("\n"),
          javascript: [
            "for (const [a, b, c] of [...cables].sort((x, y) => x[2] - y[2])) {",
            "  if (______) {",
            "    total += c;",
            "    picked++;",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "int[][] sorted = cables.clone();",
            "Arrays.sort(sorted, (x, y) -> Integer.compare(x[2], y[2]));",
            "for (int[] e : sorted) {",
            "    if (______) {",
            "        total += e[2];",
            "        picked++;",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["minimum-spanning-tree"],
  signalIds: ["sig-connect-all-cheap"],
  visualization: {
    presets: [
      problemPreset(
        "mst-min-cable-ex1",
        "mst-kruskal",
        "싼 케이블부터 잇기",
        "1, 1, 2짜리를 고르면 모두 이어져요. 3과 4짜리는 고리만 만들어 건너뛰어요.",
        [
          4,
          [
            [0, 1, 1],
            [1, 2, 2],
            [2, 3, 1],
            [0, 3, 4],
            [0, 2, 3],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 15,
  xp: 30,
};
