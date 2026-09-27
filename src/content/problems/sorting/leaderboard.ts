import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      ["nodi", "mimi", "toto"],
      [80, 95, 80],
      [30, 40, 25],
    ],
    expected: ["mimi", "toto", "nodi"],
    explanation: "mimi가 95점으로 1등. nodi와 toto는 80점으로 같아서 시간이 짧은 toto(25초)가 앞이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [
      ["zed", "amy", "kim"],
      [70, 70, 70],
      [10, 10, 5],
    ],
    expected: ["kim", "amy", "zed"],
    explanation: "모두 70점이에요. kim이 시간이 가장 짧고, amy와 zed는 시간까지 같아서 이름 순이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["solo"], [0], [1]],
    expected: ["solo"],
    failureNote: "혼자면 그대로예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      ["b", "a", "c"],
      [10, 20, 30],
      [1, 1, 1],
    ],
    expected: ["c", "a", "b"],
    failureNote: "점수가 높은 순이에요. 오름차순으로 정렬하면 거꾸로 나와요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      ["ab", "a", "b"],
      [50, 50, 50],
      [9, 9, 9],
    ],
    expected: ["a", "ab", "b"],
    failureNote: "이름만 다르면 사전 순: a, ab, b예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [
      ["p1", "p2", "p3", "p4"],
      [100, 90, 100, 90],
      [50, 10, 40, 20],
    ],
    expected: ["p3", "p1", "p2", "p4"],
    failureNote: "100점 중 40초인 p3이 1등, p1이 2등, 90점 중 10초인 p2가 3등이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 50000 }, (_, i) => "p" + ((i * 7919) % 50000).toString(36)),
      Array.from({ length: 50000 }, (_, i) => (i * 37) % 101),
      Array.from({ length: 50000 }, (_, i) => (i * 13) % 997),
    ],
    expected: (() => {
      const n = Array.from({ length: 50000 }, (_, i) => "p" + ((i * 7919) % 50000).toString(36));
      const s = Array.from({ length: 50000 }, (_, i) => (i * 37) % 101);
      const t = Array.from({ length: 50000 }, (_, i) => (i * 13) % 997);
      return n
        .map((_, i) => i)
        .sort((a, b) => s[b] - s[a] || t[a] - t[b] || (n[a] < n[b] ? -1 : n[a] > n[b] ? 1 : 0))
        .map((i) => n[i]);
    })(),
    failureNote: "선수 5만 명이에요. 1등을 매번 처음부터 찾으면(O(N²)) 시간 초과예요.",
  },
]);

export const sortingLeaderboard: Problem = {
  id: "c:sorting-leaderboard",
  slug: "sorting-leaderboard",
  source: "curated",
  topic: "sorting",
  level: 3,
  title: "달리기 대회 순위표",
  summary: "점수 내림차순, 시간 오름차순, 이름 순으로 기준을 이어 붙여요",
  statement: [
    "숲속 달리기 대회가 끝났어요. i번 선수의 이름은 `names[i]`, 점수는 `scores[i]`, 걸린 시간은 `times[i]`초예요.",
    "",
    "다음 규칙으로 순위를 매겨, 1등부터 차례로 **이름**을 담은 리스트를 반환해 주세요.",
    "",
    "1. 점수가 **높은** 선수가 앞이에요.",
    "2. 점수가 같으면 시간이 **짧은** 선수가 앞이에요.",
    "3. 둘 다 같으면 이름이 **사전 순으로 앞선** 선수가 앞이에요.",
  ].join("\n"),
  inputFormat: "`names`, `scores`, `times`: 선수별 이름·점수·시간이에요 (같은 번호끼리 한 선수).",
  outputFormat: "순위대로 선수 이름을 담은 리스트",
  constraints: [
    "1 ≤ 선수 수 ≤ 50,000",
    "이름은 서로 다르고, 영어 소문자와 숫자로 된 1~10글자예요",
    "0 ≤ 점수 ≤ 100, 1 ≤ 시간 ≤ 10,000",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "names",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "선수 이름",
      },
      { name: "scores", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "점수" },
      {
        name: "times",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "걸린 시간(초)",
      },
    ],
    returns: { type: { python: "list[str]", javascript: "string[]", java: "String[]" }, description: "순위대로 이름" },
  },
  starterCode: {
    python: ["def solution(names, scores, times):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(names, scores, times) {", "  let answer = [];", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public String[] solution(String[] names, int[] scores, int[] times) {",
      "        String[] answer = new String[names.length];",
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
      body: ["'**~순, 같으면 ~순, 그래도 같으면 ~순**' → 기준을 이어 붙인 **정렬 기준 정하기**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 선수 번호 리스트를 만들어요.",
        "2. 기준을 순서대로 비교하도록 정렬해요: 점수는 **내림차순**, 시간과 이름은 **오름차순**.",
        "3. 정렬된 번호를 이름으로 바꿔요.",
        "",
        "Python은 `key=(-점수, 시간, 이름)` 튜플 하나로 끝나요. 내림차순은 숫자에 `-`를 붙이면 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "order = [0, 1, ..., n-1]",
        "order를 (-scores[i], times[i], names[i]) 순으로 정렬",
        "return [names[i] for i in order]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["정렬 기준이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["order = sorted(range(len(names)), key=lambda i: ______)", "return [names[i] for i in order]"].join(
            "\n",
          ),
          javascript: [
            "const order = names.map((_, i) => i);",
            "order.sort((a, b) =>",
            "  ______ ||",
            "  times[a] - times[b] ||",
            "  (names[a] < names[b] ? -1 : 1));",
            "return order.map((i) => names[i]);",
          ].join("\n"),
          java: [
            "Arrays.sort(order, Comparator",
            "    .comparingInt((Integer i) -> ______)",
            "    .thenComparingInt(i -> times[i])",
            "    .thenComparing(i -> names[i]));",
          ].join("\n"),
        },
        caption: "Comparator를 이어 붙이면 기준을 차례로 비교해요. 내림차순은 값에 −를 붙여요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["custom-order"],
  signalIds: ["sig-order-rule"],
  estimatedMinutes: 15,
  xp: 30,
};
