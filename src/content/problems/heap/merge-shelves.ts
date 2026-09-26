import type { Problem } from "@/types/content";

export const heapMergeShelves: Problem = {
  id: "c:heap-merge-shelves",
  slug: "heap-merge-shelves",
  source: "curated",
  topic: "heap",
  level: 3,
  title: "여러 책장 한 줄로 합치기",
  summary: "책장마다 맨 앞 책만 힙에 넣고, 꺼낸 책장의 다음 책을 넣어요",
  statement: [
    "도서관 책장 여러 개에 책 번호가 각각 **작은 순서로** 꽂혀 있어요. `shelves[i]`는 i번 책장의 책 번호 목록이에요.",
    "",
    "모든 책을 한 줄로 합쳐, 작은 번호부터 담은 목록을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`shelves`: 책장마다 오름차순 책 번호 목록이에요 (빈 책장도 있을 수 있어요).",
  outputFormat: "합친 목록 (오름차순)",
  constraints: ["1 ≤ 책장 수 ≤ 1,000", "전체 책 수 ≤ 100,000", "0 ≤ 번호 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "shelves",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "책장별 책 번호",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" }, description: "합친 목록" },
  },
  starterCode: {
    python: ["def solution(shelves):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(shelves) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(int[][] shelves) {",
      "        List<Integer> answer = new ArrayList<>();",
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
      args: [
        [
          [1, 4, 5],
          [1, 3, 4],
          [2, 6],
        ],
      ],
      expected: [1, 1, 2, 3, 4, 4, 5, 6],
      explanation: "[1, 1, 2, 3, 4, 4, 5, 6]이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[[], [2]]],
      expected: [2],
      explanation: "빈 책장은 건너뛰어요: [2].",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[[]]],
      expected: [],
      failureNote: "책이 하나도 없어요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [[[5, 10, 15]]],
      expected: [5, 10, 15],
      failureNote: "책장이 하나면 그대로예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [[[9], [1, 2, 3], [4]]],
      expected: [1, 2, 3, 4, 9],
      failureNote: "한 책장이 먼저 다 떨어져도 나머지를 계속 합쳐요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 1000 }, (_, r) => Array.from({ length: 100 }, (_, c) => c * 1000 + ((r * 7919) % 1000))),
      ],
      expected: Array.from({ length: 1000 }, (_, r) =>
        Array.from({ length: 100 }, (_, c) => c * 1000 + ((r * 7919) % 1000)),
      )
        .flat()
        .sort((a, b) => a - b),
      failureNote:
        "책장 1,000개, 책 10만 권이에요. 매번 모든 책장의 맨 앞을 비교하면 1억 번이에요. 힙이면 N log k예요.",
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
      body: ["**정렬된 여러 줄**을 하나로 → 줄마다 맨 앞만 힙에 넣는 **여러 줄 합치기**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 책장마다 첫 책 `(번호, 책장, 위치)`를 힙에 넣어요.",
        "2. 가장 작은 책을 꺼내 결과에 붙이고, 그 책장의 **다음 책**이 있으면 힙에 넣어요.",
        "3. 힙이 빌 때까지 반복해요.",
        "",
        "힙에는 책장 수만큼만 들어 있어서 한 번에 log(책장 수)만 들어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "h = [(shelf[0], i, 0) for 책장 i가 비어 있지 않으면]",
        "while h:",
        "    v, i, j = pop(); 결과에 v 추가",
        "    if j + 1 < len(shelves[i]): push((shelves[i][j+1], i, j + 1))",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["다음 책을 넣는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "while h:",
            "    v, i, j = heapq.heappop(h)",
            "    result.append(v)",
            "    if j + 1 < len(shelves[i]):",
            "        heapq.heappush(h, ______)",
          ].join("\n"),
          javascript: [
            "while (h.size) {",
            "  const [v, i, j] = h.pop();",
            "  result.push(v);",
            "  if (j + 1 < shelves[i].length) h.push(______);",
            "}",
          ].join("\n"),
          java: [
            "while (!h.isEmpty()) {",
            "    int[] top = h.poll();   // {값, 책장, 위치}",
            "    answer.add(top[0]);",
            "    int i = top[1], j = top[2];",
            "    if (j + 1 < shelves[i].length) h.offer(______);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["k-way-merge"],
  signalIds: ["sig-repeated-min"],
  estimatedMinutes: 15,
  xp: 30,
};
