import type { Problem } from "@/types/content";

export const mstPowerPlants: Problem = {
  id: "c:mst-power-plants",
  slug: "mst-power-plants",
  source: "curated",
  topic: "graph-advanced",
  level: 3,
  title: "발전소가 여러 곳",
  summary: "발전소들을 처음부터 한 그룹으로 묶어 두고 크루스칼을 돌려요",
  statement: [
    "도시 `n`개 중 `plants`에 적힌 도시에는 발전소가 있어요. `cables`의 `[a, b, c]`는 a번과 b번 도시를 비용 `c`로 잇는 전선 후보예요.",
    "",
    "모든 도시가 전선을 따라 **발전소 하나 이상과** 이어지면 돼요. (발전소끼리는 이어지지 않아도 돼요)",
    "",
    "드는 비용 합의 **최솟값**을 반환해 주세요. 모든 도시에 전기를 보낼 수 있는 경우만 주어져요.",
  ].join("\n"),
  inputFormat: "`n`: 도시 수, `plants`: 발전소가 있는 도시, `cables`: `[a, b, c]` 전선 후보예요.",
  outputFormat: "비용 합의 최솟값",
  constraints: ["1 ≤ n ≤ 10,000", "1 ≤ plants의 길이 ≤ n", "0 ≤ cables의 길이 ≤ 50,000", "1 ≤ c ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "도시 수" },
      {
        name: "plants",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "발전소 도시",
      },
      {
        name: "cables",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 비용] 전선 후보",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "비용 합의 최솟값" },
  },
  starterCode: {
    python: ["def solution(n, plants, cables):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, plants, cables) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[] plants, int[][] cables) {",
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
        [0, 4],
        [
          [0, 1, 3],
          [1, 2, 1],
          [2, 3, 2],
          [3, 4, 5],
          [1, 4, 10],
        ],
      ],
      expected: 6,
      explanation: "1-2(1), 2-3(2), 0-1(3)로 1·2·3번이 0번 발전소에 이어져 6이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        3,
        [0, 1, 2],
        [
          [0, 1, 4],
          [1, 2, 4],
        ],
      ],
      expected: 0,
      explanation: "모든 도시에 발전소가 있어서 0이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        4,
        [0, 3],
        [
          [0, 1, 1],
          [1, 2, 5],
          [2, 3, 1],
          [0, 3, 1],
        ],
      ],
      expected: 2,
      failureNote: "0-1과 2-3만 이으면 돼서 2예요. 발전소끼리 잇는 0-3까지 고르는 보통 최소 신장 트리(3)는 비싸요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        3,
        [1],
        [
          [0, 1, 2],
          [1, 2, 3],
          [0, 2, 1],
        ],
      ],
      expected: 3,
      failureNote: "발전소가 하나면 보통 최소 신장 트리와 같아요: 1 + 2 = 3.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        4,
        [0, 3],
        [
          [0, 1, 5],
          [1, 2, 5],
          [2, 3, 5],
        ],
      ],
      expected: 10,
      failureNote: "1번은 0번에, 2번은 3번에 이어 10이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        10000,
        Array.from({ length: 10 }, (_, i) => i * 1000),
        [
          ...Array.from({ length: 9999 }, (_, i) => [i, i + 1, 10000]),
          ...Array.from({ length: 40000 }, (_, i) => {
            const a = (i * 7907) % 10000;
            const b = (a + 1 + ((i * 104729) % 9999)) % 10000;
            return [a, b, ((i * 7919) % 10000) + 1];
          }),
        ],
      ],
      expected: 14315551,
      failureNote: "도시 1만 개, 발전소 10곳, 후보 5만 개예요.",
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
        "모든 도시를 잇는 최소 비용 → 크루스칼. 그런데 목표가 '모두 서로'가 아니라 '**발전소 중 하나와**'예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "발전소들이 이미 **공짜 전선으로 서로 이어져 있다**고 생각해요. 크루스칼을 시작하기 전에 발전소를 모두 한 그룹으로 union해요.",
        "",
        "그러면 발전소끼리 잇는 전선은 '같은 그룹'이라 자연히 건너뛰고, 나머지는 보통 크루스칼과 같아요.",
        "",
        "가상의 도시 하나를 만들어 모든 발전소와 비용 0으로 잇는 것과 같은 생각이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for p in plants[1:]: union(plants[0], p)",
        "for a, b, c in 비용 순 cables:",
        "    if union(a, b): total += c",
        "return total",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["발전소를 먼저 묶는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for p in plants:", "    union(______, p)"].join("\n"),
          javascript: ["for (const p of plants) dsu.union(______, p);"].join("\n"),
          java: ["for (int p : plants) union(______, p);"].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["minimum-spanning-tree"],
  signalIds: ["sig-connect-all-cheap"],
  estimatedMinutes: 18,
  xp: 30,
};
