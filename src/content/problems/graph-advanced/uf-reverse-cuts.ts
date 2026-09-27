import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
      [0, 2],
    ],
    expected: [1, 2],
    explanation: "0-1이 무너져도 고리라 아직 1개, 2-3까지 무너지면 {1, 2}와 {3, 0}으로 2개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [2, [[0, 1]], [0]],
    expected: [2],
    explanation: "하나뿐인 다리가 무너져 2개예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [
      3,
      [
        [0, 1],
        [1, 2],
      ],
      [1, 0],
    ],
    expected: [2, 3],
    failureNote: "다리가 모두 무너지면 섬마다 따로라 [2, 3]이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      2,
      [
        [0, 1],
        [0, 1],
      ],
      [0, 1],
    ],
    expected: [1, 2],
    failureNote: "같은 두 섬 사이 다리가 둘이면 하나가 무너져도 1개예요: [1, 2].",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [4, [[0, 1]], [0]],
    expected: [4],
    failureNote: "처음부터 떨어진 섬도 세요: 4개.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [100000, Array.from({ length: 99999 }, (_, i) => [i, i + 1]), Array.from({ length: 99999 }, (_, i) => i)],
    expected: Array.from({ length: 99999 }, (_, i) => i + 2),
    failureNote: "다리 10만 개가 차례로 무너져요. 무너질 때마다 그룹을 처음부터 세면 너무 느려요.",
  },
]);

export const ufReverseCuts: Problem = {
  id: "c:uf-reverse-cuts",
  slug: "uf-reverse-cuts",
  source: "curated",
  topic: "graph-advanced",
  level: 5,
  title: "무너지는 다리",
  summary: "끊기는 순서를 거꾸로 보면, 다리를 하나씩 놓는(합치는) 문제가 돼요",
  statement: [
    "섬 `n`개가 다리 `bridges`(`[a, b]`)로 이어져 있어요. 태풍이 와서 다리가 `cuts`에 적힌 순서대로 무너져요. `cuts[k]`는 무너지는 다리의 번호(`bridges`에서의 위치, 0부터)예요.",
    "",
    "다리가 하나 무너질 때마다, 남은 다리로 오갈 수 있는 섬끼리 묶은 **그룹이 몇 개인지** 순서대로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 섬 수, `bridges`: `[a, b]` 다리 목록, `cuts`: 무너지는 다리 번호 (겹치지 않아요)예요.",
  outputFormat: "다리가 무너질 때마다 그룹 수",
  constraints: [
    "1 ≤ n ≤ 100,000",
    "1 ≤ bridges의 길이 ≤ 100,000",
    "1 ≤ cuts의 길이 ≤ bridges의 길이",
    "cuts의 번호는 겹치지 않아요",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "섬 수" },
      {
        name: "bridges",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b] 다리",
      },
      {
        name: "cuts",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "무너지는 다리 번호",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "int[]" },
      description: "무너질 때마다 그룹 수",
    },
  },
  starterCode: {
    python: ["def solution(n, bridges, cuts):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, bridges, cuts) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int n, int[][] bridges, int[] cuts) {",
      "        int[] answer = new int[cuts.length];",
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
        "그룹 수를 계속 물어요 → 유니온 파인드. 그런데 유니온 파인드는 **합치기**만 잘하고 **끊기**는 못 해요.",
        "",
        "→ 시간을 **거꾸로** 돌려 '다리가 하나씩 다시 놓인다'로 바꿔요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. **끝까지 무너지지 않는** 다리만 먼저 놓아요. 이게 마지막 다리가 무너진 뒤의 상태예요.",
        "2. `cuts`를 **뒤에서부터** 보며: 지금 그룹 수를 적고, 그 다리를 다시 놓아요(union).",
        "3. 적은 값들을 뒤집으면 답이에요.",
        "",
        "k번째로 무너진 뒤의 상태 = k번째 다리까지 무너지고 그 뒤 다리는 아직 있는 상태예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "안 무너지는 다리를 모두 union, groups = 남은 그룹 수",
        "for idx in reversed(cuts):",
        "    answer.append(groups)",
        "    if union(*bridges[idx]): groups -= 1",
        "return reversed(answer)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["거꾸로 다리를 다시 놓는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for idx in reversed(cuts):",
            "    answer.append(______)",
            "    a, b = bridges[idx]",
            "    if union(a, b):",
            "        groups -= 1",
            "return answer[::-1]",
          ].join("\n"),
          javascript: [
            "for (let k = cuts.length - 1; k >= 0; k--) {",
            "  answer.push(______);",
            "  const [a, b] = bridges[cuts[k]];",
            "  if (dsu.union(a, b)) groups--;",
            "}",
            "return answer.reverse();",
          ].join("\n"),
          java: [
            "for (int k = cuts.length - 1; k >= 0; k--) {",
            "    answer[k] = ______;",
            "    int[] b = bridges[cuts[k]];",
            "    if (union(b[0], b[1])) groups--;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["reverse-union"],
  signalIds: ["sig-merge-groups"],
  estimatedMinutes: 22,
  xp: 50,
};
