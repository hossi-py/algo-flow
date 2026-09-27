import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      ["nodi", "mimi", "toto"],
      ["toto", "nodi"],
    ],
    expected: "mimi",
    explanation: "돌아온 명단에 mimi가 없어요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [
      ["kiki", "lulu", "kiki"],
      ["kiki", "lulu"],
    ],
    expected: "kiki",
    explanation: "kiki가 두 명 출발했는데 한 명만 돌아왔어요. 이름이 있는지만 보면 틀려요. 개수를 비교하세요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["solo"], []],
    expected: "solo",
    failureNote: "혼자 출발해서 아무도 돌아오지 않았어요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      ["a", "a", "a", "b"],
      ["a", "b", "a"],
    ],
    expected: "a",
    failureNote: "a가 세 명 중 두 명만 돌아왔어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      ["mo", "ko", "jo", "po"],
      ["po", "jo", "mo"],
    ],
    expected: "ko",
    failureNote: "ko가 돌아오지 않았어요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 100000 }, (_, i) => "k" + (i % 50000).toString(36)),
      Array.from({ length: 100000 }, (_, i) => "k" + (i % 50000).toString(36))
        .filter((_, i) => i !== 76543)
        .reverse(),
    ],
    expected: "kkhb",
    failureNote:
      "10만 명, 이름마다 두 명씩 있어요. 돌아온 사람을 출발 명단에서 하나씩 지우면(list.remove) 시간 초과예요.",
  },
]);

export const hashLostCamper: Problem = {
  id: "c:hash-lost-camper",
  slug: "hash-lost-camper",
  source: "curated",
  topic: "hash",
  level: 2,
  title: "돌아오지 않은 캠퍼",
  summary: "출발 명단과 돌아온 명단의 개수를 비교해 한 명을 찾아요",
  statement: [
    "캠핑장에서 산책을 나갔다가 **딱 한 명**만 아직 돌아오지 않았어요.",
    "",
    "출발할 때 적은 명단 `departed`와 돌아와서 적은 명단 `returned`가 주어져요. `returned`는 `departed`보다 한 명 적고, 적힌 순서는 서로 달라요. 이름이 같은 친구(동명이인)가 있을 수 있어요.",
    "",
    "돌아오지 않은 친구의 이름을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`departed`: 출발 명단, `returned`: 돌아온 명단이에요.",
  outputFormat: "돌아오지 않은 친구의 이름",
  constraints: [
    "1 ≤ departed의 길이 ≤ 100,000",
    "returned의 길이 = departed의 길이 − 1",
    "이름은 영어 소문자와 숫자로 된 1~10글자예요",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "departed",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "출발 명단",
      },
      {
        name: "returned",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "돌아온 명단",
      },
    ],
    returns: { type: { python: "str", javascript: "string", java: "String" }, description: "돌아오지 않은 친구" },
  },
  starterCode: {
    python: ["def solution(departed, returned):", '    answer = ""', "    return answer", ""].join("\n"),
    javascript: ["function solution(departed, returned) {", '  let answer = "";', "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public String solution(String[] departed, String[] returned) {",
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
        "동명이인 때문에 '있다/없다'만으로는 부족해요. 이름마다 **몇 명인지** 세어야 해요 → **dict로 개수 세기**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 출발 명단으로 `count[이름] += 1` 해요.",
        "2. 돌아온 명단으로 `count[이름] -= 1` 해요.",
        "3. 값이 **0보다 큰** 이름이 돌아오지 않은 친구예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "count = {}",
        "for name in departed: count[name] += 1",
        "for name in returned: count[name] -= 1",
        "for name, c in count:",
        "    if c > 0: return name",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["돌아온 친구를 빼는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for name in departed:",
            "    count[name] = count.get(name, 0) + 1",
            "for name in returned:",
            "    ______",
          ].join("\n"),
          javascript: [
            "for (const name of departed) count.set(name, (count.get(name) ?? 0) + 1);",
            "for (const name of returned) {",
            "  ______;",
            "}",
          ].join("\n"),
          java: [
            "for (String name : departed) count.put(name, count.getOrDefault(name, 0) + 1);",
            "for (String name : returned) {",
            "    ______;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["frequency-count"],
  signalIds: ["sig-count-each"],
  estimatedMinutes: 10,
  xp: 20,
};
