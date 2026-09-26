import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: ["abc", "ahbgdc"],
    expected: true,
    explanation: "a, b, c가 순서대로 있어요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: ["axc", "ahbgdc"],
    expected: false,
    explanation: "x가 없어요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: ["", "abc"],
    expected: true,
    failureNote: "빈 단어는 언제나 숨어 있어요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: ["ba", "abc"],
    expected: false,
    failureNote: "글자는 다 있지만 순서가 달라요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: ["aa", "ab"],
    expected: false,
    failureNote: "a가 두 번 필요한데 한 번뿐이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: ["jihgfedcba".repeat(10), Array.from({ length: 100000 }, (_, i) => "abcdefghij"[(i * 7) % 10]).join("")],
    expected: true,
    failureNote:
      "편지가 10만 글자예요. 단어 글자마다 편지를 처음부터 다시 찾으면 느려요. 두 손가락 모두 앞으로만 가요.",
  },
]);

export const twoPointersHiddenWord: Problem = {
  id: "c:two-pointers-hidden-word",
  slug: "two-pointers-hidden-word",
  source: "curated",
  topic: "two-pointers",
  level: 2,
  title: "편지 속에 숨은 단어",
  summary: "긴 편지를 훑으며, 찾는 단어의 다음 글자와 같을 때만 단어 손가락을 옮겨요",
  statement: [
    "노디가 긴 편지 `letter`에서 몇 글자를 **순서를 지켜** 골라(연속이 아니어도 돼요) 단어 `word`를 만들 수 있는지 궁금해요.",
    "",
    "만들 수 있으면 `true`, 없으면 `false`를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`word`: 찾는 단어, `letter`: 편지예요. 둘 다 영어 소문자예요.",
  outputFormat: "숨어 있는지 (참/거짓)",
  constraints: ["0 ≤ word의 길이 ≤ 100", "1 ≤ letter의 길이 ≤ 100,000"],
  signature: {
    name: "solution",
    params: [
      { name: "word", type: { python: "str", javascript: "string", java: "String" }, description: "찾는 단어" },
      { name: "letter", type: { python: "str", javascript: "string", java: "String" }, description: "편지" },
    ],
    returns: { type: { python: "bool", javascript: "boolean", java: "boolean" }, description: "숨어 있는지" },
  },
  starterCode: {
    python: ["def solution(word, letter):", "    answer = False", "    return answer", ""].join("\n"),
    javascript: ["function solution(word, letter) {", "  let answer = false;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public boolean solution(String word, String letter) {",
      "        boolean answer = false;",
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
      body: ["두 문자열을 **순서대로** 맞춰 보기 → 두 손가락이 같은 방향으로 가는 **두 포인터**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `i`는 word의 다음에 찾을 글자, 편지를 앞에서부터 한 글자씩 봐요.",
        "2. 편지 글자가 `word[i]`와 같으면 `i += 1`",
        "3. 끝까지 봤을 때 `i == len(word)`면 true예요.",
        "",
        "같은 글자가 여러 번 나오면 **가장 먼저 나온 것**을 쓰는 게 늘 유리해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "i = 0",
        "for c in letter:",
        "    if i < len(word) and c == word[i]: i += 1",
        "return i == len(word)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["단어 손가락을 옮기는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for c in letter:", "    if ______:", "        i += 1", "return i == len(word)"].join("\n"),
          javascript: ["for (const c of letter) {", "  if (______) i++;", "}", "return i === word.length;"].join("\n"),
          java: [
            "for (int j = 0; j < letter.length(); j++) {",
            "    if (______) i++;",
            "}",
            "return i == word.length();",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["same-direction"],
  signalIds: ["sig-in-place"],
  estimatedMinutes: 10,
  xp: 20,
};
