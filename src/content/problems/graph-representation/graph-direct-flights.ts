import type { Problem } from "@/types/content";

export const graphDirectFlights: Problem = {
  id: "c:graph-direct-flights",
  slug: "graph-direct-flights",
  source: "curated",
  topic: "graph-representation",
  level: 3,
  title: "직항 있나요?",
  summary: "많은 질문마다 두 도시 사이 직항이 있는지 빠르게 답해요",
  statement: [
    "노디 항공은 도시 `n`개(0번 ~ `n-1`번) 사이를 오가요. 항공편 목록 `flights`의 `[a, b]`는 **a에서 b로 가는 직항**이에요 (반대 방향은 따로 있어야 해요).",
    "",
    '여행객들의 질문 `queries`의 각 원소 `[s, t]`는 "s에서 t로 가는 직항이 있나요?"예요. 질문마다 답(`True`/`False`)을 순서대로 담은 리스트를 반환해 주세요.',
  ].join("\n"),
  inputFormat: "`n`: 도시 수, `flights`: `[a, b]` 직항 목록, `queries`: `[s, t]` 질문 목록이에요.",
  outputFormat: "질문 순서대로의 bool 리스트",
  constraints: ["2 ≤ n ≤ 500", "0 ≤ flights의 길이 ≤ 20,000", "1 ≤ queries의 길이 ≤ 100,000", "s ≠ t"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "도시 수" },
      {
        name: "flights",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "직항 목록",
      },
      {
        name: "queries",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "질문 목록",
      },
    ],
    returns: { type: { python: "list[bool]", javascript: "boolean[]", java: "boolean[]" }, description: "질문별 답" },
  },
  starterCode: {
    python: ["def solution(n, flights, queries):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, flights, queries) {", "  let answer = [];", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public boolean[] solution(int n, int[][] flights, int[][] queries) {",
      "        boolean[] answer = new boolean[queries.length];",
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
        3,
        [
          [0, 1],
          [1, 2],
        ],
        [
          [0, 1],
          [1, 0],
          [0, 2],
        ],
      ],
      expected: [true, false, false],
      explanation: "0 → 1은 있어요. 1 → 0은 반대 방향이라 없고, 0 → 2는 경유라서 직항이 아니에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        2,
        [],
        [
          [0, 1],
          [1, 0],
        ],
      ],
      expected: [false, false],
      explanation: "항공편이 없어요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [
        4,
        [
          [0, 1],
          [1, 0],
          [2, 3],
        ],
        [
          [1, 0],
          [3, 2],
          [2, 3],
        ],
      ],
      expected: [true, false, true],
      failureNote: "양방향이 모두 있는 도시와 한쪽만 있는 도시가 섞여 있어요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        3,
        [
          [0, 2],
          [0, 2],
        ],
        [
          [0, 2],
          [2, 0],
        ],
      ],
      expected: [true, false],
      failureNote: "같은 직항이 두 번 적혀 있어도 괜찮아요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        5,
        [
          [4, 0],
          [3, 1],
          [2, 4],
        ],
        [
          [4, 0],
          [0, 4],
          [2, 4],
          [3, 1],
          [1, 3],
        ],
      ],
      expected: [true, false, true, true, false],
      failureNote: "여러 질문이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "edge",
      args: [2, [[1, 0]], [[1, 0]]],
      expected: [true],
      failureNote: "질문이 하나뿐이에요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        500,
        Array.from({ length: 20000 }, (_, i) => [i % 500, ((i % 500) + 1 + Math.floor(i / 500)) % 500]),
        Array.from({ length: 100000 }, (_, i) =>
          i % 2 === 0 ? [i % 500, ((i % 500) + 1) % 500] : [((i % 500) + 1) % 500, i % 500],
        ),
      ],
      expected: Array.from({ length: 100000 }, (_, i) => i % 2 === 0 || false),
      failureNote: "직항 2만 개, 질문 10만 개예요. 질문마다 직항 목록을 훑으면 20억 번이라 시간 초과예요.",
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
        '"두 도시 사이 직항이 있나요?"를 **아주 많이** 물어봐요. 연결 여부를 O(1)에 답하려면 **인접 행렬**이 딱이에요.',
        "",
        "도시가 500개뿐이라 500 × 500 표를 만들어도 25만 칸이면 충분해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. n × n 크기의 표를 `False`로 채워요.",
        "2. 직항 `[a, b]`마다 `table[a][b] = True` (방향이 있으니 한쪽만).",
        "3. 질문 `[s, t]`마다 `table[s][t]`를 그대로 답해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "table = n × n 크기의 False 표",
        "for a, b in flights: table[a][b] = True",
        "return [table[s][t] for s, t in queries]",
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
            "table = [[False] * n for _ in range(n)]",
            "for a, b in flights:",
            "    ______",
            "return [table[s][t] for s, t in queries]",
          ].join("\n"),
          javascript: [
            "const table = Array.from({ length: n }, () => new Array(n).fill(false));",
            "for (const [a, b] of flights) ______;",
            "return queries.map(([s, t]) => table[s][t]);",
          ].join("\n"),
          java: [
            "boolean[][] table = new boolean[n][n];   // 처음엔 모두 false",
            "for (int[] f : flights) ______;",
            "boolean[] answer = new boolean[queries.length];",
            "for (int i = 0; i < queries.length; i++) answer[i] = table[queries[i][0]][queries[i][1]];",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["adjacency-matrix"],
  signalIds: ["sig-matrix-given", "sig-relations-given"],
  estimatedMinutes: 12,
  xp: 30,
};
