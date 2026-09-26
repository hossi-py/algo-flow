import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [7],
    expected: "YES",
    explanation: "1과 7로만 나누어떨어져요: YES.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [1],
    expected: "NO",
    explanation: "1은 소수가 아니에요: NO.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [2],
    expected: "YES",
    failureNote: "2는 가장 작은 소수예요: YES.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [9],
    expected: "NO",
    failureNote: "3 × 3이라 NO예요. √9 = 3까지 꼭 확인해야 해요 (i < √n으로 멈추면 틀려요).",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [10000000000],
    expected: "NO",
    failureNote: "짝수라 NO예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [9999999967],
    expected: "YES",
    failureNote: "10¹⁰보다 작은 가장 큰 소수예요. √n인 약 10만까지 다 봐야 하지만, n까지 보면 100억 번이에요.",
  },
]);

export const cxIsPrime: Problem = {
  id: "c:cx-is-prime",
  slug: "cx-is-prime",
  source: "curated",
  topic: "complexity",
  level: 4,
  title: "소수일까?",
  summary: "√n까지 나누어떨어지는 수가 없으면 소수예요",
  statement: [
    '자연수 `n`이 **소수**(1과 자기 자신으로만 나누어떨어지는 1보다 큰 수)이면 `"YES"`, 아니면 `"NO"`를 반환해 주세요.',
  ].join("\n"),
  inputFormat: "`n`: 자연수예요.",
  outputFormat: '"YES" 또는 "NO"',
  constraints: ["1 ≤ n ≤ 10¹⁰"],
  signature: {
    name: "solution",
    params: [{ name: "n", type: { python: "int", javascript: "number", java: "long" }, description: "자연수" }],
    returns: { type: { python: "str", javascript: "string", java: "String" }, description: "YES 또는 NO" },
  },
  starterCode: {
    python: ["def solution(n):", '    answer = ""', "    return answer", ""].join("\n"),
    javascript: ["function solution(n) {", '  let answer = "";', "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String solution(long n) {",
      '        String answer = "";',
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
      body: ["2부터 n − 1까지 나눠 보면 `O(N)`이에요. 약수는 짝을 이루니 **√N까지만** 나눠 보면 돼요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "n이 소수가 아니면 `n = a × b`(1 < a ≤ b)로 쓸 수 있고, 이때 `a ≤ √n`이에요.",
        "",
        "그래서 2부터 `i × i ≤ n`인 i까지 나눠 보고, 하나라도 나누어떨어지면 소수가 아니에요. 1은 따로 NO로 처리해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "if n < 2: return NO",
        "for i = 2, 3, … while i * i <= n:",
        "    if n % i == 0: return NO",
        "return YES",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["나눠 보는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "i = 2",
            "while i * i <= n:",
            "    if ______:",
            '        return "NO"',
            "    i += 1",
            'return "YES"',
          ].join("\n"),
          javascript: ["for (let i = 2; i * i <= n; i++) {", '  if (______) return "NO";', "}", 'return "YES";'].join(
            "\n",
          ),
          java: ["for (long i = 2; i * i <= n; i++) {", '    if (______) return "NO";', "}", 'return "YES";'].join(
            "\n",
          ),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["sqrt-bound"],
  signalIds: ["sig-huge-n"],
  estimatedMinutes: 8,
  xp: 40,
};
