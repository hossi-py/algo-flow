import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const simSpiralFill: Problem = {
  id: "c:sim-spiral-fill",
  slug: "sim-spiral-fill",
  source: "curated",
  topic: "implementation",
  level: 2,
  title: "달팽이 숫자판",
  summary: "오른쪽으로 가다가 판 끝이나 이미 채운 칸을 만나면 오른쪽으로 돌아요",
  statement: [
    "`n`줄 `m`칸짜리 빈 판의 **왼쪽 위**에서 출발해 1, 2, 3, …을 차례로 적어요.",
    "",
    "처음엔 오른쪽으로 가요. 다음 칸이 판 밖이거나 이미 숫자를 적은 칸이면 **오른쪽으로 90도** 돌아서 계속 가요. (시계 방향 달팽이 모양이에요)",
    "",
    "숫자를 다 적은 판을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 줄 수, `m`: 칸 수예요.",
  outputFormat: "숫자를 채운 판",
  constraints: ["1 ≤ n, m ≤ 200"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "줄 수" },
      { name: "m", type: { python: "int", javascript: "number", java: "int" }, description: "칸 수" },
    ],
    returns: { type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" }, description: "채운 판" },
  },
  starterCode: {
    python: ["def solution(n, m):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, m) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[][] solution(int n, int m) {",
      "        int[][] answer = new int[n][m];",
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
      args: [3, 3],
      expected: [
        [1, 2, 3],
        [8, 9, 4],
        [7, 6, 5],
      ],
      explanation: "바깥을 한 바퀴 돌고 가운데 9로 끝나요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [1, 4],
      expected: [[1, 2, 3, 4]],
      explanation: "한 줄이면 [[1, 2, 3, 4]]예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [4, 1],
      expected: [[1], [2], [3], [4]],
      failureNote: "한 칸짜리 세로줄이면 아래로만 가요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [2, 3],
      expected: [
        [1, 2, 3],
        [6, 5, 4],
      ],
      failureNote: "[[1, 2, 3], [6, 5, 4]]예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [3, 4],
      expected: [
        [1, 2, 3, 4],
        [10, 11, 12, 5],
        [9, 8, 7, 6],
      ],
      failureNote: "가로가 더 긴 판도 같은 규칙이에요. 가운데 줄이 [10, 11, 12, 5]예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [200, 150],
      expected: (() => {
        const b = Array.from({ length: 200 }, () => new Array(150).fill(0));
        const dr = [0, 1, 0, -1];
        const dc = [1, 0, -1, 0];
        let r = 0,
          c = 0,
          d = 0;
        for (let k = 1; k <= 30000; k++) {
          b[r][c] = k;
          const nr = r + dr[d],
            nc = c + dc[d];
          if (nr < 0 || nr >= 200 || nc < 0 || nc >= 150 || b[nr][nc] !== 0) d = (d + 1) % 4;
          r += dr[d];
          c += dc[d];
        }
        return b;
      })(),
      failureNote: "200 × 150 = 3만 칸이에요.",
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
      body: ["'앞이 막히면 오른쪽으로 돈다'는 규칙을 그대로 따라 하는 **방향 시뮬레이션**이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "방향 0 = 오른쪽, 1 = 아래, 2 = 왼쪽, 3 = 위로 두고 `dr = [0, 1, 0, -1]`, `dc = [1, 0, -1, 0]`이에요.",
        "",
        "숫자 k를 적은 뒤, 다음 칸이 판 밖이거나 이미 적은 칸(0이 아닌 칸)이면 `d = (d + 1) % 4`로 돌아요. 그리고 한 칸 가요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "board = n × m, 모두 0;  r = c = d = 0",
        "for k in 1 .. n*m:",
        "    board[r][c] = k",
        "    다음 칸이 밖이거나 board가 0이 아니면 d = (d + 1) % 4",
        "    r, c = r + dr[d], c + dc[d]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["도는 조건 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "nr, nc = r + dr[d], c + dc[d]",
            "if not (0 <= nr < n and 0 <= nc < m) or ______:",
            "    d = (d + 1) % 4",
          ].join("\n"),
          javascript: [
            "const nr = r + dr[d], nc = c + dc[d];",
            "if (nr < 0 || nr >= n || nc < 0 || nc >= m || ______) d = (d + 1) % 4;",
          ].join("\n"),
          java: [
            "int nr = r + DR[d], nc = c + DC[d];",
            "if (nr < 0 || nr >= n || nc < 0 || nc >= m || ______) d = (d + 1) % 4;",
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
        "sim-spiral-fill-3x3",
        "sim-spiral",
        "막히면 오른쪽으로",
        "3 × 3 판을 1부터 9까지 달팽이 모양으로 채워요.",
        [3, 3],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
