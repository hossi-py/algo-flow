import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      3,
      3,
      [
        [0, 0],
        [0, 1],
        [1, 2],
        [2, 1],
      ],
    ],
    expected: [1, 1, 2, 3],
    explanation: "(0, 1)은 (0, 0)과 붙어 여전히 1개, 그다음은 떨어진 땅이라 2, 3개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [
      1,
      3,
      [
        [0, 0],
        [0, 2],
        [0, 1],
      ],
    ],
    expected: [1, 2, 1],
    explanation: "가운데 땅이 솟으면 두 섬이 합쳐져 [1, 2, 1]이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [
      2,
      2,
      [
        [0, 0],
        [0, 0],
        [1, 1],
        [0, 1],
      ],
    ],
    expected: [1, 1, 2, 1],
    failureNote: "같은 칸이 또 솟으면 그대로예요: [1, 1, 2, 1].",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      2,
      2,
      [
        [0, 0],
        [1, 1],
      ],
    ],
    expected: [1, 2],
    failureNote: "대각선은 이어진 게 아니라 [1, 2]예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      3,
      3,
      [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 1],
        [1, 1],
      ],
    ],
    expected: [1, 2, 3, 4, 1],
    failureNote: "가운데가 솟으면 네 섬이 한 번에 합쳐져 [1, 2, 3, 4, 1]이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      200,
      200,
      Array.from({ length: 40000 }, (_, i) => [Math.floor(i / 200), i % 200]).filter(([r, c]) => (r + c) % 2 === 0),
    ],
    expected: Array.from({ length: 20000 }, (_, i) => i + 1),
    failureNote: "체스판처럼 떨어진 땅 2만 개예요. 솟을 때마다 섬을 처음부터 세면 느려요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [200, 200, Array.from({ length: 40000 }, (_, i) => [Math.floor(i / 200), i % 200])],
    expected: new Array(40000).fill(1),
    failureNote: "4만 칸을 차례로 채워요. 합치기가 아주 많아요.",
  },
]);

export const ufOnlineIslands: Problem = {
  id: "c:uf-online-islands",
  slug: "uf-online-islands",
  source: "curated",
  topic: "graph-advanced",
  level: 2,
  title: "솟아오르는 섬",
  summary: "새 땅이 생길 때마다 섬을 하나 더하고, 이웃 땅과 합쳐질 때마다 하나씩 빼요",
  statement: [
    "`rows × cols` 크기의 바다가 있어요. `positions`에 적힌 순서대로 `[r, c]` 칸이 땅으로 솟아올라요.",
    "",
    "상하좌우로 이어진 땅은 하나의 섬이에요. 땅이 하나 솟을 때마다 **섬이 몇 개인지** 순서대로 담아 반환해 주세요.",
    "",
    "이미 땅인 칸이 또 솟을 수도 있어요. 그때는 아무 일도 없어요.",
  ].join("\n"),
  inputFormat: "`rows`, `cols`: 바다 크기, `positions`: 솟는 순서대로 적은 칸이에요.",
  outputFormat: "땅이 솟을 때마다 섬의 수",
  constraints: ["1 ≤ rows, cols ≤ 200", "1 ≤ positions의 길이 ≤ 40,000"],
  signature: {
    name: "solution",
    params: [
      { name: "rows", type: { python: "int", javascript: "number", java: "int" }, description: "줄 수" },
      { name: "cols", type: { python: "int", javascript: "number", java: "int" }, description: "칸 수" },
      {
        name: "positions",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "솟는 칸 [r, c]",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "섬의 수" },
  },
  starterCode: {
    python: ["def solution(rows, cols, positions):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(rows, cols, positions) {", "  let answer = [];", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public int[] solution(int rows, int cols, int[][] positions) {",
      "        int[] answer = new int[positions.length];",
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
        "땅이 **하나씩 늘어나며** 섬(그룹)의 수를 계속 물어요 → **유니온 파인드**예요.",
        "",
        "지도가 한 번에 주어졌다면 DFS로 세면 되지만, 매번 다시 세면 느려요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "칸 `(r, c)`를 번호 `r * cols + c`로 바꿔 유니온 파인드에 넣어요.",
        "",
        "1. 이미 땅이면 지금 섬 수를 그대로 적어요.",
        "2. 새 땅이면 섬 수 +1 (혼자 섬이 생겨요).",
        "3. 상하좌우 이웃 중 땅인 칸과 union해요. **실제로 합쳐질 때마다** 섬 수 −1이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for r, c in positions:",
        "    if land[r][c]: answer.append(count); continue",
        "    land[r][c] = True;  count += 1",
        "    for 이웃 (nr, nc)이 땅이면:",
        "        if union(id(r, c), id(nr, nc)): count -= 1",
        "    answer.append(count)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["이웃과 합치는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):",
            "    if 0 <= nr < rows and 0 <= nc < cols and land[nr][nc]:",
            "        if union(r * cols + c, nr * cols + nc):",
            "            count ______",
          ].join("\n"),
          javascript: [
            "for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {",
            "  if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || !land[nr][nc]) continue;",
            "  if (dsu.union(r * cols + c, nr * cols + nc)) count______;",
            "}",
          ].join("\n"),
          java: [
            "for (int[] d : DIRS) {",
            "    int nr = r + d[0], nc = c + d[1];",
            "    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || !land[nr][nc]) continue;",
            "    if (union(r * cols + c, nr * cols + nc)) count______;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["union-find"],
  signalIds: ["sig-merge-groups"],
  estimatedMinutes: 18,
  xp: 20,
};
