import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[7, 10], 6],
    expected: 28,
    explanation: "28분이면 7분 요정 4개 + 10분 요정 2개 = 6개예요. 27분이면 3 + 2 = 5개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[5], 3],
    expected: 15,
    explanation: "혼자면 15분이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 1, 1], 10],
    expected: 4,
    failureNote: "셋이 1분씩이면 4분에 12개라 4예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[2, 3], 1],
    expected: 2,
    failureNote: "하나만 만들면 가장 빠른 요정의 2분이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[3, 5, 7], 10],
    expected: 15,
    failureNote: "15분이면 5 + 3 + 2 = 10개예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [[1000000], 1000000000],
    expected: 1000000000000000,
    failureNote: "답이 10¹⁵이에요. 1분씩 늘려 보면 끝나지 않아요. (Java는 long, 개수를 셀 때 m을 넘으면 멈추세요)",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 10000 }, (_, i) => ((i * 7919) % 1000000) + 1), 1000000000],
    expected: 903218011,
    failureNote: "요정 1만 명, 10억 개예요.",
  },
]);

export const binarySearchToyWorkshop: Problem = {
  id: "c:binary-search-toy-workshop",
  slug: "binary-search-toy-workshop",
  source: "curated",
  topic: "binary-search",
  level: 4,
  title: "장난감 공방의 최소 시간",
  summary: "'T분 안에 m개를 만들 수 있나?'를 확인하며 T를 이분 탐색해요",
  statement: [
    "숲속 장난감 공방에 요정들이 있어요. i번 요정은 장난감 하나를 만드는 데 `times[i]`분이 걸리고, 모든 요정이 **동시에** 쉬지 않고 만들어요.",
    "",
    "장난감 `m`개를 모두 만드는 데 필요한 **최소 시간**(분)을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`times`: 요정별 장난감 하나를 만드는 시간, `m`: 만들 장난감 수예요.",
  outputFormat: "최소 시간",
  constraints: ["1 ≤ times의 길이 ≤ 10,000", "1 ≤ 시간 ≤ 1,000,000", "1 ≤ m ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "times",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "요정별 시간",
      },
      { name: "m", type: { python: "int", javascript: "number", java: "int" }, description: "장난감 수" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "최소 시간" },
  },
  starterCode: {
    python: ["def solution(times, m):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(times, m) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(int[] times, int m) {",
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
      body: [
        "'m개를 만드는 **최소 시간**' → 시간이 길수록 만든 개수는 늘어요. **답(시간)을 이분 탐색**해요. 답의 범위가 10¹⁵까지 커요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. T분 동안 만든 개수 = `sum(T // t)`예요. m 이상이면 가능해요.",
        "2. 범위는 1 ~ `min(times) × m`이에요. (가장 빠른 요정 혼자 다 만들어도 이만큼이면 돼요)",
        "3. 가능하면 답으로 적고 더 짧게, 아니면 더 길게.",
        "",
        "개수를 더하다가 m 이상이 되면 바로 멈추면 수가 너무 커지지 않아요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "lo, hi = 1, min(times) * m",
        "while lo <= hi:",
        "    mid = (lo + hi) // 2",
        "    made = sum(mid // t for t in times)",
        "    if made >= m: answer = mid; hi = mid - 1",
        "    else: lo = mid + 1",
        "return answer",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["T분 동안 만든 개수를 세는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["made = 0", "for t in times:", "    made += ______", "    if made >= m:", "        break"].join(
            "\n",
          ),
          javascript: [
            "let made = 0;",
            "for (const t of times) {",
            "  made += ______;",
            "  if (made >= m) break;",
            "}",
          ].join("\n"),
          java: [
            "long made = 0;",
            "for (int t : times) {",
            "    made += ______;",
            "    if (made >= m) break;",
            "}",
          ].join("\n"),
        },
        caption: "시간은 10¹⁵까지 커져서 long으로 다뤄요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["parametric-search"],
  signalIds: ["sig-max-min-answer", "sig-huge-range"],
  estimatedMinutes: 20,
  xp: 40,
};
