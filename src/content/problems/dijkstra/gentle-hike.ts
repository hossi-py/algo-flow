import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [1, 2, 2],
        [3, 8, 2],
        [5, 3, 5],
      ],
    ],
    expected: 2,
    explanation: "1 → 3 → 5 → 3 → 5로 가면 가장 큰 차이가 2예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[[7]]],
    expected: 0,
    explanation: "움직이지 않으니 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        [1, 2, 3],
        [3, 8, 4],
        [5, 3, 5],
      ],
    ],
    expected: 1,
    failureNote: "1 → 2 → 3 → 4 → 5로 가면 모든 차이가 1이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[[1, 10, 6, 7, 9, 10, 4, 9]]],
    expected: 9,
    failureNote: "한 줄이면 피할 수 없어요. 가장 큰 차이 9예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        [1, 2, 1, 1, 1],
        [1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1],
        [1, 1, 1, 2, 1],
      ],
    ],
    expected: 0,
    failureNote: "1만 밟는 구불구불한 길이 있어서 0이에요. 합이 가장 작은 길(칸 수가 적은 길)과 달라요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 100 }, (_, r) =>
        Array.from({ length: 100 }, (_, c) => ((r * 7919 + c * 104729 + r * c * 31) % 1000000) + 1),
      ),
    ],
    expected: 892202,
    failureNote: "100 × 100 칸이에요. 가능한 모든 길을 살펴보면 끝나지 않아요.",
  },
]);

export const dijkstraGentleHike: Problem = {
  id: "c:dijkstra-gentle-hike",
  slug: "dijkstra-gentle-hike",
  source: "curated",
  topic: "dijkstra",
  level: 3,
  title: "덜 가파른 등산길",
  summary: "경로의 값이 합이 아니라 가장 큰 높이 차여도, 가장 작은 후보부터 확정하면 돼요",
  statement: [
    "`heights`는 산을 칸으로 나눈 높이 지도예요. 왼쪽 위 칸에서 출발해 오른쪽 아래 칸까지 **상하좌우**로 한 칸씩 움직여요.",
    "",
    "길의 **가파름**은 지나는 동안 이웃한 두 칸 높이 차(절댓값) 중 **가장 큰 값**이에요.",
    "",
    "가장 덜 가파른 길의 가파름을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`heights`: 칸마다 높이예요.",
  outputFormat: "가파름의 최솟값",
  constraints: ["1 ≤ 줄 수, 칸 수 ≤ 100", "1 ≤ 높이 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "heights",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "높이 지도",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "가파름의 최솟값" },
  },
  starterCode: {
    python: ["def solution(heights):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(heights) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[][] heights) {",
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
        "경로에서 **가장 큰 값을 가장 작게** → 다익스트라를 그대로 쓰되, 거리 대신 '지금까지 가장 큰 높이 차'를 들고 다녀요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`effort[r][c]` = 그 칸까지 가는 길 중 가장 덜 가파른 가파름이에요.",
        "",
        "칸 `(r, c)`에서 이웃으로 가면 새 가파름은 `max(effort, |높이 차|)`예요. 이 값이 더 작아지면 줄이고 힙에 넣어요.",
        "",
        "max는 커지기만 하지 줄지 않아서, 가장 작은 후보부터 확정해도 틀리지 않아요. (음수 비용이 없는 것과 같은 이유예요)",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "effort[0][0] = 0;  heap = [(0, 0, 0)]",
        "while heap:",
        "    e, r, c = pop(heap)",
        "    if (r, c)가 도착 칸: return e",
        "    for 이웃 (nr, nc):",
        "        ne = max(e, |h[nr][nc] - h[r][c]|)",
        "        if ne < effort[nr][nc]: 줄이고 push",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["새 가파름을 계산하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "ne = ______",
            "if ne < effort[nr][nc]:",
            "    effort[nr][nc] = ne",
            "    heapq.heappush(heap, (ne, nr, nc))",
          ].join("\n"),
          javascript: [
            "const ne = ______;",
            "if (ne < effort[nr][nc]) {",
            "  effort[nr][nc] = ne;",
            "  heap.push([ne, nr, nc]);",
            "}",
          ].join("\n"),
          java: [
            "int ne = ______;",
            "if (ne < effort[nr][nc]) {",
            "    effort[nr][nc] = ne;",
            "    heap.offer(new int[] {ne, nr, nc});",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["minimax-path"],
  signalIds: ["sig-worst-edge"],
  estimatedMinutes: 20,
  xp: 30,
};
