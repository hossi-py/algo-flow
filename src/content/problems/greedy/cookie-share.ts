import type { Problem } from "@/types/content";

export const greedyCookieShare: Problem = {
  id: "c:greedy-cookie-share",
  slug: "greedy-cookie-share",
  source: "curated",
  topic: "greedy",
  level: 2,
  title: "쿠키 나눠 주기",
  summary: "욕심이 작은 친구부터, 조건에 맞는 가장 작은 쿠키를 줘요",
  statement: [
    "숲속 친구들에게 쿠키를 나눠 줘요. i번 친구는 크기가 `greed[i]` **이상**인 쿠키를 받아야 만족해요. 쿠키 j의 크기는 `cookies[j]`예요.",
    "",
    "친구 한 명에게 쿠키는 최대 하나만 줄 수 있어요. **만족하는 친구 수의 최댓값**을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`greed`: 친구별 필요한 크기, `cookies`: 쿠키 크기예요.",
  outputFormat: "만족하는 친구 수의 최댓값",
  constraints: ["1 ≤ greed, cookies의 길이 ≤ 100,000", "1 ≤ 크기 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "greed",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "친구별 필요한 크기",
      },
      {
        name: "cookies",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "쿠키 크기",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "만족하는 친구 수" },
  },
  starterCode: {
    python: ["def solution(greed, cookies):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(greed, cookies) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] greed, int[] cookies) {",
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
        [1, 2, 3],
        [1, 1],
      ],
      expected: 1,
      explanation: "크기 1 쿠키 두 개로는 필요한 크기가 1인 친구만 만족해요. 1명이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "basic",
      args: [
        [1, 2],
        [1, 2, 3],
      ],
      expected: 2,
      explanation: "둘 다 만족해요. 2명이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[5], [4]],
      expected: 0,
      failureNote: "쿠키가 작아서 0명이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [1, 3],
        [3, 1],
      ],
      expected: 2,
      failureNote:
        "큰 쿠키 3을 필요한 크기가 1인 친구에게 주면 남은 1로는 3짜리 친구를 못 채워요. 작은 쿠키부터 알맞게 주면 2명이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [2, 2, 2],
        [2, 2],
      ],
      expected: 2,
      failureNote: "쿠키가 두 개라 2명이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 100000) + 1),
        Array.from({ length: 100000 }, (_, i) => ((i * 104729) % 100000) + 1),
      ],
      expected: 100000,
      failureNote: "친구 10만 명, 쿠키 10만 개예요. 친구마다 모든 쿠키를 훑으면 시간 초과예요.",
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
      body: ["짝을 지어 **최대로 만족** → 둘 다 정렬해 두고, 작은 쪽부터 알맞게 맞추는 **정렬 그리디**예요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `greed`와 `cookies`를 모두 오름차순으로 정렬해요.",
        "2. 쿠키를 작은 것부터 보며, 지금 친구(가장 욕심이 작은 친구)를 만족시키면 그 친구에게 주고 다음 친구로 가요.",
        "3. 못 만족시키면 그 쿠키는 누구에게도 못 주니 버려요.",
        "",
        "큰 쿠키를 아껴 두면 욕심 큰 친구에게 쓸 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "g, c = 정렬한 greed, cookies",
        "i = 0                  # 다음에 만족시킬 친구",
        "for size in c:",
        "    if i < len(g) and size >= g[i]: i += 1",
        "return i",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["쿠키를 줄지 정하는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for size in sorted(cookies):", "    if ______:", "        i += 1", "return i"].join("\n"),
          javascript: ["for (const size of c) {", "  if (______) i++;", "}", "return i;"].join("\n"),
          java: ["for (int size : c) {", "    if (______) i++;", "}", "return i;"].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-by-sort"],
  signalIds: ["sig-greedy-local-best"],
  estimatedMinutes: 12,
  xp: 20,
};
