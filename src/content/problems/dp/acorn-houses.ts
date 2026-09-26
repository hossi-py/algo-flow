import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[2, 7, 9, 3, 1]],
    expected: 12,
    explanation: "0번(2) + 2번(9) + 4번(1) = 12예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [[2, 1, 1, 2]],
    expected: 4,
    explanation: "0번과 3번(2 + 2 = 4)이 가장 많아요. 짝수 번째만, 홀수 번째만 고르는 건 답이 아니에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[5]],
    expected: 5,
    failureNote: "집이 하나면 그 집이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[3, 8]],
    expected: 8,
    failureNote: "둘 중 큰 쪽 8이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[5, 10, 6]],
    expected: 11,
    failureNote: "가장 큰 10을 먼저 고르면 10이지만, 5 + 6 = 11이 더 많아요. 욕심껏 고르면 틀려요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "edge",
    args: [[0, 0, 0]],
    expected: 0,
    failureNote: "모두 0이면 0이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i * 104729) % 10000)],
    expected: 361059150,
    failureNote: "집 10만 채예요. 고르는 방법을 모두 해 보면 2^100000가지라 불가능해요.",
  },
]);

export const dpAcornHouses: Problem = {
  id: "c:dp-acorn-houses",
  slug: "dp-acorn-houses",
  source: "curated",
  topic: "dp",
  level: 1,
  title: "이웃하지 않게 도토리 모으기",
  summary: "i번째 집까지의 최대 = max(i번째를 건너뜀, i-2번째까지 + i번째)",
  statement: [
    "다람쥐 마을에 집이 한 줄로 있고, i번째 집 앞에는 도토리가 `acorns[i]`개 있어요. 노디가 도토리를 모으는데, **바로 이웃한 두 집**에서 함께 모으면 다람쥐들이 놀라요.",
    "",
    "이웃한 두 집을 함께 고르지 않을 때 모을 수 있는 도토리의 **최대 개수**를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`acorns`: 집마다 도토리 수예요.",
  outputFormat: "모을 수 있는 최대 개수",
  constraints: ["1 ≤ acorns의 길이 ≤ 100,000", "0 ≤ acorns[i] ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "acorns",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "집마다 도토리",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 개수" },
  },
  starterCode: {
    python: ["def solution(acorns):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(acorns) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] acorns) {",
      "        int answer = 0;",
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
        "고르면 이웃은 못 고르는, **선택이 다음 선택을 제한**하는 최대 문제 → **DP**예요. 욕심(가장 큰 집부터)으로는 틀릴 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 표의 뜻: `best[i]` = 0 ~ i번째 집만 봤을 때 모을 수 있는 최대",
        "2. i번째 집을 **안 고르면** `best[i-1]`, **고르면** i-1번째는 못 고르니 `best[i-2] + acorns[i]`",
        "3. `best[i] = max(best[i-1], best[i-2] + acorns[i])`",
        "",
        "변수 두 개(`prev2`, `prev1`)만으로도 충분해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "prev2, prev1 = 0, 0        # best[i-2], best[i-1]",
        "for x in acorns:",
        "    cur = max(prev1, prev2 + x)",
        "    prev2, prev1 = prev1, cur",
        "return prev1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["고를지 말지 비교하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for x in acorns:",
            "    cur = max(prev1, ______)",
            "    prev2, prev1 = prev1, cur",
            "return prev1",
          ].join("\n"),
          javascript: [
            "for (const x of acorns) {",
            "  const cur = Math.max(prev1, ______);",
            "  prev2 = prev1;",
            "  prev1 = cur;",
            "}",
            "return prev1;",
          ].join("\n"),
          java: [
            "for (int x : acorns) {",
            "    int cur = Math.max(prev1, ______);",
            "    prev2 = prev1;",
            "    prev1 = cur;",
            "}",
            "return prev1;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["linear-dp", "state-dp"],
  signalIds: ["sig-best-choice-sequence"],
  estimatedMinutes: 12,
  xp: 10,
};
