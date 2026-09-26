import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const heapSmallestK: Problem = {
  id: "c:heap-smallest-k",
  slug: "heap-smallest-k",
  source: "curated",
  topic: "heap",
  level: 1,
  title: "가장 가벼운 도토리 k개",
  summary: "힙에 모두 넣고 가장 작은 것을 k번 꺼내요",
  statement: [
    "도토리 무게 `weights`가 뒤죽박죽으로 주어져요. **가장 가벼운 k개**를 가벼운 순서대로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`weights`: 도토리 무게, `k`: 고를 개수예요.",
  outputFormat: "가장 가벼운 k개 (오름차순)",
  constraints: ["1 ≤ k ≤ weights의 길이 ≤ 100,000", "−1,000,000 ≤ 무게 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "weights",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "도토리 무게",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "고를 개수" },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "가장 가벼운 k개" },
  },
  starterCode: {
    python: ["def solution(weights, k):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(weights, k) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] weights, int k) {",
      "        int[] answer = new int[k];",
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
      args: [[7, 2, 9, 4, 1], 3],
      expected: [1, 2, 4],
      explanation: "1, 2, 4예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[5], 1],
      expected: [5],
      explanation: "하나뿐이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [[3, 3, 1, 3], 3],
      expected: [1, 3, 3],
      failureNote: "같은 무게도 따로 세요: [1, 3, 3].",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [[10, -2, 5], 3],
      expected: [-2, 5, 10],
      failureNote: "전부면 정렬한 것과 같아요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [[8, 6, 7], 1],
      expected: [6],
      failureNote: "가장 가벼운 6 하나예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 1000003) - 500000), 20],
      // prettier-ignore
      expected: [-500000,-499968,-499965,-499962,-499959,-499927,-499924,-499921,-499918,-499886,-499883,-499880,-499877,-499845,-499842,-499839,-499836,-499804,-499801,-499798],
      failureNote: "10만 개 중 20개예요. 가장 작은 값을 매번 처음부터 찾아 지우면 느려요.",
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
      body: ["'가장 작은 것부터 **여러 번** 꺼내기' → **최소 힙**이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 모든 무게를 최소 힙으로 만들어요. (Python은 `heapify`가 O(N))",
        "2. 가장 작은 값을 k번 꺼내면 오름차순으로 나와요.",
        "",
        "전부 정렬(O(N log N))해도 되지만, 힙은 O(N + k log N)이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "h = weights로 만든 최소 힙", "repeat k번: 결과에 pop(h) 추가", "~~~"].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["k번 꺼내는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["import heapq", "", "h = weights[:]", "heapq.heapify(h)", "return [______ for _ in range(k)]"].join(
            "\n",
          ),
          javascript: [
            "const h = new Heap((a, b) => a < b);",
            "for (const w of weights) h.push(w);",
            "const answer = [];",
            "for (let i = 0; i < k; i++) answer.push(______);",
          ].join("\n"),
          java: [
            "PriorityQueue<Integer> h = new PriorityQueue<>();",
            "for (int w : weights) h.offer(w);",
            "for (int i = 0; i < k; i++) answer[i] = ______;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["repeated-min"],
  signalIds: ["sig-repeated-min"],
  visualization: {
    presets: [
      problemPreset(
        "heap-smallest-k-ops",
        "heap-ops",
        "넣고 꺼내면 작은 것부터",
        "힙에 넣은 뒤 세 번 꺼내면 가장 가벼운 세 개가 순서대로 나와요.",
        [["push 7", "push 2", "push 9", "push 4", "push 1", "pop", "pop", "pop"]],
      ),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
