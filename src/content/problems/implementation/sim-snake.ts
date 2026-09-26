import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [4, [], [], ""],
    expected: 4,
    explanation: "(0, 3)까지 3초 동안 가고, 4초에 판 밖으로 나가요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [
      6,
      [
        [2, 3],
        [1, 4],
        [4, 2],
      ],
      [3, 15, 17],
      "DLD",
    ],
    expected: 9,
    explanation: "3초 끝에 아래로 돌아 (2, 3) 사과를 먹고, 계속 내려가다 9초에 판 아래로 나가요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      10,
      [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      [4, 5, 6],
      "DDD",
    ],
    expected: 7,
    failureNote: "사과 4개를 먹어 길이 5가 된 뒤 오른쪽으로 세 번 돌면, 7초에 자기 몸에 부딪혀요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [5, [[0, 2]], [2, 4], "DL"],
    expected: 7,
    failureNote: "2초에 사과를 먹고 아래로, 4초 끝에 왼쪽으로 돌면 다시 오른쪽을 봐요. 7초에 판 밖이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [3, [], [1, 2, 3, 4], "DDDD"],
    expected: 7,
    failureNote: "길이 1이라 빙 돌아 처음 칸에 와도 부딪히지 않아요. 7초에 판 밖으로 나가요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1],
        [0, 2],
      ],
      [2],
      "L",
    ],
    expected: 3,
    failureNote: "2초 끝에 왼쪽으로 돌면 위쪽이라 3초에 판 밖이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      100,
      Array.from({ length: 10000 }, (_, i) => i)
        .filter((i) => i > 0 && i % 7 === 3)
        .map((i) => [Math.floor(i / 100), i % 100]),
      Array.from({ length: 99 }, (_, r) => [100 * r + 99, 100 * r + 100]).flat(),
      Array.from({ length: 99 }, (_, r) => (r % 2 === 0 ? "DD" : "LL")).join(""),
    ],
    expected: 10000,
    failureNote:
      "100 × 100 판을 지그재그로 끝까지 훑어요. 몸이 1,400칸 넘게 길어져요. 몸에 부딪혔는지 목록을 매번 훑으면 느려요.",
  },
]);

export const simSnake: Problem = {
  id: "c:sim-snake",
  slug: "sim-snake",
  source: "curated",
  topic: "implementation",
  level: 5,
  title: "애벌레 게임",
  summary: "몸을 덱(머리 앞에 넣고 꼬리 빼기)과 집합으로 들고, 1초씩 규칙대로 움직여요",
  statement: [
    "`n × n` 판의 왼쪽 위 칸 (0, 0)에 길이 1인 애벌레가 **오른쪽**을 보고 있어요. `apples`의 `[r, c]` 칸에는 사과가 있어요.",
    "",
    "1초마다 이렇게 움직여요.",
    "",
    "1. 머리를 보고 있는 쪽으로 한 칸 내밀어요.",
    "2. 그 칸이 **판 밖이거나 자기 몸**(꼬리 포함)이면 게임이 끝나요.",
    "3. 그 칸에 사과가 있으면 사과를 먹고 꼬리는 그대로예요. (한 칸 길어져요)",
    "4. 사과가 없으면 꼬리가 한 칸 줄어요. (길이는 그대로예요)",
    "",
    "`times[i]`초가 끝났을 때 `dirs[i]` 쪽으로 90도 돌아요. `L`은 왼쪽, `D`는 오른쪽이에요.",
    "",
    "게임이 **몇 초에** 끝나는지 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 판 크기, `apples`: 사과 위치, `times`: 도는 시각(오름차순), `dirs`: 도는 방향이에요.",
  outputFormat: "게임이 끝나는 시각(초)",
  constraints: [
    "2 ≤ n ≤ 100",
    "0 ≤ apples의 길이 ≤ 2,000, (0, 0)에는 사과가 없어요",
    "0 ≤ times의 길이 = dirs의 길이 ≤ 10,000",
    "1 ≤ times[i] ≤ 100,000",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "판 크기" },
      {
        name: "apples",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "사과 위치",
      },
      { name: "times", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "도는 시각" },
      { name: "dirs", type: { python: "str", javascript: "string", java: "String" }, description: "도는 방향 (L/D)" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "끝나는 시각" },
  },
  starterCode: {
    python: ["def solution(n, apples, times, dirs):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, apples, times, dirs) {", "  let answer = 0;", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] apples, int[] times, String dirs) {",
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
      body: ["규칙이 길게 적힌 **시뮬레이션**이에요. 1초 동안 일어나는 일을 순서대로 정확히 옮겨요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "- 몸: 머리 쪽에 넣고 꼬리 쪽에서 빼니 **덱**에 담아요. 부딪힘을 빨리 확인하려고 **집합**에도 함께 담아요.",
        "- 사과: 집합에 담고, 먹으면 지워요.",
        "- 방향: 0 = 오른쪽부터 시계 방향으로 번호를 붙이면 `D`는 +1, `L`은 +3이에요.",
        "",
        "순서가 중요해요: 머리 이동 → 부딪힘 확인(꼬리를 빼기 전) → 사과 확인 → 꼬리 → 시간이 됐으면 돌기.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "body = 덱[(0, 0)];  occupied = {(0, 0)};  d = 0;  t = 0",
        "loop:",
        "    t += 1;  head = 머리 + 방향",
        "    if head가 판 밖이거나 occupied에 있으면: return t",
        "    body 앞에 head, occupied에 head 넣기",
        "    if head가 사과: 사과 지우기",
        "    else: tail = body 뒤에서 빼기;  occupied에서 지우기",
        "    if t가 다음 도는 시각: 돌기",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["부딪힘을 확인하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "nr, nc = body[0][0] + dr[d], body[0][1] + dc[d]",
            "if not (0 <= nr < n and 0 <= nc < n) or ______:",
            "    return t",
          ].join("\n"),
          javascript: [
            "const [hr, hc] = cells[cells.length - 1];",
            "const nr = hr + dr[d], nc = hc + dc[d];",
            "if (nr < 0 || nr >= n || nc < 0 || nc >= n || ______) return t;",
          ].join("\n"),
          java: [
            "int[] head = body.peekFirst();",
            "int nr = head[0] + DR[d], nc = head[1] + DC[d];",
            "if (nr < 0 || nr >= n || nc < 0 || nc >= n || ______) return t;",
          ].join("\n"),
        },
        caption: "몸은 ArrayDeque에, 부딪힘 확인용으로 칸 번호(r × n + c)를 HashSet에도 담아요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["step-simulation"],
  signalIds: ["sig-follow-rules"],
  estimatedMinutes: 25,
  xp: 50,
};
