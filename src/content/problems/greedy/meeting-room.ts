import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const greedyMeetingRoom: Problem = {
  id: "c:greedy-meeting-room",
  slug: "greedy-meeting-room",
  source: "curated",
  topic: "greedy",
  level: 3,
  title: "회의실 하나로 최대한 많이",
  summary: "끝나는 시각이 빠른 회의부터 고르면 남는 시간이 가장 넉넉해요",
  statement: [
    "숲속 마을 회관에 회의실이 **하나**뿐이에요. 회의 요청 `meetings`는 `[시작, 끝]` 모양이고, 회의실은 한 번에 한 회의만 열 수 있어요.",
    "",
    "한 회의가 끝나는 시각에 다음 회의가 바로 시작해도 괜찮아요. 열 수 있는 회의의 **최대 개수**를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`meetings`: `[시작, 끝]` 회의 요청들이에요.",
  outputFormat: "열 수 있는 회의의 최대 개수",
  constraints: ["1 ≤ meetings의 길이 ≤ 100,000", "0 ≤ 시작 < 끝 ≤ 2,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "meetings",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "회의 요청",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 개수" },
  },
  starterCode: {
    python: ["def solution(meetings):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(meetings) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[][] meetings) {",
      "        int answer = 0;",
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
        [
          [1, 4],
          [3, 5],
          [0, 6],
          [5, 7],
          [3, 9],
          [5, 9],
          [6, 10],
          [8, 11],
        ],
      ],
      expected: 3,
      explanation: "[1, 4], [5, 7], [8, 11]로 3개예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "tricky",
      args: [
        [
          [1, 3],
          [3, 5],
          [5, 7],
        ],
      ],
      expected: 3,
      explanation: "끝나는 시각에 바로 시작해도 돼서 3개 모두 열어요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[[2, 9]]],
      expected: 1,
      failureNote: "하나면 1개예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [0, 10],
          [1, 2],
          [3, 4],
        ],
      ],
      expected: 2,
      failureNote: "가장 먼저 시작하는 [0, 10]을 고르면 1개뿐이에요. 끝나는 시각 순이면 [1, 2], [3, 4]로 2개예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [1, 5],
          [4, 7],
          [6, 10],
        ],
      ],
      expected: 2,
      failureNote: "가장 짧은 [4, 7]을 고르면 1개뿐이에요. [1, 5], [6, 10]으로 2개예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => {
          const s = (i * 7919) % 1000000;
          return [s, s + 1 + ((i * 37) % 500)];
        }),
      ],
      expected: 12643,
      failureNote: "회의 10만 개예요. 고르는 방법을 모두 해 보는 건 불가능해요.",
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
      body: ["'겹치지 않게 **최대 몇 개**' → **끝나는 시각 순** 구간 고르기 그리디예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 회의를 **끝나는 시각** 순으로 정렬해요. (같으면 시작 순)",
        "2. 마지막으로 고른 회의가 끝난 시각 `last_end`를 들고, 시작이 `last_end` 이상인 회의를 만나면 골라요.",
        "",
        "일찍 끝나는 회의를 고르면 남는 시간이 가장 넉넉해서, 다른 회의를 골라 더 좋아질 수 없어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "meetings를 (끝, 시작) 순으로 정렬",
        "last_end = -무한대, count = 0",
        "for s, e in meetings:",
        "    if s >= last_end: count += 1; last_end = e",
        "return count",
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
          python: [
            "meetings.sort(key=lambda m: ______)",
            "for s, e in meetings:",
            "    if s >= last_end:",
            "        count += 1",
            "        last_end = e",
          ].join("\n"),
          javascript: [
            "const sorted = [...meetings].sort((a, b) => ______);",
            "for (const [s, e] of sorted) {",
            "  if (s >= lastEnd) {",
            "    count++;",
            "    lastEnd = e;",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "int[][] sorted = meetings.clone();",
            "Arrays.sort(sorted, (a, b) -> ______);",
            "for (int[] m : sorted) {",
            "    if (m[0] >= lastEnd) {",
            "        count++;",
            "        lastEnd = m[1];",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["interval-scheduling"],
  signalIds: ["sig-interval-max-count"],
  visualization: {
    presets: [
      problemPreset(
        "greedy-meeting-room-ex1",
        "greedy-intervals",
        "끝나는 시각 순으로 고르기",
        "앞 회의와 겹치지 않으면 고르고, 겹치면 건너뛰어요.",
        [
          [
            [1, 4],
            [3, 5],
            [0, 6],
            [5, 7],
            [3, 9],
            [5, 9],
            [6, 10],
            [8, 11],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 15,
  xp: 30,
};
