import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const bfsMazeShortest: Problem = {
  id: "c:bfs-maze-shortest",
  slug: "bfs-maze-shortest",
  source: "curated",
  topic: "bfs",
  level: 3,
  title: "미로 최단 탈출",
  summary: "격자 미로에서 출구까지 가장 적게 걷는 칸 수를 구해요",
  statement: [
    "노디가 격자 미로를 빠져나가려고 해요. 지도 `maze`에서 `'S'`는 출발 칸, `'E'`는 출구, `'.'`은 길, `'#'`은 벽이에요.",
    "",
    "한 번에 **상하좌우**로 한 칸씩 움직일 수 있어요. 출발 칸에서 출구까지 **가장 적게 움직이는 횟수**를 반환해 주세요. 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`maze`: 길이가 같은 문자열들의 리스트예요. 'S'와 'E'는 정확히 하나씩 있어요.",
  outputFormat: "최소 이동 횟수 (정수, 불가능하면 -1)",
  constraints: ["1 ≤ 행 수, 열 수 ≤ 100", "각 문자는 'S', 'E', '.', '#' 중 하나예요."],
  signature: {
    name: "solution",
    params: [{ name: "maze", type: { python: "list[str]", javascript: "string[]" }, description: "미로 지도" }],
    returns: { type: { python: "int", javascript: "number" }, description: "최소 이동 횟수" },
  },
  starterCode: {
    python: ["def solution(maze):", "    answer = -1", "    return answer", ""].join("\n"),
    javascript: ["function solution(maze) {", "  let answer = -1;", "  return answer;", "}", ""].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [["S.#", "..#", "#.E"]],
      expected: 4,
      explanation: "S → 아래 → 오른쪽 → 아래 → 오른쪽으로 4번이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "tricky",
      args: [["S...", ".##.", "...E"]],
      expected: 5,
      explanation: "위로 돌든 아래로 돌든 5번이에요. 어느 길로 가도 가장 짧은 거리는 같아요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [["SE"]],
      expected: 1,
      failureNote: "바로 옆이면 1번이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [["S#E"]],
      expected: -1,
      failureNote: "벽에 막혀 -1이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [["S.....", "####..", "E.....", ".#####"]],
      expected: 10,
      failureNote: "막다른 길로 새지 않고 가장 짧은 길을 찾아요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "basic",
      args: [["..S..", ".###.", ".#E#.", ".#.#.", "....."]],
      expected: 10,
      failureNote: "출구를 한 바퀴 돌아 아래로 들어가요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100 }, (_, r) =>
          Array.from({ length: 100 }, (_, c) => (r === 0 && c === 0 ? "S" : r === 99 && c === 99 ? "E" : ".")).join(""),
        ),
      ],
      expected: 198,
      failureNote: "벽 없는 100×100 들판이에요. 모든 길을 하나씩 따라가 보면 끝나지 않아요.",
    },
    {
      id: "hid-6",
      visibility: "hidden",
      purpose: "stress",
      args: (() => {
        const g = [];
        for (let r = 0; r < 100; r += 1) {
          if (r % 2 === 0) g.push(".".repeat(100));
          else {
            const gap = ((r - 1) / 2) % 2 === 0 ? 99 : 0;
            g.push(Array.from({ length: 100 }, (_, c) => (c === gap ? "." : "#")).join(""));
          }
        }
        g[0] = "S" + g[0].slice(1);
        g[98] = g[98].slice(0, 50) + "E" + g[98].slice(51);
        return [g];
      })(),
      expected: 4998,
      failureNote: "100×100 뱀 모양 미로예요.",
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
        '격자에서 "**가장 적게** 움직이기" → **격자 BFS**예요.',
        "",
        "DFS는 길을 찾아도 그게 가장 짧다는 보장이 없어요. BFS는 거리 1인 칸, 2인 칸… 순서로 퍼지니 처음 닿은 순간이 최단이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. S 위치를 찾아 `dist[S] = 0`, 큐에 넣어요. 나머지 칸의 `dist`는 -1이에요.",
        "2. 칸을 꺼내 E라면 거리를 반환해요.",
        "3. 네 방향 이웃 중 **격자 안, 벽 아님, dist == -1**인 칸에 거리 + 1을 적고 큐에 넣어요.",
        "4. 큐가 비면 -1이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "dist[S] = 0; queue = [S]",
        "while queue:",
        "    (r, c) = 앞에서 꺼내기",
        "    if (r, c) == E: return dist[r][c]",
        "    for 네 방향 (nr, nc):",
        "        if 격자 안 and 벽 아님 and dist[nr][nc] == -1:",
        "            dist[nr][nc] = dist[r][c] + 1",
        "            queue 뒤에 (nr, nc)",
        "return -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["이웃 칸으로 퍼지는 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            "for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):",
            "    nr, nc = r + dr, c + dc",
            "    if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != '#' and dist[nr][nc] == -1:",
            "        dist[nr][nc] = ______",
            "        queue.append((nr, nc))",
          ].join("\n"),
          javascript: [
            "for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {",
            "  const nr = r + dr, nc = c + dc;",
            "  if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] !== '#' && dist[nr][nc] === -1) {",
            "    dist[nr][nc] = ______;",
            "    queue.push([nr, nc]);",
            "  }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["grid-shortest-path"],
  signalIds: ["sig-shortest-steps", "sig-grid-neighbors"],
  visualization: {
    presets: [
      problemPreset("maze-ex1", "grid-bfs", "예제 1", "출발 칸에서 물결처럼 한 칸씩 거리가 퍼져요.", [
        ["S.#", "..#", "#.E"],
      ]),
      problemPreset("maze-ex2", "grid-bfs", "예제 2: 두 갈래 길", "두 길이 같은 속도로 퍼져 출구에 닿아요.", [
        ["S...", ".##.", "...E"],
      ]),
    ],
  },
  estimatedMinutes: 18,
  xp: 30,
};
