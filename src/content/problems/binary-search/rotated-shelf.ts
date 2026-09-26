import type { Problem } from "@/types/content";

export const binarySearchRotatedShelf: Problem = {
  id: "c:binary-search-rotated-shelf",
  slug: "binary-search-rotated-shelf",
  source: "curated",
  topic: "binary-search",
  level: 5,
  title: "회전된 책장에서 찾기",
  summary: "가장 작은 번호의 위치(회전 지점)를 이분 탐색으로 찾고, 알맞은 쪽에서 다시 찾아요",
  statement: [
    "책 번호가 작은 번호부터 정렬된 책장을, 누군가 앞부분을 떼어 뒤에 붙여 놓았어요. 예를 들어 [1, 3, 5, 7, 9]가 [7, 9, 1, 3, 5]가 됐어요. 번호는 서로 달라요.",
    "",
    "질문 `queries`의 번호마다 그 책의 칸 번호(0부터)를 차례로 담아 반환해 주세요. 없으면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`shelf`: 회전된 책장, `queries`: 찾을 번호들이에요.",
  outputFormat: "질문마다 칸 번호(없으면 -1)",
  constraints: [
    "1 ≤ shelf의 길이 ≤ 100,000, 번호는 서로 달라요",
    "1 ≤ queries의 길이 ≤ 20,000",
    "0 ≤ 번호 ≤ 1,000,000,000",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "shelf",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "회전된 책장",
      },
      {
        name: "queries",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "찾을 번호",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "칸 번호" },
  },
  starterCode: {
    python: ["def solution(shelf, queries):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(shelf, queries) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] shelf, int[] queries) {",
      "        int[] answer = new int[queries.length];",
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
        [7, 9, 1, 3, 5],
        [3, 9, 4],
      ],
      expected: [3, 1, -1],
      explanation: "3은 3번, 9는 1번, 4는 없어요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        [1, 3, 5],
        [5, 1],
      ],
      expected: [2, 0],
      explanation: "회전하지 않은 책장도 있어요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[42], [42, 7]],
      expected: [0, -1],
      failureNote: "한 권뿐이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [5, 1, 3],
        [5, 1, 3],
      ],
      expected: [0, 1, 2],
      failureNote: "맨 앞 한 권만 뒤로 간 경우예요. 회전 지점이 1번이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [3, 5, 1],
        [1, 3, 5],
      ],
      expected: [2, 0, 1],
      failureNote: "맨 뒤에 가장 작은 번호가 있어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [40, 50, 10, 20, 30],
        [50, 10, 35],
      ],
      expected: [1, 2, -1],
      failureNote: "1, 2, -1이에요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        (() => {
          const b = Array.from({ length: 100000 }, (_, i) => i * 3);
          return b.slice(37000).concat(b.slice(0, 37000));
        })(),
        Array.from({ length: 20000 }, (_, i) => i * 15),
      ],
      expected: Array.from({ length: 20000 }, (_, i) =>
        (i * 15) % 3 === 0 ? ((i * 15) / 3 - 37000 + 100000) % 100000 : -1,
      ),
      failureNote: "책 10만 권, 질문 2만 개예요. 질문마다 처음부터 훑으면 20억 번이라 시간 초과예요.",
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
        "통째로는 정렬이 깨졌지만, **회전 지점**을 기준으로 앞·뒤 두 조각은 각각 정렬돼 있어요 → 회전 지점을 **이분 탐색**으로 찾고, 조각 안에서 다시 이분 탐색해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 가장 작은 번호의 위치 `p`를 찾아요. `shelf[mid] > shelf[-1]`이면 mid는 앞 조각이라 `p`는 오른쪽에 있어요. 아니면 mid 이하에 있어요.",
        "2. 찾는 번호 x가 `shelf[-1]` 이하면 뒤 조각 `[p, n-1]`, 아니면 앞 조각 `[0, p-1]`에서 찾아요.",
        "3. 조각 안에서는 보통의 이분 탐색이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "lo, hi = 0, n - 1           # 가장 작은 번호의 위치 찾기",
        "while lo < hi:",
        "    mid = (lo + hi) // 2",
        "    if shelf[mid] > shelf[n-1]: lo = mid + 1",
        "    else: hi = mid",
        "p = lo",
        "for x in queries:",
        "    if x <= shelf[n-1]: [p, n-1]에서 찾기",
        "    else: [0, p-1]에서 찾기",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["회전 지점을 찾는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "lo, hi = 0, n - 1",
            "while lo < hi:",
            "    mid = (lo + hi) // 2",
            "    if ______:",
            "        lo = mid + 1",
            "    else:",
            "        hi = mid",
            "p = lo",
          ].join("\n"),
          javascript: [
            "let lo = 0, hi = n - 1;",
            "while (lo < hi) {",
            "  const mid = (lo + hi) >> 1;",
            "  if (______) lo = mid + 1;",
            "  else hi = mid;",
            "}",
            "const p = lo;",
          ].join("\n"),
          java: [
            "int lo = 0, hi = n - 1;",
            "while (lo < hi) {",
            "    int mid = (lo + hi) >>> 1;",
            "    if (______) lo = mid + 1;",
            "    else hi = mid;",
            "}",
            "int p = lo;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["boundary-search", "exact-search"],
  signalIds: ["sig-first-true", "sig-sorted-many-queries"],
  estimatedMinutes: 25,
  xp: 50,
};
