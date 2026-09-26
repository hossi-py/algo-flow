import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const greedyBiggestAfterErase: Problem = {
  id: "c:greedy-biggest-after-erase",
  slug: "greedy-biggest-after-erase",
  source: "curated",
  topic: "greedy",
  level: 5,
  title: "숫자 지워 가장 큰 수",
  summary: "뒤에 더 큰 숫자가 오면 앞의 작은 숫자를 지워 앞자리를 키워요",
  statement: [
    "숫자로 된 문자열 `number`에서 숫자 `k`개를 지워, 남은 숫자를 순서 그대로 이어 붙인 수가 **가장 크게** 되도록 하려고 해요.",
    "",
    "가장 큰 수를 문자열로 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`number`: 숫자 문자열, `k`: 지울 개수예요.",
  outputFormat: "가장 큰 수 (문자열)",
  constraints: ["2 ≤ number의 길이 ≤ 100,000", "1 ≤ k < number의 길이"],
  signature: {
    name: "solution",
    params: [
      { name: "number", type: { python: "str", javascript: "string", java: "String" }, description: "숫자 문자열" },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "지울 개수" },
    ],
    returns: { type: { python: "str", javascript: "string", java: "String" }, description: "가장 큰 수" },
  },
  starterCode: {
    python: ["def solution(number, k):", '    answer = ""', "    return answer", ""].join("\n"),
    javascript: ["function solution(number, k) {", '  let answer = "";', "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String solution(String number, int k) {",
      '        String answer = "";',
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
      args: ["1924", 2],
      expected: "94",
      explanation: "1과 2를 지워 94예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "basic",
      args: ["4177252841", 4],
      expected: "775841",
      explanation: "775841이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: ["1231234", 3],
      expected: "3234",
      failureNote: "3234예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: ["4321", 2],
      expected: "43",
      failureNote: "이미 내려가는 순서라 앞에서 지울 게 없어요. 남은 k만큼 뒤에서 지워 43이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: ["9999", 2],
      expected: "99",
      failureNote: "같은 숫자는 지울 이유가 없어요. 뒤에서 지워 99예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "edge",
      args: ["10", 1],
      expected: "1",
      failureNote: "1을 남겨요. 답은 1이에요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 100000 }, (_, i) => String((i * 7919) % 10)).join(""), 50000],
      expected: (() => {
        const s = Array.from({ length: 100000 }, (_, i) => String((i * 7919) % 10)).join("");
        let k = 50000;
        const st = [];
        for (const d of s) {
          while (k > 0 && st.length && st[st.length - 1] < d) {
            st.pop();
            k--;
          }
          st.push(d);
        }
        st.length -= k;
        return st.join("");
      })(),
      failureNote: "10만 자리에서 5만 개를 지워요. 지울 숫자를 하나씩 모두 시도하면 시간 초과예요.",
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
      body: ["수는 **앞자리가 클수록** 커요 → 앞자리를 최대한 크게 만드는 **그리디**예요. 스택과 함께 써요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 숫자를 앞에서부터 스택에 쌓아요.",
        "2. 새 숫자 d를 넣기 전에, 스택 맨 위가 d보다 **작고** 아직 지울 수 있으면(k > 0) 맨 위를 빼요. 그 자리에 더 큰 d가 오니 수가 커져요.",
        "3. 다 넣고도 k가 남으면 **뒤에서** 지워요 (뒷자리가 가장 덜 중요해요).",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "stack = []",
        "for d in number:",
        "    while k > 0 and stack and stack[-1] < d:",
        "        stack.pop(); k -= 1",
        "    stack.append(d)",
        "stack에서 뒤의 k개 버리기",
        "return stack을 이어 붙인 문자열",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["앞의 작은 숫자를 지우는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for d in number:",
            "    while ______:",
            "        stack.pop()",
            "        k -= 1",
            "    stack.append(d)",
          ].join("\n"),
          javascript: [
            "for (const d of number) {",
            "  while (______) {",
            "    stack.pop();",
            "    k--;",
            "  }",
            "  stack.push(d);",
            "}",
          ].join("\n"),
          java: [
            "StringBuilder stack = new StringBuilder();",
            "for (char d : number.toCharArray()) {",
            "    while (______) {",
            "        stack.deleteCharAt(stack.length() - 1);",
            "        k--;",
            "    }",
            "    stack.append(d);",
            "}",
          ].join("\n"),
        },
        caption: "StringBuilder를 스택처럼 써요. 맨 끝이 스택의 맨 위예요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["digit-greedy"],
  signalIds: ["sig-greedy-local-best"],
  visualization: {
    presets: [
      problemPreset(
        "greedy-biggest-after-erase-ex2",
        "greedy-digits",
        "4177252841에서 4개 지우기",
        "뒤에 더 큰 숫자가 오면 앞의 작은 숫자를 지워요.",
        ["4177252841", 4],
      ),
    ],
  },
  estimatedMinutes: 25,
  xp: 50,
};
