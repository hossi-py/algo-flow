import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[1, 4, 2, 10, 23, 3, 1, 0, 20], 4],
    expected: 39,
    explanation: "[4, 2, 10, 23]이 39로 가장 커요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[5, -2, 3], 3],
    expected: 6,
    explanation: "k가 전체 길이면 전체 합 6이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[-7], 1],
    expected: -7,
    failureNote: "하루짜리 창이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[-5, -1, -3, -2], 2],
    expected: -4,
    failureNote: "모두 손해면 가장 덜 손해인 [-1, -3]의 −4예요. 최댓값을 0으로 시작하면 틀려요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[3, 3, 3, 3], 2],
    expected: 6,
    failureNote: "모두 6이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 2001) - 1000), 50000],
    expected: 2352,
    failureNote: "10만 일, k = 5만이에요. 창마다 k개를 새로 더하면 약 25억 번이라 시간 초과예요.",
  },
]);

export const twoPointersBestKDays: Problem = {
  id: "c:two-pointers-best-k-days",
  slug: "two-pointers-best-k-days",
  source: "curated",
  topic: "two-pointers",
  level: 3,
  title: "가장 좋은 k일",
  summary: "창을 한 칸 옮길 때 새로 들어온 날은 더하고, 빠진 날은 빼요",
  statement: [
    "노디의 가게 장부에 날마다 이익 `profits`가 적혀 있어요 (음수는 손해).",
    "",
    "**연속한 k일**의 이익 합 중 가장 큰 값을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`profits`: 날마다 이익, `k`: 기간의 길이예요.",
  outputFormat: "연속한 k일 이익 합의 최댓값",
  constraints: ["1 ≤ k ≤ profits의 길이 ≤ 100,000", "−1,000 ≤ 이익 ≤ 1,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "profits",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "날마다 이익",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "기간 길이" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 합" },
  },
  starterCode: {
    python: ["def solution(profits, k):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(profits, k) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] profits, int k) {",
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
      body: ["**연속한 k일**의 합을 여러 번 → 창을 한 칸씩 옮기는 **고정 길이 창**이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 처음 k일의 합을 구해요.",
        "2. 창을 오른쪽으로 한 칸 옮길 때: 새로 들어온 `profits[i]`를 **더하고**, 빠져나간 `profits[i - k]`를 **빼요**.",
        "3. 옮길 때마다 최댓값을 갱신해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "window = sum(profits[0:k]); best = window",
        "for i in k..n-1:",
        "    window += profits[i] - profits[i - k]",
        "    best = max(best, window)",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["창을 옮기는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for i in range(k, len(profits)):", "    window += ______", "    best = max(best, window)"].join(
            "\n",
          ),
          javascript: [
            "for (let i = k; i < profits.length; i++) {",
            "  window += ______;",
            "  best = Math.max(best, window);",
            "}",
          ].join("\n"),
          java: [
            "for (int i = k; i < profits.length; i++) {",
            "    window += ______;",
            "    best = Math.max(best, window);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["fixed-window"],
  signalIds: ["sig-contiguous-window"],
  estimatedMinutes: 12,
  xp: 30,
};
