import type { Problem } from "@/types/content";

export const heapRunningMedian: Problem = {
  id: "c:heap-running-median",
  slug: "heap-running-median",
  source: "curated",
  topic: "heap",
  level: 5,
  title: "지금까지의 가운데 키",
  summary: "작은 절반은 최대 힙, 큰 절반은 최소 힙에 나눠 담아요",
  statement: [
    "숲속 친구들이 한 명씩 줄에 들어와요. 들어온 순서대로 키가 `heights`로 주어져요.",
    "",
    "한 명이 들어올 때마다 **지금까지 들어온 친구들 키의 중앙값**을 차례로 담아 반환해 주세요. 인원이 짝수면 가운데 두 값 중 **작은 쪽**이에요.",
  ].join("\n"),
  inputFormat: "`heights`: 들어온 순서대로의 키예요.",
  outputFormat: "한 명씩 들어올 때마다의 중앙값 목록",
  constraints: ["1 ≤ heights의 길이 ≤ 10,000", "−10,000 ≤ 키 ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "heights",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "들어온 키",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "중앙값 목록" },
  },
  starterCode: {
    python: ["def solution(heights):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(heights) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] heights) {",
      "        int[] answer = new int[heights.length];",
      "        return answer;",
      "    }",
      "}",
      "",
    ].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [[5, 15, 1, 3]],
      expected: [5, 5, 5, 3],
      explanation: "[5] → 5, [5, 15] → 5, [1, 5, 15] → 5, [1, 3, 5, 15] → 3이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[7]],
      expected: [7],
      explanation: "한 명이면 그 키예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [[1, 2, 3, 4, 5]],
      expected: [1, 1, 2, 2, 3],
      failureNote: "[1, 1, 2, 2, 3]이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [[5, 4, 3, 2, 1]],
      expected: [5, 4, 4, 3, 3],
      failureNote: "거꾸로 들어와도 [5, 4, 4, 3, 3]이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [[2, 2, 2]],
      expected: [2, 2, 2],
      failureNote: "같은 키만 있어요: [2, 2, 2].",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 10000 }, (_, i) => ((i * 7919) % 20001) - 10000)],
      expected: (() => {
        const s = [0].slice(1);
        const out = [0].slice(1);
        for (const x of Array.from({ length: 10000 }, (_, i) => ((i * 7919) % 20001) - 10000)) {
          let lo = 0,
            hi = s.length;
          while (lo < hi) {
            const m = (lo + hi) >> 1;
            if (s[m] < x) lo = m + 1;
            else hi = m;
          }
          s.splice(lo, 0, x);
          out.push(s[(s.length - 1) >> 1]);
        }
        return out;
      })(),
      failureNote: "1만 명이에요. 들어올 때마다 전부 정렬하면 느려요.",
    },
  ],
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
      body: ["'**지금까지의 중앙값**'을 계속 → **힙 두 개**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `low` = 작은 절반(**최대 힙**), `high` = 큰 절반(**최소 힙**)",
        "2. 새 키를 `low`에 넣고, `low`의 가장 큰 값을 `high`로 옮겨요. (작은 절반의 값이 큰 절반보다 커지지 않게)",
        "3. `high`가 더 많아지면 `high`의 가장 작은 값을 `low`로 옮겨요. 그러면 `low`가 같거나 하나 더 많아요.",
        "4. 중앙값(작은 쪽)은 늘 `low`의 맨 위예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for x in heights:",
        "    low에 x 넣기; high에 low의 최댓값 옮기기",
        "    if len(high) > len(low): low에 high의 최솟값 옮기기",
        "    결과에 low의 최댓값 추가",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["두 힙의 크기를 맞추는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for x in heights:",
            "    heapq.heappush(low, -x)",
            "    heapq.heappush(high, -heapq.heappop(low))",
            "    if ______:",
            "        heapq.heappush(low, -heapq.heappop(high))",
            "    result.append(-low[0])",
          ].join("\n"),
          javascript: [
            "for (const x of heights) {",
            "  low.push(x);",
            "  high.push(low.pop());",
            "  if (______) low.push(high.pop());",
            "  result.push(low.peek());",
            "}",
          ].join("\n"),
          java: [
            "for (int i = 0; i < heights.length; i++) {",
            "    low.offer(heights[i]);",
            "    high.offer(low.poll());",
            "    if (______) low.offer(high.poll());",
            "    answer[i] = low.peek();",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["two-heaps"],
  signalIds: ["sig-running-median"],
  estimatedMinutes: 25,
  xp: 50,
};
