import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["a==b", "b!=a"]],
    expected: "NO",
    explanation: "a와 b가 같으면서 다를 수는 없어서 NO예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [["b==a", "a==b"]],
    expected: "YES",
    explanation: "둘 다 같은 말이라 YES예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [["a==b", "b==c", "a==c"]],
    expected: "YES",
    failureNote: "모두 같게 하면 돼요: YES.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [["a==b", "b!=c", "c==a"]],
    expected: "NO",
    failureNote: "a = b = c가 되는데 b ≠ c라서 NO예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [["a!=b", "b==c", "c==a"]],
    expected: "NO",
    failureNote: "'다르다'가 먼저 나와도 뒤의 '같다'로 a = b가 돼서 NO예요. 식을 순서대로 한 번만 보면 틀려요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [["a!=b", "b!=c", "c!=a"]],
    expected: "YES",
    failureNote: "'다르다'는 이어지지 않아요. 셋을 모두 다르게 하면 돼서 YES예요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "edge",
    args: [["a!=a"]],
    expected: "NO",
    failureNote: "자기 자신과 다를 수는 없어서 NO예요.",
  },
  {
    id: "hid-6",
    visibility: "hidden",
    purpose: "stress",
    args: [
      [
        ...Array.from(
          { length: 99999 },
          (_, i) => String.fromCharCode(97 + (i % 26)) + "==" + String.fromCharCode(97 + ((i + 1) % 26)),
        ),
        "a!=z",
      ],
    ],
    expected: "NO",
    failureNote: "식 10만 개예요.",
  },
]);

export const ufEquations: Problem = {
  id: "c:uf-equations",
  slug: "uf-equations",
  source: "curated",
  topic: "graph-advanced",
  level: 2,
  title: "같다와 다르다",
  summary: "'같다'로 먼저 그룹을 모두 만든 뒤, '다르다'가 같은 그룹을 가리키는지 확인해요",
  statement: [
    '소문자 한 글자로 된 변수들에 대한 식 `equations`가 있어요. 식은 `"a==b"`(a와 b는 같다)나 `"a!=b"`(a와 b는 다르다) 꼴이에요.',
    "",
    '변수마다 정수를 하나씩 정해 **모든 식을 동시에** 참으로 만들 수 있으면 `"YES"`, 없으면 `"NO"`를 반환해 주세요.',
  ].join("\n"),
  inputFormat: "`equations`: 식 목록이에요. 식은 4글자예요.",
  outputFormat: '"YES" 또는 "NO"',
  constraints: ["1 ≤ equations의 길이 ≤ 100,000", "변수는 소문자 a ~ z"],
  signature: {
    name: "solution",
    params: [
      {
        name: "equations",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "식 목록",
      },
    ],
    returns: { type: { python: "str", javascript: "string", java: "String" }, description: "YES 또는 NO" },
  },
  starterCode: {
    python: ["def solution(equations):", '    answer = ""', "    return answer", ""].join("\n"),
    javascript: ["function solution(equations) {", '  let answer = "";', "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String solution(String[] equations) {",
      '        String answer = "";',
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
        "'같다'는 **그룹으로 묶이고**(a = b, b = c면 a = c), '다르다'는 두 변수가 **같은 그룹이 아니어야** 해요 → **유니온 파인드**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 먼저 `==` 식만 모두 보고 두 글자를 합쳐요.",
        "2. 그다음 `!=` 식을 보며, 두 글자가 같은 그룹이면 NO예요.",
        "",
        "순서를 지키는 게 중요해요. `!=`를 먼저 확인하면 뒤에 오는 `==`로 생기는 모순을 놓쳐요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        'for 식 in equations: if 식[1:3] == "==": union(식[0], 식[3])',
        'for 식 in equations: if 식[1:3] == "!=" and find(식[0]) == find(식[3]): return "NO"',
        'return "YES"',
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["두 번째로 훑는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["for e in equations:", '    if e[1] == "!" and ______:', '        return "NO"', 'return "YES"'].join(
            "\n",
          ),
          javascript: [
            "for (const e of equations) {",
            '  if (e[1] === "!" && ______) return "NO";',
            "}",
            'return "YES";',
          ].join("\n"),
          java: [
            "for (String e : equations) {",
            "    int a = e.charAt(0) - 'a', b = e.charAt(3) - 'a';",
            "    if (e.charAt(1) == '!' && ______) return \"NO\";",
            "}",
            'return "YES";',
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["union-find"],
  signalIds: ["sig-merge-groups"],
  estimatedMinutes: 15,
  xp: 20,
};
