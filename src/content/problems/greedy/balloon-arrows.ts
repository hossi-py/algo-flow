import type { Problem } from "@/types/content";

export const greedyBalloonArrows: Problem = {
  id: "c:greedy-balloon-arrows",
  slug: "greedy-balloon-arrows",
  source: "curated",
  topic: "greedy",
  level: 3,
  title: "풍선 터뜨리기",
  summary: "오른쪽 끝이 빠른 풍선부터, 그 오른쪽 끝에 화살을 쏴요",
  statement: [
    "벽에 풍선이 붙어 있어요. i번 풍선은 가로로 `l`부터 `r`까지(양 끝 포함) 차지해요. 가로 위치 x에서 위로 화살을 쏘면 `l ≤ x ≤ r`인 풍선이 모두 터져요.",
    "",
    "모든 풍선을 터뜨리는 데 필요한 **화살의 최소 개수**를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`balloons`: `[l, r]` 풍선들이에요.",
  outputFormat: "화살의 최소 개수",
  constraints: ["1 ≤ balloons의 길이 ≤ 100,000", "0 ≤ l ≤ r ≤ 2,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "balloons",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "풍선들",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최소 화살 수" },
  },
  starterCode: {
    python: ["def solution(balloons):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(balloons) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[][] balloons) {",
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
          [10, 16],
          [2, 8],
          [1, 6],
          [7, 12],
        ],
      ],
      expected: 2,
      explanation: "x = 6에서 [2, 8]과 [1, 6], x = 12에서 나머지 둘을 터뜨려 2개예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      ],
      expected: 3,
      explanation: "하나도 안 겹쳐서 3개예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [1, 2],
          [2, 3],
        ],
      ],
      expected: 1,
      failureNote: "끝이 딱 닿으면(x = 2) 한 번에 둘 다 터져요. 1개예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [[[5, 5]]],
      expected: 1,
      failureNote: "점 하나짜리 풍선도 화살 1개예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [1, 10],
          [2, 3],
          [4, 5],
        ],
      ],
      expected: 2,
      failureNote: "[1, 10]과 [2, 3]을 x = 3에서, [4, 5]를 x = 5에서 터뜨려 2개예요. 시작 순으로 보면 헷갈려요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => {
          const l = (i * 104729) % 1000000;
          return [l, l + ((i * 13) % 300)];
        }),
      ],
      expected: 6891,
      failureNote: "풍선 10만 개예요.",
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
      body: ["'모두 덮는 **최소 몇 개**' → 오른쪽 끝 순서로 정렬하는 **구간 그리디**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 풍선을 **오른쪽 끝** 순으로 정렬해요.",
        "2. 아직 안 터진 풍선 중 오른쪽 끝이 가장 빠른 풍선은 반드시 터뜨려야 해요. 그 **오른쪽 끝**에 쏘면 겹친 풍선을 가장 많이 함께 터뜨려요.",
        "3. 다음 풍선의 왼쪽 끝이 마지막 화살 위치보다 **크면** 새 화살이 필요해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "balloons를 r 순으로 정렬",
        "arrow = -무한대, count = 0",
        "for l, r in balloons:",
        "    if l > arrow: count += 1; arrow = r",
        "return count",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["새 화살이 필요한 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for l, r in sorted(balloons, key=lambda b: b[1]):",
            "    if ______:",
            "        count += 1",
            "        arrow = r",
          ].join("\n"),
          javascript: [
            "for (const [l, r] of [...balloons].sort((a, b) => a[1] - b[1])) {",
            "  if (______) {",
            "    count++;",
            "    arrow = r;",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int[] b : sorted) {",
            "    if (______) {",
            "        count++;",
            "        arrow = b[1];",
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
  estimatedMinutes: 15,
  xp: 30,
};
