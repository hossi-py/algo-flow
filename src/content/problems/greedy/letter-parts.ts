import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: ["ababcbacadefegdehijhklij"],
    expected: [9, 7, 8],
    explanation: "ababcbaca / defegde / hijhklij로 9, 7, 8이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: ["abc"],
    expected: [1, 1, 1],
    explanation: "모두 다른 글자면 한 글자씩 [1, 1, 1]이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: ["aaaa"],
    expected: [4],
    failureNote: "한 글자뿐이면 통째로 [4]예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: ["abca"],
    expected: [4],
    failureNote: "a가 맨 끝에도 있어서 전체가 한 조각 [4]예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: ["abacdcef"],
    expected: [3, 3, 1, 1],
    failureNote: "aba / cdc / e / f로 [3, 3, 1, 1]이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => String.fromCharCode(97 + (Math.floor(i / 4000) % 26))).join("")],
    expected: [
      4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000,
      4000, 4000, 4000, 4000, 4000, 4000,
    ],
    failureNote: "10만 글자예요. 자르는 곳마다 앞뒤 글자를 다시 훑으면 시간 초과예요.",
  },
]);

export const greedyLetterParts: Problem = {
  id: "c:greedy-letter-parts",
  slug: "greedy-letter-parts",
  source: "curated",
  topic: "greedy",
  level: 5,
  title: "글자가 섞이지 않게 나누기",
  summary: "글자마다 마지막 위치를 알아 두고, 구간 끝을 늘려 가다 닿으면 자르기",
  statement: [
    "노디가 영어 소문자 문자열 `s`를 여러 조각으로 나누려고 해요. **같은 글자는 모두 한 조각 안에** 있어야 해요.",
    "",
    "조각의 수를 **최대로** 할 때, 앞에서부터 조각들의 **길이**를 차례로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`s`: 영어 소문자 문자열이에요.",
  outputFormat: "조각 길이들의 리스트",
  constraints: ["1 ≤ s의 길이 ≤ 100,000"],
  signature: {
    name: "solution",
    params: [{ name: "s", type: { python: "str", javascript: "string", java: "String" }, description: "문자열" }],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" },
      description: "조각 길이들",
    },
  },
  starterCode: {
    python: ["def solution(s):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(s) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(String s) {",
      "        List<Integer> answer = new ArrayList<>();",
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
        "조각을 **최대한 많이** → 자를 수 있게 되는 순간 바로 자르는 **그리디**예요. 글자마다 마지막 위치를 알아 두면 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 글자마다 **마지막으로 나오는 위치** `last[c]`를 구해요.",
        "2. 앞에서부터 보며, 지금 조각이 적어도 어디까지 가야 하는지 `end = max(end, last[s[i]])`로 늘려요.",
        "3. `i == end`가 되면 지금 조각의 모든 글자가 여기서 끝나요 → 자르기",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "last = 글자마다 마지막 위치",
        "start = 0, end = 0",
        "for i, c in enumerate(s):",
        "    end = max(end, last[c])",
        "    if i == end: 조각 길이 end - start + 1 추가; start = i + 1",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["자를 수 있는지 확인하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i, c in enumerate(s):",
            "    end = max(end, last[c])",
            "    if ______:",
            "        parts.append(end - start + 1)",
            "        start = i + 1",
          ].join("\n"),
          javascript: [
            "for (let i = 0; i < s.length; i++) {",
            "  end = Math.max(end, last.get(s[i]));",
            "  if (______) {",
            "    parts.push(end - start + 1);",
            "    start = i + 1;",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int i = 0; i < s.length(); i++) {",
            "    end = Math.max(end, last[s.charAt(i) - 'a']);",
            "    if (______) {",
            "        parts.add(end - start + 1);",
            "        start = i + 1;",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-accumulate"],
  signalIds: ["sig-running-reach"],
  estimatedMinutes: 25,
  xp: 50,
};
