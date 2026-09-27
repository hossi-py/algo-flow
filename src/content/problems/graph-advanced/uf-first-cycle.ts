import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "edge",
    args: [
      6,
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [5, 4],
        [0, 4],
      ],
    ],
    expected: 0,
    explanation: "다리 5개를 놓아도 고리가 없어서 0이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [
      6,
      [
        [0, 1],
        [1, 2],
        [1, 3],
        [0, 3],
        [4, 5],
      ],
    ],
    expected: 4,
    explanation: "4번째 다리 0-3을 놓으면 0 → 1 → 3 → 0 고리가 생겨요.",
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
    expected: 2,
    failureNote: "같은 두 섬 사이 다리 두 개도 고리예요. 2번째에서 생겨요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [
      3,
      [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    ],
    expected: 3,
    failureNote: "세 번째 다리로 삼각형 고리가 생겨요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1],
        [2, 3],
        [1, 2],
        [3, 0],
        [0, 2],
      ],
    ],
    expected: 4,
    failureNote: "4번째 다리 3-0에서 네 섬 고리가 생겨요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [100000, [...Array.from({ length: 99999 }, (_, i) => [i + 1, i]), [0, 99999]]],
    expected: 100000,
    failureNote:
      "섬 10만 개가 한 줄로 이어진 뒤 마지막 다리에서 고리가 생겨요. find를 재귀로 짜고 크기로 합치기를 빼면 줄이 10만까지 길어져 재귀 깊이를 넘어요.",
  },
]);

export const ufFirstCycle: Problem = {
  id: "c:uf-first-cycle",
  slug: "uf-first-cycle",
  source: "curated",
  topic: "graph-advanced",
  level: 1,
  title: "처음 고리가 생기는 다리",
  summary: "다리의 두 끝이 이미 같은 그룹이면, 그 다리가 고리를 만들어요",
  statement: [
    "섬 `n`개가 있고, `bridges`에 적힌 순서대로 다리를 하나씩 놓아요. `[a, b]`는 a번과 b번 섬을 잇는 다리예요.",
    "",
    "다리를 놓다 보면 어느 순간 다리를 따라 한 바퀴 돌아 제자리로 오는 **고리**가 생길 수 있어요.",
    "",
    "**처음으로 고리가 생긴** 다리가 몇 번째(1부터)인지 반환해 주세요. 끝까지 고리가 없으면 `0`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 섬 수, `bridges`: 놓는 순서대로 적은 `[a, b]` 다리 목록이에요.",
  outputFormat: "처음 고리가 생긴 다리의 순서 (없으면 0)",
  constraints: ["2 ≤ n ≤ 100,000", "1 ≤ bridges의 길이 ≤ 200,000", "0 ≤ a, b < n, a ≠ b"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "섬 수" },
      {
        name: "bridges",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "놓는 순서대로 적은 다리",
      },
    ],
    returns: {
      type: { python: "int", javascript: "number", java: "int" },
      description: "처음 고리가 생긴 다리의 순서",
    },
  },
  starterCode: {
    python: ["def solution(n, bridges):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, bridges) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] bridges) {",
      "        int answer = 0;",
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
      body: ["다리를 **하나씩 더하며** 고리가 생겼는지 물어요 → **유니온 파인드**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "다리 `[a, b]`를 놓기 전에 a와 b가 **이미 같은 그룹**이라면, 둘 사이에 이미 길이 있다는 뜻이에요. 그 다리를 놓으면 고리가 생겨요.",
        "",
        "다르면 union(a, b)로 합치고 다음 다리로 가요.",
        "",
        "섬이 한 줄로 길게 이어질 수 있어요. find는 반복문으로 짜고, 작은 그룹을 큰 그룹 밑에 붙여요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for i, (a, b) in enumerate(bridges, 1):",
        "    if find(a) == find(b): return i",
        "    union(a, b)",
        "return 0",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["고리를 확인하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i, (a, b) in enumerate(bridges, 1):",
            "    if ______:",
            "        return i",
            "    union(a, b)",
            "return 0",
          ].join("\n"),
          javascript: [
            "for (let i = 0; i < bridges.length; i++) {",
            "  const [a, b] = bridges[i];",
            "  if (______) return i + 1;",
            "  dsu.union(a, b);",
            "}",
            "return 0;",
          ].join("\n"),
          java: [
            "for (int i = 0; i < bridges.length; i++) {",
            "    int a = bridges[i][0], b = bridges[i][1];",
            "    if (______) return i + 1;",
            "    union(a, b);",
            "}",
            "return 0;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["union-find"],
  signalIds: ["sig-merge-groups"],
  estimatedMinutes: 12,
  xp: 10,
};
