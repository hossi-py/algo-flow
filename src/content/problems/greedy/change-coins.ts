import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[500, 100, 50, 10], 1260],
    expected: 6,
    explanation: "500×2, 100×2, 50×1, 10×1로 6개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[10, 50, 100, 500], 10],
    expected: 1,
    explanation: "10원 한 개예요. 동전이 작은 순으로 와도 큰 것부터 써요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 5, 25], 99],
    expected: 11,
    failureNote: "25×3, 5×4, 1×4로 11개예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[7], 49],
    expected: 7,
    failureNote: "동전이 한 종류면 49 ÷ 7 = 7개예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 2, 4, 8], 15],
    expected: 4,
    failureNote: "8 + 4 + 2 + 1로 4개예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [[10, 50, 100, 500, 1000, 5000, 10000, 50000], 999999990],
    expected: 20018,
    failureNote: "10억 가까운 금액이에요. 가장 작은 동전을 하나씩 빼 나가면 시간 초과예요. 나눗셈으로 한 번에 세요.",
  },
]);

export const greedyChangeCoins: Problem = {
  id: "c:greedy-change-coins",
  slug: "greedy-change-coins",
  source: "curated",
  topic: "greedy",
  level: 1,
  title: "도토리 동전 거스름돈",
  summary: "큰 동전이 작은 동전의 배수라서, 큰 동전부터 쓸 수 있는 만큼 써요",
  statement: [
    "숲속 가게에서 거스름돈 `amount`를 도토리 동전으로 줘요. 동전의 종류 `coins`는 몇 개든 쓸 수 있어요.",
    "",
    "이 가게의 동전은 특별해서, 정렬했을 때 **큰 동전은 항상 바로 아래 동전의 배수**예요 (예: 500, 100, 50, 10). 그리고 `amount`는 항상 정확히 맞출 수 있어요.",
    "",
    "거스름돈을 주는 데 필요한 **동전 수의 최솟값**을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`coins`: 동전 금액(순서 없음), `amount`: 거스름돈이에요.",
  outputFormat: "동전 수의 최솟값",
  constraints: [
    "1 ≤ coins의 길이 ≤ 10",
    "큰 동전은 바로 아래 동전의 배수이고, 가장 작은 동전은 amount를 나누어떨어지게 해요",
    "1 ≤ amount ≤ 1,000,000,000",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "coins", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "동전 금액" },
      { name: "amount", type: { python: "int", javascript: "number", java: "int" }, description: "거스름돈" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최소 동전 수" },
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
        "동전 수를 **최소**로, 그리고 큰 동전이 작은 동전의 **배수** → 큰 동전부터 욕심껏 쓰는 **그리디**가 항상 최선이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 동전을 **큰 것부터** 정렬해요.",
        "2. 동전마다 `amount // coin`개를 쓰고, 남은 금액은 `amount % coin`이에요.",
        "",
        "배수 관계라서, 큰 동전 하나로 낼 수 있는 금액을 작은 동전 여러 개로 내면 항상 손해예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "count = 0",
        "for coin in coins를 큰 순서로:",
        "    count += amount // coin",
        "    amount %= coin",
        "return count",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["큰 동전부터 쓰는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for coin in sorted(coins, reverse=True):", "    count += ______", "    amount %= coin"].join("\n"),
          javascript: [
            "for (const coin of [...coins].sort((a, b) => b - a)) {",
            "  count += ______;",
            "  amount %= coin;",
            "}",
          ].join("\n"),
          java: [
            "int[] sorted = coins.clone();",
            "Arrays.sort(sorted);",
            "for (int i = sorted.length - 1; i >= 0; i--) {",
            "    count += ______;",
            "    amount %= sorted[i];",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-by-sort"],
  signalIds: ["sig-greedy-local-best"],
  visualization: {
    presets: [
      problemPreset("greedy-change-coins-ex1", "greedy-coins", "1260원 거스름돈", "큰 동전부터 쓸 수 있는 만큼 써요.", [
        [500, 100, 50, 10],
        1260,
      ]),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
