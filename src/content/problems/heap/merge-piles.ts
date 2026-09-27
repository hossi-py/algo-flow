import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[10, 20, 40]],
    expected: 100,
    explanation: "10 + 20 = 30, 30 + 40 = 70으로 100이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[5]],
    expected: 0,
    explanation: "하나뿐이면 합칠 필요가 없어 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 2, 3, 4]],
    expected: 19,
    failureNote: "1 + 2 = 3, 3 + 3 = 6, 4 + 6 = 10으로 19예요. 합친 더미도 다시 가장 작은 둘 중 하나가 될 수 있어요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [[7, 7]],
    expected: 14,
    failureNote: "14예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[5, 1, 1, 1]],
    expected: 13,
    failureNote: "1+1=2, 1+2=3, 3+5=8로 13이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 1000) + 1)],
    expected: 818668155,
    failureNote: "더미 10만 개예요. 매번 정렬하면 시간 초과예요. (답이 수십억이라 Java는 long)",
  },
]);

export const heapMergePiles: Problem = {
  id: "c:heap-merge-piles",
  slug: "heap-merge-piles",
  source: "curated",
  topic: "heap",
  level: 2,
  title: "종이 더미 합치기",
  summary: "가장 작은 두 더미를 합치고, 합친 더미를 다시 넣기를 반복해요",
  statement: [
    "종이 더미 N개가 있고, i번 더미에는 종이가 `piles[i]`장 있어요. 두 더미를 합치면 **두 더미의 장수 합**만큼 시간이 걸려요.",
    "",
    "모든 더미를 하나로 합치는 데 걸리는 **최소 시간**을 반환해 주세요. 더미가 하나면 0이에요.",
  ].join("\n"),
  inputFormat: "`piles`: 더미별 종이 장수예요.",
  outputFormat: "최소 시간",
  constraints: ["1 ≤ piles의 길이 ≤ 100,000", "1 ≤ 장수 ≤ 1,000", "답이 21억을 넘을 수 있어요 (Java는 long)"],
  signature: {
    name: "solution",
    params: [
      {
        name: "piles",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "더미별 장수",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "최소 시간" },
  },
  starterCode: {
    python: ["def solution(piles):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(piles) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(int[] piles) {",
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
      body: ["'**가장 작은 두 개** 꺼내 합치고 **다시 넣기**'를 반복 → **최소 힙**이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 모든 더미를 최소 힙에 넣어요.",
        "2. 두 개 이상인 동안: 가장 작은 두 개를 꺼내 합치고, 합을 시간에 더하고, 합친 더미를 다시 넣어요.",
        "",
        "먼저 합친 더미는 뒤에서 또 더해져요. 그래서 작은 것부터 합쳐야 큰 수가 여러 번 더해지지 않아요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "h = 최소 힙(piles), total = 0",
        "while 크기 >= 2:",
        "    a = pop(); b = pop()",
        "    total += a + b; push(a + b)",
        "return total",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["합친 더미를 다시 넣는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "while len(h) >= 2:",
            "    a = heapq.heappop(h)",
            "    b = heapq.heappop(h)",
            "    total += a + b",
            "    heapq.heappush(h, ______)",
          ].join("\n"),
          javascript: [
            "while (h.size >= 2) {",
            "  const a = h.pop(), b = h.pop();",
            "  total += a + b;",
            "  h.push(______);",
            "}",
          ].join("\n"),
          java: [
            "while (h.size() >= 2) {",
            "    long a = h.poll(), b = h.poll();",
            "    total += a + b;",
            "    h.offer(______);",
            "}",
          ].join("\n"),
        },
        caption: "합친 더미도 커질 수 있어서 힙에 long을 담아요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["repeated-min"],
  signalIds: ["sig-repeated-min"],
  visualization: {
    presets: [
      problemPreset(
        "heap-merge-piles-ex1",
        "heap-merge",
        "가장 작은 두 더미부터",
        "가장 작은 두 더미를 꺼내 합치고, 합친 더미를 다시 넣어요.",
        [[10, 20, 40]],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
