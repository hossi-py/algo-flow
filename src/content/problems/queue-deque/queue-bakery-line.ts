import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["arrive mina", "arrive jun", "serve", "arrive hana", "serve", "serve"]],
    expected: ["mina", "jun", "hana"],
    explanation: "먼저 선 mina, jun이 먼저 받고, 나중에 온 hana가 마지막이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["serve", "arrive toto", "serve", "serve"]],
    expected: ["toto"],
    explanation: "줄이 비어 있을 때의 serve는 무시돼요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["arrive a", "arrive b"]],
    expected: [],
    failureNote: "아무도 받지 못했어요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [["arrive a", "serve", "arrive a", "arrive b", "serve"]],
    expected: ["a", "a"],
    failureNote: "같은 이름의 손님이 다시 줄을 설 수 있어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [["arrive x", "arrive y", "arrive z", "serve", "serve", "serve"]],
    expected: ["x", "y", "z"],
    failureNote: "세 명이 온 순서 그대로 받아요. 스택처럼 거꾸로 나가면 안 돼요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [["arrive p", "serve", "arrive q", "serve", "arrive r", "serve"]],
    expected: ["p", "q", "r"],
    failureNote: "오자마자 바로 받아요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 999 }, (_, i) => (i % 3 === 2 ? "serve" : `arrive c${i % 10}`))],
    // prettier-ignore
    expected: ["c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8","c9","c1","c2","c4","c5","c7","c8","c0","c1","c3","c4","c6","c7","c9","c0","c2","c3","c5","c6","c8"],
    failureNote: "기록이 999개예요.",
  },
]);

export const queueBakeryLine: Problem = {
  id: "c:queue-bakery-line",
  slug: "queue-bakery-line",
  source: "curated",
  topic: "queue-deque",
  level: 1,
  title: "빵집 줄 서기",
  summary: "줄을 선 순서대로 빵을 받은 손님을 구해요",
  statement: [
    "아침마다 노디네 빵집 앞에는 줄이 길게 서요. 하루 동안의 기록 `events`에는 두 가지 일이 적혀 있어요.",
    "",
    '- `"arrive 이름"`: 그 손님이 줄의 **맨 뒤**에 서요.',
    '- `"serve"`: 줄의 **맨 앞** 손님이 빵을 받고 줄에서 나가요. 줄이 비어 있으면 아무 일도 없어요.',
    "",
    "빵을 받은 손님의 이름을 받은 순서대로 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: '`events`: `"arrive 이름"` 또는 `"serve"` 문자열의 리스트예요. 이름은 영어 소문자예요.',
  outputFormat: "빵을 받은 순서대로의 이름 리스트. 아무도 받지 못했으면 빈 리스트예요.",
  constraints: ["1 ≤ events의 길이 ≤ 1,000", "1 ≤ 이름의 길이 ≤ 10", "같은 이름의 손님이 여러 번 올 수 있어요."],
  signature: {
    name: "solution",
    params: [
      {
        name: "events",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "하루 기록",
      },
    ],
    returns: {
      type: { python: "list[str]", javascript: "string[]", java: "List<String>" },
      description: "빵을 받은 손님 순서",
    },
  },
  starterCode: {
    python: ["def solution(events):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(events) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<String> solution(String[] events) {",
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
      title: "어떤 구조일까요?",
      body: [
        '"맨 뒤에 서요", "맨 앞 손님이 나가요" → 먼저 온 사람이 먼저 나가는 **큐**예요.',
        "",
        "넣는 곳(뒤)과 빼는 곳(앞)이 달라요. 이게 스택과의 차이예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 줄을 큐로 만들어요. Python은 `collections.deque`, JavaScript는 배열에 넣고 **앞을 가리키는 번호(head)** 를 따로 둬요. Java는 `Queue<String> line = new ArrayDeque<>()`를 써요.",
        "2. arrive → 뒤에 추가, serve → 줄이 비어 있지 않으면 앞에서 꺼내 결과에 추가.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "queue = 빈 큐, served = []",
        "for e in events:",
        "    arrive 이름 → queue 뒤에 이름 추가",
        "    serve       → queue가 비어 있지 않으면 앞에서 꺼내 served에 추가",
        "return served",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["serve 처리 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "from collections import deque",
            "",
            "line = deque()",
            "for event in events:",
            "    parts = event.split()",
            '    if parts[0] == "arrive":',
            "        line.append(parts[1])",
            "    elif line:",
            "        served.append(______)",
          ].join("\n"),
          javascript: [
            "const line = [];",
            "let head = 0; // 맨 앞 손님의 위치",
            "for (const event of events) {",
            '  const [name, who] = event.split(" ");',
            '  if (name === "arrive") line.push(who);',
            "  else if (head < line.length) served.push(______);",
            "}",
          ].join("\n"),
          java: [
            "Queue<String> line = new ArrayDeque<>();",
            "for (String event : events) {",
            '    String[] parts = event.split(" ");',
            '    if (parts[0].equals("arrive")) line.offer(parts[1]);',
            "    else if (!line.isEmpty()) served.add(______);",
            "}",
          ].join("\n"),
        },
        caption:
          "JS의 shift()는 배열 전체를 한 칸씩 당겨서 느려요. head 번호를 옮기는 방식이 빨라요. Java는 Queue<...> queue = new ArrayDeque<>()로 큐를 써요 (offer로 넣고 poll로 꺼내요, 둘 다 O(1)).",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["queue-simulation"],
  signalIds: ["sig-arrival-order"],
  visualization: {
    presets: [
      problemPreset("bakery-ex1", "queue-basic", "예제 1 흐름", "먼저 들어온 손님이 먼저 나가요.", [
        ["enqueue 1", "enqueue 2", "dequeue", "enqueue 3", "dequeue", "dequeue"],
      ]),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
