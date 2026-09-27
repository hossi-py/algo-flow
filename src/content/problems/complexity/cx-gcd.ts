import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [12, 18],
    expected: 6,
    explanation: "6 × 6 타일이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [7, 7],
    expected: 7,
    explanation: "같으면 그 길이 7이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [17, 5],
    expected: 1,
    failureNote: "서로 나누어떨어지는 수가 1뿐이라 1이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [1, 1000000000000000],
    expected: 1,
    failureNote: "1이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [1000000000000000, 999999999999999],
    expected: 1,
    failureNote: "이웃한 두 수는 최대공약수가 1이에요. 작은 수부터 하나씩 내려가며 확인하면 10¹⁵번이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [806515533049393, 498454011879264],
    expected: 1,
    failureNote: "피보나치 수 두 개예요. 유클리드 호제법이 가장 오래 걸리는 경우라도 70번 정도예요.",
  },
]);

export const cxGcd: Problem = {
  id: "c:cx-gcd",
  slug: "cx-gcd",
  source: "curated",
  topic: "complexity",
  level: 3,
  title: "가장 큰 공통 타일",
  summary: "큰 수를 작은 수로 나눈 나머지로 바꾸기를 반복하면 금방 끝나요 (유클리드 호제법)",
  statement: [
    "가로 `a`, 세로 `b`인 바닥을 똑같은 정사각형 타일로 빈틈없이 덮으려고 해요.",
    "",
    "쓸 수 있는 **가장 큰 타일의 한 변 길이**, 즉 a와 b의 최대공약수를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`a`, `b`: 바닥의 가로와 세로예요.",
  outputFormat: "최대공약수",
  constraints: ["1 ≤ a, b ≤ 10¹⁵"],
  signature: {
    name: "solution",
    params: [
      { name: "a", type: { python: "int", javascript: "number", java: "long" }, description: "가로" },
      { name: "b", type: { python: "int", javascript: "number", java: "long" }, description: "세로" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "최대공약수" },
  },
  starterCode: {
    python: ["def solution(a, b):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(a, b) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(long a, long b) {",
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
      body: [
        "작은 수부터 하나씩 나눠 보면 `O(N)`이라 10¹⁵에서는 끝나지 않아요. 수가 **빠르게 줄어드는** 방법이 필요해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "**유클리드 호제법**: a와 b의 최대공약수는 b와 `a % b`의 최대공약수와 같아요.",
        "",
        "`b`가 0이 될 때까지 `(a, b) → (b, a % b)`를 반복하면, 남은 `a`가 답이에요.",
        "",
        "나머지는 두 번마다 적어도 절반 아래로 줄어서 `O(log N)`번이면 끝나요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "while b != 0:", "    a, b = b, a % b", "return a", "~~~"].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["반복 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["while b != 0:", "    a, b = b, ______", "return a"].join("\n"),
          javascript: ["while (b !== 0) {", "  [a, b] = [b, ______];", "}", "return a;"].join("\n"),
          java: ["while (b != 0) {", "    long r = ______;", "    a = b;", "    b = r;", "}", "return a;"].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["halving-log"],
  signalIds: ["sig-huge-n"],
  estimatedMinutes: 10,
  xp: 30,
};
