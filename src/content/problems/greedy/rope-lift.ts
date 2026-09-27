import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[10, 15]],
    expected: 20,
    explanation: "둘 다 쓰면 가장 약한 10 × 2 = 20, 15만 쓰면 15라 20이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[7]],
    expected: 7,
    explanation: "밧줄 하나면 7이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 100]],
    expected: 100,
    failureNote: "둘 다 쓰면 약한 1에 맞춰 2밖에 안 돼요. 100 하나만 쓰는 게 나아요. 모두 쓰는 게 늘 최선은 아니에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [[5, 5, 5, 5]],
    expected: 20,
    failureNote: "모두 쓰면 20이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[3, 8, 4, 2]],
    expected: 9,
    failureNote: "8, 4, 3을 쓰면 3 × 3 = 9예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 10000) + 1)],
    expected: 250050000,
    failureNote: "밧줄 10만 개예요. 고르는 방법을 모두 해 보면 불가능해요.",
  },
]);

export const greedyRopeLift: Problem = {
  id: "c:greedy-rope-lift",
  slug: "greedy-rope-lift",
  source: "curated",
  topic: "greedy",
  level: 2,
  title: "밧줄로 짐 들어 올리기",
  summary: "k개를 쓴다면 튼튼한 k개를 골라야 해요. 약한 밧줄 × 개수의 최댓값",
  statement: [
    "밧줄 여러 개로 짐을 들어 올려요. i번 밧줄은 무게 `ropes[i]`까지 버텨요. 밧줄 k개를 함께 쓰면 짐의 무게가 **똑같이 나뉘어서**, 각 밧줄에 `무게 ÷ k`씩 걸려요.",
    "",
    "밧줄을 몇 개든 골라 쓸 수 있을 때, 들어 올릴 수 있는 **짐의 최대 무게**를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`ropes`: 밧줄별로 버티는 무게예요.",
  outputFormat: "최대 무게",
  constraints: ["1 ≤ ropes의 길이 ≤ 100,000", "1 ≤ 버티는 무게 ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "ropes",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "밧줄별 버티는 무게",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 무게" },
  },
  starterCode: {
    python: ["def solution(ropes):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(ropes) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] ropes) {",
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
        "k개를 쓴다면 **가장 튼튼한 k개**를 쓰는 게 늘 최선이에요 → 정렬하고 k마다 한 번씩만 확인하는 **정렬 그리디**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 밧줄을 튼튼한 순(내림차순)으로 정렬해요.",
        "2. 앞의 k개를 쓰면 가장 약한 건 `ropes[k-1]`이라, 무게는 `ropes[k-1] × k`예요.",
        "3. k = 1 … n 중 최댓값이 답이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "r = ropes를 내림차순 정렬",
        "best = 0",
        "for k in 1..n:",
        "    best = max(best, r[k-1] * k)",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["k개를 쓸 때의 무게예요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "r = sorted(ropes, reverse=True)",
            "for k in range(1, len(r) + 1):",
            "    best = max(best, ______)",
          ].join("\n"),
          javascript: [
            "const r = [...ropes].sort((a, b) => b - a);",
            "for (let k = 1; k <= r.length; k++) best = Math.max(best, ______);",
          ].join("\n"),
          java: [
            "int[] r = ropes.clone();",
            "Arrays.sort(r);   // 약한 순",
            "int n = r.length;",
            "for (int k = 1; k <= n; k++) best = Math.max(best, ______);",
          ].join("\n"),
        },
        caption: "오름차순으로 정렬했다면 튼튼한 k개 중 가장 약한 건 r[n - k]예요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-by-sort"],
  signalIds: ["sig-greedy-local-best"],
  estimatedMinutes: 12,
  xp: 20,
};
