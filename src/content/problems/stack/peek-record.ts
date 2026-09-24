import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const stackPeekRecord: Problem = {
  id: "c:stack-peek-record",
  slug: "stack-peek-record",
  source: "curated",
  topic: "stack",
  level: 1,
  title: "맨 위 엿보기",
  summary: "peek 명령이 나올 때마다 맨 위 값을 기록해요",
  statement: [
    '노디는 책을 한 권씩 쌓아 올리며 정리하고 있어요. 친구가 가끔 "지금 맨 위 책이 뭐야?" 하고 물어봐요.',
    "",
    '- `"push x"`: 번호가 x인 책을 맨 위에 올려요.',
    '- `"pop"`: 맨 위 책을 치워요. 책이 없으면 아무 일도 없어요.',
    '- `"peek"`: 맨 위 책 번호를 **보기만** 하고 기록해요. 책이 없으면 `-1`을 기록해요.',
    "",
    '명령을 순서대로 실행하면서, `"peek"` 때마다 기록한 값을 차례로 담은 리스트를 반환해 주세요.',
  ].join("\n"),
  inputFormat: '`commands`: `"push x"`, `"pop"`, `"peek"` 문자열의 리스트예요.',
  outputFormat: "peek 결과를 순서대로 담은 리스트. peek이 없으면 빈 리스트예요.",
  constraints: ["1 ≤ commands의 길이 ≤ 1,000", "1 ≤ x ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "commands",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "명령 목록",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" }, description: "peek 기록" },
  },
  starterCode: {
    python: ["def solution(commands):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(commands) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(String[] commands) {",
      "        List<Integer> answer = new ArrayList<>();",
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
      args: [["push 4", "peek", "push 9", "peek", "pop", "peek"]],
      expected: [4, 9, 4],
      explanation: "9를 치우면 다시 4가 맨 위예요. 기록은 [4, 9, 4].",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [["peek", "pop", "push 2", "pop", "peek"]],
      expected: [-1, -1],
      explanation: "책이 없을 때 peek은 -1을 기록해요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [["push 1", "push 2"]],
      expected: [],
      failureNote: "peek이 한 번도 없으면 빈 리스트예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [["push 5", "peek", "peek", "peek"]],
      expected: [5, 5, 5],
      failureNote: "peek은 꺼내지 않아요. 여러 번 해도 같은 값이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [["push 1", "push 2", "push 3", "pop", "pop", "peek", "pop", "peek"]],
      expected: [1, -1],
      failureNote: "하나씩 치우며 맨 위가 바뀌어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "edge",
      args: [["pop", "pop", "peek"]],
      expected: [-1],
      failureNote: "빈 상태의 pop과 peek이에요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 999 }, (_, i) => ["push " + (i + 1), "peek", "pop"][i % 3])],
      // prettier-ignore
      expected: [1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,145,148,151,154,157,160,163,166,169,172,175,178,181,184,187,190,193,196,199,202,205,208,211,214,217,220,223,226,229,232,235,238,241,244,247,250,253,256,259,262,265,268,271,274,277,280,283,286,289,292,295,298,301,304,307,310,313,316,319,322,325,328,331,334,337,340,343,346,349,352,355,358,361,364,367,370,373,376,379,382,385,388,391,394,397,400,403,406,409,412,415,418,421,424,427,430,433,436,439,442,445,448,451,454,457,460,463,466,469,472,475,478,481,484,487,490,493,496,499,502,505,508,511,514,517,520,523,526,529,532,535,538,541,544,547,550,553,556,559,562,565,568,571,574,577,580,583,586,589,592,595,598,601,604,607,610,613,616,619,622,625,628,631,634,637,640,643,646,649,652,655,658,661,664,667,670,673,676,679,682,685,688,691,694,697,700,703,706,709,712,715,718,721,724,727,730,733,736,739,742,745,748,751,754,757,760,763,766,769,772,775,778,781,784,787,790,793,796,799,802,805,808,811,814,817,820,823,826,829,832,835,838,841,844,847,850,853,856,859,862,865,868,871,874,877,880,883,886,889,892,895,898,901,904,907,910,913,916,919,922,925,928,931,934,937,940,943,946,949,952,955,958,961,964,967,970,973,976,979,982,985,988,991,994,997],
      failureNote: "명령이 999개예요.",
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
      body: [
        "맨 위에만 올리고, 맨 위에서만 치우고, 맨 위만 확인해요 → **스택**이에요.",
        "",
        '"맨 위 책이 뭐야?"가 바로 **peek**(꺼내지 않고 보기)이에요.',
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 리스트 `stack`과 결과 리스트 `answer`를 준비해요.",
        "2. push → 끝에 추가, pop → 비어 있지 않으면 끝에서 제거.",
        "3. peek → 비어 있으면 -1, 아니면 **끝 값**을 answer에 추가해요. 이때 stack은 바꾸지 않아요.",
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
        "    push x → stack에 x 추가",
        "    pop    → stack이 비어 있지 않으면 끝 값 제거",
        "    peek   → answer에 (stack이 비었으면 -1, 아니면 stack의 끝 값) 추가",
        "return answer",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드: peek",
      body: ["peek은 꺼내지 않고 **보기만** 해요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ['elif parts[0] == "peek":', "    answer.append(______ if stack else -1)"].join("\n"),
          javascript: ['} else if (name === "peek") {', "  answer.push(stack.length > 0 ? ______ : -1);", "}"].join(
            "\n",
          ),
          java: ['} else if (parts[0].equals("peek")) {', "    answer.add(stack.isEmpty() ? -1 : ______);", "}"].join(
            "\n",
          ),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["stack-simulation"],
  signalIds: ["sig-latest-first"],
  visualization: {
    presets: [
      problemPreset("peek-record-ex1", "stack-basic", "예제 1", "peek은 꺼내지 않고 맨 위만 확인해요.", [
        ["push 4", "peek", "push 9", "peek", "pop", "peek"],
      ]),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
