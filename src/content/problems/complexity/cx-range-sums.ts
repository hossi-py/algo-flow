import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [3, 5],
        [1, 10],
      ],
    ],
    expected: [12, 55],
    explanation: "3 + 4 + 5 = 12, 1 + … + 10 = 55예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[[7, 7]]],
    expected: [7],
    explanation: "한 수뿐이면 그 수 7이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        [1, 1],
        [1, 2],
        [1, 3],
      ],
    ],
    expected: [1, 3, 6],
    failureNote: "[1, 3, 6]이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[[2, 5]]],
    expected: [14],
    failureNote: "개수가 짝수(4개)여도 공식이 맞아요: 14.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [[[1, 10000000]]],
    expected: [50000005000000],
    failureNote: "합이 50,000,005,000,000이라 큰 수를 다룰 수 있어야 해요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 100000 }, (_, i) => {
        const a = ((i * 7919) % 5000000) + 1;
        return [a, a + ((i * 104729) % 5000000)];
      }),
    ],
    expected: Array.from({ length: 100000 }, (_, i) => {
      const a = ((i * 7919) % 5000000) + 1;
      return [a, a + ((i * 104729) % 5000000)];
    }).map(([a, b]) => ((a + b) * (b - a + 1)) / 2),
    failureNote: "질문 10만 개, 구간 길이는 최대 500만이에요. 질문마다 더하면 수천억 번이에요.",
  },
]);

export const cxRangeSums: Problem = {
  id: "c:cx-range-sums",
  slug: "cx-range-sums",
  source: "curated",
  topic: "complexity",
  level: 1,
  title: "구간 합 질문 10만 개",
  summary: "a부터 b까지의 합은 (a + b) × 개수 ÷ 2 공식으로 한 번에 구해요",
  statement: [
    "`queries`의 `[a, b]`마다 **a부터 b까지 모든 정수의 합**을 구해, 질문 순서대로 담아 반환해 주세요.",
    "",
    "예를 들어 `[3, 5]`는 3 + 4 + 5 = 12예요.",
  ].join("\n"),
  inputFormat: "`queries`: `[a, b]` 질문 목록이에요.",
  outputFormat: "질문마다 합",
  constraints: ["1 ≤ queries의 길이 ≤ 100,000", "1 ≤ a ≤ b ≤ 10,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "queries",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b] 질문",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "long[]" }, description: "질문마다 합" },
  },
  starterCode: {
    python: ["def solution(queries):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(queries) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long[] solution(int[][] queries) {",
      "        long[] answer = new long[queries.length];",
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
        "질문이 10만 개이고 구간 길이가 수백만이에요. 질문마다 하나씩 더하면 너무 느려요 → 질문마다 **공식으로 O(1)**.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "a부터 b까지는 `b − a + 1`개예요. 맨 앞과 맨 뒤를 짝지으면 짝마다 합이 `a + b`로 같아요.",
        "",
        "그래서 합은 `(a + b) × (b − a + 1) ÷ 2`예요. (둘 중 하나는 꼭 짝수라 나누어떨어져요)",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "for a, b in queries:", "    answer.append((a + b) * (b - a + 1) // 2)", "~~~"].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["공식 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["return [______ for a, b in queries]"].join("\n"),
          javascript: ["return queries.map(([a, b]) => ______);"].join("\n"),
          java: [
            "for (int i = 0; i < queries.length; i++) {",
            "    long a = queries[i][0], b = queries[i][1];",
            "    answer[i] = ______;",
            "}",
          ].join("\n"),
        },
        caption: "합이 21억을 넘을 수 있어서 long으로 계산해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["formula-o1"],
  signalIds: ["sig-huge-n"],
  estimatedMinutes: 8,
  xp: 10,
};
