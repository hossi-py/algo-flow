import type { Problem } from "@/types/content";

export const simLadder: Problem = {
  id: "c:sim-ladder",
  slug: "sim-ladder",
  source: "curated",
  topic: "implementation",
  level: 5,
  title: "사다리 타기",
  summary: "가로줄을 높이 순서로 보며 '지금 그 자리에 누가 있는지'만 바꾸면, 모든 출발점을 한 번에 따라가요",
  statement: [
    "세로줄 `n`개가 `0`번부터 `n − 1`번까지 나란히 있어요. `bars`의 `[row, col]`은 높이 `row`에서 `col`번과 `col + 1`번 세로줄을 잇는 가로줄이에요.",
    "",
    "각 세로줄 맨 위에서 출발해 아래로 내려가다가, 가로줄을 만나면 반드시 건너가요. 높이가 같은 가로줄끼리는 세로줄을 함께 쓰지 않아요.",
    "",
    "`i`번에서 출발하면 맨 아래에서 몇 번 세로줄에 닿는지, `i` 순서대로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 세로줄 수, `bars`: `[row, col]` 가로줄 목록(순서는 뒤섞여 있을 수 있어요)이에요.",
  outputFormat: "출발점마다 도착하는 세로줄 번호",
  constraints: ["2 ≤ n ≤ 1,000", "0 ≤ bars의 길이 ≤ 100,000", "1 ≤ row ≤ 10⁹", "0 ≤ col ≤ n − 2"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "세로줄 수" },
      {
        name: "bars",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[높이, 왼쪽 세로줄] 가로줄",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "출발점마다 도착점" },
  },
  starterCode: {
    python: ["def solution(n, bars):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, bars) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int n, int[][] bars) {",
      "        int[] answer = new int[n];",
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
          [1, 0],
          [2, 1],
        ],
      ],
      expected: [2, 0, 1],
      explanation: "0번은 1번으로 건너갔다가 2번으로 가요: [2, 0, 1].",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [2, []],
      expected: [0, 1],
      explanation: "가로줄이 없으면 그대로 [0, 1]이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        2,
        [
          [5, 0],
          [1, 0],
        ],
      ],
      expected: [0, 1],
      failureNote: "가로줄은 높이 순서로 만나요. 두 번 건너면 제자리라 [0, 1]이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        4,
        [
          [1, 0],
          [1, 2],
        ],
      ],
      expected: [1, 0, 3, 2],
      failureNote: "같은 높이의 두 가로줄을 동시에 건너 [1, 0, 3, 2]예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        3,
        [
          [10, 1],
          [3, 0],
          [1000000000, 0],
        ],
      ],
      expected: [2, 1, 0],
      failureNote: "높이 3, 10, 10억 순서로 만나요. 0번은 1 → 2, 1번은 0 → 1, 2번은 1 → 0으로 가서 [2, 1, 0]이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        1000,
        Array.from({ length: 50000 }, (_, i) => {
          const row = ((i * 7919) % 50000) + 1;
          return [row, (row * 31) % 999];
        }),
      ],
      expected: (() => {
        const at = Array.from({ length: 1000 }, (_, i) => i);
        for (let row = 1; row <= 50000; row++) {
          const c = (row * 31) % 999;
          const t = at[c];
          at[c] = at[c + 1];
          at[c + 1] = t;
        }
        const res = new Array(1000).fill(0);
        at.forEach((s, c) => {
          res[s] = c;
        });
        return res;
      })(),
      failureNote: "세로줄 1,000개, 가로줄 5만 개예요. 출발점마다 가로줄을 모두 훑으면 5천만 번이에요.",
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
        "사다리를 규칙대로 따라가는 **시뮬레이션**이에요. 출발점마다 따로 따라가면 느리니, 모두를 한꺼번에 움직여요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 가로줄을 **높이 순서로 정렬**해요.",
        "2. `at[col]` = 지금 `col`번 세로줄에 있는 출발점이에요. 처음엔 `at[i] = i`예요.",
        "3. 가로줄 `[row, col]`을 만나면 `col`번과 `col + 1`번에 있던 두 출발점이 **자리를 바꿔요**: `at[col]`과 `at[col + 1]`을 바꿔요.",
        "4. 다 보고 나면 `at[col] = i`인 출발점 i의 도착점이 `col`이에요.",
        "",
        "정렬 `O(B log B)` + 가로줄마다 `O(1)`이라 빨라요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "at = [0, 1, ..., n-1]",
        "for row, col in bars를 row 순으로:",
        "    at[col], at[col + 1] = at[col + 1], at[col]",
        "for col in range(n): answer[at[col]] = col",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["마지막에 답을 적는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["answer = [0] * n", "for col in range(n):", "    answer[______] = col"].join("\n"),
          javascript: [
            "const answer = new Array(n).fill(0);",
            "for (let col = 0; col < n; col++) answer[______] = col;",
          ].join("\n"),
          java: ["int[] answer = new int[n];", "for (int col = 0; col < n; col++) answer[______] = col;"].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["step-simulation"],
  signalIds: ["sig-follow-rules"],
  estimatedMinutes: 18,
  xp: 50,
};
