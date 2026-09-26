import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [100, 200],
        [200, 1300],
        [1000, 1250],
        [2000, 3200],
      ],
    ],
    expected: 3,
    explanation: "100일, 1000일, 200일 수업을 들으면 1300일에 끝나서 3개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[[1, 2]]],
    expected: 1,
    explanation: "하나를 들을 수 있어요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [
      [
        [3, 2],
        [4, 3],
      ],
    ],
    expected: 0,
    failureNote: "둘 다 마감 전에 못 끝내요. 0이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        [5, 5],
        [4, 6],
        [2, 6],
      ],
    ],
    expected: 2,
    failureNote:
      "5일 수업 대신 4일·2일 수업 두 개를 들으면 6일에 끝나요. 2개예요. 긴 수업을 빼고 짧은 수업으로 바꿔야 해요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        [1, 2],
        [2, 3],
      ],
    ],
    expected: 2,
    failureNote: "1 + 2 = 3일에 끝나서 2개예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => [((i * 7919) % 100) + 1, ((i * 104729) % 1000000) + 1])],
    expected: 44222,
    failureNote: "수업 10만 개예요. 고르는 방법을 모두 해 보면 불가능해요.",
  },
]);

export const heapCoursePlan: Problem = {
  id: "c:heap-course-plan",
  slug: "heap-course-plan",
  source: "curated",
  topic: "heap",
  level: 5,
  title: "마감 안에 최대한 많은 수업",
  summary: "마감 순으로 듣다가 넘치면, 들은 수업 중 가장 긴 것을 빼요",
  statement: [
    "숲속 학교의 수업 `courses[i] = [걸리는 날, 마감일]`이 있어요. 수업은 1일부터 하나씩 **이어서** 듣고, 한 수업은 시작하면 끝날 때까지 들어요. 수업을 **마감일까지 끝내야** 인정돼요.",
    "",
    "인정받을 수 있는 수업의 **최대 개수**를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`courses`: `[걸리는 날, 마감일]` 목록이에요.",
  outputFormat: "최대 수업 수",
  constraints: ["1 ≤ courses의 길이 ≤ 100,000", "1 ≤ 걸리는 날, 마감일 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "courses",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "수업 목록",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 수업 수" },
  },
  starterCode: {
    python: ["def solution(courses):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(courses) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[][] courses) {",
      "        int answer = 0;",
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
      body: ["마감 순으로 욕심껏 듣다가, 넘치면 **들은 것 중 가장 긴 것**을 빼요 → 그리디 + **최대 힙**이에요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 수업을 **마감일** 순으로 정렬해요.",
        "2. 하나씩 들어요: 힙에 걸리는 날을 넣고, 총 날짜를 더해요.",
        "3. 총 날짜가 이번 마감일을 넘으면, 들은 수업 중 **가장 긴** 것을 빼요 (힙에서 꺼내고 날짜에서 빼기).",
        "4. 힙에 남은 개수가 답이에요.",
        "",
        "가장 긴 것을 빼면 개수는 그대로(또는 하나 줄고) 남은 날이 가장 많이 늘어서 뒤 수업에 유리해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "courses를 마감일 순으로 정렬; time = 0; h = 빈 최대 힙",
        "for d, last in courses:",
        "    push(d); time += d",
        "    if time > last: time -= pop()     # 가장 긴 수업 빼기",
        "return 힙 크기",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["마감을 넘었을 때의 처리예요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for d, last in sorted(courses, key=lambda c: c[1]):",
            "    heapq.heappush(h, -d)",
            "    time += d",
            "    if time > last:",
            "        time -= ______",
            "return len(h)",
          ].join("\n"),
          javascript: [
            "for (const [d, last] of sorted) {",
            "  h.push(d);",
            "  time += d;",
            "  if (time > last) time -= ______;",
            "}",
            "return h.size;",
          ].join("\n"),
          java: [
            "for (int[] c : sorted) {",
            "    h.offer(c[0]);",
            "    time += c[0];",
            "    if (time > c[1]) time -= ______;",
            "}",
            "return h.size();",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["heap-scheduling"],
  signalIds: ["sig-repeated-min", "sig-greedy-local-best"],
  estimatedMinutes: 30,
  xp: 50,
};
