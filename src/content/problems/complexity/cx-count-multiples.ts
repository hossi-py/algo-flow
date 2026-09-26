import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [10, 3],
    expected: 3,
    explanation: "3, 6, 9로 3개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [7, 7],
    expected: 1,
    explanation: "7 하나라 1개예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1, 1],
    expected: 1,
    failureNote: "1은 1의 배수라 1개예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [100, 10],
    expected: 10,
    failureNote: "10, 20, …, 100으로 10개예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [999999999999999, 2],
    expected: 499999999999999,
    failureNote: "홀수까지라 499,999,999,999,999개예요. 나눗셈 결과를 정수로 버려야 해요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [1000000000000000, 7],
    expected: 142857142857142,
    failureNote: "10¹⁵까지 하나씩 세면 몇 달이 걸려요.",
  },
]);

export const cxCountMultiples: Problem = {
  id: "c:cx-count-multiples",
  slug: "cx-count-multiples",
  source: "curated",
  topic: "complexity",
  level: 1,
  title: "배수는 몇 개?",
  summary: "하나씩 세지 않고 나눗셈 한 번으로 구해요",
  statement: [
    "1부터 `n`까지의 수 중에서 `k`의 배수는 몇 개인지 반환해 주세요.",
    "",
    "`n`은 아주 클 수 있어요. 하나씩 세면 시간 안에 끝나지 않아요.",
  ].join("\n"),
  inputFormat: "`n`: 마지막 수, `k`: 나누는 수예요.",
  outputFormat: "k의 배수의 개수",
  constraints: ["1 ≤ k ≤ n ≤ 10¹⁵"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "long" }, description: "마지막 수" },
      { name: "k", type: { python: "int", javascript: "number", java: "long" }, description: "나누는 수" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "배수의 개수" },
  },
  starterCode: {
    python: ["def solution(n, k):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, k) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(long n, long k) {",
      "        long answer = 0;",
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
      body: ["n이 10¹⁵까지라 반복문 한 바퀴(`O(N)`)도 못 돌아요. 식 하나로 끝내는 `O(1)`이 필요해요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "k의 배수는 k, 2k, 3k, …예요. `m × k ≤ n`인 가장 큰 m이 개수예요.",
        "",
        "그 m은 **n을 k로 나눈 몫**이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "return n을 k로 나눈 몫 (소수점 아래 버림)", "~~~"].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["정수 나눗셈 한 줄이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["return ______"].join("\n"),
          javascript: ["return Math.floor(______);"].join("\n"),
          java: ["return ______;"].join("\n"),
        },
        caption: "10¹⁵은 int(약 21억)를 넘어서 long을 써요. long끼리 나누면 몫만 남아요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["formula-o1"],
  signalIds: ["sig-huge-n"],
  estimatedMinutes: 5,
  xp: 10,
};
