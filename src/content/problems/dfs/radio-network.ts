import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
    ],
    expected: [3, 2],
    explanation: "{0, 1}, {2}, {3}이라 무리 3개, 가장 큰 무리는 2명이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [
      [
        [1, 1, 0],
        [1, 1, 1],
        [0, 1, 1],
      ],
    ],
    expected: [1, 3],
    explanation: "0과 2는 직접 안 통하지만 1을 거쳐 전달돼요. 무리 1개, 3명이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[[1]]],
    expected: [1, 1],
    failureNote: "대원 한 명이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
    ],
    expected: [3, 1],
    failureNote: "아무도 연결되지 않았어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        [1, 0, 0, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [1, 0, 0, 1, 1],
        [0, 0, 0, 1, 1],
      ],
    ],
    expected: [2, 3],
    failureNote: "{0, 3, 4}와 {1, 2}예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ],
    ],
    expected: [3, 2],
    failureNote: "번호가 떨어져 있어도 같은 무리일 수 있어요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 200 }, (_, i) => Array.from({ length: 200 }, (_, j) => (i % 7 === j % 7 ? 1 : 0)))],
    expected: [7, 29],
    failureNote: "대원 200명이 번호를 7로 나눈 나머지끼리 무리를 이뤄요.",
  },
]);

export const dfsRadioNetwork: Problem = {
  id: "c:dfs-radio-network",
  slug: "dfs-radio-network",
  source: "curated",
  topic: "dfs",
  level: 3,
  title: "무전기 네트워크",
  summary: "연결 표에서 무전이 통하는 무리의 수와 가장 큰 무리의 크기를 구해요",
  statement: [
    "캠프에 참가한 대원 `n`명(0번 ~ `n-1`번)이 무전기를 들고 있어요. `link[i][j]`가 `1`이면 i와 j는 **서로 직접** 무전이 통해요. 직접 안 통해도 다른 대원을 거쳐 전달할 수 있으면 같은 **무전 무리**예요.",
    "",
    "무전 무리의 개수와, 가장 큰 무리의 대원 수를 `[무리 수, 가장 큰 무리 크기]`로 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`link`: n × n 크기의 0/1 표예요. `link[i][j] == link[j][i]`이고 `link[i][i] == 1`이에요.",
  outputFormat: "`[무리 수, 가장 큰 무리 크기]`",
  constraints: ["1 ≤ n ≤ 200"],
  signature: {
    name: "solution",
    params: [
      {
        name: "link",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "직접 연결 표",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "int[]" },
      description: "[무리 수, 가장 큰 무리 크기]",
    },
  },
  starterCode: {
    python: ["def solution(link):", "    answer = [0, 0]", "    return answer", ""].join("\n"),
    javascript: ["function solution(link) {", "  let answer = [0, 0];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[][] link) {",
      "        int[] answer = new int[2];",
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
        '"거쳐서라도 통하면 같은 무리" → **연결 요소**예요.',
        "",
        "입력이 N × N 표라서 **인접 행렬**을 그대로 DFS에 써요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 대원 0번부터 보면서 방문하지 않은 대원을 만나면 새 무리예요.",
        "2. 그 대원에서 DFS를 돌려 무리 크기를 세요. 행렬에서 v의 이웃은 `link[v][w] == 1`인 w예요.",
        "3. 무리 수를 세고, 크기의 최댓값을 기록해요.",
        "",
        "`link[i][i]`도 1이지만, 자기 자신은 이미 방문 표시가 돼 있어서 다시 가지 않아요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dfs(v):  # 무리 크기를 반환",
        "    visited[v] = True",
        "    size = 1",
        "    for w in 0..n-1:",
        "        if link[v][w] == 1 and not visited[w]:",
        "            size += dfs(w)",
        "    return size",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["행렬에서 이웃을 찾는 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            "def dfs(v):",
            "    visited[v] = True",
            "    size = 1",
            "    for w in range(n):",
            "        if ______ and not visited[w]:",
            "            size += dfs(w)",
            "    return size",
          ].join("\n"),
          javascript: [
            "function dfs(v) {",
            "  visited[v] = true;",
            "  let size = 1;",
            "  for (let w = 0; w < n; w += 1) {",
            "    if (______ && !visited[w]) size += dfs(w);",
            "  }",
            "  return size;",
            "}",
          ].join("\n"),
          java: [
            "int dfs(int v) {",
            "    visited[v] = true;",
            "    int size = 1;",
            "    for (int w = 0; w < n; w++) {",
            "        if (______ && !visited[w]) size += dfs(w);",
            "    }",
            "    return size;",
            "}",
          ].join("\n"),
        },
        caption: "Java에서는 graph · visited처럼 dfs가 함께 쓰는 값을 Solution의 필드로 두면 편해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["connected-components", "adjacency-matrix"],
  signalIds: ["sig-connected-group", "sig-matrix-given"],
  estimatedMinutes: 18,
  xp: 30,
};
