import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      6,
      [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [4, 5],
      ],
      0,
      2,
    ],
    expected: [3, 4],
    explanation: "3과 4가 2다리예요.",
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
        [0, 2],
        [2, 3],
      ],
      0,
      2,
    ],
    expected: [3],
    explanation:
      "DFS로 0 → 1 → 2로 가면 2를 '2다리'로 잘못 셀 수 있어요. 2는 0과 바로 친구라 1다리이고, 답은 [3]이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [3, [[0, 1]], 2, 0],
    expected: [2],
    failureNote: "0다리는 자기 자신뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [
      3,
      [
        [0, 1],
        [1, 2],
      ],
      0,
      5,
    ],
    expected: [],
    failureNote: "그렇게 먼 학생이 없어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      7,
      [
        [3, 0],
        [3, 1],
        [3, 2],
        [0, 4],
        [1, 5],
        [2, 6],
      ],
      3,
      2,
    ],
    expected: [4, 5, 6],
    failureNote: "3을 가운데로 한 별 모양이에요.",
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
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
      ],
      0,
      3,
    ],
    expected: [3],
    failureNote: "고리 모양이라 3은 양쪽 모두 3다리예요. 한 번만 세요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [100000, Array.from({ length: 99999 }, (_, i) => [Math.floor(i / 2), i + 1]), 0, 16],
    expected: Array.from({ length: 100000 - 65535 }, (_, i) => 65535 + i),
    failureNote: "10만 명의 친구 관계가 나무 모양으로 뻗어 있어요.",
  },
]);

export const bfsExactHops: Problem = {
  id: "c:bfs-exact-hops",
  slug: "bfs-exact-hops",
  source: "curated",
  topic: "bfs",
  level: 2,
  title: "딱 k다리 건너 친구",
  summary: "가장 짧은 거리가 정확히 k인 사람들을 찾아요",
  statement: [
    "노디 학교 학생 `n`명(0번 ~ `n-1`번)의 친구 관계 `pairs`가 주어져요. `[a, b]`는 a와 b가 서로 친구라는 뜻이에요.",
    "",
    "`me`번 학생과의 **가장 짧은 다리 수가 정확히 `k`** 인 학생들의 번호를 오름차순으로 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 학생 수, `pairs`: 친구 관계, `me`: 기준 학생, `k`: 다리 수예요.",
  outputFormat: "해당 학생 번호의 오름차순 리스트 (없으면 빈 리스트)",
  constraints: ["1 ≤ n ≤ 100,000", "0 ≤ pairs의 길이 ≤ 200,000", "0 ≤ k ≤ n"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "학생 수" },
      {
        name: "pairs",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "친구 관계",
      },
      { name: "me", type: { python: "int", javascript: "number", java: "int" }, description: "기준 학생" },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "다리 수" },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" },
      description: "정확히 k다리인 학생들",
    },
  },
  starterCode: {
    python: ["def solution(n, pairs, me, k):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, pairs, me, k) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(int n, int[][] pairs, int me, int k) {",
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
        '"가장 짧은 다리 수"가 기준이에요 → **BFS**로 거리를 구해요.',
        "",
        "DFS로 깊이를 세면 돌아가는 길로 먼저 도착해서 거리를 크게 셀 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. me에서 BFS로 모든 학생의 거리 `dist`를 구해요.",
        "2. `dist[i] == k`인 i를 번호 순서대로 모아요.",
        "",
        "**방문 표시는 큐에 넣을 때** 해요. 꺼낼 때 표시하면 같은 학생이 큐에 여러 번 들어가서 느려지고, 거리가 덮어써질 수도 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "dist = BFS(me)로 구한 거리", "return [i for i in 0..n-1 if dist[i] == k]", "~~~"].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["거리 k인 학생만 모아요."].join("\n"),
      code: {
        code: {
          python: ["dist = bfs(me)", "return [i for i in range(n) if ______]"].join("\n"),
          javascript: [
            "const dist = bfs(me);",
            "const answer = [];",
            "for (let i = 0; i < n; i += 1) if (______) answer.push(i);",
            "return answer;",
          ].join("\n"),
          java: [
            "int[] dist = bfs(me);",
            "List<Integer> answer = new ArrayList<>();",
            "for (int i = 0; i < n; i++) if (______) answer.add(i);",
            "return answer;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["shortest-path-unweighted", "level-order"],
  signalIds: ["sig-shortest-steps"],
  estimatedMinutes: 15,
  xp: 20,
};
