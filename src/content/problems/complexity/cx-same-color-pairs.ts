import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[1, 2, 1, 1, 2]],
    expected: 4,
    explanation: "색 1이 3개라 3가지, 색 2가 2개라 1가지, 합 4예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[5, 6, 7]],
    expected: 0,
    explanation: "같은 색이 없어서 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[0]],
    expected: 0,
    failureNote: "구슬 하나면 0이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [[3, 3, 3, 3]],
    expected: 6,
    failureNote: "4개에서 2개 고르기: 6가지예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[0, 99, 0, 99, 50]],
    expected: 2,
    failureNote: "0과 99처럼 끝 번호도 세요: 2예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i * 7919) % 100)],
    expected: 49950000,
    failureNote: "구슬 10만 개예요. 모든 쌍을 비교하면 약 50억 번이에요.",
  },
]);

export const cxSameColorPairs: Problem = {
  id: "c:cx-same-color-pairs",
  slug: "cx-same-color-pairs",
  source: "curated",
  topic: "complexity",
  level: 2,
  title: "같은 색 짝꿍",
  summary: "색마다 개수를 먼저 세고, 개수로 짝의 수를 공식으로 구해요",
  statement: [
    "구슬 `n`개의 색 번호 `colors`가 있어요. 색 번호는 0부터 99까지예요.",
    "",
    "**같은 색**인 두 구슬을 고르는 방법은 모두 몇 가지인지 반환해 주세요. (고르는 순서는 상관없어요)",
  ].join("\n"),
  inputFormat: "`colors`: 구슬마다 색 번호예요.",
  outputFormat: "같은 색 두 구슬을 고르는 방법의 수",
  constraints: ["1 ≤ n ≤ 100,000", "0 ≤ 색 번호 ≤ 99"],
  signature: {
    name: "solution",
    params: [
      {
        name: "colors",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "구슬 색 번호",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "방법의 수" },
  },
  starterCode: {
    python: ["def solution(colors):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(colors) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(int[] colors) {",
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
      body: ["모든 쌍을 비교하면 `O(N²)`이에요. 색이 100가지뿐이라 **색마다 개수를 세면** `O(N)`이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 길이 100인 배열 `count`에 색마다 몇 개인지 세요.",
        "2. 같은 색이 c개면, 그중 2개를 고르는 방법은 `c × (c − 1) ÷ 2`예요. (악수 공식과 같아요)",
        "3. 색마다 더해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "count = [0] * 100",
        "for c in colors: count[c] += 1",
        "return sum(c * (c - 1) / 2 for c in count)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["색마다 짝을 더하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["return sum(______ for c in count)"].join("\n"),
          javascript: ["let total = 0;", "for (const c of count) total += ______;", "return total;"].join("\n"),
          java: ["long total = 0;", "for (int c : count) total += ______;", "return total;"].join("\n"),
        },
        caption: "짝의 수는 21억을 넘을 수 있어서 long으로 더해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["single-pass"],
  signalIds: ["sig-all-pairs-slow"],
  estimatedMinutes: 10,
  xp: 20,
};
