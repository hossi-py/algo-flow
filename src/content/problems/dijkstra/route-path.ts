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
        [0, 1, 2],
        [0, 2, 6],
        [1, 2, 3],
        [1, 3, 8],
        [2, 3, 1],
        [3, 4, 2],
        [2, 4, 7],
      ],
      0,
      4,
    ],
    expected: [0, 1, 2, 3, 4],
    explanation: "0 → 1 → 2 → 3 → 4로 8분이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [3, [[0, 1, 1]], 0, 2],
    expected: [],
    explanation: "2번으로 가는 길이 없어서 []예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [2, [[0, 1, 3]], 1, 1],
    expected: [1],
    failureNote: "출발과 도착이 같으면 [1]이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 3, 10],
        [0, 1, 2],
        [1, 2, 2],
        [2, 3, 2],
      ],
      0,
      3,
    ],
    expected: [0, 1, 2, 3],
    failureNote: "곧장 가는 10분보다 [0, 1, 2, 3]의 6분이 빨라요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 1],
        [1, 3, 5],
      ],
      3,
      0,
    ],
    expected: [3, 2, 1, 0],
    failureNote: "거꾸로 가도 돼요: [3, 2, 1, 0]이에요. prev를 따라간 뒤 뒤집는 걸 잊지 마세요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      10000,
      [
        ...Array.from({ length: 9999 }, (_, i) => [i, i + 1, 2]),
        ...Array.from({ length: 9998 }, (_, i) => [i, i + 2, 5]),
        ...Array.from({ length: 9997 }, (_, i) => [i, i + 3, 7]),
      ],
      0,
      9999,
    ],
    expected: Array.from({ length: 10000 }, (_, i) => i),
    failureNote: "1만 개의 마을을 모두 지나는 길이에요. 경로를 매번 통째로 복사해 들고 다니면 느려요.",
  },
]);

export const dijkstraRoutePath: Problem = {
  id: "c:dijkstra-route-path",
  slug: "dijkstra-route-path",
  source: "curated",
  topic: "dijkstra",
  level: 2,
  title: "가장 빠른 길 알려 주기",
  summary: "거리를 줄일 때 어디서 왔는지 적어 두고, 도착점에서 거꾸로 따라가요",
  statement: [
    "마을 `n`개와 양방향 길 `roads`가 있어요. `[a, b, t]`는 a번과 b번 마을 사이가 `t`분 걸린다는 뜻이에요.",
    "",
    "`s`번 마을에서 `e`번 마을까지 **가장 빨리 가는 길**을 지나는 마을 번호 순서대로(`s`와 `e` 포함) 담아 반환해 주세요.",
    "",
    "가장 빠른 길은 **하나뿐**이에요. 갈 수 없으면 빈 목록을 반환해요.",
  ].join("\n"),
  inputFormat: "`n`: 마을 수, `roads`: `[a, b, t]` 길 목록, `s`: 출발 마을, `e`: 도착 마을이에요.",
  outputFormat: "가장 빠른 길에서 지나는 마을 번호 (갈 수 없으면 [])",
  constraints: [
    "1 ≤ n ≤ 10,000",
    "0 ≤ roads의 길이 ≤ 30,000",
    "0 ≤ a, b < n, a ≠ b",
    "1 ≤ t ≤ 1,000",
    "가장 빠른 길은 하나뿐이에요",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "마을 수" },
      {
        name: "roads",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, 시간] 양방향 길",
      },
      { name: "s", type: { python: "int", javascript: "number", java: "int" }, description: "출발 마을" },
      { name: "e", type: { python: "int", javascript: "number", java: "int" }, description: "도착 마을" },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "지나는 마을 번호" },
  },
  starterCode: {
    python: ["def solution(n, roads, s, e):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, roads, s, e) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int n, int[][] roads, int s, int e) {",
      "        int[] answer = new int[0];",
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
      body: ["최단 시간뿐 아니라 **그 길 자체**를 물어요 → 다익스트라 + **경로 되짚기**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 다익스트라에서 `dist[w]`를 줄일 때 `prev[w] = v`로 **어디서 왔는지** 적어 둬요.",
        "2. 끝나면 `e`에서 시작해 `prev`를 따라 `s`까지 거슬러 가요.",
        "3. 모은 순서를 뒤집으면 `s → e` 경로예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "if d + t < dist[w]: dist[w] = d + t;  prev[w] = v;  push",
        "if dist[e] == ∞: return []",
        "path = [];  v = e",
        "while v != -1: path.append(v);  v = prev[v]",
        "return reverse(path)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["prev를 따라 거슬러 가는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "path = []",
            "v = e",
            "while v != -1:",
            "    path.append(v)",
            "    v = ______",
            "return path[::-1]",
          ].join("\n"),
          javascript: [
            "const path = [];",
            "for (let v = e; v !== -1; v = ______) path.push(v);",
            "return path.reverse();",
          ].join("\n"),
          java: [
            "List<Integer> path = new ArrayList<>();",
            "for (int v = e; v != -1; v = ______) path.add(v);",
            "Collections.reverse(path);",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["path-restore"],
  signalIds: ["sig-weighted-route"],
  visualization: {
    presets: [
      problemPreset(
        "dijkstra-route-path-ex1",
        "dijkstra-path",
        "prev를 따라 거꾸로",
        "거리를 줄일 때마다 prev를 적고, 끝나면 4번에서 prev를 따라 0번까지 거슬러 가요.",
        [
          5,
          [
            [0, 1, 2],
            [0, 2, 6],
            [1, 2, 3],
            [1, 3, 8],
            [2, 3, 1],
            [3, 4, 2],
            [2, 4, 7],
          ],
          0,
          4,
        ],
      ),
    ],
  },
  estimatedMinutes: 18,
  xp: 20,
};
