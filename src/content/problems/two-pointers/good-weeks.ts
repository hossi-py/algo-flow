import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[2, 2, 2, 2, 5, 5, 5, 8], 3, 4],
    expected: 3,
    explanation: "[2, 5, 5], [5, 5, 5], [5, 5, 8] 세 기간이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[11, 13, 17, 23, 29, 31, 7, 5, 2, 3], 3, 5],
    expected: 6,
    explanation: "앞의 6개 기간이 평균 5 이상이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[1], 1, 1],
    expected: 1,
    failureNote: "평균이 기준과 같아도 셉니다.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 2], 2, 2],
    expected: 0,
    failureNote: "평균 1.5는 2보다 작아요. 정수 나눗셈(3 // 2 = 1)을 쓰면 헷갈리니 합 ≥ 기준 × k로 비교하세요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[0, 0, 0], 2, 0],
    expected: 2,
    failureNote: "기준이 0이면 모든 기간이라 2개예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i * 7919) % 101), 30000, 50],
    expected: 35346,
    failureNote: "10만 일, k = 3만이에요. 창마다 새로 더하면 시간 초과예요.",
  },
]);

export const twoPointersGoodWeeks: Problem = {
  id: "c:two-pointers-good-weeks",
  slug: "two-pointers-good-weeks",
  source: "curated",
  topic: "two-pointers",
  level: 3,
  title: "평균 이상인 기간 세기",
  summary: "평균 ≥ 기준은 합 ≥ 기준 × k와 같아요. 창을 옮기며 세요",
  statement: [
    "숲속 학교의 날마다 점수 `scores`가 있어요. **연속한 k일**의 평균이 `threshold` **이상**인 기간이 몇 개인지 세려고 해요.",
    "",
    "그런 기간의 수를 반환해 주세요. 시작일이 다르면 다른 기간이에요.",
  ].join("\n"),
  inputFormat: "`scores`: 날마다 점수, `k`: 기간 길이, `threshold`: 기준 평균이에요.",
  outputFormat: "기간의 수",
  constraints: ["1 ≤ k ≤ scores의 길이 ≤ 100,000", "0 ≤ 점수, threshold ≤ 100"],
  signature: {
    name: "solution",
    params: [
      {
        name: "scores",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "날마다 점수",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "기간 길이" },
      { name: "threshold", type: { python: "int", javascript: "number", java: "int" }, description: "기준 평균" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "기간 수" },
  },
  starterCode: {
    python: ["def solution(scores, k, threshold):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(scores, k, threshold) {", "  let answer = 0;", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public int solution(int[] scores, int k, int threshold) {",
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
      body: ["**연속한 k일**을 모두 확인 → **고정 길이 창**이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "평균 ≥ 기준은 **합 ≥ 기준 × k**와 같아요. 나눗셈 없이 합만 비교해요.",
        "",
        "1. 처음 k일의 합을 구하고 비교해요.",
        "2. 한 칸씩 옮기며 들어온 날은 더하고 빠진 날은 빼고, 다시 비교해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "need = threshold * k",
        "window = sum(scores[0:k]); count = (window >= need)",
        "for i in k..n-1:",
        "    window += scores[i] - scores[i - k]",
        "    if window >= need: count += 1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["기간을 세는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i in range(k, len(scores)):",
            "    window += scores[i] - scores[i - k]",
            "    if ______:",
            "        count += 1",
          ].join("\n"),
          javascript: [
            "for (let i = k; i < scores.length; i++) {",
            "  window += scores[i] - scores[i - k];",
            "  if (______) count++;",
            "}",
          ].join("\n"),
          java: [
            "for (int i = k; i < scores.length; i++) {",
            "    window += scores[i] - scores[i - k];",
            "    if (______) count++;",
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
