import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      3,
      [
        [1, 3],
        [2, 3],
      ],
    ],
    expected: 3,
    explanation: "3번은 1, 2번 모두에게 추천받고 아무도 추천하지 않아서 명가예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [
      3,
      [
        [1, 3],
        [2, 3],
        [3, 1],
      ],
    ],
    expected: -1,
    explanation: "3번이 1번을 추천해서 명가가 아니에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1, []],
    expected: 1,
    failureNote: "가게가 하나뿐이면 조건을 모두 만족해서 그 가게가 명가예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [2, []],
    expected: -1,
    failureNote: "추천이 하나도 없으면 명가가 없어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      4,
      [
        [1, 4],
        [2, 4],
        [3, 2],
      ],
    ],
    expected: -1,
    failureNote: "4번은 3번에게 추천받지 못했어요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [
      4,
      [
        [1, 2],
        [3, 2],
        [4, 2],
        [1, 3],
        [4, 3],
      ],
    ],
    expected: 2,
    failureNote: "2번이 명가예요. 3번은 추천받은 수가 모자라요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      100000,
      [
        ...Array.from({ length: 99999 }, (_, i) => [i + 1, 100000]),
        ...Array.from({ length: 99999 }, (_, i) => [i + 2, 1]).slice(0, 50000),
      ],
    ],
    expected: 100000,
    failureNote: "가게 10만 곳의 추천이에요. 가게마다 추천 목록 전체를 훑으면 시간 초과예요.",
  },
  {
    id: "hid-6",
    visibility: "hidden",
    purpose: "stress",
    args: [
      100000,
      [
        ...Array.from({ length: 99999 }, (_, i) => [i + 2, 1]),
        ...Array.from({ length: 50000 }, (_, i) => [i + 2, (i % 99998) + 3]),
      ],
    ],
    expected: 1,
    failureNote: "1번이 모두에게 추천받는 10만 곳의 시장이에요.",
  },
]);

export const graphTrustedShop: Problem = {
  id: "c:graph-trusted-shop",
  slug: "graph-trusted-shop",
  source: "curated",
  topic: "graph-representation",
  level: 5,
  title: "모두가 추천하는 가게",
  summary: "모두에게 추천받고 아무도 추천하지 않는 가게를 찾아요",
  statement: [
    "노디 시장에는 가게가 `n`곳(1번 ~ `n`번) 있어요. 가게 주인들끼리 서로 추천을 해요. 추천 목록 `recs`의 `[a, b]`는 **a 가게 주인이 b 가게를 추천**했다는 뜻이에요.",
    "",
    "소문난 **명가**는 다음 두 조건을 모두 만족하는 가게예요.",
    "",
    "- 자기 가게를 뺀 **다른 모든 가게**에게 추천받았어요.",
    "- 명가 주인은 **아무 가게도 추천하지 않았어요**.",
    "",
    "명가가 있으면 그 번호를, 없으면 `-1`을 반환해 주세요. 명가는 많아야 하나예요.",
  ].join("\n"),
  inputFormat: "`n`: 가게 수, `recs`: `[a, b]`(a가 b를 추천) 목록이에요.",
  outputFormat: "명가 번호 또는 -1",
  constraints: ["1 ≤ n ≤ 100,000", "0 ≤ recs의 길이 ≤ 200,000", "a ≠ b", "같은 추천은 두 번 주어지지 않아요."],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "가게 수" },
      {
        name: "recs",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "추천 목록",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "명가 번호 또는 -1" },
  },
  starterCode: {
    python: ["def solution(n, recs):", "    answer = -1", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, recs) {", "  let answer = -1;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] recs) {",
      "        int answer = -1;",
      "        return answer;",
      "    }",
      "}",
      "",
    ].join("\n"),
  },
  get testCases() {
    return testCases();
  },
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
        '"모두에게 추천받고, 아무도 추천하지 않음" → 가게마다 **들어오는 추천 수**와 **나가는 추천 수**만 알면 돼요 → **차수 세기**예요.',
        "",
        "경로를 찾거나 탐색할 필요가 없어요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `inn[x]`: x가 받은 추천 수, `out[x]`: x가 한 추천 수를 세요.",
        "2. `inn[x] == n - 1`이고 `out[x] == 0`인 가게가 명가예요.",
        "",
        "추천 목록을 한 번만 훑으니 O(N + 추천 수)예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for a, b in recs:",
        "    out[a] += 1",
        "    inn[b] += 1",
        "for x in 1..n:",
        "    if inn[x] == n - 1 and out[x] == 0: return x",
        "return -1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["명가 조건이에요."].join("\n"),
      code: {
        code: {
          python: ["for x in range(1, n + 1):", "    if ______ and out[x] == 0:", "        return x", "return -1"].join(
            "\n",
          ),
          javascript: [
            "for (let x = 1; x <= n; x += 1) {",
            "  if (______ && out[x] === 0) return x;",
            "}",
            "return -1;",
          ].join("\n"),
          java: ["for (int x = 1; x <= n; x++) {", "    if (______ && out[x] == 0) return x;", "}", "return -1;"].join(
            "\n",
          ),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["degree-count"],
  signalIds: ["sig-degree"],
  estimatedMinutes: 20,
  xp: 50,
};
