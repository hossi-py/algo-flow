import type { Problem } from "@/types/content";

export const cxPrefixQueries: Problem = {
  id: "c:cx-prefix-queries",
  slug: "cx-prefix-queries",
  source: "curated",
  topic: "complexity",
  level: 2,
  title: "누적 합으로 빠르게",
  summary: "누적 합을 한 번 만들어 두면, 구간 합 질문마다 뺄셈 한 번이에요",
  statement: [
    "정수 배열 `nums`가 있어요. `queries`의 `[l, r]`마다 `nums[l] + nums[l + 1] + … + nums[r]`를 구해, 질문 순서대로 담아 반환해 주세요.",
    "",
    "번호는 0부터 세고, `l`과 `r` 칸도 포함해요.",
  ].join("\n"),
  inputFormat: "`nums`: 정수 배열, `queries`: `[l, r]` 질문 목록이에요.",
  outputFormat: "질문마다 구간 합",
  constraints: [
    "1 ≤ nums의 길이 ≤ 100,000",
    "−10,000 ≤ nums[i] ≤ 10,000",
    "1 ≤ queries의 길이 ≤ 100,000",
    "0 ≤ l ≤ r < nums의 길이",
  ],
  signature: {
    name: "solution",
    params: [
      { name: "nums", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "정수 배열" },
      {
        name: "queries",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[l, r] 질문",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "long[]" }, description: "질문마다 구간 합" },
  },
  starterCode: {
    python: ["def solution(nums, queries):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(nums, queries) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long[] solution(int[] nums, int[][] queries) {",
      "        long[] answer = new long[queries.length];",
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
        [3, -1, 4, 1, 5],
        [
          [0, 2],
          [1, 3],
          [4, 4],
        ],
      ],
      expected: [6, 4, 5],
      explanation: "3 − 1 + 4 = 6, −1 + 4 + 1 = 4, 5예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[7], [[0, 0]]],
      expected: [7],
      explanation: "칸 하나면 그 값이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [1, 2, 3, 4],
        [
          [0, 3],
          [0, 0],
          [3, 3],
        ],
      ],
      expected: [10, 1, 4],
      failureNote: "[10, 1, 4]예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [5, -5, 5, -5],
        [
          [0, 1],
          [1, 2],
          [0, 3],
        ],
      ],
      expected: [0, 0, 0],
      failureNote: "음수가 있어도 똑같아요: [0, 0, 0].",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [2, 2, 2],
        [
          [1, 2],
          [0, 1],
        ],
      ],
      expected: [4, 4],
      failureNote: "[4, 4]예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 20001) - 10000),
        Array.from({ length: 100000 }, (_, i) => {
          const l = (i * 104729) % 100000;
          return [l, l + ((i * 31) % (100000 - l))];
        }),
      ],
      expected: (() => {
        const p = [0];
        for (const x of Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 20001) - 10000))
          p.push(p[p.length - 1] + x);
        return Array.from({ length: 100000 }, (_, i) => {
          const l = (i * 104729) % 100000;
          return [l, l + ((i * 31) % (100000 - l))];
        }).map(([l, r]) => p[r + 1] - p[l]);
      })(),
      failureNote: "질문 10만 개, 구간 길이 최대 10만이에요. 질문마다 더하면 최대 100억 번이에요.",
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
      body: ["같은 배열에 구간 합을 **여러 번** 물어요. 질문마다 더하면 `O(N × Q)`예요 → **미리 계산해 두기**."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`prefix[i]` = 앞에서 i개를 더한 값이에요. (`prefix[0] = 0`)",
        "",
        "그러면 `l`부터 `r`까지의 합은 `prefix[r + 1] − prefix[l]`이에요. 앞에서 r + 1개 더한 것에서 앞의 l개를 빼면 돼요.",
        "",
        "prefix를 만드는 데 `O(N)`, 질문마다 `O(1)`이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "prefix = [0]",
        "for x in nums: prefix.append(prefix[-1] + x)",
        "return [prefix[r + 1] - prefix[l] for l, r in queries]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["질문에 답하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["return [______ for l, r in queries]"].join("\n"),
          javascript: ["return queries.map(([l, r]) => ______);"].join("\n"),
          java: [
            "for (int i = 0; i < queries.length; i++) {",
            "    int l = queries[i][0], r = queries[i][1];",
            "    answer[i] = ______;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["precompute"],
  signalIds: ["sig-all-pairs-slow"],
  estimatedMinutes: 12,
  xp: 20,
};
