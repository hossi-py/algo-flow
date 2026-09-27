import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["nodi", "mimi", "nodi", "toto", "mimi", "nodi"]],
    expected: "nodi",
    explanation: "nodi 3표, mimi 2표, toto 1표예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [["toto", "mimi", "toto", "mimi"]],
    expected: "mimi",
    explanation: "toto와 mimi가 2표씩 같아요. 사전 순으로 앞선 mimi가 당선이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["solo"]],
    expected: "solo",
    failureNote: "한 표뿐이면 그 후보가 당선이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [["b", "a", "c", "b", "c", "a"]],
    expected: "a",
    failureNote: "세 명이 모두 2표예요. 가장 앞선 a가 당선이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [["ab", "b", "abc", "b", "ab", "abc"]],
    expected: "ab",
    failureNote: "모두 2표예요. 사전 순으로 ab가 abc와 b보다 앞서요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [["z", "y", "z", "y", "y"]],
    expected: "y",
    failureNote: "먼저 나온 z가 아니라 표가 더 많은 y(3표)가 당선이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => "c" + ((i * i + 3 * i) % 997).toString(36))],
    expected: "c0",
    failureNote:
      "10만 표, 후보 약 1,000명이에요. 후보마다 votes.count()로 세면 시간 초과예요. 한 번 훑으며 dict로 세세요.",
  },
]);

export const hashClassVote: Problem = {
  id: "c:hash-class-vote",
  slug: "hash-class-vote",
  source: "curated",
  topic: "hash",
  level: 2,
  title: "숲속 반장 선거",
  summary: "후보마다 표를 세고 가장 많이 받은 후보를 찾아요",
  statement: [
    "숲속 학교에서 반장 선거를 했어요. 투표 용지에는 후보 이름이 하나씩 적혀 있어요.",
    "",
    "가장 많은 표를 받은 후보의 이름을 반환해 주세요. 표 수가 같은 후보가 여럿이면 이름이 **사전 순으로 가장 앞선** 후보를 반환해요.",
  ].join("\n"),
  inputFormat: "`votes`: 투표 용지에 적힌 이름 리스트예요.",
  outputFormat: "당선된 후보의 이름",
  constraints: ["1 ≤ votes의 길이 ≤ 100,000", "이름은 영어 소문자와 숫자로 된 1~10글자예요"],
  signature: {
    name: "solution",
    params: [
      {
        name: "votes",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "투표 용지",
      },
    ],
    returns: { type: { python: "str", javascript: "string", java: "String" }, description: "당선자 이름" },
  },
  starterCode: {
    python: ["def solution(votes):", '    answer = ""', "    return answer", ""].join("\n"),
    javascript: ["function solution(votes) {", '  let answer = "";', "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String solution(String[] votes) {",
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
      body: ["'**각 후보가 몇 표**'를 세요 → 이름을 키, 표 수를 값으로 하는 **dict로 개수 세기**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 투표 용지를 한 번 훑으며 `count[이름] += 1` 해요.",
        "2. count를 돌면서 '표가 더 많거나, 표가 같고 이름이 더 앞서는' 후보로 답을 바꿔요.",
        "",
        "후보마다 리스트 전체를 세면 후보 수 × 표 수만큼 걸려요.",
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
        "for v in votes: count[v] += 1 (처음이면 1)",
        "best = 없음",
        "for name, c in count:",
        "    if best가 없거나 c > count[best] 이거나 (c == count[best] 이고 name < best):",
        "        best = name",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["표를 세는 한 줄이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["count = {}", "for v in votes:", "    count[v] = ______ + 1"].join("\n"),
          javascript: ["const count = new Map();", "for (const v of votes) {", "  count.set(v, ______ + 1);", "}"].join(
            "\n",
          ),
          java: [
            "Map<String, Integer> count = new HashMap<>();",
            "for (String v : votes) {",
            "    count.put(v, ______ + 1);",
            "}",
          ].join("\n"),
        },
        caption: "Java는 getOrDefault(키, 0)으로 처음 보는 키를 0부터 셀 수 있어요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["frequency-count"],
  signalIds: ["sig-count-each"],
  visualization: {
    presets: [
      problemPreset(
        "hash-class-vote-ex1",
        "hash-count",
        "표 세기",
        "용지를 한 장씩 보며 count[이름]을 1씩 늘려요. 처음 보는 이름은 1부터 시작해요.",
        [["nodi", "mimi", "nodi", "toto", "mimi", "nodi"]],
      ),
    ],
  },
  estimatedMinutes: 10,
  xp: 20,
};
