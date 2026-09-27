import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[3, 2, 1, 5, 6, 4], 2],
    expected: 5,
    explanation: "6, 5, …라 2번째는 5예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4],
    expected: 4,
    explanation: "6, 5, 5, 4라 4번째는 4예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[7], 1],
    expected: 7,
    failureNote: "하나뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[4, 9, 2], 3],
    expected: 2,
    failureNote: "k가 전체 길이면 가장 낮은 점수예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[-1, -5, -3], 1],
    expected: -1,
    failureNote: "음수여도 가장 높은 건 −1이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 1000003) - 500000), 777],
    expected: 492245,
    failureNote: "10만 개예요. 크기 777인 힙만 유지하면 돼요.",
  },
]);

export const heapKthLargest: Problem = {
  id: "c:heap-kth-largest",
  slug: "heap-kth-largest",
  source: "curated",
  topic: "heap",
  level: 1,
  title: "K번째로 높은 점수",
  summary: "크기 K인 최소 힙을 두면 맨 위가 K번째로 큰 값이에요",
  statement: [
    "숲속 대회의 점수 목록 `scores`가 있어요. **k번째로 높은 점수**를 반환해 주세요. 같은 점수도 따로 세요.",
  ].join("\n"),
  inputFormat: "`scores`: 점수, `k`: 몇 번째로 높은지예요.",
  outputFormat: "k번째로 높은 점수",
  constraints: ["1 ≤ k ≤ scores의 길이 ≤ 100,000", "−1,000,000 ≤ 점수 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      { name: "scores", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "점수" },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "몇 번째" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "k번째로 높은 점수" },
  },
  starterCode: {
    python: ["def solution(scores, k):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(scores, k) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] scores, int k) {",
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
      body: ["'**K번째로 큰**' → 크기가 K인 **최소 힙**을 두면 맨 위가 답이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 점수를 하나씩 최소 힙에 넣어요.",
        "2. 힙 크기가 k를 넘으면 가장 작은 것을 꺼내요. 힙에는 늘 '지금까지 큰 k개'만 남아요.",
        "3. 끝나면 맨 위가 k번째로 큰 점수예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "h = 빈 최소 힙",
        "for s in scores:",
        "    push(s)",
        "    if 크기 > k: pop()",
        "return 맨 위",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["힙 크기를 k로 유지하는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for s in scores:",
            "    heapq.heappush(h, s)",
            "    if ______:",
            "        heapq.heappop(h)",
            "return h[0]",
          ].join("\n"),
          javascript: [
            "for (const s of scores) {",
            "  h.push(s);",
            "  if (______) h.pop();",
            "}",
            "return h.peek();",
          ].join("\n"),
          java: [
            "for (int s : scores) {",
            "    h.offer(s);",
            "    if (______) h.poll();",
            "}",
            "return h.peek();",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["top-k"],
  signalIds: ["sig-top-k"],
  visualization: {
    presets: [
      problemPreset(
        "heap-kth-largest-top3",
        "heap-top-k",
        "크기 K인 최소 힙",
        "맨 위보다 큰 수만 들어와요. 맨 위가 K번째로 큰 수예요.",
        [[3, 2, 1, 5, 6, 4], 2],
      ),
    ],
  },
  estimatedMinutes: 10,
  xp: 10,
};
