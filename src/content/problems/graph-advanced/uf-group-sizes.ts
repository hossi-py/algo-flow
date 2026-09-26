import type { Problem } from "@/types/content";

export const ufGroupSizes: Problem = {
  id: "c:uf-group-sizes",
  slug: "uf-group-sizes",
  source: "curated",
  topic: "graph-advanced",
  level: 2,
  title: "모임마다 몇 명?",
  summary: "대표마다 크기를 들고 있으면, 합칠 때 더하기만 하면 돼요",
  statement: [
    "학생 `n`명과 친구 관계 `pairs`(`[a, b]`)가 있어요. 친구의 친구도 같은 모임이에요.",
    "",
    "모임마다 **몇 명인지** 큰 순서대로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 학생 수, `pairs`: `[a, b]` 친구 관계 목록이에요.",
  outputFormat: "모임별 인원 (내림차순)",
  constraints: ["1 ≤ n ≤ 100,000", "0 ≤ pairs의 길이 ≤ 100,000", "0 ≤ a, b < n, a ≠ b"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "학생 수" },
      {
        name: "pairs",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "친구 관계",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "int[]" },
      description: "모임별 인원 (내림차순)",
    },
  },
  starterCode: {
    python: ["def solution(n, pairs):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, pairs) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int n, int[][] pairs) {",
      "        int[] answer = new int[0];",
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
          [1, 2],
          [3, 4],
        ],
      ],
      expected: [3, 2, 1],
      explanation: "{0, 1, 2}, {3, 4}, {5}라 [3, 2, 1]이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [3, []],
      expected: [1, 1, 1],
      explanation: "모두 혼자라 [1, 1, 1]이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [
        4,
        [
          [0, 1],
          [2, 3],
          [1, 3],
        ],
      ],
      expected: [4],
      failureNote: "모두 한 모임이라 [4]예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        5,
        [
          [0, 4],
          [4, 0],
        ],
      ],
      expected: [2, 1, 1, 1],
      failureNote: "같은 관계가 두 번 나와도 2명이에요: [2, 1, 1, 1].",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        7,
        [
          [0, 1],
          [2, 3],
          [4, 5],
          [5, 6],
        ],
      ],
      expected: [3, 2, 2],
      failureNote: "[3, 2, 2]예요. 크기가 같은 모임도 따로 적어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        100000,
        Array.from({ length: 100000 }, (_, i) => i)
          .filter((i) => i % 10 !== 9)
          .map((i) => [i, i + 1]),
      ],
      expected: new Array(10000).fill(10),
      failureNote: "10명씩 모임 1만 개예요.",
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
      body: ["관계로 그룹을 합치고 그룹의 **크기**를 물어요 → 크기를 함께 들고 다니는 **유니온 파인드**예요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`size[대표]` = 그 그룹의 인원이에요. union에서 작은 그룹을 큰 그룹 밑에 붙일 때 `size[큰 대표] += size[작은 대표]`로 더해요.",
        "",
        "끝나면 **자기 자신이 대표인** 노드(`find(i) == i`)만 골라 크기를 모아 정렬해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for a, b in pairs: union(a, b)",
        "sizes = [size[i] for i in range(n) if find(i) == i]",
        "return 내림차순 정렬(sizes)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["대표만 골라 크기를 모으는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["sizes = [size[i] for i in range(n) if ______]", "return sorted(sizes, reverse=True)"].join("\n"),
          javascript: [
            "const sizes = [];",
            "for (let i = 0; i < n; i++) if (______) sizes.push(dsu.size[i]);",
            "return sizes.sort((a, b) => b - a);",
          ].join("\n"),
          java: [
            "List<Integer> sizes = new ArrayList<>();",
            "for (int i = 0; i < n; i++) if (______) sizes.add(size[i]);",
            "sizes.sort(Collections.reverseOrder());",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["union-find"],
  signalIds: ["sig-merge-groups"],
  estimatedMinutes: 12,
  xp: 20,
};
