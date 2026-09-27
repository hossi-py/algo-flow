import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["..#", "...", "#.."]],
    expected: [
      [2, 2, -1],
      [2, 4, 2],
      [-1, 2, 2],
    ],
    explanation: "가운데 칸은 위·아래·왼쪽·오른쪽이 모두 길이라 4예요. 벽 칸은 -1이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["."]],
    expected: [[0]],
    explanation: "길 한 칸뿐이면 이웃이 없어서 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["#"]],
    expected: [[-1]],
    failureNote: "벽 한 칸이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [["....."]],
    expected: [[1, 2, 2, 2, 1]],
    failureNote: "한 줄짜리 길이에요. 양 끝은 이웃이 하나예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[".#.", "#.#", ".#."]],
    expected: [
      [0, -1, 0],
      [-1, 0, -1],
      [0, -1, 0],
    ],
    failureNote: "대각선은 이어진 게 아니에요. 모든 길 칸이 0이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [[".", ".", "#", "."]],
    expected: [[1], [1], [-1], [0]],
    failureNote: "한 열짜리 지도예요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array(100).fill(".".repeat(100))],
    expected: Array.from({ length: 100 }, (_, r) =>
      Array.from({ length: 100 }, (_, c) => Number(r > 0) + Number(r < 99) + Number(c > 0) + Number(c < 99)),
    ),
    failureNote: "100×100 전체가 길이에요.",
  },
]);

export const graphGridPaths: Problem = {
  id: "c:graph-grid-paths",
  slug: "graph-grid-paths",
  source: "curated",
  topic: "graph-representation",
  level: 4,
  title: "격자 길의 갈림 수",
  summary: "격자 지도를 그래프로 보고 칸마다 이어진 이웃 칸 수를 세요",
  statement: [
    "노디 마을 지도는 격자 `grid`예요. `'.'`은 걸을 수 있는 길, `'#'`은 벽이에요. 길은 **상하좌우**로 붙은 길 칸으로만 이어져요.",
    "",
    "각 칸마다, 길 칸이면 **상하좌우로 붙은 길 칸의 수**를, 벽이면 `-1`을 적은 같은 크기의 표를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`grid`: 길이가 같은 문자열들의 리스트예요. `grid[r][c]`는 r행 c열 칸이에요.",
  outputFormat: "`grid`와 같은 크기의 정수 표 (리스트의 리스트)",
  constraints: ["1 ≤ 행 수, 열 수 ≤ 100", "각 문자는 '.' 또는 '#'이에요."],
  signature: {
    name: "solution",
    params: [
      { name: "grid", type: { python: "list[str]", javascript: "string[]", java: "String[]" }, description: "지도" },
    ],
    returns: {
      type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
      description: "칸별 이웃 길 수 (벽은 -1)",
    },
  },
  starterCode: {
    python: ["def solution(grid):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(grid) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[][] solution(String[] grid) {",
      "        int[][] answer = new int[grid.length][grid[0].length()];",
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
        "격자는 **칸 = 노드, 붙어 있는 칸 = 간선**인 그래프예요. 인접 리스트를 따로 만들지 않고, 칸마다 상하좌우 네 방향을 보면 이웃을 알 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 방향 목록 `(-1, 0), (1, 0), (0, -1), (0, 1)`을 준비해요.",
        "2. 모든 칸 (r, c)에 대해: 벽이면 -1, 길이면 네 방향 칸 중 **격자 안**이고 길인 칸을 세요.",
        "3. **범위 검사를 먼저** 해야 격자 밖을 읽는 오류가 나지 않아요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for r, c in 모든 칸:",
        "    if grid[r][c] == '#': result[r][c] = -1",
        "    else:",
        "        count = 네 방향 (nr, nc) 중 격자 안이고 grid[nr][nc] == '.'인 수",
        "        result[r][c] = count",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["이웃을 세는 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            "count = 0",
            "for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):",
            "    nr, nc = r + dr, c + dc",
            "    if 0 <= nr < rows and 0 <= nc < cols and ______:",
            "        count += 1",
          ].join("\n"),
          javascript: [
            "let count = 0;",
            "for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {",
            "  const nr = r + dr, nc = c + dc;",
            "  if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && ______) count += 1;",
            "}",
          ].join("\n"),
          java: [
            "int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};",
            "int count = 0;",
            "for (int[] d : dirs) {",
            "    int nr = r + d[0], nc = c + d[1];",
            "    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && ______) count++;",
            "}",
          ].join("\n"),
        },
        caption: "격자 한 줄은 String이라 칸은 grid[r].charAt(c)로 읽고, 문자 비교는 '.'처럼 작은따옴표로 해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["edge-list-conversion", "degree-count"],
  signalIds: ["sig-grid-neighbors"],
  estimatedMinutes: 15,
  xp: 40,
};
