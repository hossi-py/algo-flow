import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [8],
    expected: 3,
    explanation: "8 → 4 → 2 → 1로 3번이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [7],
    expected: 2,
    explanation: "7 → 3 → 1로 2번이에요. 나머지는 버려요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1],
    expected: 0,
    failureNote: "처음부터 1장이라 0번이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [1000],
    expected: 9,
    failureNote: "1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1로 9번이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [1000000000000000],
    expected: 49,
    failureNote: "10¹⁵도 49번이면 돼요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [2],
    expected: 1,
    failureNote: "1번이에요.",
  },
]);

export const cxHalvingSteps: Problem = {
  id: "c:cx-halving-steps",
  slug: "cx-halving-steps",
  source: "curated",
  topic: "complexity",
  level: 3,
  title: "반으로 접기",
  summary: "절반씩 줄이면 10¹⁵도 50번이면 끝나요 — O(log N)",
  statement: [
    "종이 더미에 `n`장이 있어요. 한 번에 더미를 반으로 나눠 **절반**(나머지는 버림)만 남겨요. 예를 들어 7장이면 3장이 남아요.",
    "",
    "1장이 남을 때까지 몇 번 나누는지 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 처음 장 수예요.",
  outputFormat: "나누는 횟수",
  constraints: ["1 ≤ n ≤ 10¹⁵"],
  signature: {
    name: "solution",
    params: [{ name: "n", type: { python: "int", javascript: "number", java: "long" }, description: "처음 장 수" }],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "나누는 횟수" },
  },
  starterCode: {
    python: ["def solution(n):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(long n) {",
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
      body: ["매번 **절반**으로 줄어요. 이런 반복은 `O(log N)`번이라 N이 10¹⁵여도 50번 정도면 끝나요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "그대로 따라 하면 돼요. `n`이 1보다 큰 동안 `n`을 2로 나눈 몫으로 바꾸고 횟수를 세요.",
        "",
        "하나씩 빼는 반복이었다면 10¹⁵번이지만, 절반씩이라 금방 끝나요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "steps = 0", "while n > 1:", "    n = n // 2", "    steps += 1", "return steps", "~~~"].join(
        "\n",
      ),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["절반으로 줄이는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["while n > 1:", "    n = ______", "    steps += 1"].join("\n"),
          javascript: ["while (n > 1) {", "  n = ______;", "  steps++;", "}"].join("\n"),
          java: ["while (n > 1) {", "    n = ______;", "    steps++;", "}"].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["halving-log"],
  signalIds: ["sig-huge-n"],
  visualization: {
    presets: [
      problemPreset(
        "cx-halving-steps-1000",
        "cx-halving",
        "1000장을 반으로",
        "1000장도 9번 나누면 1장이 돼요.",
        [1000],
      ),
    ],
  },
  estimatedMinutes: 6,
  xp: 30,
};
