import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [1, 2],
        [3, 4],
      ],
      1,
    ],
    expected: [
      [3, 1],
      [4, 2],
    ],
    explanation: "[[3, 1], [4, 2]]예요. 맨 위 줄이 맨 오른쪽 열이 돼요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      1,
    ],
    expected: [
      [4, 1],
      [5, 2],
      [6, 3],
    ],
    explanation: "2 × 3 판이 3 × 2 판 [[4, 1], [5, 2], [6, 3]]이 돼요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      0,
    ],
    expected: [
      [1, 2, 3],
      [4, 5, 6],
    ],
    failureNote: "돌리지 않으면 그대로예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      2,
    ],
    expected: [
      [6, 5, 4],
      [3, 2, 1],
    ],
    failureNote: "180도면 [[6, 5, 4], [3, 2, 1]]이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        [1, 2],
        [3, 4],
      ],
      1000000000,
    ],
    expected: [
      [1, 2],
      [3, 4],
    ],
    failureNote: "10억은 4의 배수라 제자리예요. 한 번씩 10억 번 돌리면 끝나지 않아요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [[[7]], 3],
    expected: [[7]],
    failureNote: "한 칸은 돌려도 [[7]]이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 200 }, (_, r) => Array.from({ length: 150 }, (_, c) => ((r * 31 + c * 17) % 199) - 99)),
      999999999,
    ],
    expected: (() => {
      const a = Array.from({ length: 200 }, (_, r) =>
        Array.from({ length: 150 }, (_, c) => ((r * 31 + c * 17) % 199) - 99),
      );
      const n = a.length,
        m = a[0].length;
      return Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => a[j][m - 1 - i]));
    })(),
    failureNote: "200 × 150 판을 999,999,999번(= 반시계 90도 한 번) 돌려요.",
  },
]);

export const simRotateMatrix: Problem = {
  id: "c:sim-rotate-matrix",
  slug: "sim-rotate-matrix",
  source: "curated",
  topic: "implementation",
  level: 2,
  title: "타일판 돌리기",
  summary: "칸 a[r][c]가 돌린 판의 b[c][n − 1 − r]로 가요. k번은 k % 4번만 돌리면 돼요",
  statement: [
    "`n`줄 `m`칸짜리 타일판 `matrix`를 **시계 방향으로 90도씩 `k`번** 돌린 결과를 반환해 주세요.",
    "",
    "90도 돌리면 판은 `m`줄 `n`칸이 돼요.",
  ].join("\n"),
  inputFormat: "`matrix`: 타일판, `k`: 돌리는 횟수예요.",
  outputFormat: "돌린 판",
  constraints: ["1 ≤ n, m ≤ 200", "−99 ≤ 칸 ≤ 99", "0 ≤ k ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "matrix",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "타일판",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "돌리는 횟수" },
    ],
    returns: { type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" }, description: "돌린 판" },
  },
  starterCode: {
    python: ["def solution(matrix, k):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(matrix, k) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[][] solution(int[][] matrix, int k) {",
      "        int[][] answer = matrix;",
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
      body: ["판을 **돌리는** 구현이에요. 칸 하나가 어디로 가는지 식으로 적으면 돼요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "시계 방향 90도: n × m 판 a가 m × n 판 b가 되고, `b[c][n − 1 − r] = a[r][c]`예요.",
        "",
        "네 번 돌리면 제자리라 `k % 4`번만 돌려요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "repeat k % 4 번:",
        "    n, m = 판의 줄 수, 칸 수",
        "    b = m × n 판",
        "    for r, c: b[c][n - 1 - r] = a[r][c]",
        "    a = b",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["한 번 돌리는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "b = [[0] * n for _ in range(m)]",
            "for r in range(n):",
            "    for c in range(m):",
            "        b[c][______] = a[r][c]",
          ].join("\n"),
          javascript: [
            "const b = Array.from({ length: m }, () => new Array(n).fill(0));",
            "for (let r = 0; r < n; r++)",
            "  for (let c = 0; c < m; c++) b[c][______] = a[r][c];",
          ].join("\n"),
          java: [
            "int[][] b = new int[m][n];",
            "for (int r = 0; r < n; r++)",
            "    for (int c = 0; c < m; c++) b[c][______] = a[r][c];",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["matrix-transform"],
  signalIds: ["sig-direction-turn"],
  visualization: {
    presets: [
      problemPreset(
        "sim-rotate-matrix-ex2",
        "sim-rotate",
        "칸마다 새 자리로",
        "a[r][c]를 b[c][n − 1 − r]로 옮기면 2 × 3 판이 3 × 2 판이 돼요.",
        [
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
