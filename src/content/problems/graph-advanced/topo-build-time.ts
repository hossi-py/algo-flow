import type { Problem } from "@/types/content";

export const topoBuildTime: Problem = {
  id: "c:topo-build-time",
  slug: "topo-build-time",
  source: "curated",
  topic: "graph-advanced",
  level: 4,
  title: "집 짓기 공정표",
  summary: "위상 정렬 순서로 '이 작업이 끝나는 가장 이른 시각'을 채워 나가요",
  statement: [
    "집을 짓는 작업 `n`개가 있어요. `times[i]`는 i번 작업에 걸리는 날 수예요. `prereqs`의 `[a, b]`는 **a번이 끝나야 b번을 시작할 수 있다**는 뜻이에요.",
    "",
    "일꾼은 충분히 많아서 조건만 지키면 여러 작업을 동시에 할 수 있어요.",
    "",
    "모든 작업을 끝내는 데 걸리는 **가장 짧은 날 수**를 반환해 주세요. 조건에 고리는 없어요.",
  ].join("\n"),
  inputFormat: "`times`: 작업마다 걸리는 날 수, `prereqs`: `[a, b]` 조건이에요.",
  outputFormat: "모두 끝내는 가장 짧은 날 수",
  constraints: ["1 ≤ n ≤ 50,000", "1 ≤ times[i] ≤ 1,000", "0 ≤ prereqs의 길이 ≤ 150,000", "조건에 고리는 없어요"],
  signature: {
    name: "solution",
    params: [
      {
        name: "times",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "작업마다 걸리는 날 수",
      },
      {
        name: "prereqs",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[먼저, 나중] 조건",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "가장 짧은 날 수" },
  },
  starterCode: {
    python: ["def solution(times, prereqs):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(times, prereqs) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] times, int[][] prereqs) {",
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
        [10, 1, 100, 10],
        [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3],
        ],
      ],
      expected: 120,
      explanation: "3번은 2번(10 + 100 = 110일째 끝)을 기다려야 해서 110 + 10 = 120이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[5], []],
      expected: 5,
      explanation: "작업 하나면 5예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [[3, 2, 1], []],
      expected: 3,
      failureNote: "조건이 없으면 모두 동시에 해서 가장 긴 3이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [1, 2, 3],
        [
          [0, 1],
          [1, 2],
        ],
      ],
      expected: 6,
      failureNote: "한 줄로 이어져서 1 + 2 + 3 = 6이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [5, 1, 1, 1],
        [
          [1, 2],
          [2, 3],
        ],
      ],
      expected: 5,
      failureNote:
        "1 → 2 → 3은 3일이지만 0번이 혼자 5일 걸려서 5예요. 마지막 작업이 아니라 가장 늦게 끝나는 작업을 봐야 해요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 30000 }, (_, i) => ((i * 7919) % 1000) + 1),
        Array.from({ length: 90000 }, (_, i) => {
          const a = (i * 7919) % 29999;
          return [a, a + 1 + ((i * 104729) % (29999 - a))];
        }),
      ],
      expected: 29097,
      failureNote: "작업 3만 개, 조건 9만 개예요. 작업마다 가능한 경로를 모두 따라가면 끝나지 않아요.",
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
      body: ["선행 조건이 있는 작업 → **위상 정렬**. 순서를 따라가며 '끝나는 시각'을 채우니 **DAG 위의 DP**예요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`finish[v]` = v번 작업이 끝나는 가장 이른 날이에요. 처음엔 `times[v]`예요.",
        "",
        "위상 정렬로 v를 꺼낼 때는 v의 선행 작업이 모두 끝나 `finish[v]`가 확정돼 있어요. 그 뒤 작업 w마다:",
        "",
        "`finish[w] = max(finish[w], finish[v] + times[w])`",
        "",
        "답은 `finish`의 최댓값이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "finish = times 복사",
        "위상 정렬 순서로 v를 꺼낼 때:",
        "    for w in graph[v]:",
        "        finish[w] = max(finish[w], finish[v] + times[w])",
        "return max(finish)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["끝나는 날을 채우는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for w in graph[v]:",
            "    finish[w] = max(finish[w], ______)",
            "    indeg[w] -= 1",
            "    if indeg[w] == 0:",
            "        queue.append(w)",
          ].join("\n"),
          javascript: [
            "for (const w of graph[v]) {",
            "  finish[w] = Math.max(finish[w], ______);",
            "  if (--indeg[w] === 0) queue.push(w);",
            "}",
          ].join("\n"),
          java: [
            "for (int w : graph.get(v)) {",
            "    finish[w] = Math.max(finish[w], ______);",
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
  estimatedMinutes: 18,
  xp: 40,
};
