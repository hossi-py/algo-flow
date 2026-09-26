import type { Problem } from "@/types/content";

export const hashAnagramGroups: Problem = {
  id: "c:hash-anagram-groups",
  slug: "hash-anagram-groups",
  source: "curated",
  topic: "hash",
  level: 4,
  title: "글자 구성이 같은 단어 묶기",
  summary: "글자를 정렬한 문자열을 키로 삼아 같은 구성끼리 모아요",
  statement: [
    "노디가 단어 카드를 정리하고 있어요. 글자의 **종류와 개수가 모두 같은** 단어(애너그램)끼리 한 묶음으로 모으려고 해요. 예를 들어 listen과 silent는 같은 묶음이에요.",
    "",
    "묶음들을 담은 리스트를 반환해 주세요.",
    "",
    "- 묶음의 순서: 묶음의 **첫 단어가 먼저 나온** 순서예요.",
    "- 묶음 안의 순서: 입력에 나온 순서 그대로예요. 같은 단어가 여러 번 나오면 모두 넣어요.",
  ].join("\n"),
  inputFormat: "`words`: 단어 리스트예요.",
  outputFormat: "애너그램 묶음들의 리스트",
  constraints: ["1 ≤ words의 길이 ≤ 10,000", "단어는 영어 소문자로 된 1~10글자예요"],
  signature: {
    name: "solution",
    params: [
      { name: "words", type: { python: "list[str]", javascript: "string[]", java: "String[]" }, description: "단어들" },
    ],
    returns: {
      type: { python: "list[list[str]]", javascript: "string[][]", java: "List<List<String>>" },
      description: "애너그램 묶음들",
    },
  },
  starterCode: {
    python: ["def solution(words):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(words) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<List<String>> solution(String[] words) {",
      "        List<List<String>> answer = new ArrayList<>();",
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
      args: [["listen", "silent", "google", "enlist", "gogole", "cat"]],
      expected: [["listen", "silent", "enlist"], ["google", "gogole"], ["cat"]],
      explanation: "listen 묶음이 가장 먼저, 그다음 google 묶음, 마지막이 cat이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [["a"]],
      expected: [["a"]],
      explanation: "단어가 하나면 묶음도 하나예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [["ab", "ba", "ab"]],
      expected: [["ab", "ba", "ab"]],
      failureNote: "같은 단어가 두 번 나와도 둘 다 넣어요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [["aab", "abb", "bab", "aba"]],
      expected: [
        ["aab", "aba"],
        ["abb", "bab"],
      ],
      failureNote: "글자 종류가 같아도 개수가 다르면 다른 묶음이에요: aab·aba와 abb·bab.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [["abc", "xyz", "bca", "zyx", "cab"]],
      expected: [
        ["abc", "bca", "cab"],
        ["xyz", "zyx"],
      ],
      failureNote: "묶음 안에서는 입력 순서를 지켜요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "tricky",
      args: [["ab", "abc", "ba", "cba"]],
      expected: [
        ["ab", "ba"],
        ["abc", "cba"],
      ],
      failureNote: "길이가 다르면 다른 묶음이에요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 10000 }, (_, i) => {
          const s = "abcdefghij".slice(0, 3 + (i % 5));
          const r = i % s.length;
          return s.slice(r) + s.slice(0, r);
        }),
      ],
      expected: (() => {
        const m = new Map();
        for (const x of Array.from({ length: 10000 }, (_, i) => {
          const s = "abcdefghij".slice(0, 3 + (i % 5));
          const r = i % s.length;
          return s.slice(r) + s.slice(0, r);
        })) {
          const k = [...x].sort().join("");
          if (!m.has(k)) m.set(k, []);
          m.get(k).push(x);
        }
        return [...m.values()];
      })(),
      failureNote: "단어 1만 개예요. 단어마다 모든 묶음과 하나씩 비교하지 말고, 정렬한 글자를 키로 dict에 모으세요.",
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
      body: ["'**같은 종류끼리 묶기**' → 묶는 기준을 **키**로 만들어 dict에 모으는 해시 패턴이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "애너그램끼리는 글자를 **정렬하면 똑같은 문자열**이 돼요. listen, silent → eilnst.",
        "",
        "1. 단어마다 정렬한 문자열을 키로 만들어요.",
        "2. `groups[키]`에 단어를 이어 붙여요. 처음 보는 키면 빈 리스트부터 만들어요.",
        "3. dict는 키를 넣은 순서를 기억하니까, 값들을 차례로 꺼내면 묶음 순서도 맞아요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "groups = {}                # 키를 넣은 순서가 유지돼요",
        "for w in words:",
        "    key = w의 글자를 정렬해 이은 문자열",
        "    groups[key]에 w 추가 (없으면 []부터)",
        "return groups의 값들을 리스트로",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["묶음의 키를 만드는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "groups = {}",
            "for w in words:",
            "    key = ______",
            "    groups.setdefault(key, []).append(w)",
            "return list(groups.values())",
          ].join("\n"),
          javascript: [
            "const groups = new Map();",
            "for (const w of words) {",
            "  const key = ______;",
            "  if (!groups.has(key)) groups.set(key, []);",
            "  groups.get(key).push(w);",
            "}",
            "return [...groups.values()];",
          ].join("\n"),
          java: [
            "Map<String, List<String>> groups = new LinkedHashMap<>();",
            "for (String w : words) {",
            "    char[] letters = w.toCharArray();",
            "    Arrays.sort(letters);",
            "    String key = ______;",
            "    groups.computeIfAbsent(key, x -> new ArrayList<>()).add(w);",
            "}",
            "return new ArrayList<>(groups.values());",
          ].join("\n"),
        },
        caption: "Java의 HashMap은 넣은 순서를 기억하지 않아요. 순서가 필요하면 LinkedHashMap을 써요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["group-by-key"],
  signalIds: ["sig-group-same"],
  estimatedMinutes: 18,
  xp: 40,
};
