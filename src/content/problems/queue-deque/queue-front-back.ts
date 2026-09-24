import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const queueFrontBack: Problem = {
  id: "c:queue-front-back",
  slug: "queue-front-back",
  source: "curated",
  topic: "queue-deque",
  level: 1,
  title: "줄의 맨 앞과 맨 뒤",
  summary: "줄의 맨 앞·맨 뒤를 물어볼 때마다 답을 기록해요",
  statement: [
    "놀이공원 안내원 노디는 번호표를 든 손님들의 줄을 관리해요. 명령 `commands`는 다음과 같아요.",
    "",
    '- `"enqueue x"`: 번호표 x인 손님이 줄 맨 뒤에 서요.',
    '- `"dequeue"`: 맨 앞 손님이 입장해요. 줄이 비어 있으면 아무 일도 없어요.',
    '- `"front"`: 맨 앞 손님의 번호를 기록해요.',
    '- `"back"`: 맨 뒤 손님의 번호를 기록해요.',
    "",
    "front·back에서 줄이 비어 있으면 `-1`을 기록해요. 기록한 값들을 순서대로 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`commands`: 위 네 가지 명령 문자열의 리스트예요.",
  outputFormat: "front·back 기록을 순서대로 담은 리스트",
  constraints: ["1 ≤ commands의 길이 ≤ 1,000", "1 ≤ x ≤ 10,000"],
  signature: {
    name: "solution",
    params: [{ name: "commands", type: { python: "list[str]", javascript: "string[]" }, description: "명령 목록" }],
    returns: { type: { python: "list[int]", javascript: "number[]" }, description: "front·back 기록" },
  },
  starterCode: {
    python: ["def solution(commands):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(commands) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [["enqueue 3", "enqueue 8", "front", "back", "dequeue", "front"]],
      expected: [3, 8, 8],
      explanation: "맨 앞 3, 맨 뒤 8. 3이 입장하면 8이 맨 앞이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [["front", "enqueue 5", "dequeue", "back"]],
      expected: [-1, -1],
      explanation: "줄이 비어 있으면 -1이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [["enqueue 7", "front", "back"]],
      expected: [7, 7],
      failureNote: "한 명뿐이면 맨 앞과 맨 뒤가 같아요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [["dequeue", "dequeue", "back"]],
      expected: [-1],
      failureNote: "빈 줄에서 dequeue는 무시돼요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [["enqueue 1", "enqueue 2", "enqueue 3", "dequeue", "front", "back", "dequeue", "dequeue", "front"]],
      expected: [2, 3, -1],
      failureNote: "차례로 입장하며 맨 앞이 바뀌어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "tricky",
      args: [["enqueue 4", "enqueue 4", "dequeue", "front"]],
      expected: [4],
      failureNote: "같은 번호가 줄에 둘 있을 수 있어요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from(
          { length: 1000 },
          (_, i) => ["enqueue " + (i + 1), "front", "enqueue " + (i + 2), "back", "dequeue"][i % 5],
        ),
      ],
      // prettier-ignore
      expected: [1,4,4,9,6,14,9,19,11,24,14,29,16,34,19,39,21,44,24,49,26,54,29,59,31,64,34,69,36,74,39,79,41,84,44,89,46,94,49,99,51,104,54,109,56,114,59,119,61,124,64,129,66,134,69,139,71,144,74,149,76,154,79,159,81,164,84,169,86,174,89,179,91,184,94,189,96,194,99,199,101,204,104,209,106,214,109,219,111,224,114,229,116,234,119,239,121,244,124,249,126,254,129,259,131,264,134,269,136,274,139,279,141,284,144,289,146,294,149,299,151,304,154,309,156,314,159,319,161,324,164,329,166,334,169,339,171,344,174,349,176,354,179,359,181,364,184,369,186,374,189,379,191,384,194,389,196,394,199,399,201,404,204,409,206,414,209,419,211,424,214,429,216,434,219,439,221,444,224,449,226,454,229,459,231,464,234,469,236,474,239,479,241,484,244,489,246,494,249,499,251,504,254,509,256,514,259,519,261,524,264,529,266,534,269,539,271,544,274,549,276,554,279,559,281,564,284,569,286,574,289,579,291,584,294,589,296,594,299,599,301,604,304,609,306,614,309,619,311,624,314,629,316,634,319,639,321,644,324,649,326,654,329,659,331,664,334,669,336,674,339,679,341,684,344,689,346,694,349,699,351,704,354,709,356,714,359,719,361,724,364,729,366,734,369,739,371,744,374,749,376,754,379,759,381,764,384,769,386,774,389,779,391,784,394,789,396,794,399,799,401,804,404,809,406,814,409,819,411,824,414,829,416,834,419,839,421,844,424,849,426,854,429,859,431,864,434,869,436,874,439,879,441,884,444,889,446,894,449,899,451,904,454,909,456,914,459,919,461,924,464,929,466,934,469,939,471,944,474,949,476,954,479,959,481,964,484,969,486,974,489,979,491,984,494,989,496,994,499,999],
      failureNote: "명령이 1,000개예요.",
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
      title: "어떤 구조일까요?",
      body: ["뒤로 서고 앞에서 입장하는 **큐**예요. front는 맨 앞 보기, back은 맨 뒤 보기예요 (꺼내지 않아요)."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 큐를 준비해요 (Python `deque`, JS는 배열 + head 번호).",
        "2. front는 큐의 첫 원소, back은 마지막 원소를 기록해요.",
        "3. 비어 있는지 먼저 확인하고, 비었으면 -1을 기록해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for 명령 in commands:",
        "    enqueue x → 뒤에 x 추가",
        "    dequeue   → 비어 있지 않으면 앞에서 제거",
        "    front     → 기록(비었으면 -1, 아니면 맨 앞)",
        "    back      → 기록(비었으면 -1, 아니면 맨 뒤)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["front와 back 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            'elif name == "front":',
            "    answer.append(line[0] if line else -1)",
            'elif name == "back":',
            "    answer.append(______ if line else -1)",
          ].join("\n"),
          javascript: [
            '} else if (name === "front") {',
            "  answer.push(head < line.length ? line[head] : -1);",
            '} else if (name === "back") {',
            "  answer.push(head < line.length ? ______ : -1);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["queue-simulation"],
  signalIds: ["sig-arrival-order"],
  visualization: {
    presets: [
      problemPreset("front-back-ex1", "queue-basic", "예제 1 흐름", "front 쪽에서 나가고 rear 쪽으로 들어와요.", [
        ["enqueue 3", "enqueue 8", "peek", "dequeue", "peek"],
      ]),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
