import type { Problem } from "@/types/content";

export const bfsKeyEscape: Problem = {
  id: "c:bfs-key-escape",
  slug: "bfs-key-escape",
  source: "curated",
  topic: "bfs",
  level: 5,
  title: "열쇠를 찾아 탈출",
  summary: "열쇠를 가졌는지까지 상태로 보고 출구까지의 최소 이동 수를 구해요",
  statement: [
    "노디가 방 탈출 게임을 해요. 지도 `room`은 같은 길이의 문자열 리스트이고, 칸마다 이런 뜻이 있어요.",
    "",
    "- `S`: 출발 칸, `E`: 출구",
    "- `.`: 빈 칸, `#`: 벽",
    "- `K`: 열쇠가 있는 칸. 밟으면 열쇠를 주워요.",
    "- `D`: 잠긴 문. **열쇠를 가지고 있을 때만** 지나갈 수 있어요. 열쇠 하나로 모든 문을 몇 번이든 열 수 있어요.",
    "",
    "노디는 한 번에 상하좌우로 한 칸 움직여요. S에서 E까지 가는 **최소 이동 수**를 반환해 주세요. 갈 수 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`room`: `S`, `E`, `.`, `#`, `K`, `D`로 된 문자열 리스트예요.",
  outputFormat: "최소 이동 수 (갈 수 없으면 -1)",
  constraints: ["1 ≤ 줄 수, 줄 길이 ≤ 50", "모든 줄의 길이가 같아요", "S와 E는 딱 한 개씩 있어요"],
  signature: {
    name: "solution",
    params: [
      { name: "room", type: { python: "list[str]", javascript: "string[]", java: "String[]" }, description: "방 지도" },
    ],
    returns: {
      type: { python: "int", javascript: "number", java: "int" },
      description: "최소 이동 수 (갈 수 없으면 -1)",
    },
  },
  starterCode: {
    python: ["def solution(room):", "    answer = -1", "    return answer", ""].join("\n"),
    javascript: ["function solution(room) {", "  let answer = -1;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(String[] room) {",
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
      args: [["S.#E", "..D.", "K.#."]],
      expected: 7,
      explanation:
        "문을 지나야 출구로 가요. 아래로 두 칸 가서 열쇠를 줍고, 왔던 칸으로 돌아와 문을 지나면 모두 7번이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [["S.D.E"]],
      expected: -1,
      explanation: "열쇠가 없어서 문을 지날 수 없어요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [["S..E"]],
      expected: 3,
      failureNote: "문이 없으면 그냥 걸어가요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [["SD.KE"]],
      expected: -1,
      failureNote: "열쇠가 문 너머에 있어요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [["K.S..", "####D", "E...."]],
      expected: 12,
      failureNote:
        "열쇠를 주우러 왼쪽으로 갔다가, 이미 지나온 칸을 다시 지나 오른쪽 문으로 가요. 칸만 방문 표시하면 되돌아갈 수 없어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "tricky",
      args: [["S.K", "#D#", "E.."]],
      expected: 6,
      failureNote: "열쇠가 가까이 있어서 한 번 들렀다 가요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "basic",
      args: [["S.#..", ".D#.E", "..D..", "K#..."]],
      expected: 9,
      failureNote: "문이 여러 개예요. 열쇠 하나로 모두 열려요.",
    },
    {
      id: "hid-6",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 50 }, (_, r) =>
          Array.from({ length: 50 }, (_, c) =>
            r === 0 && c === 0 ? "S" : r === 0 && c === 49 ? "E" : r === 49 && c === 0 ? "K" : c === 25 ? "D" : ".",
          ).join(""),
        ),
      ],
      expected: 147,
      failureNote: "가운데 세로줄이 모두 문이고, 열쇠는 출발 칸에서 가장 먼 아래 구석에 있어요.",
    },
    {
      id: "hid-7",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 50 }, (_, r) =>
          Array.from({ length: 50 }, (_, c) =>
            r === 0 && c === 0
              ? "S"
              : r === 49 && c === 49
                ? "E"
                : r % 4 === 1 && c !== 49
                  ? "#"
                  : r % 4 === 3 && c !== 0
                    ? "#"
                    : ".",
          ).join(""),
        ),
      ],
      expected: 1274,
      failureNote: "문 없이 뱀처럼 구불구불한 50×50 미로예요.",
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
        "최소 이동 수라서 BFS인데, **같은 칸이라도 열쇠가 있을 때와 없을 때 할 수 있는 일이 달라요**.",
        "",
        "그래서 '칸'이 아니라 `(행, 열, 열쇠 여부)`를 하나의 **상태**로 보고 BFS해요 → **상태 공간 BFS**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 방문 표시를 `visited[열쇠 여부][행][열]`로 두 겹 만들어요. 열쇠 없이 지나간 칸도, 열쇠를 가지고는 **다시** 지나갈 수 있어야 하니까요.",
        "2. 큐에는 `(행, 열, 열쇠 여부, 이동 수)`를 넣어요. 시작은 `(S, 없음, 0)`.",
        "3. 꺼낸 칸이 E면 이동 수를 반환해요.",
        "4. 상하좌우로 옮겨 가요. 벽이면 못 가고, 문인데 열쇠가 없으면 못 가요. 옮겨 간 칸이 K면 **열쇠 여부를 참**으로 바꿔요.",
        "5. 새 상태를 아직 방문하지 않았으면 방문 표시하고 큐에 넣어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "visited[2][rows][cols], queue = [(sr, sc, 0, 0)]",
        "while queue가 비어 있지 않은 동안:",
        "    (r, c, key, d) = queue 앞에서 꺼내기",
        "    if room[r][c] == 'E': return d",
        "    for 상하좌우 (nr, nc):",
        "        지도 밖이거나 벽이면 건너뛰기",
        "        문인데 key가 0이면 건너뛰기",
        "        nkey = key 또는 (room[nr][nc] == 'K')",
        "        if not visited[nkey][nr][nc]:",
        "            visited[nkey][nr][nc] = true, queue에 (nr, nc, nkey, d + 1) 넣기",
        "return -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["옮겨 간 칸에서 열쇠 상태를 정하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):",
            "    nr, nc = r + dr, c + dc",
            '    if not (0 <= nr < rows and 0 <= nc < cols) or room[nr][nc] == "#":',
            "        continue",
            '    if room[nr][nc] == "D" and not key:',
            "        continue",
            "    nkey = ______",
            "    if not visited[nkey][nr][nc]:",
            "        visited[nkey][nr][nc] = True",
            "        queue.append((nr, nc, nkey, d + 1))",
          ].join("\n"),
          javascript: [
            "for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {",
            "  const nr = r + dr, nc = c + dc;",
            '  if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || room[nr][nc] === "#") continue;',
            '  if (room[nr][nc] === "D" && !key) continue;',
            "  const nkey = ______;",
            "  if (!visited[nkey][nr][nc]) {",
            "    visited[nkey][nr][nc] = true;",
            "    queue.push([nr, nc, nkey, d + 1]);",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int[] d : DIRS) {",
            "    int nr = r + d[0], nc = c + d[1];",
            "    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || room[nr].charAt(nc) == '#') continue;",
            "    if (room[nr].charAt(nc) == 'D' && key == 0) continue;",
            "    int nkey = ______;",
            "    if (!visited[nkey][nr][nc]) {",
            "        visited[nkey][nr][nc] = true;",
            "        queue.offer(new int[] {nr, nc, nkey, dist + 1});",
            "    }",
            "}",
          ].join("\n"),
        },
        caption: "열쇠 여부는 0과 1로 두면 visited의 첫 번째 칸 번호로 바로 쓸 수 있어요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["state-space-bfs", "grid-shortest-path"],
  signalIds: ["sig-shortest-steps", "sig-grid-neighbors"],
  estimatedMinutes: 30,
  xp: 50,
};
