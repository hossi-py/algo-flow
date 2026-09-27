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
        [0, 2],
        [1, 3],
        [2, 4],
      ],
    ],
    expected: [3, 1, 4, 2, 0],
    explanation:
      "0 → 1 → 3으로 들어가 3이 먼저 끝나고, 돌아오며 1이 끝나요. 그다음 2 → 4로 들어가 4, 2가 끝나고 마지막에 0이 끝나요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [3, [[0, 1]]],
    expected: [1, 0],
    explanation: "2번 방은 0번에서 닿을 수 없어서 빠져요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1, []],
    expected: [0],
    failureNote: "방이 하나뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    ],
    expected: [3, 2, 1, 0],
    failureNote: "고리 모양이에요. 3번에서는 이어진 방(0, 2)을 모두 가 봤으니 바로 끝나요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 3],
        [0, 1],
        [1, 3],
        [0, 2],
      ],
    ],
    expected: [3, 1, 2, 0],
    failureNote: "굴이 번호 순서로 주어지지 않아요. 이어진 방을 번호 순으로 정렬해야 해요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      6,
      [
        [0, 1],
        [1, 2],
        [0, 3],
        [3, 4],
        [4, 5],
        [5, 1],
      ],
    ],
    expected: [2, 3, 4, 5, 1, 0],
    failureNote: "처음 들어간 길에서 다른 길의 방까지 이어져요. 먼저 도착한 쪽에서 탐험해요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [1000, Array.from({ length: 999 }, (_, i) => [i, i + 1])],
    expected: Array.from({ length: 1000 }, (_, i) => 999 - i),
    failureNote: "방 1,000개가 한 줄로 이어져 있어요. 가장 깊은 방부터 끝나요.",
  },
  {
    id: "hid-6",
    visibility: "hidden",
    purpose: "stress",
    args: [1000, Array.from({ length: 999 }, (_, i) => [999 - i, 0])],
    expected: [...Array.from({ length: 999 }, (_, i) => i + 1), 0],
    failureNote: "0번 방에 나머지 방이 모두 이어져 있고, 굴은 번호가 큰 방부터 주어져요.",
  },
]);

export const dfsFinishOrder: Problem = {
  id: "c:dfs-finish-order",
  slug: "dfs-finish-order",
  source: "curated",
  topic: "dfs",
  level: 1,
  title: "탐험을 마친 순서",
  summary: "DFS로 탐험하며 방마다 탐험이 끝나는 순서를 기록해요",
  statement: [
    "노디가 동굴을 탐험해요. 동굴에는 방이 `n`개 있고 0번부터 `n-1`번까지 번호가 있어요. 굴 `tunnels`의 `[a, b]`는 a번 방과 b번 방이 양쪽으로 이어져 있다는 뜻이에요.",
    "",
    "노디는 0번 방에서 출발해 이렇게 탐험해요.",
    "",
    "1. 지금 방과 이어진 방 중 **아직 안 가 본 방이 있으면, 그중 번호가 가장 작은 방**으로 들어가요.",
    "2. 안 가 본 방이 더 없으면 그 방의 **탐험을 마치고**, 이 방에 들어오기 직전의 방으로 돌아가요.",
    "",
    "방마다 **탐험을 마친 순서**대로 번호를 담은 리스트를 반환해 주세요. 0번 방에서 닿을 수 없는 방은 넣지 않아요.",
  ].join("\n"),
  inputFormat: "`n`: 방의 수, `tunnels`: `[a, b]` 굴 목록이에요.",
  outputFormat: "탐험을 마친 순서대로 방 번호를 담은 리스트",
  constraints: ["1 ≤ n ≤ 1,000", "0 ≤ tunnels의 길이 ≤ 3,000", "a ≠ b", "같은 굴은 두 번 주어지지 않아요"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "방의 수" },
      {
        name: "tunnels",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "굴 목록",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" },
      description: "탐험을 마친 순서",
    },
  },
  starterCode: {
    python: ["def solution(n, tunnels):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, tunnels) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(int n, int[][] tunnels) {",
      "        List<Integer> answer = new ArrayList<>();",
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
        "갈 수 있는 데까지 깊이 들어갔다가, 막히면 **돌아오는** 탐험 → **DFS**예요.",
        "",
        "'탐험을 마친다'는 건 재귀 DFS에서 **그 방의 함수가 끝나고 돌아가는 순간**이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 방마다 이어진 방 목록(인접 리스트)을 만들고, **번호 순으로 정렬**해요.",
        "2. `dfs(u)`: u를 방문 표시하고, 이어진 방 중 안 가 본 방마다 `dfs`를 불러요.",
        "3. 반복문이 끝난 **뒤**에 u를 answer에 넣어요. 이게 '탐험을 마친' 순간이에요.",
        "4. `dfs(0)`을 부르고 answer를 반환해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "function dfs(u):",
        "    visited[u] = true",
        "    for v in graph[u] (번호 순):",
        "        if not visited[v]: dfs(v)",
        "    answer에 u 추가            # 탐험을 마친 순간",
        "dfs(0)",
        "return answer",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["탐험을 마친 방을 적는 위치가 핵심이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "def dfs(u):",
            "    visited[u] = True",
            "    for v in graph[u]:",
            "        if not visited[v]:",
            "            dfs(v)",
            "    ______",
          ].join("\n"),
          javascript: [
            "function dfs(u) {",
            "  visited[u] = true;",
            "  for (const v of graph[u]) {",
            "    if (!visited[v]) dfs(v);",
            "  }",
            "  ______;",
            "}",
          ].join("\n"),
          java: [
            "void dfs(int u) {",
            "    visited[u] = true;",
            "    for (int v : graph.get(u)) {",
            "        if (!visited[v]) dfs(v);",
            "    }",
            "    ______;",
            "}",
          ].join("\n"),
        },
        caption: "Java는 graph · visited · answer를 필드로 두면 재귀 함수에서 바로 쓸 수 있어요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["path-existence"],
  signalIds: ["sig-path-exists"],
  visualization: {
    presets: [
      problemPreset(
        "finish-order-ex1",
        "graph-dfs",
        "예제 1 탐험",
        "호출 스택에서 함수가 빠지는 순간이 그 방의 탐험을 마친 순간이에요.",
        [
          5,
          [
            [0, 1],
            [0, 2],
            [1, 3],
            [2, 4],
          ],
          0,
        ],
      ),
    ],
  },
  estimatedMinutes: 10,
  xp: 10,
};
