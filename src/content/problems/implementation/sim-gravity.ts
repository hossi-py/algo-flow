import type { Problem } from "@/types/content";

export const simGravity: Problem = {
  id: "c:sim-gravity",
  slug: "sim-gravity",
  source: "curated",
  topic: "implementation",
  level: 3,
  title: "쏟아지는 도토리",
  summary: "세로줄마다 아래에서부터 보며, 도토리가 멈출 자리를 하나씩 올려 가요",
  statement: [
    "상자 `grid`를 세로로 세웠더니 안의 물건이 떨어져요. `'.'`은 빈칸, `'#'`은 상자에 붙은 칸막이, 소문자는 도토리예요.",
    "",
    "도토리는 아래로 떨어지다가 **바닥, 칸막이, 다른 도토리** 위에서 멈춰요. 칸막이는 움직이지 않아요. 같은 세로줄 도토리들의 위아래 순서는 그대로예요.",
    "",
    "모두 멈춘 뒤의 모습을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`grid`: 상자 속 모습이에요.",
  outputFormat: "떨어진 뒤의 모습",
  constraints: ["1 ≤ 줄 수, 칸 수 ≤ 300"],
  signature: {
    name: "solution",
    params: [
      {
        name: "grid",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "상자 속 모습",
      },
    ],
    returns: { type: { python: "list[str]", javascript: "string[]", java: "String[]" }, description: "떨어진 뒤" },
  },
  starterCode: {
    python: ["def solution(grid):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(grid) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String[] solution(String[] grid) {",
      "        String[] answer = grid;",
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
      args: [["a.b", ".c.", "..."]],
      expected: ["...", "...", "acb"],
      explanation: '모두 바닥까지 떨어져 ["...", "...", "acb"]예요.',
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "basic",
      args: [["x", ".", "y"]],
      expected: [".", "x", "y"],
      explanation: 'x는 y 위에서 멈춰요: [".", "x", "y"].',
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [["a", "#", ".", "b", "."]],
      expected: ["a", "#", ".", ".", "b"],
      failureNote: 'a는 칸막이 위에 그대로 있고, b만 바닥으로 떨어져요: ["a", "#", ".", ".", "b"].',
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [["..", ".."]],
      expected: ["..", ".."],
      failureNote: "빈 상자는 그대로예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [["p", "q", ".", "r", "."]],
      expected: [".", ".", "p", "q", "r"],
      failureNote: '순서를 지켜 [".", ".", "p", "q", "r"]이에요.',
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "tricky",
      args: [["a.", "#.", "b#", "..", "c."]],
      expected: ["a.", "#.", ".#", "b.", "c."],
      failureNote: "칸막이 아래 칸에서 다시 바닥을 세요. 첫 줄은 a, #, 빈칸, b, c 순서가 돼요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 300 }, (_, r) =>
          Array.from({ length: 300 }, (_, c) => {
            const v = (r * 7919 + c * 104729) % 23;
            return v < 2 ? "#" : v < 12 ? String.fromCharCode(97 + (v % 26)) : ".";
          }).join(""),
        ),
      ],
      expected: (() => {
        const g = Array.from({ length: 300 }, (_, r) =>
          Array.from({ length: 300 }, (_, c) => {
            const v = (r * 7919 + c * 104729) % 23;
            return v < 2 ? "#" : v < 12 ? String.fromCharCode(97 + (v % 26)) : ".";
          }).join(""),
        ).map((row) => row.split(""));
        const n = g.length,
          m = g[0].length;
        for (let c = 0; c < m; c++) {
          let land = n - 1;
          for (let r = n - 1; r >= 0; r--) {
            const ch = g[r][c];
            if (ch === "#") land = r - 1;
            else if (ch !== ".") {
              g[r][c] = ".";
              g[land][c] = ch;
              land--;
            }
          }
        }
        return g.map((row) => row.join(""));
      })(),
      failureNote: "300 × 300 상자예요. 도토리를 한 칸씩 떨어뜨리면 느려요.",
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
      body: ["규칙대로 판을 바꾸는 **시뮬레이션**이에요. 세로줄마다 따로 생각하면 쉬워요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "세로줄 하나를 **아래에서 위로** 보며, 다음 도토리가 멈출 자리 `land`를 들고 다녀요. 처음엔 맨 아래 줄이에요.",
        "",
        "- 칸막이를 만나면 `land`를 칸막이 바로 위로 옮겨요.",
        "- 도토리를 만나면 그 칸을 비우고 `land`에 놓은 뒤 `land`를 한 칸 올려요.",
        "",
        "도토리를 한 칸씩 여러 번 떨어뜨리지 않아도 한 번 훑기로 끝나요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for 세로줄 c:",
        "    land = 맨 아래 줄",
        "    for r = 아래부터 위로:",
        "        '#'면 land = r - 1",
        "        도토리면 g[r][c] = '.';  g[land][c] = 도토리;  land -= 1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["도토리를 옮기는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for r in range(n - 1, -1, -1):",
            "    ch = g[r][c]",
            '    if ch == "#":',
            "        land = r - 1",
            '    elif ch != ".":',
            '        g[r][c] = "."',
            "        g[land][c] = ch",
            "        land ______",
          ].join("\n"),
          javascript: [
            "for (let r = n - 1; r >= 0; r--) {",
            "  const ch = g[r][c];",
            '  if (ch === "#") land = r - 1;',
            '  else if (ch !== ".") {',
            '    g[r][c] = ".";',
            "    g[land][c] = ch;",
            "    land______;",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int r = n - 1; r >= 0; r--) {",
            "    char ch = g[r][c];",
            "    if (ch == '#') land = r - 1;",
            "    else if (ch != '.') {",
            "        g[r][c] = '.';",
            "        g[land][c] = ch;",
            "        land______;",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["step-simulation"],
  signalIds: ["sig-follow-rules"],
  estimatedMinutes: 15,
  xp: 30,
};
