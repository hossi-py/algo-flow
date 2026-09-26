import type { Problem } from "@/types/content";

export const greedyHeightQueue: Problem = {
  id: "c:greedy-height-queue",
  slug: "greedy-height-queue",
  source: "curated",
  topic: "greedy",
  level: 5,
  title: "키 메모로 줄 다시 세우기",
  summary: "큰 사람부터 세우고, 앞에 있어야 하는 사람 수 자리에 끼워 넣어요",
  statement: [
    "체육 시간에 줄이 흐트러졌어요. 친구마다 쪽지에 `[키, 앞사람 수]`를 적어 뒀어요. **앞사람 수**는 줄에서 자기보다 앞에 선 사람 중 **키가 자기 이상**인 사람의 수예요.",
    "",
    "쪽지들 `people`이 뒤섞여 주어질 때, 원래 줄을 앞에서부터 `[키, 앞사람 수]` 목록으로 복원해 반환해 주세요. 올바른 줄은 항상 하나 있어요.",
  ].join("\n"),
  inputFormat: "`people`: `[키, 앞사람 수]` 쪽지들이에요 (순서 뒤섞임).",
  outputFormat: "앞에서부터 복원한 줄",
  constraints: ["1 ≤ people의 길이 ≤ 1,000", "1 ≤ 키 ≤ 1,000,000", "0 ≤ 앞사람 수 < people의 길이"],
  signature: {
    name: "solution",
    params: [
      {
        name: "people",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "쪽지들",
      },
    ],
    returns: {
      type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
      description: "복원한 줄",
    },
  },
  starterCode: {
    python: ["def solution(people):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(people) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[][] solution(int[][] people) {",
      "        int[][] answer = new int[0][];",
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
          [7, 0],
          [4, 4],
          [7, 1],
          [5, 0],
          [6, 1],
          [5, 2],
        ],
      ],
      expected: [
        [5, 0],
        [7, 0],
        [5, 2],
        [6, 1],
        [4, 4],
        [7, 1],
      ],
      explanation: "[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1] 순서예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[[3, 0]]],
      expected: [[3, 0]],
      explanation: "혼자면 그대로예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [5, 0],
          [5, 1],
          [5, 2],
        ],
      ],
      expected: [
        [5, 0],
        [5, 1],
        [5, 2],
      ],
      failureNote: "키가 같은 사람도 '이상'이라 앞사람 수에 들어가요. 앞사람 수 순서대로예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [
          [6, 0],
          [5, 0],
          [4, 0],
          [3, 2],
          [2, 2],
          [1, 4],
        ],
      ],
      expected: [
        [4, 0],
        [5, 0],
        [2, 2],
        [3, 2],
        [1, 4],
        [6, 0],
      ],
      failureNote: "[4, 0], [5, 0], [2, 2], [3, 2], [1, 4], [6, 0]이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "edge",
      args: [
        [
          [1, 1],
          [2, 0],
        ],
      ],
      expected: [
        [2, 0],
        [1, 1],
      ],
      failureNote: "작은 사람(1) 앞에 큰 사람(2)이 한 명 있어야 해요. [2, 0], [1, 1]이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        (() => {
          const hs = Array.from({ length: 1000 }, (_, i) => 150 + ((i * 7919) % 100));
          return hs.map((h, i) => [h, hs.slice(0, i).filter((x) => x >= h).length]);
        })()
          .map((p, i) => ({ p, key: (i * 7919) % 1000 }))
          .sort((a, b) => a.key - b.key)
          .map((x) => x.p),
      ],
      expected: (() => {
        const hs = Array.from({ length: 1000 }, (_, i) => 150 + ((i * 7919) % 100));
        return hs.map((h, i) => [h, hs.slice(0, i).filter((x) => x >= h).length]);
      })(),
      failureNote: "1,000명이에요. 가능한 줄을 모두 만들어 보는 건 불가능해요.",
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
        "누구를 먼저 세우느냐가 핵심인 **정렬 그리디**예요. **큰 사람부터** 세우면, 뒤에 끼워 넣는 작은 사람은 큰 사람들의 앞사람 수를 바꾸지 않아요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 키가 **큰 순**으로, 키가 같으면 앞사람 수가 **작은 순**으로 정렬해요.",
        "2. 빈 줄에 차례로 `k`번 자리에 **끼워 넣어요**. 지금 줄에 있는 사람은 모두 자기보다 키가 크거나 같으니, 앞에 정확히 k명이 서게 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "people를 (-키, 앞사람 수) 순으로 정렬",
        "line = []",
        "for h, k in people:",
        "    line의 k번 자리에 [h, k] 끼워 넣기",
        "return line",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["정렬 기준이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "people.sort(key=lambda p: ______)",
            "line = []",
            "for h, k in people:",
            "    line.insert(k, [h, k])",
          ].join("\n"),
          javascript: [
            "const sorted = [...people].sort((a, b) => ______);",
            "const line = [];",
            "for (const [h, k] of sorted) line.splice(k, 0, [h, k]);",
          ].join("\n"),
          java: [
            "int[][] sorted = people.clone();",
            "Arrays.sort(sorted, (a, b) -> ______);",
            "List<int[]> line = new ArrayList<>();",
            "for (int[] p : sorted) line.add(p[1], p);",
          ].join("\n"),
        },
        caption: "List의 add(자리, 값)은 그 자리에 끼워 넣고 뒤를 한 칸씩 밀어요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-by-sort"],
  signalIds: ["sig-greedy-local-best"],
  estimatedMinutes: 25,
  xp: 50,
};
