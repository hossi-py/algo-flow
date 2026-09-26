import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[1, 2, 5], 5],
    expected: 4,
    explanation: "5, 2+2+1, 2+1+1+1, 1×5 네 가지예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[2], 3],
    expected: 0,
    explanation: "2로는 3을 만들 수 없어서 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[7], 0],
    expected: 1,
    failureNote: "금액 0은 아무 동전도 안 쓰는 1가지예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 2], 3],
    expected: 2,
    failureNote: "1+1+1, 1+2 두 가지예요. 순서를 따지면(1+2, 2+1) 3이 나와서 틀려요. 동전 반복문을 바깥에 두세요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[10], 10],
    expected: 1,
    failureNote: "10 하나로 1가지예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 50 }, (_, i) => i + 1), 10000],
    expected: 783279696,
    failureNote: "동전 50종류, 금액 1만이에요. 경우를 하나씩 만들면 끝나지 않아요.",
  },
]);

export const dpCoinWays: Problem = {
  id: "c:dp-coin-ways",
  slug: "dp-coin-ways",
  source: "curated",
  topic: "dp",
  level: 3,
  title: "도토리 동전으로 값 치르기",
  summary: "동전을 하나씩 보며 '금액 a를 만드는 방법 수' 표를 작은 금액부터 채워요",
  statement: [
    "숲속 가게에서는 도토리 동전을 써요. 동전의 종류 `coins`가 주어지고, 종류마다 **몇 개든** 쓸 수 있어요.",
    "",
    "금액 `amount`를 정확히 맞추는 방법의 수를 **1,000,000,007로 나눈 나머지**로 반환해 주세요. 쓰는 **순서는 상관없어요** (1 + 2와 2 + 1은 같은 방법이에요).",
  ].join("\n"),
  inputFormat: "`coins`: 서로 다른 동전 금액, `amount`: 맞출 금액이에요.",
  outputFormat: "방법의 수를 1,000,000,007로 나눈 나머지",
  constraints: ["1 ≤ coins의 길이 ≤ 50", "1 ≤ 동전 금액 ≤ 10,000 (서로 다름)", "0 ≤ amount ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      { name: "coins", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "동전 금액" },
      { name: "amount", type: { python: "int", javascript: "number", java: "int" }, description: "맞출 금액" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "방법의 수 (나머지)" },
  },
  starterCode: {
    python: ["def solution(coins, amount):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(coins, amount) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] coins, int amount) {",
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
      body: ["동전을 **몇 개씩 넣을지** 고르는 **방법의 수** + 나머지 → **동전 DP**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 표의 뜻: `ways[a]` = 지금까지 본 동전들로 금액 a를 만드는 방법 수. `ways[0] = 1`",
        "2. 동전 c를 하나씩 추가해요. 금액을 **작은 쪽부터** 돌며 `ways[a] += ways[a - c]`",
        "",
        "동전을 **바깥** 반복문에 두면 같은 조합을 순서만 바꿔 두 번 세지 않아요. 작은 금액부터 돌면 같은 동전을 여러 번 쓸 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "ways = [0] * (amount + 1); ways[0] = 1",
        "for c in coins:",
        "    for a in c .. amount:",
        "        ways[a] = (ways[a] + ways[a - c]) % MOD",
        "return ways[amount]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["표를 채우는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "ways = [0] * (amount + 1)",
            "ways[0] = 1",
            "for c in coins:",
            "    for a in range(c, amount + 1):",
            "        ways[a] = (ways[a] + ______) % MOD",
          ].join("\n"),
          javascript: [
            "const ways = Array(amount + 1).fill(0);",
            "ways[0] = 1;",
            "for (const c of coins) {",
            "  for (let a = c; a <= amount; a++) ways[a] = (ways[a] + ______) % MOD;",
            "}",
          ].join("\n"),
          java: [
            "long[] ways = new long[amount + 1];",
            "ways[0] = 1;",
            "for (int c : coins) {",
            "    for (int a = c; a <= amount; a++) ways[a] = (ways[a] + ______) % MOD;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["knapsack"],
  signalIds: ["sig-count-ways-mod"],
  estimatedMinutes: 15,
  xp: 30,
};
