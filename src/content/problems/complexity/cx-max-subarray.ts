import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
    expected: 6,
    explanation: "4 − 1 + 2 + 1 = 6이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [[-3, -1, -2]],
    expected: -1,
    explanation: "모두 음수면 가장 큰 한 칸 −1이에요. 한 칸 이상 골라야 해서 0이 아니에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[5]],
    expected: 5,
    failureNote: "5예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 2, 3]],
    expected: 6,
    failureNote: "전부 더해 6이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[2, -10, 3]],
    expected: 3,
    failureNote: "앞의 2를 이어 가면 손해라 3만 골라요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 20001) - 10000)],
    expected: 77468,
    failureNote: "10만 칸이에요. 모든 (시작, 끝) 쌍을 보면 약 50억 번이에요.",
  },
]);

export const cxMaxSubarray: Problem = {
  id: "c:cx-max-subarray",
  slug: "cx-max-subarray",
  source: "curated",
  topic: "complexity",
  level: 5,
  title: "가장 큰 연속 합",
  summary: "'여기서 끝나는 가장 큰 합'만 들고 다니면 한 번 훑기로 끝나요",
  statement: ["정수 배열 `nums`에서 **연속한 한 칸 이상**을 골라 더한 값 중 가장 큰 값을 반환해 주세요."].join("\n"),
  inputFormat: "`nums`: 정수 배열이에요.",
  outputFormat: "연속한 부분의 합 중 최댓값",
  constraints: ["1 ≤ nums의 길이 ≤ 100,000", "−10,000 ≤ nums[i] ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      { name: "nums", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "정수 배열" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최댓값" },
  },
  starterCode: {
    python: ["def solution(nums):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(nums) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] nums) {",
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
      body: ["모든 구간을 보면 `O(N²)`이에요. N이 10만이라 **한 번 훑기**로 바꿔야 해요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`cur` = '지금 칸에서 끝나는 연속 합' 중 가장 큰 값이에요.",
        "",
        "지금 칸 x를 볼 때, 앞에서 이어 온 `cur`가 음수면 이어 봐야 손해예요. 그래서 `cur = max(x, cur + x)`예요.",
        "",
        "칸마다 `cur`의 최댓값을 답으로 기억해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "cur = best = nums[0]",
        "for x in nums[1:]:",
        "    cur = max(x, cur + x)",
        "    best = max(best, cur)",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["지금 칸에서 끝나는 합을 고르는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for x in nums[1:]:", "    cur = ______", "    best = max(best, cur)"].join("\n"),
          javascript: [
            "for (let i = 1; i < nums.length; i++) {",
            "  cur = ______;",
            "  best = Math.max(best, cur);",
            "}",
          ].join("\n"),
          java: [
            "for (int i = 1; i < nums.length; i++) {",
            "    cur = ______;",
            "    best = Math.max(best, cur);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["single-pass"],
  signalIds: ["sig-all-pairs-slow"],
  estimatedMinutes: 12,
  xp: 50,
};
