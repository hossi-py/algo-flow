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
      0,
    ],
    expected: [0, 1, 3, 2, 4],
    explanation: "0 → 1 → 3에서 막혀요. 1, 0으로 되돌아온 뒤 2 → 4로 가요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 1],
        [1, 2],
        [2, 0],
        [2, 3],
      ],
      0,
    ],
    expected: [0, 1, 2, 3],
    explanation: "2번에서 0번은 이미 가 봤으니 3번으로 가요. 방문 표시가 없으면 0 → 1 → 2 → 0 … 을 끝없이 돌아요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1, [], 0],
    expected: [0],
    failureNote: "방이 하나뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      5,
      [
        [0, 1],
        [3, 4],
      ],
      3,
    ],
    expected: [3, 4],
    failureNote: "3번에서 출발하면 3, 4번 방에만 갈 수 있어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      5,
      [
        [2, 4],
        [2, 3],
        [2, 1],
        [1, 0],
      ],
      2,
    ],
    expected: [2, 1, 0, 3, 4],
    failureNote: "굴이 섞여서 주어져도 번호가 작은 방부터 가요. 2 → 1 → 0, 되돌아와서 3, 4.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [
      6,
      [
        [0, 5],
        [5, 4],
        [4, 3],
        [0, 1],
        [1, 2],
      ],
      0,
    ],
    expected: [0, 1, 2, 5, 4, 3],
    failureNote: "0에서 1쪽 길을 먼저 끝까지 가요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [1000, Array.from({ length: 999 }, (_, i) => [999 - i, 998 - i]), 500],
    expected: [
      500,
      ...Array.from({ length: 500 }, (_, i) => 499 - i),
      ...Array.from({ length: 499 }, (_, i) => 501 + i),
    ],
    failureNote: "방 1,000개가 한 줄로 이어져 있어요. 가운데에서 출발해 작은 쪽 끝까지 갔다가 돌아와요.",
  },
]);

export const dfsCaveOrder: Problem = {
  id: "c:dfs-cave-order",
  slug: "dfs-cave-order",
  source: "curated",
  topic: "dfs",
  level: 1,
  title: "동굴 탐험 순서",
  summary: "작은 번호 방부터 끝까지 들어갔다 돌아오는 순서를 기록해요",
  statement: [
    "탐험가 노디가 동굴을 탐험해요. 동굴에는 방이 `n`개(0번 ~ `n-1`번) 있고, 굴 목록 `tunnels`의 `[a, b]`는 a방과 b방을 잇는 **양방향 굴**이에요.",
    "",
    "노디는 `start` 방에서 출발해 이렇게 움직여요.",
    "",
    "1. 지금 방과 굴로 이어진 방 중 **아직 안 가 본 방**이 있으면, 그중 **번호가 가장 작은 방**으로 들어가요.",
    "2. 안 가 본 방이 없으면, **이 방에 들어오기 직전의 방**으로 되돌아가요.",
    "3. 출발한 방으로 돌아왔는데 더 갈 곳이 없으면 탐험을 마쳐요.",
    "",
    "노디가 **처음 들어간 순서대로** 방 번호를 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 방의 수, `tunnels`: `[a, b]` 굴 목록, `start`: 출발 방이에요.",
  outputFormat: "처음 방문한 순서대로의 방 번호 리스트 (갈 수 없는 방은 빠져요)",
  constraints: ["1 ≤ n ≤ 1,000", "0 ≤ tunnels의 길이 ≤ 3,000", "a ≠ b", "같은 굴은 두 번 주어지지 않아요."],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "방의 수" },
      {
        name: "tunnels",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "굴 목록",
      },
      { name: "start", type: { python: "int", javascript: "number", java: "int" }, description: "출발 방" },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" }, description: "방문 순서" },
  },
  starterCode: {
    python: ["def solution(n, tunnels, start):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, tunnels, start) {", "  let answer = [];", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(int n, int[][] tunnels, int start) {",
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
        '"갈 수 있는 한 깊이 들어가고, 막히면 **직전 방으로** 돌아온다" → **DFS**(깊이 우선 탐색)예요.',
        "",
        "직전으로 돌아가는 건 재귀 함수가 끝나고 호출한 곳으로 돌아가는 것과 똑같아요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 굴 목록으로 **인접 리스트**를 만들고, 방마다 이웃을 **오름차순 정렬**해요 (작은 번호부터 가야 하니까).",
        "2. `dfs(v)`: v를 방문 표시하고 순서에 추가 → 이웃을 차례로 보며 **안 가 본 방이면** `dfs(이웃)`.",
        '3. `dfs(start)` 한 번이면 끝이에요. 함수가 끝나 돌아오는 것이 "직전 방으로 되돌아가기"예요.',
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "graph = 인접 리스트 (이웃은 오름차순)",
        "dfs(v):",
        "    visited[v] = True",
        "    order에 v 추가",
        "    for w in graph[v]:",
        "        if not visited[w]: dfs(w)",
        "dfs(start)",
        "return order",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "def dfs(v):",
            "    visited[v] = True",
            "    order.append(v)",
            "    for w in graph[v]:",
            "        if ______:",
            "            dfs(w)",
          ].join("\n"),
          javascript: [
            "function dfs(v) {",
            "  visited[v] = true;",
            "  order.push(v);",
            "  for (const w of graph[v]) {",
            "    if (______) dfs(w);",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "void dfs(int v) {",
            "    visited[v] = true;",
            "    order.add(v);",
            "    for (int w : graph.get(v)) {",
            "        if (______) dfs(w);",
            "    }",
            "}",
          ].join("\n"),
        },
        caption: "Java에서는 graph · visited처럼 dfs가 함께 쓰는 값을 Solution의 필드로 두면 편해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["path-existence"],
  signalIds: ["sig-path-exists"],
  visualization: {
    presets: [
      problemPreset(
        "cave-ex1",
        "graph-dfs",
        "예제 1 탐험",
        "작은 번호 방부터 끝까지 들어갔다가 되돌아오는 모습을 봐요.",
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
      problemPreset(
        "cave-ex2",
        "graph-dfs",
        "예제 2: 순환이 있는 동굴",
        "이미 방문한 방은 건너뛰어서 같은 곳을 돌지 않아요.",
        [
          4,
          [
            [0, 1],
            [1, 2],
            [2, 0],
            [2, 3],
          ],
          0,
        ],
      ),
    ],
  },
  estimatedMinutes: 10,
  xp: 10,
};
