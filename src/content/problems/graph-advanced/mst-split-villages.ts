import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      7,
      [
        [0, 1, 3],
        [0, 2, 2],
        [2, 1, 1],
        [1, 4, 2],
        [2, 3, 4],
        [6, 2, 6],
        [4, 0, 5],
        [0, 5, 2],
        [5, 3, 1],
        [5, 4, 3],
        [3, 4, 3],
        [5, 6, 4],
      ],
    ],
    expected: 8,
    explanation: "최소 신장 트리 비용은 12이고, 그중 가장 비싼 길(4)을 빼면 8이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [2, [[0, 1, 5]]],
    expected: 0,
    explanation: "두 집이면 길을 없애고 한 채씩 두 마을이라 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [
      3,
      [
        [0, 1, 1],
        [1, 2, 2],
        [0, 2, 3],
      ],
    ],
    expected: 1,
    failureNote: "최소 신장 트리 1 + 2에서 2를 빼 1이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 100],
        [0, 3, 100],
      ],
    ],
    expected: 2,
    failureNote: "3번 집만 따로 한 마을로 두면 돼서 2예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1, 5],
        [1, 2, 5],
        [2, 3, 5],
        [3, 0, 5],
      ],
    ],
    expected: 10,
    failureNote: "5 × 3 − 5 = 10이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      10000,
      [
        ...Array.from({ length: 9999 }, (_, i) => [i, i + 1, 1000]),
        ...Array.from({ length: 40000 }, (_, i) => {
          const a = (i * 104729) % 10000;
          const b = (a + 1 + ((i * 7907) % 9999)) % 10000;
          return [a, b, ((i * 7919) % 1000) + 1];
        }),
      ],
    ],
    expected: 1347108,
    failureNote: "집 1만 채, 길 5만 개예요.",
  },
]);

export const mstSplitVillages: Problem = {
  id: "c:mst-split-villages",
  slug: "mst-split-villages",
  source: "curated",
  topic: "graph-advanced",
  level: 3,
  title: "마을을 둘로 나누기",
  summary: "최소 신장 트리에서 가장 비싼 길 하나를 빼면 두 마을로 나뉘어요",
  statement: [
    "집 `n`채가 길 `roads`로 이어져 있어요. `[a, b, c]`는 a번과 b번 집 사이 길을 지키는 데 해마다 `c`원이 든다는 뜻이에요.",
    "",
    "이 동네를 **두 마을**로 나누려고 해요. 마을마다 집이 한 채 이상 있어야 하고, 한 마을 안의 집은 남긴 길로 서로 오갈 수 있어야 해요. 두 마을 사이 길과 필요 없는 길은 모두 없애요.",
    "",
    "남긴 길을 지키는 비용 합의 **최솟값**을 반환해 주세요. 처음 동네는 모두 이어져 있어요.",
  ].join("\n"),
  inputFormat: "`n`: 집 수, `roads`: `[a, b, c]` 길 목록이에요.",
  outputFormat: "남긴 길 비용 합의 최솟값",
  constraints: ["2 ≤ n ≤ 10,000", "n − 1 ≤ roads의 길이 ≤ 50,000", "1 ≤ c ≤ 1,000", "처음 동네는 모두 이어져 있어요"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "집 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 비용] 길",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "비용 합의 최솟값" },
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
      body: ["남긴 길로 마을이 **이어져 있어야** 하고 비용이 최소 → 최소 신장 트리(크루스칼)를 조금 바꿔요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "먼저 동네 전체의 최소 신장 트리를 만들어요. 트리에서 길 하나를 빼면 정확히 **두 덩어리**로 나뉘어요.",
        "",
        "비용을 가장 많이 줄이려면 트리에서 **가장 비싼 길**을 빼면 돼요.",
        "",
        "크루스칼은 싼 길부터 고르니, 마지막에 고른 길이 트리에서 가장 비싸요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for a, b, c in 비용 순 roads:",
        "    if union(a, b): total += c;  biggest = c",
        "return total - biggest",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["마지막 계산 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for a, b, c in sorted(roads, key=lambda x: x[2]):",
            "    if union(a, b):",
            "        total += c",
            "        biggest = c",
            "return ______",
          ].join("\n"),
          javascript: [
            "for (const [a, b, c] of [...roads].sort((x, y) => x[2] - y[2])) {",
            "  if (dsu.union(a, b)) {",
            "    total += c;",
            "    biggest = c;",
            "  }",
            "}",
            "return ______;",
          ].join("\n"),
          java: [
            "for (int[] e : sorted) {",
            "    if (union(e[0], e[1])) {",
            "        total += e[2];",
            "        biggest = e[2];",
            "    }",
            "}",
            "return ______;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["minimum-spanning-tree"],
  signalIds: ["sig-connect-all-cheap"],
  estimatedMinutes: 15,
  xp: 30,
};
