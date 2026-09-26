import type { Problem } from "@/types/content";

export const binarySearchNearestStation: Problem = {
  id: "c:binary-search-nearest-station",
  slug: "binary-search-nearest-station",
  source: "curated",
  topic: "binary-search",
  level: 2,
  title: "가장 가까운 정류장",
  summary: "집 위치 이상인 첫 정류장과 그 바로 앞 정류장만 비교해요",
  statement: [
    "숲길 위에 버스 정류장들이 있어요. `stations`는 정류장 위치(순서 없음), `homes`는 친구들의 집 위치예요.",
    "",
    "집마다 **가장 가까운 정류장까지의 거리**를 차례로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`stations`: 정류장 위치, `homes`: 집 위치예요.",
  outputFormat: "집마다 가장 가까운 정류장까지의 거리",
  constraints: ["1 ≤ stations의 길이 ≤ 100,000", "1 ≤ homes의 길이 ≤ 100,000", "0 ≤ 위치 ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "stations",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "정류장 위치",
      },
      { name: "homes", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "집 위치" },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "가장 가까운 거리" },
  },
  starterCode: {
    python: ["def solution(stations, homes):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(stations, homes) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] stations, int[] homes) {",
      "        int[] answer = new int[homes.length];",
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
        [10, 50, 30],
        [12, 41, 60],
      ],
      expected: [2, 9, 10],
      explanation: "12는 10과 2, 41은 50과 9(30과는 11), 60은 50과 10이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[20], [5, 20, 100]],
      expected: [15, 0, 80],
      explanation: "정류장이 하나면 모두 그 정류장이에요. 같은 자리면 0이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [100, 200],
        [0, 300],
      ],
      expected: [100, 100],
      failureNote: "모든 정류장보다 앞이거나 뒤인 집이에요. 한쪽 이웃이 없을 때를 조심하세요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [[10, 20], [15]],
      expected: [5],
      failureNote: "양쪽이 똑같이 5만큼 떨어져 있어요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [1, 1000000000],
        [500000000, 500000001],
      ],
      expected: [499999999, 499999999],
      failureNote: "가운데 근처예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 100000) * 10000),
        Array.from({ length: 100000 }, (_, i) => (i * 104729) % 1000000000),
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
        const s = Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 100000) * 10000).sort((x, y) => x - y);
        return Array.from({ length: 100000 }, (_, i) => (i * 104729) % 1000000000).map((h) => {
          const i = lb(s, h);
          let best = Infinity;
          if (i < s.length) best = s[i] - h;
          if (i > 0) best = Math.min(best, h - s[i - 1]);
          return best;
        });
      })(),
      failureNote: "정류장 10만 개, 집 10만 채예요. 집마다 모든 정류장을 보면 시간 초과예요.",
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
        "정렬된 정류장에서 '**집 위치 이상인 첫 정류장**'을 찾으면, 가장 가까운 정류장은 그것 아니면 **바로 앞** 정류장이에요 → **경계 찾기**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 정류장을 정렬해요.",
        "2. 집 h마다 `i` = h 이상인 첫 위치를 찾아요.",
        "3. `s[i] − h` (i < n일 때)와 `h − s[i − 1]` (i > 0일 때) 중 작은 값이 답이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "s = stations를 정렬",
        "for h in homes:",
        "    i = lower_bound(s, h)",
        "    best = 무한대",
        "    if i < n: best = s[i] - h",
        "    if i > 0: best = min(best, h - s[i - 1])",
        "    answer에 best 추가",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["양쪽 이웃과 비교하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "i = bisect_left(s, h)",
            "best = float('inf')",
            "if i < len(s):",
            "    best = s[i] - h",
            "if i > 0:",
            "    best = min(best, ______)",
          ].join("\n"),
          javascript: [
            "const i = lowerBound(s, h);",
            "let best = Infinity;",
            "if (i < s.length) best = s[i] - h;",
            "if (i > 0) best = Math.min(best, ______);",
          ].join("\n"),
          java: [
            "int i = lowerBound(s, h);",
            "int best = Integer.MAX_VALUE;",
            "if (i < s.length) best = s[i] - h;",
            "if (i > 0) best = Math.min(best, ______);",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["boundary-search"],
  signalIds: ["sig-first-true", "sig-sorted-many-queries"],
  estimatedMinutes: 15,
  xp: 20,
};
