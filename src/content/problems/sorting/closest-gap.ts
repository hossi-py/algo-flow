import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[40, 3, 25, 11, 29]],
    expected: 4,
    explanation: "정렬하면 3, 11, 25, 29, 40. 이웃 사이 거리 중 25와 29 사이 4가 가장 작아요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[8, 8, 20]],
    expected: 0,
    explanation: "같은 자리에 두 그루면 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[0, 1000000000]],
    expected: 1000000000,
    failureNote: "두 그루뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[100, 1, 50, 99]],
    expected: 1,
    failureNote: "입력에서 옆에 있다고 가깝지 않아요. 정렬해야 99와 100이 이웃이 돼요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[10, 20, 30, 40]],
    expected: 10,
    failureNote: "모든 간격이 10이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [[5, 1000, 3, 998, 7]],
    expected: 2,
    failureNote: "가장 작은 간격 2가 여러 군데(3과 5, 5와 7, 998과 1000) 있어요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 100000) * 10000 + (i % 7))],
    expected: 9997,
    failureNote: "나무 10만 그루예요. 모든 쌍을 비교하면 약 50억 번이라 시간 초과예요.",
  },
]);

export const sortingClosestGap: Problem = {
  id: "c:sorting-closest-gap",
  slug: "sorting-closest-gap",
  source: "curated",
  topic: "sorting",
  level: 1,
  title: "가장 가까운 두 나무",
  summary: "정렬하면 가장 가까운 두 값은 반드시 이웃해요",
  statement: [
    "숲길을 따라 나무가 서 있어요. `positions`는 각 나무가 출발점에서 몇 m 떨어져 있는지예요. 순서는 뒤죽박죽이에요.",
    "",
    "**가장 가까운 두 나무** 사이의 거리를 반환해 주세요. 같은 자리에 나무가 두 그루 있으면 거리는 0이에요.",
  ].join("\n"),
  inputFormat: "`positions`: 나무들의 위치예요.",
  outputFormat: "가장 가까운 두 나무 사이의 거리",
  constraints: ["2 ≤ positions의 길이 ≤ 100,000", "0 ≤ 위치 ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "positions",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "나무 위치",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "가장 가까운 거리" },
  },
  starterCode: {
    python: ["def solution(positions):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(positions) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] positions) {",
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
      body: ["'**가장 가까운 두 값**' → 정렬하면 크기가 비슷한 값이 옆에 붙어요. **정렬 후 훑기**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "정렬된 줄에서 a < b < c라면, a와 c 사이는 a와 b 사이보다 멀어요. 그래서 가장 가까운 두 값은 **반드시 이웃**이에요.",
        "",
        "1. 위치를 정렬해요.",
        "2. 이웃한 두 값의 차이 n − 1개 중 가장 작은 값을 구해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "p = positions를 정렬",
        "best = 무한대",
        "for i in 1 .. n-1:",
        "    best = min(best, p[i] - p[i - 1])",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["이웃끼리 비교하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["p = sorted(positions)", "best = min(______ for i in range(1, len(p)))"].join("\n"),
          javascript: [
            "const p = [...positions].sort((a, b) => a - b);",
            "let best = Infinity;",
            "for (let i = 1; i < p.length; i++) best = Math.min(best, ______);",
          ].join("\n"),
          java: [
            "int[] p = positions.clone();",
            "Arrays.sort(p);",
            "int best = Integer.MAX_VALUE;",
            "for (int i = 1; i < p.length; i++) best = Math.min(best, ______);",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["sort-then-scan"],
  signalIds: ["sig-neighbor-after-sort"],
  estimatedMinutes: 10,
  xp: 10,
};
