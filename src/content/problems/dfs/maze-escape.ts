import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["S.#", "#..", "#.E"]],
    expected: true,
    explanation: "S → 오른쪽 → 아래 → 아래 → 오른쪽으로 E에 닿아요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [["S#E", ".#.", "..#"]],
    expected: false,
    explanation: "S에서 갈 수 있는 칸은 왼쪽 아래 네 칸뿐이라 E에 닿을 수 없어요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["SE"]],
    expected: true,
    failureNote: "출구가 바로 옆이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [["S#", "#E"]],
    expected: false,
    failureNote: "대각선으로는 갈 수 없어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [["S....", "####.", "E...."]],
    expected: true,
    failureNote: "빙 돌아가는 길이 있어요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [["S", ".", "#", "E"]],
    expected: false,
    failureNote: "한 열짜리 미로가 벽에 막혀 있어요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: (() => {
      const g = [];
      for (let r = 0; r < 40; r += 1) {
        if (r % 2 === 0) g.push(".".repeat(40));
        else {
          const gap = ((r - 1) / 2) % 2 === 0 ? 39 : 0;
          g.push(Array.from({ length: 40 }, (_, c) => (c === gap ? "." : "#")).join(""));
        }
      }
      g[0] = "S" + g[0].slice(1);
      g[38] = g[38].slice(0, 20) + "E" + g[38].slice(21);
      return [g];
    })(),
    expected: true,
    failureNote: "40×40 뱀 모양 미로예요. 방문 표시가 없으면 같은 칸을 끝없이 오가요.",
  },
  {
    id: "hid-6",
    visibility: "hidden",
    purpose: "stress",
    args: (() => {
      const g = [];
      for (let r = 0; r < 40; r += 1) {
        if (r % 2 === 0) g.push(".".repeat(40));
        else {
          const gap = ((r - 1) / 2) % 2 === 0 ? 39 : 0;
          g.push(Array.from({ length: 40 }, (_, c) => (c === gap ? "." : "#")).join(""));
        }
      }
      g[0] = "S" + g[0].slice(1);
      g[38] = g[38].slice(0, 20) + "E" + g[38].slice(21);
      g[37] = "#".repeat(40);
      return [g];
    })(),
    expected: false,
    failureNote: "같은 뱀 모양 미로인데 마지막 통로가 막혔어요.",
  },
]);

export const dfsMazeEscape: Problem = {
  id: "c:dfs-maze-escape",
  slug: "dfs-maze-escape",
  source: "curated",
  topic: "dfs",
  level: 2,
  title: "미로 탈출",
  summary: "격자 미로에서 출구까지 갈 수 있는지 판별해요",
  statement: [
    "노디가 격자 미로에 들어왔어요. 지도 `maze`에서 `'S'`는 출발 칸, `'E'`는 출구, `'.'`은 지나갈 수 있는 칸, `'#'`은 벽이에요.",
    "",
    "노디는 **상하좌우**로 한 칸씩 움직일 수 있고, 벽과 미로 바깥으로는 갈 수 없어요.",
    "",
    "출발 칸에서 출구까지 갈 수 있으면 `True`, 없으면 `False`를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`maze`: 길이가 같은 문자열들의 리스트예요. 'S'와 'E'는 정확히 하나씩 있어요.",
  outputFormat: "출구에 갈 수 있는지 (bool)",
  constraints: ["1 ≤ 행 수, 열 수 ≤ 40", "각 문자는 'S', 'E', '.', '#' 중 하나예요."],
  signature: {
    name: "solution",
    params: [
      {
        name: "maze",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "미로 지도",
      },
    ],
    returns: { type: { python: "bool", javascript: "boolean", java: "boolean" }, description: "탈출 가능 여부" },
  },
  starterCode: {
    python: ["def solution(maze):", "    answer = False", "    return answer", ""].join("\n"),
    javascript: ["function solution(maze) {", "  let answer = false;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public boolean solution(String[] maze) {",
      "        boolean answer = false;",
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
        '"출발점에서 도착점까지 **갈 수 있나요?**" → **경로 존재 여부**예요. 격자는 칸이 노드, 상하좌우로 붙은 칸이 이웃인 그래프예요.',
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 'S'의 위치를 찾아요.",
        "2. S에서 DFS를 시작해 벽이 아니고 안 가 본 칸으로 계속 들어가요.",
        "3. DFS가 끝난 뒤 E 칸에 방문 표시가 있으면 `True`예요.",
        "",
        "칸을 방문 표시하지 않으면 두 칸 사이를 영원히 왔다 갔다 해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dfs(r, c):",
        "    visited[r][c] = True",
        "    for 네 방향 (nr, nc):",
        "        if 격자 안 and maze[nr][nc] != '#' and not visited[nr][nc]:",
        "            dfs(nr, nc)",
        "dfs(S 위치)",
        "return visited[E 위치]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["이웃 칸으로 들어갈 조건이에요."].join("\n"),
      code: {
        code: {
          python: [
            "for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):",
            "    nr, nc = r + dr, c + dc",
            "    if 0 <= nr < rows and 0 <= nc < cols and ______ and not visited[nr][nc]:",
            "        dfs(nr, nc)",
          ].join("\n"),
          javascript: [
            "for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {",
            "  const nr = r + dr, nc = c + dc;",
            "  if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && ______ && !visited[nr][nc]) dfs(nr, nc);",
            "}",
          ].join("\n"),
          java: [
            "for (int[] d : new int[][] {{-1, 0}, {1, 0}, {0, -1}, {0, 1}}) {",
            "    int nr = r + d[0], nc = c + d[1];",
            "    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && ______ && !visited[nr][nc]) {",
            "        dfs(nr, nc);",
            "    }",
            "}",
          ].join("\n"),
        },
        caption:
          "칸은 maze[r].charAt(c)로 읽어요. Java에서는 graph · visited처럼 dfs가 함께 쓰는 값을 Solution의 필드로 두면 편해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["path-existence", "grid-flood-fill"],
  signalIds: ["sig-path-exists", "sig-grid-neighbors"],
  estimatedMinutes: 15,
  xp: 20,
};
