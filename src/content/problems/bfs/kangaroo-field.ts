import type { Problem } from "@/types/content";

export const bfsKangarooField: Problem = {
  id: "c:bfs-kangaroo-field",
  slug: "bfs-kangaroo-field",
  source: "curated",
  topic: "bfs",
  level: 3,
  title: "캥거루 점프",
  summary: "L자로만 뛰는 캥거루가 목적지까지 가는 최소 점프 수를 구해요",
  statement: [
    "초원 지도 `field`는 같은 길이의 문자열 리스트예요. `S`는 캥거루가 있는 곳, `E`는 가고 싶은 곳, `.`은 풀밭, `#`은 가시덤불이에요.",
    "",
    "캥거루는 한 번에 **L자 모양**으로만 뛰어요. 세로로 2칸·가로로 1칸, 또는 세로로 1칸·가로로 2칸 떨어진 칸으로요. 뛰는 동안 지나가는 칸은 상관없지만, **가시덤불이나 지도 밖에는 내려앉을 수 없어요**.",
    "",
    "S에서 E까지 가는 **최소 점프 수**를 반환해 주세요. 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`field`: `S`, `E`, `.`, `#`로 된 문자열 리스트예요. S와 E는 한 개씩 있어요.",
  outputFormat: "최소 점프 수 (갈 수 없으면 -1)",
  constraints: ["1 ≤ 줄 수, 줄 길이 ≤ 100", "모든 줄의 길이가 같아요", "S와 E는 딱 한 개씩 있어요"],
  signature: {
    name: "solution",
    params: [
      {
        name: "field",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "초원 지도",
      },
    ],
    returns: {
      type: { python: "int", javascript: "number", java: "int" },
      description: "최소 점프 수 (갈 수 없으면 -1)",
    },
  },
  starterCode: {
    python: ["def solution(field):", "    answer = -1", "    return answer", ""].join("\n"),
    javascript: ["function solution(field) {", "  let answer = -1;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(String[] field) {",
      "        int answer = -1;",
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
      args: [["S...", "....", "..#.", "...E"]],
      expected: 2,
      explanation: "S(0, 0) → (2, 1) → E(3, 3)으로 두 번이에요. (1, 2)를 거쳐도 두 번이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [["S.", ".E"]],
      expected: -1,
      explanation: "2×2 초원에서는 L자로 뛸 곳이 없어요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [["SE..", "....", "...."]],
      expected: 3,
      failureNote: "바로 옆 칸이어도 한 번에 못 가요. L자로 세 번 뛰어야 해요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [["S...", "..#.", ".#..", "...E"]],
      expected: -1,
      failureNote: "S에서 뛰어 내려앉을 수 있는 두 칸이 모두 가시덤불이에요. 한 번도 뛸 수 없어서 갈 수 없어요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [["S#..", "##E."]],
      expected: 1,
      failureNote: "가시덤불은 뛰어넘을 수 있어요. 내려앉지만 않으면 돼서 한 번에 가요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100 }, (_, r) =>
          Array.from({ length: 100 }, (_, c) => (r === 0 && c === 0 ? "S" : r === 99 && c === 99 ? "E" : ".")).join(""),
        ),
      ],
      expected: 66,
      failureNote: "100×100 빈 초원의 대각선 끝이에요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100 }, (_, r) =>
          Array.from({ length: 100 }, (_, c) =>
            r === 0 && c === 0
              ? "S"
              : r === 99 && c === 99
                ? "E"
                : (r === 97 && c === 98) || (r === 98 && c === 97)
                  ? "#"
                  : ".",
          ).join(""),
        ),
      ],
      expected: -1,
      failureNote:
        "E로 뛰어 들어올 수 있는 두 칸이 모두 가시덤불이에요. 초원 전체를 살펴본 뒤에야 못 간다는 걸 알아요.",
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
        "한 번 뛸 때마다 점프 수가 1씩 늘어요. **최소 점프 수** → **BFS**예요.",
        "",
        "격자 BFS와 같지만, 이웃 칸이 상하좌우 4칸이 아니라 **L자로 뛰어 닿는 8칸**이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 뛰는 방향 8가지를 목록으로 만들어요: `(±1, ±2)`, `(±2, ±1)`.",
        "2. S 위치를 찾아 큐에 넣고 거리 0으로 시작해요.",
        "3. 큐에서 칸을 꺼내 8방향으로 뛰어 봐요. **지도 안**이고, **가시덤불이 아니고**, **아직 안 가 본** 칸이면 거리 +1로 적고 큐에 넣어요.",
        "4. E의 거리가 답이에요. 끝까지 못 닿으면 -1.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "JUMPS = (1,2),(2,1),(2,-1),(1,-2),(-1,-2),(-2,-1),(-2,1),(-1,2)",
        "dist = -1로 채운 표, dist[S] = 0, queue = [S]",
        "while queue가 비어 있지 않은 동안:",
        "    (r, c) = queue 앞에서 꺼내기",
        "    if (r, c)가 E: return dist[r][c]",
        "    for (dr, dc) in JUMPS:",
        "        (nr, nc) = (r + dr, c + dc)",
        "        지도 안 · 가시덤불 아님 · dist가 -1 → dist = dist[r][c] + 1, 큐에 넣기",
        "return -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["내려앉을 수 있는 칸인지 확인하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for dr, dc in JUMPS:",
            "    nr, nc = r + dr, c + dc",
            "    if 0 <= nr < rows and 0 <= nc < cols and ______ and dist[nr][nc] == -1:",
            "        dist[nr][nc] = dist[r][c] + 1",
            "        queue.append((nr, nc))",
          ].join("\n"),
          javascript: [
            "for (const [dr, dc] of JUMPS) {",
            "  const nr = r + dr, nc = c + dc;",
            "  if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && ______ && dist[nr][nc] === -1) {",
            "    dist[nr][nc] = dist[r][c] + 1;",
            "    queue.push([nr, nc]);",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int[] j : JUMPS) {",
            "    int nr = r + j[0], nc = c + j[1];",
            "    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && ______ && dist[nr][nc] == -1) {",
            "        dist[nr][nc] = dist[r][c] + 1;",
            "        queue.offer(new int[] {nr, nc});",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["grid-shortest-path"],
  signalIds: ["sig-shortest-steps", "sig-grid-neighbors"],
  estimatedMinutes: 18,
  xp: 30,
};
