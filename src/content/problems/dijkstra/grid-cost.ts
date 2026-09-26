import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const dijkstraGridCost: Problem = {
  id: "c:dijkstra-grid-cost",
  slug: "dijkstra-grid-cost",
  source: "curated",
  topic: "dijkstra",
  level: 2,
  title: "진흙 밭 건너기",
  summary: "칸을 노드, 이웃 칸을 간선으로 보고, 들어가는 칸의 비용을 간선 비용으로 써요",
  statement: [
    "`grid`는 밭을 칸으로 나눈 지도예요. 칸의 수는 그 칸을 지날 때 드는 **힘**이에요. (진흙이 깊을수록 커요)",
    "",
    "왼쪽 위 칸에서 출발해 오른쪽 아래 칸까지 가요. 한 번에 **상하좌우**로 한 칸씩 움직일 수 있어요.",
    "",
    "지나는 모든 칸(출발 칸과 도착 칸 포함)의 힘을 더한 값의 **최솟값**을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`grid`: 칸마다 드는 힘이에요.",
  outputFormat: "드는 힘의 최솟값",
  constraints: ["1 ≤ 줄 수, 칸 수 ≤ 150", "1 ≤ 칸의 힘 ≤ 9"],
  signature: {
    name: "solution",
    params: [
      {
        name: "grid",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "칸마다 드는 힘",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "드는 힘의 최솟값" },
  },
  starterCode: {
    python: ["def solution(grid):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(grid) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[][] grid) {",
      "        int answer = 0;",
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
          [1, 3, 1],
          [1, 5, 1],
          [4, 2, 1],
        ],
      ],
      expected: 7,
      explanation: "1 → 3 → 1 → 1 → 1로 7이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[[5]]],
      expected: 5,
      explanation: "출발 칸이 곧 도착 칸이라 5예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [1, 9, 1, 1, 1],
          [1, 9, 1, 9, 1],
          [1, 1, 1, 9, 1],
        ],
      ],
      expected: 11,
      failureNote: "아래로 내려갔다가 다시 **위로** 올라가야 가장 싸요 (11). 오른쪽·아래로만 가는 DP로는 못 찾아요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [
          [1, 2],
          [3, 4],
        ],
      ],
      expected: 7,
      failureNote: "1 → 2 → 4로 7이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "edge",
      args: [[[3, 1, 4, 1, 5]]],
      expected: 14,
      failureNote: "한 줄이면 모두 더해 14예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 150 }, (_, r) =>
          Array.from({ length: 150 }, (_, c) => ((r * 31 + c * 17 + r * c) % 9) + 1),
        ),
      ],
      expected: 765,
      failureNote: "150 × 150 = 22,500칸이에요.",
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
        "칸마다 비용이 다르고, **상하좌우**로 움직여 합의 최솟값을 구해요 → 격자 위의 **다익스트라**예요.",
        "",
        "위·왼쪽으로도 갈 수 있어서 한 방향 DP로는 안 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 칸 `(r, c)` 하나가 노드예요. 이웃 칸으로 가는 비용은 **들어가는 칸의 힘**이에요.",
        "2. `dist[0][0] = grid[0][0]`로 시작해요. (출발 칸 힘도 내요)",
        "3. 힙에서 `(힘, r, c)`를 꺼내며 상하좌우 이웃을 줄여요. 도착 칸을 꺼내면 끝이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dist[0][0] = grid[0][0];  heap = [(grid[0][0], 0, 0)]",
        "while heap:",
        "    d, r, c = pop(heap)",
        "    if (r, c)가 도착 칸: return d",
        "    if d > dist[r][c]: continue",
        "    for (nr, nc) in 상하좌우 이웃:",
        "        if d + grid[nr][nc] < dist[nr][nc]: 줄이고 push",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["이웃 칸으로 가는 비용을 계산하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):",
            "    if 0 <= nr < rows and 0 <= nc < cols:",
            "        nd = ______",
            "        if nd < dist[nr][nc]:",
            "            dist[nr][nc] = nd",
            "            heapq.heappush(heap, (nd, nr, nc))",
          ].join("\n"),
          javascript: [
            "for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {",
            "  if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;",
            "  const nd = ______;",
            "  if (nd < dist[nr][nc]) {",
            "    dist[nr][nc] = nd;",
            "    heap.push([nd, nr, nc]);",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int[] dir : DIRS) {",
            "    int nr = r + dir[0], nc = c + dir[1];",
            "    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;",
            "    int nd = ______;",
            "    if (nd < dist[nr][nc]) {",
            "        dist[nr][nc] = nd;",
            "        heap.offer(new int[] {nd, nr, nc});",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["weighted-shortest-path"],
  signalIds: ["sig-weighted-route"],
  visualization: {
    presets: [
      problemPreset(
        "dijkstra-grid-cost-ex1",
        "dijkstra-grid",
        "싼 칸부터 확정하기",
        "힙에서 가장 싼 칸을 꺼내 확정하고, 이웃 칸의 비용을 줄여요. 도착 칸을 꺼내면 끝이에요.",
        [
          [
            [1, 3, 1],
            [1, 5, 1],
            [4, 2, 1],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 18,
  xp: 20,
};
