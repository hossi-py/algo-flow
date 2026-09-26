import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const dpForestPaths: Problem = {
  id: "c:dp-forest-paths",
  slug: "dp-forest-paths",
  source: "curated",
  topic: "dp",
  level: 2,
  title: "숲길 경로의 수",
  summary: "한 칸으로 오는 길 = 위 칸 + 왼쪽 칸, 막힌 칸은 0",
  statement: [
    "숲 지도 `forest`에서 `.`은 지나갈 수 있는 길, `#`은 덤불이에요. 노디는 **왼쪽 위** 칸에서 출발해 **오른쪽 아래** 칸까지, **오른쪽이나 아래로만** 한 칸씩 움직여요.",
    "",
    "도착하는 서로 다른 경로의 수를 **1,000,000,007로 나눈 나머지**로 반환해 주세요. 출발 칸이나 도착 칸이 덤불이면 0이에요.",
  ].join("\n"),
  inputFormat: "`forest`: 한 줄에 한 행씩 적힌 숲 지도예요.",
  outputFormat: "경로의 수를 1,000,000,007로 나눈 나머지",
  constraints: ["1 ≤ 행 수, 열 수 ≤ 500", "지도는 `.`과 `#`로만 되어 있어요"],
  signature: {
    name: "solution",
    params: [
      {
        name: "forest",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "숲 지도",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "경로의 수 (나머지)" },
  },
  starterCode: {
    python: ["def solution(forest):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(forest) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(String[] forest) {",
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
      args: [["...", "...", "..."]],
      expected: 6,
      explanation: "3 × 3 빈 숲에는 6가지 길이 있어요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "basic",
      args: [["....", ".#..", "...."]],
      expected: 4,
      explanation: "덤불을 피하는 길은 4가지예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [["."]],
      expected: 1,
      failureNote: "출발 칸이 곧 도착 칸이라 1가지예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [["#.", ".."]],
      expected: 0,
      failureNote: "출발 칸이 덤불이면 0이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [[".#", "#."]],
      expected: 0,
      failureNote: "오른쪽도 아래도 막혀 도착할 수 없어요. 0이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "tricky",
      args: [["....#", "....."]],
      expected: 4,
      failureNote: "도착 칸 바로 위가 덤불이에요. 덤불에서 오는 길은 0으로 세야 해요. 답은 4예요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 500 }, (_, r) =>
          Array.from({ length: 500 }, (_, c) =>
            (r * 7 + c * 13) % 29 === 0 && r + c > 0 && r + c < 998 ? "#" : ".",
          ).join(""),
        ),
      ],
      expected: 88588104,
      failureNote: "500 × 500 숲이에요. 길을 하나씩 따라가면 끝나지 않아요. 칸마다 한 번 더하기만 하세요.",
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
      body: ["격자에서 **오른쪽·아래로만** 가는 **경로의 수** + 나머지 → **격자 DP**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 표의 뜻: `dp[r][c]` = (r, c)까지 오는 경로의 수",
        "2. (r, c)에는 위(r-1, c)나 왼쪽(r, c-1)에서만 와요 → `dp[r][c] = dp[r-1][c] + dp[r][c-1]`",
        "3. 덤불 칸은 0, 출발 칸은 1 (덤불이 아니면)",
        "",
        "왼쪽 위부터 한 줄씩 채우면 위·왼쪽이 항상 먼저 채워져 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dp = R × C 표, 모두 0",
        "for r in 0..R-1:",
        "    for c in 0..C-1:",
        "        if forest[r][c] == '#': continue",
        "        if r == 0 and c == 0: dp[r][c] = 1; continue",
        "        dp[r][c] = (위 + 왼쪽) % MOD     # 범위 밖은 0",
        "return dp[R-1][C-1]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["위·왼쪽 칸을 더하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "up = dp[r - 1][c] if r > 0 else 0",
            "left = dp[r][c - 1] if c > 0 else 0",
            "dp[r][c] = ______ % MOD",
          ].join("\n"),
          javascript: [
            "const up = r > 0 ? dp[r - 1][c] : 0;",
            "const left = c > 0 ? dp[r][c - 1] : 0;",
            "dp[r][c] = ______ % MOD;",
          ].join("\n"),
          java: [
            "long up = r > 0 ? dp[r - 1][c] : 0;",
            "long left = c > 0 ? dp[r][c - 1] : 0;",
            "dp[r][c] = ______ % MOD;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["grid-dp"],
  signalIds: ["sig-count-ways-mod", "sig-overlapping-subproblems"],
  visualization: {
    presets: [
      problemPreset(
        "dp-forest-paths-ex2",
        "dp-grid-paths",
        "덤불을 피하는 길 세기",
        "칸마다 위와 왼쪽의 길 수를 더해요. 덤불 칸은 0이에요.",
        [["....", ".#..", "...."]],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
