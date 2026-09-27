import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[0, 1, 0, 3, 12]],
    expected: [1, 3, 12, 0, 0],
    explanation: "[1, 3, 12, 0, 0]이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[0]],
    expected: [0],
    explanation: "0 하나면 그대로예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [[4, 2, 0, 0, 7]],
    expected: [4, 2, 7, 0, 0],
    failureNote: "순서를 지켜 [4, 2, 7, 0, 0]이에요. 정렬하면 틀려요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[5, 6]],
    expected: [5, 6],
    failureNote: "0이 없으면 그대로예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [[0, 0, 1]],
    expected: [1, 0, 0],
    failureNote: "[1, 0, 0]이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i % 3 === 0 ? 0 : i))],
    expected: [
      ...Array.from({ length: 100000 }, (_, i) => (i % 3 === 0 ? 0 : i)).filter((x) => x !== 0),
      ...Array.from({ length: 100000 }, (_, i) => (i % 3 === 0 ? 0 : i)).filter((x) => x === 0),
    ],
    failureNote: "10만 개예요. 0을 만날 때마다 뒤를 한 칸씩 당기면 O(N²)이라 시간 초과예요.",
  },
]);

export const twoPointersZerosBack: Problem = {
  id: "c:two-pointers-zeros-back",
  slug: "two-pointers-zeros-back",
  source: "curated",
  topic: "two-pointers",
  level: 2,
  title: "빈 바구니는 뒤로",
  summary: "0이 아닌 값만 앞으로 옮겨 쓰고, 남은 자리는 0으로 채워요",
  statement: [
    "바구니가 한 줄로 놓여 있고, `baskets[i]`는 i번 바구니의 과일 수예요. **빈 바구니**(0)를 모두 뒤로 보내려고 해요.",
    "",
    "0이 아닌 바구니들의 **순서는 그대로** 지켜야 해요. 정리한 목록을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`baskets`: 바구니별 과일 수예요.",
  outputFormat: "0을 뒤로 보낸 목록",
  constraints: ["1 ≤ baskets의 길이 ≤ 100,000", "0 ≤ 과일 수 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "baskets",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "바구니별 과일 수",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "정리한 목록" },
  },
  starterCode: {
    python: ["def solution(baskets):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(baskets) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] baskets) {",
      "        int[] answer = new int[baskets.length];",
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
      body: ["순서를 지키며 **제자리에서** 걸러 내기 → 읽기·쓰기 **같은 방향 두 포인터**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 쓰는 위치 `w = 0`",
        "2. 읽는 손가락으로 훑으며 0이 아닌 값을 만나면 `a[w]`에 쓰고 `w += 1`",
        "3. 다 읽으면 `w`부터 끝까지 0으로 채워요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "a = baskets 복사, w = 0",
        "for x in a:",
        "    if x != 0: a[w] = x; w += 1",
        "a[w:]를 모두 0으로",
        "return a",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["0이 아닌 값을 앞으로 옮겨 쓰는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for x in baskets:",
            "    if x != 0:",
            "        a[w] = x",
            "        ______",
            "for i in range(w, len(a)):",
            "    a[i] = 0",
          ].join("\n"),
          javascript: [
            "for (const x of baskets) {",
            "  if (x !== 0) {",
            "    a[w] = x;",
            "    ______;",
            "  }",
            "}",
            "a.fill(0, w);",
          ].join("\n"),
          java: [
            "int w = 0;",
            "for (int x : baskets) {",
            "    if (x != 0) {",
            "        answer[w] = x;",
            "        ______;",
            "    }",
            "}",
          ].join("\n"),
        },
        caption: "Java의 int 배열은 0으로 시작해서 뒤를 따로 채우지 않아도 돼요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["same-direction"],
  signalIds: ["sig-in-place"],
  estimatedMinutes: 10,
  xp: 20,
};
