import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [3, 5],
    expected: 3,
    explanation: "1, 2, 2, 3, 3, …에서 5번째는 3이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [3, 9],
    expected: 9,
    explanation: "가장 큰 수 9예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1, 1],
    expected: 1,
    failureNote: "1 × 1 표예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [2, 3],
    expected: 2,
    failureNote: "1, 2, 2, 4에서 3번째도 2예요. 같은 수를 따로 세요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [10, 50],
    expected: 24,
    failureNote: "10 × 10 표의 50번째예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [20000, 123456789],
    expected: 36328286,
    failureNote: "4억 개의 수를 다 만들어 정렬할 수는 없어요. X 이하인 개수는 줄마다 min(n, X // i)로 세요.",
  },
]);

export const binarySearchKthTable: Problem = {
  id: "c:binary-search-kth-table",
  slug: "binary-search-kth-table",
  source: "curated",
  topic: "binary-search",
  level: 5,
  title: "곱셈표의 K번째 수",
  summary: "'X 이하인 수가 몇 개인가'를 줄마다 세면서 X를 이분 탐색해요",
  statement: [
    "n × n 곱셈표가 있어요. i행 j열(1부터)에는 `i × j`가 적혀 있어요. 이 n² 개의 수를 작은 것부터 늘어놓았을 때 **k번째 수**를 반환해 주세요. 같은 수도 따로 세요.",
    "",
    "예를 들어 n = 3이면 1, 2, 2, 3, 3, 4, 6, 6, 9라서 5번째 수는 3이에요.",
  ].join("\n"),
  inputFormat: "`n`: 곱셈표 크기, `k`: 몇 번째 수인지예요.",
  outputFormat: "k번째 수",
  constraints: ["1 ≤ n ≤ 20,000", "1 ≤ k ≤ n²"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "곱셈표 크기" },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "몇 번째" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "k번째 수" },
  },
  starterCode: {
    python: ["def solution(n, k):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, k) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int k) {",
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
    timeLimitMs: 3000,
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
        "'**k번째로 작은 수**'인데 전부 만들 수 없을 만큼 많아요 → 'X 이하인 수가 k개 이상인 **가장 작은 X**'를 **이분 탐색**해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "i행에는 i, 2i, …, ni가 있어요. 그중 X 이하는 `min(n, X // i)`개예요. 모든 행을 더하면 X 이하인 수의 개수예요 (O(n)).",
        "",
        "1. X의 범위는 1 ~ n²이에요.",
        "2. 개수 ≥ k면 X가 답일 수 있어요 → 답으로 적고 더 작게. 아니면 더 크게.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "def count(X): return sum(min(n, X // i) for i in 1..n)",
        "lo, hi = 1, n * n",
        "while lo <= hi:",
        "    mid = (lo + hi) // 2",
        "    if count(mid) >= k: answer = mid; hi = mid - 1",
        "    else: lo = mid + 1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["X 이하인 수를 세는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "def count(x):",
            "    total = 0",
            "    for i in range(1, n + 1):",
            "        total += ______",
            "    return total",
          ].join("\n"),
          javascript: [
            "const count = (x) => {",
            "  let total = 0;",
            "  for (let i = 1; i <= n; i++) total += ______;",
            "  return total;",
            "};",
          ].join("\n"),
          java: [
            "long count(int n, long x) {",
            "    long total = 0;",
            "    for (int i = 1; i <= n; i++) total += ______;",
            "    return total;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["parametric-search", "range-count"],
  signalIds: ["sig-max-min-answer", "sig-huge-range"],
  estimatedMinutes: 25,
  xp: 50,
};
