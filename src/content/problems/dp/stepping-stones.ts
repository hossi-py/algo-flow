import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[10, 15, 20]],
    expected: 15,
    explanation: "1번 돌(15)에서 시작해 두 칸 뛰면 건너편이라 15예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]],
    expected: 6,
    explanation: "100인 돌을 모두 피해서 6이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[5, 3]],
    expected: 3,
    failureNote: "1번 돌에서 시작해 한 칸 뛰면 건너편이라 3이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[0, 0, 0, 0]],
    expected: 0,
    failureNote: "모두 0이면 0이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 2, 100, 1]],
    expected: 3,
    failureNote:
      "0번(1)이 더 싸 보여도, 1번(2)에서 시작해 3번(1)으로 두 칸 뛰면 3이라 더 적어요. 시작 돌도 두 가지를 모두 비교해야 해요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i * 7919) % 1000)],
    expected: 23025600,
    failureNote: "돌 10만 개예요. 모든 뛰는 방법을 다 해 보면 시간 초과예요.",
  },
]);

export const dpSteppingStones: Problem = {
  id: "c:dp-stepping-stones",
  slug: "dp-stepping-stones",
  source: "curated",
  topic: "dp",
  level: 1,
  title: "징검다리 최소 체력",
  summary: "i번 돌에 도착하는 최소 체력 = min(한 칸 전, 두 칸 전) + 이 돌",
  statement: [
    "개울에 징검돌이 한 줄로 놓여 있고, i번 돌을 밟으면 체력이 `cost[i]`만큼 들어요. 노디는 **0번이나 1번 돌**에서 시작해 한 번에 **1칸 또는 2칸** 앞으로 뛰어요.",
    "",
    "마지막 돌 너머 **건너편**에 도착하는 데 드는 체력의 최솟값을 반환해 주세요. 시작하는 돌의 체력도 들어요.",
  ].join("\n"),
  inputFormat: "`cost`: 돌마다 드는 체력이에요.",
  outputFormat: "건너편까지 드는 최소 체력",
  constraints: ["2 ≤ cost의 길이 ≤ 100,000", "0 ≤ cost[i] ≤ 1,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "cost",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "돌마다 체력",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최소 체력" },
  },
  starterCode: {
    python: ["def solution(cost):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(cost) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] cost) {",
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
        "뛸 때마다 선택(1칸/2칸)이 있고 **최소** 체력을 물어요. 앞에서 구한 최소를 적어 두고 쓰는 **1차원 DP**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 표의 뜻: `best[i]` = i번 돌을 **밟을 때까지** 드는 최소 체력",
        "2. i번 돌에는 i-1번이나 i-2번에서 뛰어와요 → `best[i] = min(best[i-1], best[i-2]) + cost[i]`",
        "3. 시작 값: `best[0] = cost[0]`, `best[1] = cost[1]`",
        "4. 건너편은 마지막 돌이나 그 앞 돌에서 뛰어와요 → `min(best[n-1], best[n-2])`",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "best[0] = cost[0]; best[1] = cost[1]",
        "for i in 2 .. n-1:",
        "    best[i] = min(best[i-1], best[i-2]) + cost[i]",
        "return min(best[n-1], best[n-2])",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["점화식 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "best = cost[:]",
            "for i in range(2, len(cost)):",
            "    best[i] = ______ + cost[i]",
            "return min(best[-1], best[-2])",
          ].join("\n"),
          javascript: [
            "const best = [...cost];",
            "for (let i = 2; i < cost.length; i++) best[i] = ______ + cost[i];",
            "return Math.min(best[best.length - 1], best[best.length - 2]);",
          ].join("\n"),
          java: [
            "int[] best = cost.clone();",
            "for (int i = 2; i < cost.length; i++) best[i] = ______ + cost[i];",
            "return Math.min(best[best.length - 1], best[best.length - 2]);",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["linear-dp"],
  signalIds: ["sig-overlapping-subproblems", "sig-best-choice-sequence"],
  estimatedMinutes: 10,
  xp: 10,
};
