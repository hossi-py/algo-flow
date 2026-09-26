import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[1, 0, 2]],
    expected: 5,
    explanation: "2, 1, 2개로 5개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [[1, 2, 2]],
    expected: 4,
    explanation: "1, 2, 1개로 4개예요. 점수가 같으면 더 받을 필요가 없어요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[7]],
    expected: 1,
    failureNote: "혼자면 1개예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 2, 3, 4]],
    expected: 10,
    failureNote: "1, 2, 3, 4개로 10개예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 3, 4, 5, 2]],
    expected: 11,
    failureNote: "왼쪽에서만 보면 1, 2, 3, 4, 1인데, 오른쪽에서 보면 5는 2보다 많아야 해요 (이미 4 > 1). 11개예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [[5, 4, 3, 2, 1, 2]],
    expected: 17,
    failureNote: "내려가는 쪽은 오른쪽에서 훑어야 맞출 수 있어요. 5, 4, 3, 2, 1, 2개로 17개예요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i < 60000 ? i : (i * 7919) % 1000))],
    expected: 1800297268,
    failureNote:
      "아이 10만 명이에요. 조건이 맞을 때까지 계속 고치면 느려요. 두 번만 훑으세요. (답이 수십억이라 Java는 long)",
  },
]);

export const greedyCandyLine: Problem = {
  id: "c:greedy-candy-line",
  slug: "greedy-candy-line",
  source: "curated",
  topic: "greedy",
  level: 4,
  title: "사탕 나눠 주기",
  summary: "왼쪽에서 한 번, 오른쪽에서 한 번 훑어 두 조건을 모두 맞춰요",
  statement: [
    "아이들이 한 줄로 서 있고, i번 아이의 칭찬 점수는 `scores[i]`예요. 사탕을 이렇게 나눠 줘요.",
    "",
    "- 모든 아이가 **적어도 1개**를 받아요.",
    "- 바로 옆 아이보다 점수가 **높으면** 그 옆 아이보다 사탕을 **더 많이** 받아요.",
    "",
    "필요한 사탕의 **최소 개수**를 반환해 주세요. 답이 21억을 넘을 수 있어요 (Java는 `long`).",
  ].join("\n"),
  inputFormat: "`scores`: 줄 선 순서대로의 칭찬 점수예요.",
  outputFormat: "필요한 사탕의 최소 개수",
  constraints: ["1 ≤ scores의 길이 ≤ 100,000", "0 ≤ 점수 ≤ 100,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "scores",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "칭찬 점수",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "최소 사탕 수" },
  },
  starterCode: {
    python: ["def solution(scores):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(scores) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(int[] scores) {",
      "        long answer = 0;",
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
      body: ["왼쪽 이웃과 오른쪽 이웃, **두 방향의 조건** → 한 방향씩 따로 훑어 맞추는 **그리디**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 모두 1개로 시작해요.",
        "2. **왼쪽 → 오른쪽**: 왼쪽 아이보다 점수가 높으면 `candy[i] = candy[i-1] + 1`",
        "3. **오른쪽 → 왼쪽**: 오른쪽 아이보다 점수가 높으면 `candy[i] = max(candy[i], candy[i+1] + 1)`",
        "",
        "두 번째에서 max를 쓰는 이유: 왼쪽 조건으로 이미 늘린 값을 줄이면 안 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "candy = [1] * n",
        "for i in 1..n-1:",
        "    if s[i] > s[i-1]: candy[i] = candy[i-1] + 1",
        "for i in n-2..0:",
        "    if s[i] > s[i+1]: candy[i] = max(candy[i], candy[i+1] + 1)",
        "return sum(candy)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["오른쪽에서 훑는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i in range(n - 2, -1, -1):",
            "    if scores[i] > scores[i + 1]:",
            "        candy[i] = ______",
          ].join("\n"),
          javascript: [
            "for (let i = n - 2; i >= 0; i--) {",
            "  if (scores[i] > scores[i + 1]) candy[i] = ______;",
            "}",
          ].join("\n"),
          java: [
            "for (int i = n - 2; i >= 0; i--) {",
            "    if (scores[i] > scores[i + 1]) candy[i] = ______;",
            "}",
          ].join("\n"),
        },
        caption: "합은 21억을 넘을 수 있어서 long으로 더해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-accumulate"],
  signalIds: ["sig-greedy-local-best"],
  estimatedMinutes: 20,
  xp: 40,
};
