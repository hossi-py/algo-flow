import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [2],
    expected: ["(())", "()()"],
    explanation: "(()), ()() 두 가지예요. ())(는 중간에 닫는 괄호가 더 많아져서 안 돼요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [3],
    expected: ["((()))", "(()())", "(())()", "()(())", "()()()"],
    explanation: "5가지예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1],
    expected: ["()"],
    failureNote: "() 하나뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [4],
    expected: [
      "(((())))",
      "((()()))",
      "((())())",
      "((()))()",
      "(()(()))",
      "(()()())",
      "(()())()",
      "(())(())",
      "(())()()",
      "()((()))",
      "()(()())",
      "()(())()",
      "()()(())",
      "()()()()",
    ],
    failureNote: "14가지예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [5],
    // prettier-ignore
    expected: ["((((()))))","(((()())))","(((())()))","(((()))())","(((())))()","((()(())))","((()()()))","((()())())","((()()))()","((())(()))","((())()())","((())())()","((()))(())","((()))()()","(()((())))","(()(()()))","(()(())())","(()(()))()","(()()(()))","(()()()())","(()()())()","(()())(())","(()())()()","(())((()))","(())(()())","(())(())()","(())()(())","(())()()()","()(((())))","()((()()))","()((())())","()((()))()","()(()(()))","()(()()())","()(()())()","()(())(())","()(())()()","()()((()))","()()(()())","()()(())()","()()()(())","()()()()()"],
    failureNote: "42가지예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [8],
    expected: Array.from({ length: 1 << 16 }, (_, m) =>
      Array.from({ length: 16 }, (_, j) => (((m >> (15 - j)) & 1) === 0 ? "(" : ")")).join(""),
    ).filter((s) => {
      let open = 0;
      for (const ch of s) {
        open += ch === "(" ? 1 : -1;
        if (open < 0) return false;
      }
      return open === 0;
    }),
    failureNote:
      "8쌍이면 1,430가지예요. 2^16가지 괄호열을 모두 만들고 검사하는 대신, 만드는 도중에 잘못된 가지를 잘라요.",
  },
]);

export const backtrackingBracketStrings: Problem = {
  id: "c:backtracking-bracket-strings",
  slug: "backtracking-bracket-strings",
  source: "curated",
  topic: "backtracking",
  level: 4,
  title: "짝 맞는 괄호 만들기",
  summary: "여는 괄호와 닫는 괄호 수를 세며 짝이 맞는 괄호열만 만들어요",
  statement: [
    "노디는 여는 괄호 `(` `n`개와 닫는 괄호 `)` `n`개로 괄호열을 만들어요. 짝이 맞는 괄호열은 앞에서부터 읽을 때 **닫는 괄호가 여는 괄호보다 많아지는 순간이 없고**, 끝에서 두 수가 같아요.",
    "",
    "짝이 맞는 **모든 괄호열**을 사전 순(`(`가 `)`보다 앞)으로 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 괄호 쌍의 수예요.",
  outputFormat: "짝이 맞는 괄호열들의 사전 순 리스트",
  constraints: ["1 ≤ n ≤ 8"],
  signature: {
    name: "solution",
    params: [{ name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "괄호 쌍의 수" }],
    returns: {
      type: { python: "list[str]", javascript: "string[]", java: "List<String>" },
      description: "짝 맞는 괄호열",
    },
  },
  starterCode: {
    python: ["def solution(n):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<String> solution(int n) {",
      "        List<String> answer = new ArrayList<>();",
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
        "모든 괄호열을 만드는 **백트래킹**인데, 짝이 안 맞을 게 뻔한 가지는 **미리 잘라요** → **가지치기**.",
        "",
        "다 만든 뒤 검사하면 2^(2n)가지를 모두 봐야 해요. 만드는 도중에 규칙을 지키면 답이 되는 것만 만들어요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "지금까지 쓴 여는 괄호 수 `open`, 닫는 괄호 수 `close`를 들고 다녀요.",
        "",
        "- `open < n`이면 `(`를 더 쓸 수 있어요.",
        "- `close < open`이면 `)`를 쓸 수 있어요. (닫을 여는 괄호가 남아 있을 때만)",
        "- 길이가 2n이 되면 완성이에요.",
        "",
        "`(`를 먼저 시도하면 결과가 저절로 사전 순이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "make(s, open, close):",
        "    if len(s) == 2n: result에 s 추가; return",
        "    if open < n:      make(s + '(', open + 1, close)",
        "    if close < open:  make(s + ')', open, close + 1)",
        "make('', 0, 0)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["닫는 괄호를 쓸 수 있는 조건이 빈칸이에요."].join("\n"),
      code: {
        code: {
          python: [
            "if open_ < n:",
            '    make(s + "(", open_ + 1, close)',
            "if ______:",
            '    make(s + ")", open_, close + 1)',
          ].join("\n"),
          javascript: [
            'if (open < n) make(s + "(", open + 1, close);',
            'if (______) make(s + ")", open, close + 1);',
          ].join("\n"),
          java: ['if (open < n) make(s + "(", open + 1, close);', 'if (______) make(s + ")", open, close + 1);'].join(
            "\n",
          ),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["constraint-pruning"],
  signalIds: ["sig-all-cases", "sig-small-n"],
  estimatedMinutes: 25,
  xp: 40,
};
