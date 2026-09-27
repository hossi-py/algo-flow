import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      3,
      [
        [0, 1],
        [0, 2],
        [2, 1],
      ],
    ],
    expected: [
      [2, 0],
      [0, 2],
      [1, 1],
    ],
    explanation: "0번은 나가는 길 2개, 1번은 들어오는 길 2개, 2번은 하나씩이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [2, []],
    expected: [
      [0, 0],
      [0, 0],
    ],
    explanation: "길이 없으면 모두 [0, 0]이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      2,
      [
        [0, 1],
        [1, 0],
      ],
    ],
    expected: [
      [1, 1],
      [1, 1],
    ],
    failureNote: "서로 반대 방향 길 두 개는 다른 길이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    ],
    expected: [
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
    ],
    failureNote: "한 바퀴 도는 골목이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      3,
      [
        [0, 1],
        [0, 1],
        [0, 1],
      ],
    ],
    expected: [
      [3, 0],
      [0, 3],
      [0, 0],
    ],
    failureNote: "같은 방향 길이 여러 개일 수 있어요. 모두 세요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "edge",
    args: [1, []],
    expected: [[0, 0]],
    failureNote: "교차로가 하나뿐이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      1000,
      Array.from({ length: 10000 }, (_, i) => [
        i % 1000,
        (i * 7 + 1) % 1000 === i % 1000 ? (i + 1) % 1000 : (i * 7 + 1) % 1000,
      ]),
    ],
    expected: (() => {
      const r = Array.from({ length: 1000 }, () => [0, 0]);
      for (let i = 0; i < 10000; i += 1) {
        const a = i % 1000;
        const b = (i * 7 + 1) % 1000 === a ? (i + 1) % 1000 : (i * 7 + 1) % 1000;
        r[a][0] += 1;
        r[b][1] += 1;
      }
      return r;
    })(),
    failureNote: "길이 1만 개예요.",
  },
]);

export const graphOneWayStreets: Problem = {
  id: "c:graph-one-way-streets",
  slug: "graph-one-way-streets",
  source: "curated",
  topic: "graph-representation",
  level: 1,
  title: "일방통행 골목",
  summary: "골목마다 나가는 길과 들어오는 길의 수를 세요",
  statement: [
    "노디 마을의 골목길은 모두 **일방통행**이에요. 교차로는 0번부터 `n-1`번까지 있고, 길 목록 `roads`의 `[a, b]`는 **a 교차로에서 b 교차로로만** 갈 수 있는 길이에요.",
    "",
    "교차로마다 **나가는 길의 수**와 **들어오는 길의 수**를 세어, i번째 원소가 `[i번에서 나가는 길 수, i번으로 들어오는 길 수]`인 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 교차로 수, `roads`: `[a, b]`(a → b) 길 목록이에요.",
  outputFormat: "길이 n인 리스트. 각 원소는 `[나가는 수, 들어오는 수]`예요.",
  constraints: ["1 ≤ n ≤ 1,000", "0 ≤ roads의 길이 ≤ 10,000", "0 ≤ a, b < n, a ≠ b"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "교차로 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "일방통행 길 목록",
      },
    ],
    returns: {
      type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
      description: "[나가는 수, 들어오는 수] 목록",
    },
  },
  starterCode: {
    python: ["def solution(n, roads):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[][] solution(int n, int[][] roads) {",
      "        int[][] answer = new int[n][2];",
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
        "방향이 있는 길 → **방향 그래프**예요.",
        "",
        "노드에서 나가는 간선 수를 **나가는 차수**, 들어오는 간선 수를 **들어오는 차수**라고 해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 길이 n인 `out`, `inn` 두 리스트를 0으로 채워요.",
        "2. 길 `[a, b]`마다 `out[a] += 1`, `inn[b] += 1`.",
        "3. `[out[i], inn[i]]`를 모아 반환해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "out = [0] * n, inn = [0] * n",
        "for a, b in roads:",
        "    out[a] += 1",
        "    inn[b] += 1",
        "return [[out[i], inn[i]] for i in 0..n-1]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for a, b in roads:",
            "    out[a] += 1",
            "    ______",
            "return [[out[i], inn[i]] for i in range(n)]",
          ].join("\n"),
          javascript: [
            "for (const [a, b] of roads) {",
            "  out[a] += 1;",
            "  ______;",
            "}",
            "return out.map((o, i) => [o, inn[i]]);",
          ].join("\n"),
          java: [
            "for (int[] road : roads) {",
            "    out[road[0]]++;",
            "    ______;",
            "}",
            "int[][] answer = new int[n][2];",
            "for (int i = 0; i < n; i++) answer[i] = new int[] {out[i], inn[i]};",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["degree-count"],
  signalIds: ["sig-degree"],
  estimatedMinutes: 8,
  xp: 10,
};
