import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [1, 5, 9],
        [10, 11, 13],
        [12, 13, 15],
      ],
      8,
    ],
    expected: 13,
    explanation: "1, 5, 9, 10, 11, 12, 13, 13, 15에서 8번째는 13이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[[-5]], 1],
    expected: -5,
    explanation: "칸 하나예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        [1, 2],
        [1, 3],
      ],
      2,
    ],
    expected: 1,
    failureNote: "1, 1, 2, 3에서 2번째도 1이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        [1, 3, 5],
        [2, 4, 6],
        [7, 8, 9],
      ],
      6,
    ],
    expected: 6,
    failureNote: "6이에요. 줄 순서대로 읽으면 안 돼요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [
      [
        [1, 2],
        [3, 4],
      ],
      4,
    ],
    expected: 4,
    failureNote: "가장 큰 4예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 300 }, (_, r) => Array.from({ length: 300 }, (_, c) => r * 3 + c * 5)), 45000],
    expected: 1196,
    failureNote: "300 × 300 표예요. 힙에는 줄 수만큼만 들어가요.",
  },
]);

export const heapMatrixKth: Problem = {
  id: "c:heap-matrix-kth",
  slug: "heap-matrix-kth",
  source: "curated",
  topic: "heap",
  level: 3,
  title: "정렬된 표에서 K번째",
  summary: "각 줄의 맨 앞을 힙에 넣고, 꺼낼 때마다 그 줄의 오른쪽 칸을 넣어요",
  statement: [
    "n × n 표 `grid`는 **각 가로줄**도 왼쪽에서 오른쪽으로, **각 세로줄**도 위에서 아래로 커지게(같을 수도 있게) 정렬돼 있어요.",
    "",
    "표의 모든 수를 작은 순으로 늘어놓았을 때 **k번째 수**를 반환해 주세요. 같은 수도 따로 세요.",
  ].join("\n"),
  inputFormat: "`grid`: 정렬된 n × n 표, `k`: 몇 번째인지예요.",
  outputFormat: "k번째로 작은 수",
  constraints: ["1 ≤ n ≤ 300", "1 ≤ k ≤ n²", "−1,000,000 ≤ 수 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "grid",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "정렬된 표",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "몇 번째" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "k번째 수" },
  },
  starterCode: {
    python: ["def solution(grid, k):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(grid, k) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[][] grid, int k) {",
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
      body: ["가로줄마다 정렬된 **여러 줄**에서 작은 것부터 k번 → **여러 줄 합치기** 힙이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 줄마다 맨 앞 칸 `(값, 줄, 칸)`을 힙에 넣어요.",
        "2. k번 꺼내요. 꺼낼 때마다 그 줄의 **오른쪽 칸**이 있으면 넣어요.",
        "3. k번째로 꺼낸 값이 답이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "h = [(grid[r][0], r, 0) for r in 0..n-1]",
        "repeat k번:",
        "    v, r, c = pop()",
        "    if c + 1 < n: push((grid[r][c+1], r, c + 1))",
        "return v",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["k번 꺼내는 반복이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for _ in range(k):",
            "    v, r, c = heapq.heappop(h)",
            "    if c + 1 < n:",
            "        heapq.heappush(h, ______)",
            "return v",
          ].join("\n"),
          javascript: [
            "for (let t = 0; t < k; t++) {",
            "  [v, r, c] = h.pop();",
            "  if (c + 1 < n) h.push(______);",
            "}",
            "return v;",
          ].join("\n"),
          java: [
            "for (int t = 0; t < k; t++) {",
            "    int[] top = h.poll();   // {값, 줄, 칸}",
            "    v = top[0];",
            "    int r = top[1], c = top[2];",
            "    if (c + 1 < n) h.offer(______);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["k-way-merge", "top-k"],
  signalIds: ["sig-repeated-min"],
  estimatedMinutes: 18,
  xp: 30,
};
