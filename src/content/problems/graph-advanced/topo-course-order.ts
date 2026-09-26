import type { Problem } from "@/types/content";

export const topoCourseOrder: Problem = {
  id: "c:topo-course-order",
  slug: "topo-course-order",
  source: "curated",
  topic: "graph-advanced",
  level: 4,
  title: "번호가 빠른 과목부터",
  summary: "들을 수 있는 과목 중 번호가 가장 작은 것을 꺼내려면 큐 대신 최소 힙을 써요",
  statement: [
    "과목 `n`개가 `0`번부터 `n - 1`번까지 있어요. `prereqs`의 `[a, b]`는 **a번을 들어야 b번을 들을 수 있다**는 뜻이에요.",
    "",
    "과목은 한 번에 하나씩 들어요. 지금 들을 수 있는 과목이 여러 개면 **번호가 가장 작은 과목**부터 들어요.",
    "",
    "과목을 듣는 순서를 반환해 주세요. 모든 과목을 들을 수 없으면 빈 목록이에요.",
  ].join("\n"),
  inputFormat: "`n`: 과목 수, `prereqs`: `[a, b]` 선수 조건이에요.",
  outputFormat: "과목을 듣는 순서 (모두 들을 수 없으면 [])",
  constraints: ["1 ≤ n ≤ 100,000", "0 ≤ prereqs의 길이 ≤ 200,000", "0 ≤ a, b < n, a ≠ b"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "과목 수" },
      {
        name: "prereqs",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[먼저, 나중] 조건",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "듣는 순서" },
  },
  starterCode: {
    python: ["def solution(n, prereqs):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, prereqs) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int n, int[][] prereqs) {",
      "        int[] answer = new int[0];",
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
        4,
        [
          [3, 1],
          [2, 0],
        ],
      ],
      expected: [2, 0, 3, 1],
      explanation: "처음엔 2·3번을 들을 수 있어요. 2번 → (0번이 열림) 0번 → 3번 → 1번이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        2,
        [
          [0, 1],
          [1, 0],
        ],
      ],
      expected: [],
      explanation: "서로가 서로의 선수 과목이라 들을 수 없어요: [].",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [3, []],
      expected: [0, 1, 2],
      failureNote: "조건이 없으면 번호 순서 [0, 1, 2]예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        5,
        [
          [4, 0],
          [3, 0],
          [2, 1],
        ],
      ],
      expected: [2, 1, 3, 4, 0],
      failureNote:
        "2번을 들으면 1번이 열려서 3·4번보다 먼저 들어요: [2, 1, 3, 4, 0]. 보통 큐를 쓰면 [2, 3, 4, 1, 0]이 돼서 틀려요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "edge",
      args: [
        4,
        [
          [0, 1],
          [1, 2],
          [2, 1],
          [0, 3],
        ],
      ],
      expected: [],
      failureNote: "1·2번이 고리라 모두 들을 수는 없어요: [].",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        50000,
        [
          ...Array.from({ length: 49999 }, (_, i) => [i + 1, i]),
          ...Array.from({ length: 49998 }, (_, i) => [i + 2, i]),
        ],
      ],
      expected: Array.from({ length: 50000 }, (_, i) => 49999 - i),
      failureNote: "과목 5만 개예요. 매번 들을 수 있는 과목을 전부 훑어 가장 작은 번호를 찾으면 느려요.",
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
      body: [
        "'a를 들어야 b를 들을 수 있다' → **위상 정렬**이에요. 거기에 '들을 수 있는 것 중 번호가 가장 작은 것'이 붙었어요 → 큐 대신 **최소 힙**.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 과목마다 진입 차수(먼저 들어야 하는 과목 수)를 세요.",
        "2. 진입 차수가 0인 과목을 모두 **최소 힙**에 넣어요.",
        "3. 힙에서 가장 작은 번호를 꺼내 순서에 적고, 그 과목 뒤에 오는 과목들의 진입 차수를 1씩 줄여요. 0이 되면 힙에 넣어요.",
        "4. 순서에 n개가 모이지 않으면 고리가 있는 거예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "heap = [진입 차수가 0인 과목들]",
        "while heap:",
        "    v = heappop(heap);  order.append(v)",
        "    for w in graph[v]:",
        "        indeg[w] -= 1",
        "        if indeg[w] == 0: heappush(heap, w)",
        "return order if len(order) == n else []",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["다음 과목이 열리는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for w in graph[v]:", "    indeg[w] -= 1", "    if ______:", "        heapq.heappush(heap, w)"].join(
            "\n",
          ),
          javascript: ["for (const w of graph[v]) {", "  indeg[w]--;", "  if (______) heap.push(w);", "}"].join("\n"),
          java: ["for (int w : graph.get(v)) {", "    indeg[w]--;", "    if (______) heap.offer(w);", "}"].join("\n"),
        },
        caption: "PriorityQueue<Integer>는 가장 작은 번호부터 꺼내요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["topological-sort"],
  signalIds: ["sig-prerequisites"],
  estimatedMinutes: 18,
  xp: 40,
};
