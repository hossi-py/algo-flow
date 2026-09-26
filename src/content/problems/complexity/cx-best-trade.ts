import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[7, 1, 5, 3, 6, 4]],
    expected: 5,
    explanation: "1에 사서 6에 팔면 5예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[7, 6, 4, 3, 1]],
    expected: 0,
    explanation: "계속 내려서 사지 않아요: 0.",
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
      "가장 싼 1은 뒤에 있어서 1 → 4는 3뿐이에요. 3 → 8의 5가 더 커요. 가장 싼 날과 가장 비싼 날을 따로 고르면 틀려요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[2, 4, 1, 7]],
    expected: 6,
    failureNote: "1에 사서 7에 팔아 6이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 10000) + 1)],
    expected: 9999,
    failureNote: "10만 일이에요. 모든 두 날을 비교하면 약 50억 번이에요.",
  },
]);

export const cxBestTrade: Problem = {
  id: "c:cx-best-trade",
  slug: "cx-best-trade",
  source: "curated",
  topic: "complexity",
  level: 2,
  title: "한 번 사고 한 번 팔기",
  summary: "지금까지 가장 싼 가격만 기억하며 한 번 훑으면 모든 쌍을 볼 필요가 없어요",
  statement: [
    "`prices[i]`는 i번째 날 도토리 한 알의 가격이에요. **한 번 사고, 그보다 뒤의 날에 한 번 팔** 수 있어요.",
    "",
    "얻을 수 있는 **가장 큰 이익**을 반환해 주세요. 이익을 낼 수 없으면 사지 않고 `0`이에요.",
  ].join("\n"),
  inputFormat: "`prices`: 날마다 가격이에요.",
  outputFormat: "가장 큰 이익 (없으면 0)",
  constraints: ["1 ≤ prices의 길이 ≤ 100,000", "1 ≤ 가격 ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "prices",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "날마다 가격",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "가장 큰 이익" },
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
      body: ["모든 (사는 날, 파는 날) 쌍을 보면 `O(N²)`이에요. N이 10만이라 **한 번 훑기**(O(N))로 바꿔야 해요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "파는 날을 j로 정하면, 가장 좋은 사는 날은 **j보다 앞에서 가장 싼 날**이에요.",
        "",
        "왼쪽부터 훑으며 '지금까지 가장 싼 가격' `low`를 기억하면, 날마다 `가격 − low`가 그날 팔 때의 최대 이익이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "best = 0;  low = prices[0]",
        "for p in prices:",
        "    best = max(best, p - low)",
        "    low = min(low, p)",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["한 번 훑는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for p in prices:", "    best = max(best, ______)", "    low = min(low, p)"].join("\n"),
          javascript: [
            "for (const p of prices) {",
            "  best = Math.max(best, ______);",
            "  low = Math.min(low, p);",
            "}",
          ].join("\n"),
          java: [
            "for (int p : prices) {",
            "    best = Math.max(best, ______);",
            "    low = Math.min(low, p);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["single-pass"],
  signalIds: ["sig-all-pairs-slow"],
  visualization: {
    presets: [
      problemPreset(
        "cx-best-trade-ex1",
        "cx-pairs",
        "비교 횟수 세어 보기",
        "모든 쌍은 15번, 한 번 훑기는 5번 비교해서 같은 답 5를 구해요.",
        [[7, 1, 5, 3, 6, 4]],
      ),
    ],
  },
  estimatedMinutes: 10,
  xp: 20,
};
