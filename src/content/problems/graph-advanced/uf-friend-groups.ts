import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      5,
      [
        [0, 1],
        [1, 2],
        [3, 4],
      ],
    ],
    expected: 2,
    explanation: "{0, 1, 2}와 {3, 4}로 2개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [3, []],
    expected: 3,
    explanation: "관계가 없으면 모두 혼자라 3개예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1, []],
    expected: 1,
    failureNote: "한 명이면 1개예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 1],
        [1, 0],
        [0, 1],
      ],
    ],
    expected: 3,
    failureNote: "같은 관계가 여러 번 나와도 한 번만 합쳐져요. {0, 1}, {2}, {3}으로 3개예요.",
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
      ],
    ],
    expected: 1,
    failureNote: "두 모임이 1-2 관계로 합쳐져 1개예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [100000, Array.from({ length: 99999 }, (_, i) => [99999 - i, 99998 - i])],
    expected: 1,
    failureNote: "10만 명이 한 줄로 이어져 1개예요. 관계마다 DFS로 다시 세면 너무 느려요.",
  },
]);

export const ufFriendGroups: Problem = {
  id: "c:uf-friend-groups",
  slug: "uf-friend-groups",
  source: "curated",
  topic: "graph-advanced",
  level: 1,
  title: "친구 모임은 몇 개?",
  summary: "친구 관계마다 두 사람의 그룹을 합치고, 대표의 수를 세요",
  statement: [
    "학생 `n`명이 `0`번부터 `n - 1`번까지 있어요. `pairs`의 `[a, b]`는 a번과 b번이 친구라는 뜻이에요.",
    "",
    "친구의 친구도 같은 모임이에요. 모임은 모두 몇 개인지 반환해 주세요. 친구가 없는 학생은 혼자서 한 모임이에요.",
  ].join("\n"),
  inputFormat: "`n`: 학생 수, `pairs`: `[a, b]` 친구 관계 목록이에요.",
  outputFormat: "모임의 수",
  constraints: [
    "1 ≤ n ≤ 100,000",
    "0 ≤ pairs의 길이 ≤ 100,000",
    "0 ≤ a, b < n, a ≠ b",
    "같은 관계가 여러 번 나올 수 있어요",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "학생 수" },
      {
        name: "pairs",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "친구 관계",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "모임의 수" },
  },
  starterCode: {
    python: ["def solution(n, pairs):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, pairs) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] pairs) {",
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
      body: [
        "관계로 이어진 **그룹**을 세요. 관계를 하나씩 합치는 **유니온 파인드**가 딱 맞아요. (DFS로 세도 돼요)",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 처음엔 모두 자기 자신이 대표예요. 그룹 수 = n",
        "2. 관계 `[a, b]`마다 union(a, b)를 해요. 서로 다른 그룹이 합쳐질 때마다 그룹 수가 1 줄어요.",
        "3. 남은 그룹 수가 답이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "groups = n",
        "for a, b in pairs:",
        "    if union(a, b): groups -= 1   # 실제로 합쳐졌을 때만",
        "return groups",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["find에서 경로를 줄이는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "def find(x):",
            "    root = x",
            "    while parent[root] != root:",
            "        root = parent[root]",
            "    while x != root:          # 지나온 노드가 대표를 바로 가리키게",
            "        nxt = parent[x]",
            "        parent[x] = ______",
            "        x = nxt",
            "    return root",
          ].join("\n"),
          javascript: [
            "find(x) {",
            "  let root = x;",
            "  while (this.parent[root] !== root) root = this.parent[root];",
            "  while (x !== root) {       // 지나온 노드가 대표를 바로 가리키게",
            "    const next = this.parent[x];",
            "    this.parent[x] = ______;",
            "    x = next;",
            "  }",
            "  return root;",
            "}",
          ].join("\n"),
          java: [
            "int find(int x) {",
            "    int root = x;",
            "    while (parent[root] != root) root = parent[root];",
            "    while (x != root) {          // 지나온 노드가 대표를 바로 가리키게",
            "        int next = parent[x];",
            "        parent[x] = ______;",
            "        x = next;",
            "    }",
            "    return root;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["union-find"],
  signalIds: ["sig-merge-groups"],
  visualization: {
    presets: [
      problemPreset(
        "uf-friend-groups-ex1",
        "uf-union",
        "관계마다 그룹 합치기",
        "0-1, 1-2를 합치면 {0, 1, 2}가, 3-4를 합치면 {3, 4}가 돼요. 대표가 둘이라 모임은 2개예요.",
        [
          5,
          [
            [0, 1],
            [1, 2],
            [3, 4],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 10,
};
