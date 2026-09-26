import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const topoSemester: Problem = {
  id: "c:topo-semester",
  slug: "topo-semester",
  source: "curated",
  topic: "graph-advanced",
  level: 5,
  title: "몇 학기에 들을 수 있을까?",
  summary: "위상 정렬 순서로 '선수 과목 중 가장 늦은 학기 + 1'을 채워요",
  statement: [
    "과목 `n`개와 선수 조건 `prereqs`가 있어요. `[a, b]`는 **a번을 들은 다음 학기부터 b번을 들을 수 있다**는 뜻이에요.",
    "",
    "한 학기에 과목을 몇 개든 들을 수 있어요. 과목마다 **가장 빨리 들을 수 있는 학기**(1학기부터)를 번호 순서대로 담아 반환해 주세요.",
    "",
    "조건에 고리는 없어요.",
  ].join("\n"),
  inputFormat: "`n`: 과목 수, `prereqs`: `[a, b]` 선수 조건이에요.",
  outputFormat: "과목마다 가장 빠른 학기",
  constraints: ["1 ≤ n ≤ 100,000", "0 ≤ prereqs의 길이 ≤ 200,000", "조건에 고리는 없어요"],
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
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "과목별 학기" },
  },
  starterCode: {
    python: ["def solution(n, prereqs):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, prereqs) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int n, int[][] prereqs) {",
      "        int[] answer = new int[n];",
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
        6,
        [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 4],
          [3, 5],
        ],
      ],
      expected: [1, 2, 2, 3, 3, 4],
      explanation: "0번은 1학기, 1·2번은 2학기, 3·4번은 3학기, 5번은 4학기예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [3, []],
      expected: [1, 1, 1],
      explanation: "조건이 없으면 모두 1학기예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [
        3,
        [
          [0, 2],
          [1, 2],
        ],
      ],
      expected: [1, 1, 2],
      failureNote: "2번은 두 과목 다음이라 2학기예요: [1, 1, 2].",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        4,
        [
          [0, 1],
          [1, 2],
          [0, 3],
          [2, 3],
        ],
      ],
      expected: [1, 2, 3, 4],
      failureNote: "3번은 0번 바로 다음이 아니라, 가장 늦은 선수 과목 2번(3학기) 다음인 4학기예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "edge",
      args: [1, []],
      expected: [1],
      failureNote: "과목 하나면 [1]이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        50000,
        [
          ...Array.from({ length: 50000 }, (_, i) => i)
            .filter((i) => i % 100 !== 99)
            .map((i) => [i, i + 1]),
          ...Array.from({ length: 50000 }, (_, i) => i)
            .filter((i) => i % 100 < 98)
            .map((i) => [i, i + 2]),
        ],
      ],
      expected: Array.from({ length: 50000 }, (_, i) => (i % 100) + 1),
      failureNote: "과목 5만 개예요. 과목마다 선수 과목을 거슬러 올라가면 같은 계산을 계속 반복해요.",
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
      body: ["선수 조건 → **위상 정렬**, 순서를 따라 학기를 채우는 **DAG 위의 DP**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`term[v]` = v번의 가장 빠른 학기예요. 처음엔 모두 1이에요.",
        "",
        "위상 정렬로 v를 꺼낼 때 `term[v]`는 확정돼 있어요. v 다음 과목 w마다 `term[w] = max(term[w], term[v] + 1)`이에요.",
        "",
        "선수 과목이 여러 개면 **가장 늦은 것** 다음 학기예요. 그래서 max를 써요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "term = [1] * n",
        "위상 정렬 순서로 v를 꺼낼 때:",
        "    for w in graph[v]: term[w] = max(term[w], term[v] + 1)",
        "return term",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["학기를 채우는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for w in graph[v]:",
            "    term[w] = ______",
            "    indeg[w] -= 1",
            "    if indeg[w] == 0:",
            "        queue.append(w)",
          ].join("\n"),
          javascript: [
            "for (const w of graph[v]) {",
            "  term[w] = ______;",
            "  if (--indeg[w] === 0) queue.push(w);",
            "}",
          ].join("\n"),
          java: [
            "for (int w : graph.get(v)) {",
            "    term[w] = ______;",
            "    if (--indeg[w] == 0) queue.add(w);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["dag-dp"],
  signalIds: ["sig-prerequisites"],
  visualization: {
    presets: [
      problemPreset(
        "topo-semester-ex1",
        "topo-kahn",
        "꺼내는 순서가 곧 학기 순서",
        "0번을 꺼내면 1·2번이, 그다음 3·4번이, 마지막에 5번이 열려요.",
        [
          6,
          [
            [0, 1],
            [0, 2],
            [1, 3],
            [2, 4],
            [3, 5],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 15,
  xp: 50,
};
