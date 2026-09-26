import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1, 100],
        [1, 2, 100],
        [2, 0, 100],
        [1, 3, 600],
        [2, 3, 200],
      ],
      0,
      3,
      1,
    ],
    expected: 700,
    explanation: "한 번만 갈아탈 수 있어서 0 → 1 → 3의 700원이에요. 0 → 1 → 2 → 3(400원)은 두 번 갈아타요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1, 100],
        [1, 2, 100],
        [2, 0, 100],
        [1, 3, 600],
        [2, 3, 200],
      ],
      0,
      3,
      2,
    ],
    expected: 400,
    explanation: "두 번까지 갈아탈 수 있으면 0 → 1 → 2 → 3의 400원이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [
      3,
      [
        [0, 1, 100],
        [1, 2, 100],
        [0, 2, 500],
      ],
      0,
      2,
      0,
    ],
    expected: 500,
    failureNote: "갈아타기 0번이면 곧장 가는 500원뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [2, [[0, 1, 5]], 1, 1, 0],
    expected: 0,
    failureNote: "출발과 도착이 같으면 0원이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [
      4,
      [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 1],
      ],
      0,
      3,
      1,
    ],
    expected: -1,
    failureNote: "3번까지는 비행기를 세 번 타야 해서 한 번 갈아타기로는 못 가요. -1이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      5,
      [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 1],
        [0, 2, 5],
        [3, 4, 1],
      ],
      0,
      4,
      2,
    ],
    expected: 7,
    failureNote:
      "싼 길 0 → 1 → 2는 비행기가 많아서 4번까지 못 가요. 2번에 더 비싸게(5원) 오는 길을 버리지 않아야 5 + 1 + 1 = 7원을 찾아요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      300,
      Array.from({ length: 3000 }, (_, i) => {
        const a = (i * 7919) % 300;
        const b = (a + 1 + ((i * 104729) % 299)) % 300;
        return [a, b, ((i * 31337) % 10000) + 1];
      }),
      0,
      299,
      20,
    ],
    expected: 3392,
    failureNote: "공항 300개, 비행편 3,000개, 갈아타기 20번까지예요.",
  },
]);

export const dijkstraLimitedTransfers: Problem = {
  id: "c:dijkstra-limited-transfers",
  slug: "dijkstra-limited-transfers",
  source: "curated",
  topic: "dijkstra",
  level: 4,
  title: "환승은 K번까지",
  summary: "(공항, 탄 비행기 수)를 노드로 보면, 싼 길이 막혀도 비싼 길을 놓치지 않아요",
  statement: [
    "공항 `n`개와 한쪽 방향 비행편 `flights`가 있어요. `[a, b, p]`는 a번 공항에서 b번 공항으로 가는 요금 `p`원 비행편이에요.",
    "",
    "`src`번 공항에서 `dst`번 공항으로 가요. 중간 공항에서 **갈아타기는 많아야 `k`번**이에요. (비행기는 많아야 `k + 1`번 타요)",
    "",
    "요금 합의 **최솟값**을 반환해 주세요. 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`n`: 공항 수, `flights`: `[a, b, p]` 비행편, `src`: 출발, `dst`: 도착, `k`: 갈아타기 최대 횟수예요.",
  outputFormat: "요금 합의 최솟값 (갈 수 없으면 -1)",
  constraints: [
    "1 ≤ n ≤ 300",
    "0 ≤ flights의 길이 ≤ 3,000",
    "0 ≤ a, b < n, a ≠ b",
    "1 ≤ p ≤ 10,000",
    "0 ≤ src, dst < n",
    "0 ≤ k ≤ 20",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "공항 수" },
      {
        name: "flights",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[a, b, p] 비행편",
      },
      { name: "src", type: { python: "int", javascript: "number", java: "int" }, description: "출발 공항" },
      { name: "dst", type: { python: "int", javascript: "number", java: "int" }, description: "도착 공항" },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "갈아타기 최대 횟수" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "요금 합의 최솟값" },
  },
  starterCode: {
    python: ["def solution(n, flights, src, dst, k):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, flights, src, dst, k) {", "  let answer = 0;", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] flights, int src, int dst, int k) {",
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
      body: [
        "최소 요금 → 다익스트라. 그런데 **탄 비행기 수**에 제한이 있어요 → `(공항, 탄 횟수)`를 노드로 보는 **상태 다익스트라**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "공항마다 거리를 하나만 들고 있으면, 싸지만 비행기를 많이 탄 길이 비싸지만 적게 탄 길을 밀어내요. (숨은 테스트 하나가 이걸 확인해요)",
        "",
        "그래서 `dist[공항][탄 횟수]`로 나눠 적어요. 탄 횟수가 `k + 1`이면 더 탈 수 없어요.",
        "",
        "`dst`를 처음 꺼낸 순간의 요금이 답이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dist[src][0] = 0;  heap = [(0, src, 0)]",
        "while heap:",
        "    cost, v, used = pop(heap)",
        "    if v == dst: return cost",
        "    if cost > dist[v][used] or used == k + 1: continue",
        "    for (w, p) in graph[v]:",
        "        if cost + p < dist[w][used + 1]: 줄이고 push",
        "return -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["다음 비행기를 타는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for w, p in graph[v]:",
            "    nc = cost + p",
            "    if nc < dist[w][______]:",
            "        dist[w][used + 1] = nc",
            "        heapq.heappush(heap, (nc, w, used + 1))",
          ].join("\n"),
          javascript: [
            "for (const [w, p] of graph[v]) {",
            "  const nc = cost + p;",
            "  if (nc < dist[w][______]) {",
            "    dist[w][used + 1] = nc;",
            "    heap.push([nc, w, used + 1]);",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int[] x : graph.get(v)) {",
            "    int nc = cost + x[1];",
            "    if (nc < dist[x[0]][______]) {",
            "        dist[x[0]][used + 1] = nc;",
            "        heap.offer(new int[] {nc, x[0], used + 1});",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["state-dijkstra"],
  signalIds: ["sig-route-with-state"],
  estimatedMinutes: 25,
  xp: 40,
};
