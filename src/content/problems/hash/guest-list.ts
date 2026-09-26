import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const hashGuestList: Problem = {
  id: "c:hash-guest-list",
  slug: "hash-guest-list",
  source: "curated",
  topic: "hash",
  level: 1,
  title: "초대 명단 확인",
  summary: "도착한 손님마다 초대 명단에 있는지 빠르게 확인해요",
  statement: [
    "노디가 숲속 파티를 열었어요. 입구에서 도착한 손님이 **초대 명단**에 있는지 확인해야 해요.",
    "",
    "초대 명단 `invited`와 도착한 순서대로 적힌 이름 `arrivals`가 주어질 때, 도착한 손님마다 명단에 있으면 `true`, 없으면 `false`를 차례로 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`invited`: 초대한 사람의 이름 리스트, `arrivals`: 도착한 사람의 이름 리스트예요.",
  outputFormat: "`arrivals`와 길이가 같은 참/거짓 리스트",
  constraints: [
    "1 ≤ invited의 길이 ≤ 100,000",
    "1 ≤ arrivals의 길이 ≤ 100,000",
    "이름은 영어 소문자와 숫자로 된 1~10글자예요",
    "invited에 같은 이름이 여러 번 있을 수 있어요",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "invited",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "초대 명단",
      },
      {
        name: "arrivals",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "도착한 사람들",
      },
    ],
    returns: {
      type: { python: "list[bool]", javascript: "boolean[]", java: "boolean[]" },
      description: "도착한 사람마다 초대 여부",
    },
  },
  starterCode: {
    python: ["def solution(invited, arrivals):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(invited, arrivals) {", "  let answer = [];", "  return answer;", "}", ""].join(
      "\n",
    ),
    java: [
      "class Solution {",
      "    public boolean[] solution(String[] invited, String[] arrivals) {",
      "        boolean[] answer = new boolean[arrivals.length];",
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
      args: [
        ["nodi", "mimi", "toto"],
        ["mimi", "bobo", "nodi"],
      ],
      expected: [true, false, true],
      explanation: "mimi와 nodi는 명단에 있고, bobo는 없어요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [["nodi"], ["nodi", "nodi"]],
      expected: [true, true],
      explanation: "같은 사람이 두 번 와도 매번 확인해요. 두 번 다 true예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [["a", "b"], ["c"]],
      expected: [false],
      failureNote: "명단에 없는 사람만 왔어요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [
        ["kiki", "kiki", "lulu"],
        ["lulu", "kiki", "momo", "kik"],
      ],
      expected: [true, true, false, false],
      failureNote: "명단에 같은 이름이 두 번 있어도 괜찮아요. kik은 kiki와 다른 이름이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        ["ab1", "b2"],
        ["ab", "b2", "ab1"],
      ],
      expected: [false, true, true],
      failureNote: "이름이 정확히 같을 때만 true예요. 앞부분만 같은 ab는 false예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => "g" + i.toString(36)),
        Array.from({ length: 100000 }, (_, i) =>
          i % 2 === 0 ? "g" + ((i * 7) % 100000).toString(36) : "x" + i.toString(36),
        ),
      ],
      expected: Array.from({ length: 100000 }, (_, i) => i % 2 === 0),
      failureNote:
        "명단과 손님이 각각 10만 명이에요. 손님마다 명단 리스트를 처음부터 훑으면(x in list) 시간 초과예요. 명단을 set으로 바꿔 두세요.",
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
        "'명단에 **있는지** 확인'을 손님 수만큼 반복해요 → **해시**(set)예요.",
        "",
        "리스트에서 `in`으로 찾으면 한 번에 최대 10만 번 비교라, 손님 10만 명이면 100억 번이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 초대 명단을 **set**에 한 번 넣어 둬요. (10만 번)",
        "2. 손님마다 set에 있는지 물어봐요. 한 번에 평균 O(1)이에요.",
        "",
        "전체 O(N + M)으로 끝나요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "invitedSet = invited의 모든 이름을 담은 set",
        "answer = []",
        "for name in arrivals:",
        "    answer에 (name이 invitedSet에 있는가) 추가",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["set을 만드는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "invited_set = ______(invited)",
            "for name in arrivals:",
            "    answer.append(name in invited_set)",
          ].join("\n"),
          javascript: [
            "const invitedSet = new ______(invited);",
            "for (const name of arrivals) {",
            "  answer.push(invitedSet.has(name));",
            "}",
          ].join("\n"),
          java: [
            "Set<String> invitedSet = new ______<>(Arrays.asList(invited));",
            "for (int i = 0; i < arrivals.length; i++) {",
            "    answer[i] = invitedSet.contains(arrivals[i]);",
            "}",
          ].join("\n"),
        },
        caption: "Java는 HashSet에 Arrays.asList(배열)을 넘겨 한 번에 만들 수 있어요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["existence-check"],
  signalIds: ["sig-seen-before"],
  visualization: {
    presets: [
      problemPreset(
        "hash-guest-list-ex1",
        "hash-buckets",
        "명단을 해시 테이블에 넣고 찾기",
        "초대 명단을 칸에 나눠 넣고, 손님이 오면 그 이름의 칸 하나만 확인해요.",
        [["add nodi", "add mimi", "add toto", "find mimi", "find bobo", "find nodi"], 5],
      ),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
