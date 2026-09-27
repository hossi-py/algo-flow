import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[3, 1, 4, 3, 2]],
    expected: 32,
    explanation: "1, 2, 3, 3, 4 순서면 1 + 3 + 6 + 9 + 13 = 32예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[5]],
    expected: 5,
    explanation: "혼자면 5예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [[2, 2, 2]],
    expected: 12,
    failureNote: "2 + 4 + 6 = 12예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[10, 1]],
    expected: 12,
    failureNote: "10분 손님이 앞이면 10 + 11 = 21이지만, 1분 손님이 앞이면 1 + 11 = 12예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[4, 3, 2, 1]],
    expected: 20,
    failureNote: "1 + 3 + 6 + 10 = 20이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 1000) + 1)],
    expected: 1669192525000,
    failureNote: "손님 10만 명이에요. 답이 수십억이라 Java는 long으로 세요.",
  },
]);

export const greedyShortestFirst: Problem = {
  id: "c:greedy-shortest-first",
  slug: "greedy-shortest-first",
  source: "curated",
  topic: "greedy",
  level: 2,
  title: "우체국 줄 서기",
  summary: "일이 빨리 끝나는 사람을 앞에 세우면 모두의 기다림이 줄어요",
  statement: [
    "우체국 창구가 하나뿐이에요. i번 손님은 일을 보는 데 `times[i]`분이 걸려요. 손님 한 명이 일을 마치는 시각은 **자기 앞 사람들의 시간 + 자기 시간**이에요.",
    "",
    "줄 서는 순서를 마음대로 정할 수 있을 때, 모든 손님이 일을 마치는 시각의 **합의 최솟값**을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`times`: 손님별로 걸리는 시간(분)이에요.",
  outputFormat: "일을 마치는 시각의 합의 최솟값",
  constraints: ["1 ≤ times의 길이 ≤ 100,000", "1 ≤ 시간 ≤ 1,000", "답이 21억을 넘을 수 있어요 (Java는 long)"],
  signature: {
    name: "solution",
    params: [
      {
        name: "times",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "손님별 시간",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "합의 최솟값" },
  },
  starterCode: {
    python: ["def solution(times):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(times) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(int[] times) {",
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
        "순서를 정해 합을 **최소로** → 앞 사람의 시간은 뒤 사람 모두에게 더해져요. 빠른 사람을 앞에 세우는 **정렬 그리디**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 시간을 오름차순으로 정렬해요.",
        "2. 앞에서부터 누적 합을 만들고, 누적 합들을 모두 더해요.",
        "",
        "앞 사람의 시간은 뒤에 선 사람 수만큼 여러 번 더해져서, 긴 시간이 앞에 있으면 손해예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "now = 0, total = 0",
        "for t in times를 짧은 순서로:",
        "    now += t          # 이 손님이 마치는 시각",
        "    total += now",
        "return total",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["마치는 시각을 더하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for t in sorted(times):", "    now += t", "    total += ______"].join("\n"),
          javascript: [
            "for (const t of [...times].sort((a, b) => a - b)) {",
            "  now += t;",
            "  total += ______;",
            "}",
          ].join("\n"),
          java: [
            "int[] sorted = times.clone();",
            "Arrays.sort(sorted);",
            "for (int t : sorted) {",
            "    now += t;",
            "    total += ______;",
            "}",
          ].join("\n"),
        },
        caption: "합이 21억을 넘을 수 있어서 now와 total은 long이에요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-by-sort"],
  signalIds: ["sig-greedy-local-best"],
  estimatedMinutes: 10,
  xp: 20,
};
