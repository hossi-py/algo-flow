import type { Problem } from "@/types/content";

export const binarySearchRangeCount: Problem = {
  id: "c:binary-search-range-count",
  slug: "binary-search-range-count",
  source: "curated",
  topic: "binary-search",
  level: 2,
  title: "키 범위 안의 친구 수",
  summary: "두 경계(l 이상 첫 위치, r 초과 첫 위치)의 차이로 개수를 구해요",
  statement: [
    "숲속 친구들의 키 `heights`가 순서 없이 주어져요. 놀이 기구마다 탈 수 있는 키 범위 `[l, r]`가 있어요.",
    "",
    "범위 `ranges`마다 키가 **l 이상 r 이하**인 친구 수를 차례로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`heights`: 친구들의 키, `ranges`: `[l, r]` 범위들이에요.",
  outputFormat: "범위마다 해당하는 친구 수",
  constraints: [
    "1 ≤ heights의 길이 ≤ 100,000",
    "1 ≤ ranges의 길이 ≤ 100,000",
    "0 ≤ 키 ≤ 1,000,000,000, 0 ≤ l ≤ r ≤ 1,000,000,000",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "heights",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "친구들의 키",
      },
      {
        name: "ranges",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[l, r] 범위들",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "범위 안 친구 수" },
  },
  starterCode: {
    python: ["def solution(heights, ranges):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(heights, ranges) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] heights, int[][] ranges) {",
      "        int[] answer = new int[ranges.length];",
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
        [120, 135, 110, 150, 135, 128],
        [
          [120, 135],
          [140, 200],
        ],
      ],
      expected: [4, 1],
      explanation: "120~135: 120, 128, 135, 135로 4명. 140~200: 150 한 명이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        [100],
        [
          [100, 100],
          [101, 105],
          [0, 99],
        ],
      ],
      expected: [1, 0, 0],
      explanation: "양 끝이 키와 같으면 포함해요. 1명, 0명, 0명이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [5, 5, 5, 7, 7],
        [
          [5, 5],
          [6, 6],
          [5, 7],
        ],
      ],
      expected: [3, 0, 5],
      failureNote: "(5 초과 첫 위치) − (5 이상 첫 위치) = 3이에요. 6은 없어서 0, 5~7은 5명이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [1, 2, 3, 4, 5, 6],
        [
          [2, 4],
          [0, 10],
        ],
      ],
      expected: [3, 6],
      failureNote: "3명, 6명이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [3, 1, 2],
        [
          [1, 3],
          [2, 2],
        ],
      ],
      expected: [3, 1],
      failureNote: "입력은 정렬돼 있지 않아요. 먼저 정렬해야 이분 탐색을 쓸 수 있어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => (i * 7919) % 100003),
        Array.from({ length: 100000 }, (_, i) => [(i * 37) % 100003, ((i * 37) % 100003) + (i % 5000)]),
      ],
      expected: (() => {
        const lb = (a = [0], x = 0) => {
          let lo = 0,
            hi = a.length;
          while (lo < hi) {
            const m = (lo + hi) >> 1;
            if (a[m] >= x) hi = m;
            else lo = m + 1;
          }
          return lo;
        };
        const a = Array.from({ length: 100000 }, (_, i) => (i * 7919) % 100003).sort((x, y) => x - y);
        return Array.from({ length: 100000 }, (_, i) => [(i * 37) % 100003, ((i * 37) % 100003) + (i % 5000)]).map(
          ([l, r]) => lb(a, r + 1) - lb(a, l),
        );
      })(),
      failureNote: "친구 10만 명, 범위 10만 개예요. 범위마다 모두 세면 시간 초과예요.",
    },
  ],
  judge: {
    timeLimitMs: 3000,
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
        "'**l 이상 r 이하인 개수**'를 여러 번 물어요 → 정렬 + **경계 두 개**를 이분 탐색하는 **범위 안 개수** 패턴이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "정렬된 키에서",
        "",
        "- `left` = l 이상인 첫 위치",
        "- `right` = r보다 **큰** 첫 위치 (= r + 1 이상인 첫 위치)",
        "",
        "그 사이가 모두 범위 안이라 개수는 `right − left`예요.",
        "",
        "Python은 `bisect_right(s, r) - bisect_left(s, l)`예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "s = heights를 정렬",
        "for l, r in ranges:",
        "    answer에 lower_bound(s, r + 1) - lower_bound(s, l) 추가",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["두 경계로 개수를 구하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "from bisect import bisect_left, bisect_right",
            "",
            "s = sorted(heights)",
            "for l, r in ranges:",
            "    answer.append(______ - bisect_left(s, l))",
          ].join("\n"),
          javascript: [
            "const s = [...heights].sort((a, b) => a - b);",
            "for (const [l, r] of ranges) {",
            "  answer.push(______ - lowerBound(s, l));",
            "}",
          ].join("\n"),
          java: [
            "int[] s = heights.clone();",
            "Arrays.sort(s);",
            "for (int i = 0; i < ranges.length; i++) {",
            "    answer[i] = ______ - lowerBound(s, ranges[i][0]);",
            "}",
          ].join("\n"),
        },
        caption: "r보다 큰 첫 위치는 lowerBound(s, r + 1)이에요. r + 1이 int를 넘지 않게 long으로 넘겨요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["range-count", "boundary-search"],
  signalIds: ["sig-first-true", "sig-sorted-many-queries"],
  estimatedMinutes: 12,
  xp: 20,
};
