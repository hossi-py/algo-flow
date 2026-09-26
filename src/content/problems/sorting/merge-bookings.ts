import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        [8, 10],
        [1, 3],
        [2, 6],
        [15, 18],
      ],
    ],
    expected: [
      [1, 6],
      [8, 10],
      [15, 18],
    ],
    explanation: "[1, 3]과 [2, 6]이 겹쳐서 [1, 6]이 돼요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [
      [
        [1, 4],
        [4, 5],
      ],
    ],
    expected: [[1, 5]],
    explanation: "끝(4)과 시작(4)이 같으면 이어서 [1, 5]예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[[3, 7]]],
    expected: [[3, 7]],
    failureNote: "하나면 그대로예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        [1, 10],
        [2, 3],
        [4, 5],
      ],
    ],
    expected: [[1, 10]],
    failureNote: "[1, 10] 안에 다른 예약이 쏙 들어가요. 끝은 max로 늘려야 해요. 뒤 예약의 끝으로 바꾸면 줄어들어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        [5, 6],
        [1, 2],
        [3, 4],
      ],
    ],
    expected: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    failureNote: "겹치는 게 없어도 시작 순으로 정렬해서 돌려줘요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        [2, 3],
        [2, 5],
        [1, 2],
      ],
    ],
    expected: [[1, 5]],
    failureNote: "셋이 모두 이어져서 [1, 5] 하나예요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => [3 * (99999 - i), 3 * (99999 - i) + 3])],
    expected: [[0, 300000]],
    failureNote:
      "예약 10만 개가 꼬리를 물고 이어져 [0, 300000] 하나가 돼요. 예약마다 모든 예약과 비교하면 시간 초과예요.",
  },
]);

export const sortingMergeBookings: Problem = {
  id: "c:sorting-merge-bookings",
  slug: "sorting-merge-bookings",
  source: "curated",
  topic: "sorting",
  level: 4,
  title: "겹치는 예약 합치기",
  summary: "시작 시각 순으로 정렬하고, 겹치면 끝 시각을 늘려 가요",
  statement: [
    "숲속 캠핑장 예약이 `[시작, 끝]` 모양으로 주어져요. 순서는 뒤죽박죽이에요.",
    "",
    "겹치는 예약을 하나로 합쳐서, 시작 시각 순으로 담은 리스트를 반환해 주세요. 한 예약의 **끝과 다음 예약의 시작이 같아도** 이어진 것으로 보고 합쳐요.",
  ].join("\n"),
  inputFormat: "`bookings`: `[시작, 끝]` 예약 리스트예요.",
  outputFormat: "합친 예약들을 시작 시각 순으로 담은 리스트",
  constraints: ["1 ≤ bookings의 길이 ≤ 100,000", "0 ≤ 시작 < 끝 ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "bookings",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "예약들",
      },
    ],
    returns: {
      type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
      description: "합친 예약들",
    },
  },
  starterCode: {
    python: ["def solution(bookings):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(bookings) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[][] solution(int[][] bookings) {",
      "        int[][] answer = new int[0][];",
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
      body: ["'**시작과 끝이 있는 구간**이 겹치면 합치기' → 시작 순 **구간 정렬**이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "시작 순으로 정렬하면, 지금 예약과 겹칠 수 있는 건 **바로 앞에서 합친 예약**뿐이에요.",
        "",
        "1. 예약을 시작 시각 순으로 정렬해요.",
        "2. 결과의 마지막 예약 끝 ≥ 지금 시작이면 겹쳐요 → 마지막 끝을 `max(마지막 끝, 지금 끝)`으로 늘려요.",
        "3. 아니면 지금 예약을 결과에 새로 붙여요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "bookings를 시작 순으로 정렬",
        "out = []",
        "for s, e in bookings:",
        "    if out이 있고 out[-1].끝 >= s: out[-1].끝 = max(out[-1].끝, e)",
        "    else: out에 [s, e] 추가",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["겹칠 때 끝을 늘리는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for s, e in sorted(bookings):",
            "    if out and out[-1][1] >= s:",
            "        out[-1][1] = ______",
            "    else:",
            "        out.append([s, e])",
          ].join("\n"),
          javascript: [
            "const sorted = [...bookings].sort((a, b) => a[0] - b[0]);",
            "for (const [s, e] of sorted) {",
            "  const last = out[out.length - 1];",
            "  if (last && last[1] >= s) last[1] = ______;",
            "  else out.push([s, e]);",
            "}",
          ].join("\n"),
          java: [
            "for (int[] b : sorted) {",
            "    if (!out.isEmpty() && out.get(out.size() - 1)[1] >= b[0]) {",
            "        int[] last = out.get(out.size() - 1);",
            "        last[1] = ______;",
            "    } else {",
            "        out.add(new int[] {b[0], b[1]});",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["interval-sweep"],
  signalIds: ["sig-intervals"],
  estimatedMinutes: 18,
  xp: 40,
};
