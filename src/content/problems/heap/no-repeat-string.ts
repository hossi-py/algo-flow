import type { Problem } from "@/types/content";

export const heapNoRepeatString: Problem = {
  id: "c:heap-no-repeat-string",
  slug: "heap-no-repeat-string",
  source: "curated",
  topic: "heap",
  level: 4,
  title: "같은 글자가 붙지 않게",
  summary: "남은 개수가 가장 많은 글자부터, 바로 앞 글자만 피해서 놓아요",
  statement: [
    "노디가 글자 카드 `s`를 다시 늘어놓아 **같은 글자가 이웃하지 않게** 만들려고 해요. 매번 이렇게 골라요.",
    "",
    "- 바로 앞에 놓은 글자와 **다른** 글자 중 **남은 개수가 가장 많은** 글자를 놓아요.",
    "- 남은 개수가 같으면 **사전 순으로 앞선** 글자를 놓아요.",
    "",
    '이렇게 만든 문자열을 반환해 주세요. 어떻게 해도 불가능하면 빈 문자열 `""`을 반환해요.',
  ].join("\n"),
  inputFormat: "`s`: 영어 소문자 글자 카드예요.",
  outputFormat: '다시 늘어놓은 문자열 (불가능하면 "")',
  constraints: ["1 ≤ s의 길이 ≤ 100,000"],
  signature: {
    name: "solution",
    params: [{ name: "s", type: { python: "str", javascript: "string", java: "String" }, description: "글자 카드" }],
    returns: { type: { python: "str", javascript: "string", java: "String" }, description: "늘어놓은 문자열" },
  },
  starterCode: {
    python: ["def solution(s):", '    answer = ""', "    return answer", ""].join("\n"),
    javascript: ["function solution(s) {", '  let answer = "";', "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String solution(String s) {",
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
      args: ["aab"],
      expected: "aba",
      explanation: "a(2) → b → a로 aba예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: ["aaab"],
      expected: "",
      explanation: "a가 너무 많아 어떻게 해도 붙어요. 빈 문자열이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: ["z"],
      expected: "z",
      failureNote: "한 글자면 그대로예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: ["aabbcc"],
      expected: "abcabc",
      failureNote: "모두 2개라 사전 순으로 a, 그다음 a를 피해 b, … abcabc예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: ["vvvlo"],
      expected: "vlvov",
      failureNote: "v를 사이사이에: vlvov예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 100000 }, (_, i) => "aabbbcdde"[(i * 7) % 9]).join("")],
      expected: (() => {
        const s = Array.from({ length: 100000 }, (_, i) => "aabbbcdde"[(i * 7) % 9]).join("");
        const cnt = Array(26).fill(0);
        for (const c of s) cnt[c.charCodeAt(0) - 97]++;
        let prev = -1;
        let out = "";
        for (let n = 0; n < s.length; n++) {
          let best = -1;
          for (let j = 0; j < 26; j++) if (j !== prev && cnt[j] > 0 && (best < 0 || cnt[j] > cnt[best])) best = j;
          if (best < 0) return "";
          out += String.fromCharCode(97 + best);
          cnt[best]--;
          prev = best;
        }
        return out;
      })(),
      failureNote: "10만 글자예요. 가능한 순서를 모두 시도하는 건 불가능해요.",
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
        "매번 '**남은 개수가 가장 많은** 글자'를 꺼내고, 쓴 뒤 개수를 줄여 **다시 넣기** → **최대 힙** + 그리디예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 글자별 개수를 세고 `(-개수, 글자)`를 힙에 넣어요.",
        "2. 가장 많은 글자를 꺼내요. 그게 바로 앞 글자와 같으면 **그다음** 글자를 꺼내 쓰고, 앞의 것은 다시 넣어요.",
        "3. 쓸 글자가 없으면 불가능이에요.",
        "4. 쓴 글자는 개수를 1 줄여 남아 있으면 다시 넣어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "h = [(-count, c)], prev = 없음",
        "repeat len(s)번:",
        "    top = pop()",
        '    if top.c == prev: second = pop() (없으면 return ""); push(top); top = second',
        "    결과에 top.c; 개수 1 줄여 남으면 push; prev = top.c",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["바로 앞 글자와 같을 때의 처리예요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "cnt, c = heapq.heappop(h)",
            "if c == prev:",
            "    if not h:",
            '        return ""',
            "    second = heapq.heappop(h)",
            "    heapq.heappush(h, ______)",
            "    cnt, c = second",
          ].join("\n"),
          javascript: [
            "let top = h.pop();",
            "if (top[1] === prev) {",
            '  if (!h.size) return "";',
            "  const second = h.pop();",
            "  h.push(______);",
            "  top = second;",
            "}",
          ].join("\n"),
          java: [
            "int[] top = h.poll();   // {남은 개수, 글자}",
            "if (top[1] == prev) {",
            '    if (h.isEmpty()) return "";',
            "    int[] second = h.poll();",
            "    h.offer(______);",
            "    top = second;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["repeated-min"],
  signalIds: ["sig-repeated-min", "sig-greedy-local-best"],
  estimatedMinutes: 20,
  xp: 40,
};
