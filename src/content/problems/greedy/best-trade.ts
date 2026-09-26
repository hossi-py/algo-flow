import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[7, 1, 5, 3, 6, 4]],
    expected: 5,
    explanation: "2일(1)에 사서 5일(6)에 팔면 5예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[7, 6, 4, 3, 1]],
    expected: 0,
    explanation: "값이 계속 내려가서 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[5]],
    expected: 0,
    failureNote: "하루뿐이면 팔 날이 없어서 0이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[3, 8, 1, 4]],
    expected: 5,
    failureNote:
      "가장 싼 1은 뒤에 비싼 날이 없어요. 3에 사서 8에 판 5가 답이에요. 가장 싼 날과 가장 비싼 날을 따로 찾으면 틀려요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[2, 4, 1, 7]],
    expected: 6,
    failureNote: "1에 사서 7에 팔면 6이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 104729) % 100000) + 1)],
    expected: 99999,
    failureNote: "10만 일이에요. 사는 날과 파는 날을 모두 짝지어 보면 약 50억 번이라 시간 초과예요.",
  },
]);

export const greedyBestTrade: Problem = {
  id: "c:greedy-best-trade",
  slug: "greedy-best-trade",
  source: "curated",
  topic: "greedy",
  level: 1,
  title: "딸기 한 번 사고팔기",
  summary: "지금까지의 가장 싼 값만 기억하며 오늘 팔 때의 이익을 비교해요",
  statement: [
    "딸기 장터의 날마다 값 `prices`가 주어져요. 노디는 딸기 한 상자를 **한 번 사서 그 뒤의 어느 날 한 번** 팔 수 있어요.",
    "",
    "얻을 수 있는 **최대 이익**을 반환해 주세요. 이익을 낼 수 없으면 사지 않아서 0이에요.",
  ].join("\n"),
  inputFormat: "`prices`: 날마다 딸기 값이에요.",
  outputFormat: "최대 이익",
  constraints: ["1 ≤ prices의 길이 ≤ 100,000", "1 ≤ 값 ≤ 100,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "prices",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "날마다 값",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 이익" },
  },
  starterCode: {
    python: ["def solution(prices):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(prices) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] prices) {",
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
        "오늘 판다면, 사는 날은 **지금까지 가장 쌌던 날**이 최선이에요 → 한 번 훑으며 최선만 들고 가는 **그리디**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `lowest` = 지금까지 본 가장 싼 값",
        "2. 날마다 '오늘 판다면 이익 = 오늘 값 − lowest'로 답을 갱신해요.",
        "3. 그다음 `lowest`를 오늘 값과 비교해 줄여요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "lowest = 무한대, best = 0",
        "for p in prices:",
        "    best = max(best, p - lowest)",
        "    lowest = min(lowest, p)",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["오늘 팔 때의 이익을 계산하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for p in prices:", "    best = max(best, ______)", "    lowest = min(lowest, p)"].join("\n"),
          javascript: [
            "for (const p of prices) {",
            "  best = Math.max(best, ______);",
            "  lowest = Math.min(lowest, p);",
            "}",
          ].join("\n"),
          java: [
            "for (int p : prices) {",
            "    best = Math.max(best, ______);",
            "    lowest = Math.min(lowest, p);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-accumulate"],
  signalIds: ["sig-running-reach"],
  estimatedMinutes: 8,
  xp: 10,
};
