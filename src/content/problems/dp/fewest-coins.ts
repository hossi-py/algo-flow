import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[1, 2, 5], 11],
    expected: 3,
    explanation: "5 + 5 + 1로 3개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[2], 3],
    expected: -1,
    explanation: "만들 수 없어서 -1이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[1], 0],
    expected: 0,
    failureNote: "금액 0은 동전 0개예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 3, 4], 6],
    expected: 2,
    failureNote: "큰 동전부터 욕심껏 쓰면 4 + 1 + 1로 3개지만, 3 + 3이면 2개예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[7, 11], 25],
    expected: 3,
    failureNote: "7 + 7 + 11로 3개예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 50 }, (_, i) => 2 * i + 37), 9999],
    expected: 75,
    failureNote: "동전 50종류, 금액 1만이에요. 모든 조합을 해 보면 끝나지 않아요.",
  },
]);

export const dpFewestCoins: Problem = {
  id: "c:dp-fewest-coins",
  slug: "dp-fewest-coins",
  source: "curated",
  topic: "dp",
  level: 3,
  title: "동전 가장 적게 쓰기",
  summary: "금액 a를 만드는 최소 동전 수 = min(a - 동전)의 최소 + 1",
  statement: [
    "도토리 동전의 종류 `coins`가 주어지고, 종류마다 몇 개든 쓸 수 있어요.",
    "",
    "금액 `amount`를 정확히 맞추는 데 필요한 **동전 개수의 최솟값**을 반환해 주세요. 맞출 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`coins`: 서로 다른 동전 금액, `amount`: 맞출 금액이에요.",
  outputFormat: "최소 동전 개수 (불가능하면 -1)",
  constraints: ["1 ≤ coins의 길이 ≤ 50", "1 ≤ 동전 금액 ≤ 10,000 (서로 다름)", "0 ≤ amount ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      { name: "coins", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "동전 금액" },
      { name: "amount", type: { python: "int", javascript: "number", java: "int" }, description: "맞출 금액" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최소 개수" },
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
      body: [
        "동전을 골라 **최소 개수** → 큰 동전부터 쓰는 욕심은 틀릴 수 있어요 ([1, 3, 4]로 6). **동전 DP**로 모든 금액의 최소를 비교해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 표의 뜻: `fewest[a]` = 금액 a를 만드는 최소 동전 수 (못 만들면 무한대). `fewest[0] = 0`",
        "2. 마지막에 쓴 동전이 c라면 나머지는 a - c예요 → `fewest[a] = min(fewest[a - c] + 1)`",
        "3. 답이 무한대로 남으면 -1이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "fewest = [INF] * (amount + 1); fewest[0] = 0",
        "for a in 1 .. amount:",
        "    for c in coins:",
        "        if c <= a: fewest[a] = min(fewest[a], fewest[a - c] + 1)",
        "return fewest[amount] (INF면 -1)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["마지막 동전을 정해 비교하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for c in coins:",
            "    for a in range(c, amount + 1):",
            "        fewest[a] = min(fewest[a], ______)",
          ].join("\n"),
          javascript: [
            "for (const c of coins) {",
            "  for (let a = c; a <= amount; a++) fewest[a] = Math.min(fewest[a], ______);",
            "}",
          ].join("\n"),
          java: [
            "for (int c : coins) {",
            "    for (int a = c; a <= amount; a++) {",
            "        if (fewest[a - c] != INF) fewest[a] = Math.min(fewest[a], ______);",
            "    }",
            "}",
          ].join("\n"),
        },
        caption: "INF에 1을 더하면 int가 넘쳐서, 만들 수 있는 금액일 때만 더해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["knapsack"],
  signalIds: ["sig-best-choice-sequence"],
  estimatedMinutes: 15,
  xp: 30,
};
