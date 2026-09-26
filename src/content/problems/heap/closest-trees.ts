import type { Problem } from "@/types/content";

export const heapClosestTrees: Problem = {
  id: "c:heap-closest-trees",
  slug: "heap-closest-trees",
  source: "curated",
  topic: "heap",
  level: 2,
  title: "집에서 가장 가까운 나무 k그루",
  summary: "거리(의 제곱)로 비교하는 힙에서 가까운 것부터 k번 꺼내요",
  statement: [
    "노디의 집은 (0, 0)에 있어요. 숲의 나무 위치 `trees`가 `[x, y]` 목록으로 주어질 때, 집에서 **가장 가까운 나무 k그루**를 가까운 순서로 반환해 주세요.",
    "",
    "거리는 직선 거리예요. 거리가 같으면 x가 작은 나무, x도 같으면 y가 작은 나무가 먼저예요.",
  ].join("\n"),
  inputFormat: "`trees`: 나무 위치 `[x, y]` 목록, `k`: 고를 수예요.",
  outputFormat: "가까운 순서의 나무 k그루",
  constraints: ["1 ≤ k ≤ trees의 길이 ≤ 100,000", "−10,000 ≤ x, y ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "trees",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "나무 위치",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "고를 수" },
    ],
    returns: {
      type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
      description: "가까운 나무들",
    },
  },
  starterCode: {
    python: ["def solution(trees, k):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(trees, k) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[][] solution(int[][] trees, int k) {",
      "        int[][] answer = new int[k][];",
      "        return answer;",
      "    }",
      "}",
      "",
    ].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [
        [
          [1, 3],
          [-2, 2],
          [5, -1],
        ],
        2,
      ],
      expected: [
        [-2, 2],
        [1, 3],
      ],
      explanation: "거리의 제곱이 10, 8, 26이라 [-2, 2], [1, 3] 순서예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "tricky",
      args: [
        [
          [3, 0],
          [0, 3],
          [-3, 0],
        ],
        2,
      ],
      expected: [
        [-3, 0],
        [0, 3],
      ],
      explanation: "셋 다 거리 3이에요. x가 작은 [-3, 0], 그다음 [0, 3]이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[[0, 0]], 1],
      expected: [[0, 0]],
      failureNote: "집 바로 앞 나무예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [
          [2, 2],
          [1, 1],
          [3, 3],
        ],
        3,
      ],
      expected: [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      failureNote: "모두 고르면 가까운 순서대로예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [1, 2],
          [1, -2],
          [2, 1],
        ],
        2,
      ],
      expected: [
        [1, -2],
        [1, 2],
      ],
      failureNote: "모두 거리 제곱 5예요. x가 1인 둘 중 y가 작은 [1, -2]가 먼저예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => [((i * 7919) % 20001) - 10000, ((i * 104729) % 20001) - 10000]),
        10,
      ],
      expected: [
        [-59, -11],
        [-59, -11],
        [-59, -11],
        [-59, -11],
        [-59, -11],
        [60, 12],
        [60, 12],
        [60, 12],
        [60, 12],
        [60, 12],
      ],
      failureNote: "나무 10만 그루예요. 거리는 제곱으로 비교하면 소수점 없이 정확해요.",
    },
  ],
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
      body: ["**가까운 것부터 k개** → 거리를 기준으로 비교하는 **최소 힙**이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 나무마다 `(x² + y², x, y)`를 힙에 넣어요. 제곱근 없이 제곱으로 비교해도 순서는 같아요.",
        "2. k번 꺼내 `[x, y]`만 결과에 담아요.",
        "",
        "튜플은 첫 값이 같으면 다음 값으로 비교돼서 '거리 → x → y' 규칙이 저절로 지켜져요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "h = [(x*x + y*y, x, y) for x, y in trees]를 힙으로",
        "repeat k번: d, x, y = pop(); 결과에 [x, y] 추가",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["힙에 넣을 값이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "h = [______ for x, y in trees]",
            "heapq.heapify(h)",
            "return [[x, y] for _, x, y in (heapq.heappop(h) for _ in range(k))]",
          ].join("\n"),
          javascript: [
            "const h = new Heap((a, b) => (a[0] - b[0] || a[1] - b[1] || a[2] - b[2]) < 0);",
            "for (const [x, y] of trees) h.push(______);",
          ].join("\n"),
          java: [
            "PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> {",
            "    long da = (long) a[0] * a[0] + (long) a[1] * a[1];",
            "    long db = (long) b[0] * b[0] + (long) b[1] * b[1];",
            "    if (da != db) return Long.compare(da, db);",
            "    return ______;",
            "});",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["top-k"],
  signalIds: ["sig-top-k"],
  estimatedMinutes: 12,
  xp: 20,
};
