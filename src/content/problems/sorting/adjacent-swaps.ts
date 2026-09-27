import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[3, 1, 2]],
    expected: 2,
    explanation: "3이 1, 2와 한 번씩 바꿔서 뒤로 가요. 2번이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[1, 2, 3]],
    expected: 0,
    explanation: "이미 순서대로라 0번이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [[4, 3, 2, 1]],
    expected: 6,
    failureNote: "완전히 거꾸로면 모든 쌍을 바꿔야 해서 6번이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[2, 1, 2, 1]],
    expected: 3,
    failureNote: "키가 같은 친구끼리는 바꾸지 않아요. 3번이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [[5]],
    expected: 0,
    failureNote: "혼자면 0번이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [[2, 3, 8, 6, 1]],
    expected: 5,
    failureNote: "5번이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 1000 }, (_, i) => 1000 - i)],
    expected: 499500,
    failureNote: "1,000명이 거꾸로 서 있으면 499,500번이에요.",
  },
]);

export const sortingAdjacentSwaps: Problem = {
  id: "c:sorting-adjacent-swaps",
  slug: "sorting-adjacent-swaps",
  source: "curated",
  topic: "sorting",
  level: 2,
  title: "옆자리끼리 바꾸기",
  summary: "삽입 정렬처럼 옮기며, 옆자리와 바꾼 횟수를 세요",
  statement: [
    "노디 반 친구들이 한 줄로 서 있어요. 키 순서(작은 사람이 앞)로 서려고 하는데, 한 번에 **바로 옆 사람과만** 자리를 바꿀 수 있어요.",
    "",
    "키 순서로 서기 위해 필요한 **최소 교환 횟수**를 반환해 주세요. 키가 같은 친구끼리는 바꿀 필요가 없어요.",
  ].join("\n"),
  inputFormat: "`heights`: 앞에서부터 선 친구들의 키예요.",
  outputFormat: "최소 교환 횟수",
  constraints: ["1 ≤ heights의 길이 ≤ 1,000", "1 ≤ 키 ≤ 1,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "heights",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "줄 선 키",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최소 교환 횟수" },
  },
  starterCode: {
    python: ["def solution(heights):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(heights) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] heights) {",
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
      body: ["옆끼리 바꿔서 정렬하기 → **삽입 정렬**이 바로 그 방법이에요. 한 칸 밀 때마다 한 번 바꾼 거예요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "삽입 정렬을 그대로 따라 하면서 **민 횟수**를 세요.",
        "",
        "1. i번째 친구를 뽑아요.",
        "2. 왼쪽에 **자기보다 큰** 친구가 있는 동안 한 칸씩 앞으로 가요(= 옆 사람과 교환). 횟수를 1 늘려요.",
        "3. 키가 같으면 멈춰요.",
        "",
        "사실 이 횟수는 '앞에 있는데 더 큰' 쌍의 수와 같아요. N이 1,000이라 O(N²)도 충분해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "a = heights 복사, swaps = 0",
        "for i in 1 .. n-1:",
        "    j = i",
        "    while j > 0 and a[j - 1] > a[j]:",
        "        a[j - 1], a[j] 교환; swaps += 1; j -= 1",
        "return swaps",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["교환을 계속할 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i in range(1, len(a)):",
            "    j = i",
            "    while ______:",
            "        a[j - 1], a[j] = a[j], a[j - 1]",
            "        swaps += 1",
            "        j -= 1",
          ].join("\n"),
          javascript: [
            "for (let i = 1; i < a.length; i++) {",
            "  for (let j = i; ______; j--) {",
            "    [a[j - 1], a[j]] = [a[j], a[j - 1]];",
            "    swaps++;",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int i = 1; i < a.length; i++) {",
            "    for (int j = i; ______; j--) {",
            "        int t = a[j - 1]; a[j - 1] = a[j]; a[j] = t;",
            "        swaps++;",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["merge-step"],
  signalIds: ["sig-inversions"],
  visualization: {
    presets: [
      problemPreset(
        "sorting-adjacent-swaps-ex1",
        "sort-insertion",
        "삽입 정렬로 밀기",
        "한 칸 밀 때마다 옆 사람과 한 번 바꾼 거예요. 밀기 횟수가 답이에요.",
        [[3, 1, 2]],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
