import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[".....", "..#..", "..#..", "..#..", "....."], 1],
    expected: [".....", ".....", ".###.", ".....", "....."],
    explanation: "세로 막대가 가로 막대로 바뀌어요. 가운데는 이웃 2개라 살고, 양 옆은 이웃 3개라 생겨요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["##", "##"], 3],
    expected: ["##", "##"],
    explanation: "네모는 모두 이웃이 3개라 그대로예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["#.", ".#"], 0],
    expected: ["#.", ".#"],
    failureNote: "0시간이면 그대로예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [["#"], 1],
    expected: ["."],
    failureNote: "혼자인 이끼는 사라져요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [["....", ".##.", ".#..", "...."], 1],
    expected: ["....", ".##.", ".##.", "...."],
    failureNote: "빈칸 (2, 2)는 이웃 3개라 생겨서 네모가 돼요. 칸을 바꾸면서 같은 판을 계속 보면 틀려요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [[".#....", "..#...", "###...", "......", "......", "......"], 4],
    expected: ["......", "..#...", "...#..", ".###..", "......", "......"],
    failureNote: "글라이더 모양은 4시간 뒤 오른쪽 아래로 한 칸씩 옮겨가요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 40 }, (_, r) =>
        Array.from({ length: 40 }, (_, c) => ((r * 7 + c * 13 + r * c) % 5 < 2 ? "#" : ".")).join(""),
      ),
      50,
    ],
    // prettier-ignore
    expected: [".....#..........................##......","....#.#.........................##......","....#.#.................................",".....#..................................","........................................","........................................","........................................","........................................","...................................##...","...................................##...","........................................","........................................","........................................","...................................##...","...................................##...","........................................","........................................","........................................","...................................##...","...................................##...","........................................","........................................","........................................","...................................##...","...................................##...","........................................","........................................","........................................","........................................","........................................","........................................","........................................","........................................","....................................###.","........................................","........................................","........................................","........................................","........................................","........................................"],
    failureNote: "40 × 40 판을 50시간 돌려요.",
  },
]);

export const simLifeSteps: Problem = {
  id: "c:sim-life-steps",
  slug: "sim-life-steps",
  source: "curated",
  topic: "implementation",
  level: 3,
  title: "이끼 번식 시뮬레이션",
  summary: "모든 칸의 다음 상태를 '지금 판'만 보고 새 판에 적어야 해요",
  statement: [
    "바위 표면 `grid`에 이끼가 자라요. `'#'`은 이끼가 있는 칸, `'.'`은 빈칸이에요.",
    "",
    "1시간마다 **모든 칸이 동시에** 이렇게 바뀌어요. 이웃은 둘레 8칸이고, 판 밖은 빈칸으로 봐요.",
    "",
    "- 이끼 칸: 이웃 이끼가 **2개나 3개**면 살아남고, 아니면 사라져요.",
    "- 빈칸: 이웃 이끼가 **정확히 3개**면 이끼가 생겨요.",
    "",
    "`k`시간 뒤의 모습을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`grid`: 처음 모습, `k`: 지나는 시간이에요.",
  outputFormat: "k시간 뒤의 모습",
  constraints: ["1 ≤ 줄 수, 칸 수 ≤ 40", "0 ≤ k ≤ 50"],
  signature: {
    name: "solution",
    params: [
      {
        name: "grid",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "처음 모습",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "시간" },
    ],
    returns: { type: { python: "list[str]", javascript: "string[]", java: "String[]" }, description: "k시간 뒤" },
  },
  starterCode: {
    python: ["def solution(grid, k):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(grid, k) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String[] solution(String[] grid, int k) {",
      "        String[] answer = grid;",
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
      body: ["규칙대로 판 전체를 한 단계씩 바꾸는 **시뮬레이션**이에요. '모든 칸이 동시에'가 핵심이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "한 칸을 바꾸자마자 그 칸을 이웃 계산에 쓰면 틀려요. 그래서 **새 판**을 따로 만들어요.",
        "",
        "1. 지금 판의 모든 칸에서 둘레 8칸 중 이끼 수를 세요. (판 밖은 세지 않아요)",
        "2. 규칙대로 새 판에 적어요.",
        "3. 새 판을 지금 판으로 바꾸고 k번 반복해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "repeat k번:",
        "    new = 빈 판",
        "    for 모든 칸 (r, c):",
        "        cnt = 둘레 8칸 중 '#' 수",
        "        new[r][c] = '#' if (cnt == 3) or (지금 '#' and cnt == 2) else '.'",
        "    grid = new",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["다음 상태를 정하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ['alive = grid[r][c] == "#"', 'row.append("#" if cnt == 3 or (______) else ".")'].join("\n"),
          javascript: ['const alive = grid[r][c] === "#";', 'row += cnt === 3 || (______) ? "#" : ".";'].join("\n"),
          java: ["boolean alive = grid[r].charAt(c) == '#';", "row.append(cnt == 3 || (______) ? '#' : '.');"].join(
            "\n",
          ),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["step-simulation"],
  signalIds: ["sig-follow-rules"],
  estimatedMinutes: 18,
  xp: 30,
};
