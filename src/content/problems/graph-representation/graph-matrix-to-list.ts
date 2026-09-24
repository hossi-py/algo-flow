import type { Problem } from "@/types/content";

export const graphMatrixToList: Problem = {
  id: "c:graph-matrix-to-list",
  slug: "graph-matrix-to-list",
  source: "curated",
  topic: "graph-representation",
  level: 3,
  title: "노선도 표 읽기",
  summary: "연결 여부 표(인접 행렬)를 이웃 목록(인접 리스트)으로 바꿔요",
  statement: [
    "버스 회사가 노선도를 표로 보내 왔어요. `table[i][j]`가 `1`이면 i번 정류장에서 j번 정류장으로 **바로 가는 버스**가 있고, `0`이면 없어요. (한쪽 방향만 있을 수도 있어요.)",
    "",
    "i번째 원소가 **i번 정류장에서 바로 갈 수 있는 정류장 번호를 오름차순으로** 담은 리스트인 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`table`: n × n 크기의 0/1 표예요. `table[i][i]`는 항상 0이에요.",
  outputFormat: "길이 n인 리스트의 리스트",
  constraints: ["1 ≤ n ≤ 200"],
  signature: {
    name: "solution",
    params: [
      { name: "table", type: { python: "list[list[int]]", javascript: "number[][]" }, description: "연결 여부 표" },
    ],
    returns: {
      type: { python: "list[list[int]]", javascript: "number[][]" },
      description: "정류장별로 바로 갈 수 있는 곳",
    },
  },
  starterCode: {
    python: ["def solution(table):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(table) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [
        [
          [0, 1, 1],
          [0, 0, 1],
          [1, 0, 0],
        ],
      ],
      expected: [[1, 2], [2], [0]],
      explanation: "0번 → 1, 2번 / 1번 → 2번 / 2번 → 0번이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        [
          [0, 0],
          [0, 0],
        ],
      ],
      expected: [[], []],
      explanation: "버스가 하나도 없어요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[[0]]],
      expected: [[]],
      failureNote: "정류장이 하나뿐이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [0, 1],
          [0, 0],
        ],
      ],
      expected: [[1], []],
      failureNote: "0 → 1은 있지만 1 → 0은 없어요. 행이 '출발'이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [
          [0, 1, 1, 1],
          [1, 0, 1, 1],
          [1, 1, 0, 1],
          [1, 1, 1, 0],
        ],
      ],
      expected: [
        [1, 2, 3],
        [0, 2, 3],
        [0, 1, 3],
        [0, 1, 2],
      ],
      failureNote: "모든 정류장끼리 오갈 수 있어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [
          [0, 0, 0, 1, 0],
          [0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0],
          [0, 1, 0, 0, 0],
          [0, 0, 1, 0, 0],
        ],
      ],
      expected: [[3], [4], [0], [1], [2]],
      failureNote: "정류장을 한 바퀴 도는 노선이에요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 200 }, (_, i) =>
          Array.from({ length: 200 }, (_, j) => (i !== j && (i + j) % 3 === 0 ? 1 : 0)),
        ),
      ],
      expected: Array.from({ length: 200 }, (_, i) =>
        Array.from({ length: 200 }, (_, j) => j).filter((j) => i !== j && (i + j) % 3 === 0),
      ),
      failureNote: "정류장 200개의 표예요.",
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
        "N×N 표로 연결 여부가 주어졌어요 → 이 표가 바로 **인접 행렬**이에요.",
        "",
        "행 번호가 출발, 열 번호가 도착이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "i번 행을 왼쪽부터 훑으면서 값이 1인 열 번호 j를 i의 목록에 넣어요. 왼쪽부터 보니까 저절로 오름차순이에요.",
        "",
        "**인접 행렬 vs 인접 리스트**",
        "- 행렬: 두 노드가 연결됐는지 O(1)에 알지만, 공간이 N²이고 이웃을 찾으려면 한 행 전체(N칸)를 훑어야 해요.",
        "- 리스트: 이웃만 담아서 간선이 적을 때 공간과 시간을 아껴요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for i in 0..n-1:",
        "    result[i] = [j for j in 0..n-1 if table[i][j] == 1]",
        "return result",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["n = len(table)", "return [[j for j in range(n) if ______] for i in range(n)]"].join("\n"),
          javascript: [
            "return table.map((row) => {",
            "  const next = [];",
            "  row.forEach((value, j) => {",
            "    if (______) next.push(j);",
            "  });",
            "  return next;",
            "});",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["adjacency-matrix", "adjacency-list"],
  signalIds: ["sig-matrix-given"],
  estimatedMinutes: 12,
  xp: 30,
};
