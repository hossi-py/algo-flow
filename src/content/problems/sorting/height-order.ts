import type { Problem } from "@/types/content";

export const sortingHeightOrder: Problem = {
  id: "c:sorting-height-order",
  slug: "sorting-height-order",
  source: "curated",
  topic: "sorting",
  level: 1,
  title: "키 순서로 줄 서기",
  summary: "번호와 키를 함께 정렬해서, 줄 선 순서대로 번호를 알려 줘요",
  statement: [
    "숲속 학교 체육 시간이에요. 학생들이 0번부터 차례로 번호를 달고 있고, `heights[i]`는 i번 학생의 키예요.",
    "",
    "키가 **작은 학생부터** 한 줄로 세울 때, 앞에서부터 학생 **번호**를 차례로 담은 리스트를 반환해 주세요. 키가 같으면 **번호가 작은 학생이 앞**에 서요.",
  ].join("\n"),
  inputFormat: "`heights`: 학생들의 키예요.",
  outputFormat: "줄 선 순서대로 학생 번호를 담은 리스트",
  constraints: ["1 ≤ heights의 길이 ≤ 100,000", "100 ≤ 키 ≤ 200"],
  signature: {
    name: "solution",
    params: [
      {
        name: "heights",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "학생들의 키",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "줄 선 순서의 번호" },
  },
  starterCode: {
    python: ["def solution(heights):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(heights) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] heights) {",
      "        int[] answer = new int[heights.length];",
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
      args: [[152, 140, 165, 148]],
      expected: [1, 3, 0, 2],
      explanation: "140(1번), 148(3번), 152(0번), 165(2번) 순서예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "tricky",
      args: [[150, 145, 150, 145]],
      expected: [1, 3, 0, 2],
      explanation: "145가 두 명(1번, 3번), 150이 두 명(0번, 2번)이에요. 키가 같으면 번호가 작은 학생이 앞이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[170]],
      expected: [0],
      failureNote: "한 명이면 [0]이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [[120, 130, 140]],
      expected: [0, 1, 2],
      failureNote: "이미 키 순서로 서 있어요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [[200, 190, 180, 170]],
      expected: [3, 2, 1, 0],
      failureNote: "거꾸로 서 있으면 번호도 거꾸로예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "tricky",
      args: [[160, 160, 160]],
      expected: [0, 1, 2],
      failureNote: "모두 키가 같으면 번호 순서 그대로예요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 100000 }, (_, i) => 100 + ((i * 7919) % 100))],
      expected: (() => {
        const h = Array.from({ length: 100000 }, (_, i) => 100 + ((i * 7919) % 100));
        return h.map((_, i) => i).sort((a, b) => h[a] - h[b] || a - b);
      })(),
      failureNote:
        "학생 10만 명이에요. 가장 작은 학생을 매번 처음부터 찾으면(O(N²)) 시간 초과예요. 내장 정렬을 쓰세요.",
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
        "'키가 작은 순, 같으면 번호 순'으로 줄을 세워요 → **정렬 기준 정하기**예요.",
        "",
        "키만 정렬하면 누가 누구인지 잃어버려요. **번호를 정렬**하되 기준은 키로 해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 번호 리스트 `[0, 1, …, n-1]`을 만들어요.",
        "2. 번호 i를 `(heights[i], i)` 기준으로 정렬해요.",
        "",
        "파이썬·자바스크립트·자바의 정렬은 **안정 정렬**이라, 키만 기준으로 해도 같은 키는 원래(번호) 순서를 지켜요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "order = [0, 1, ..., n-1]", "order를 (heights[i], i) 순으로 정렬", "return order", "~~~"].join(
        "\n",
      ),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["정렬 기준을 정하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["order = list(range(len(heights)))", "order.sort(key=lambda i: ______)", "return order"].join("\n"),
          javascript: [
            "const order = heights.map((_, i) => i);",
            "order.sort((a, b) => ______ || a - b);",
            "return order;",
          ].join("\n"),
          java: [
            "Integer[] order = new Integer[heights.length];",
            "for (int i = 0; i < order.length; i++) order[i] = i;",
            "Arrays.sort(order, (a, b) -> ______ != 0 ? heights[a] - heights[b] : a - b);",
          ].join("\n"),
        },
        caption: "Java는 int[]에 비교 기준을 줄 수 없어서 Integer[]로 번호를 정렬해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["custom-order"],
  signalIds: ["sig-order-rule"],
  estimatedMinutes: 8,
  xp: 10,
};
