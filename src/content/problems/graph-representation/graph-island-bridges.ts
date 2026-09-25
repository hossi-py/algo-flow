import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const graphIslandBridges: Problem = {
  id: "c:graph-island-bridges",
  slug: "graph-island-bridges",
  source: "curated",
  topic: "graph-representation",
  level: 1,
  title: "섬 사이 다리 세기",
  summary: "섬마다 이어진 섬 목록을 보고 다리가 모두 몇 개인지 세요",
  statement: [
    "노디의 바다에는 섬이 `n`개 있고, 0번부터 `n-1`번까지 번호가 있어요. 섬 사이에는 양쪽으로 건널 수 있는 다리가 놓여 있어요.",
    "",
    "섬마다 다리로 **바로 이어진 섬 목록**이 `neighbors`로 주어져요. `neighbors[i]`는 i번 섬과 다리로 이어진 섬들의 번호예요.",
    "",
    "바다에 놓인 다리가 **모두 몇 개**인지 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`neighbors`: i번째 원소가 i번 섬과 이어진 섬 번호 리스트인 리스트예요.",
  outputFormat: "다리의 개수 (정수)",
  constraints: [
    "1 ≤ n ≤ 1,000",
    "다리는 양쪽으로 건널 수 있어서, a가 neighbors[b]에 있으면 b도 neighbors[a]에 있어요",
    "같은 두 섬 사이에 다리가 두 개 놓이지 않고, 자기 자신으로 가는 다리도 없어요",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "neighbors",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "섬마다 이어진 섬 목록",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "다리의 개수" },
  },
  starterCode: {
    python: ["def solution(neighbors):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(neighbors) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[][] neighbors) {",
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
      args: [[[1, 2], [0], [0]]],
      expected: 2,
      explanation:
        "0–1, 0–2 다리 두 개예요. 목록에는 번호가 4번 나오지만, 다리 하나가 양쪽 섬 목록에 한 번씩 적혀서 그래요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[[]]],
      expected: 0,
      explanation: "섬이 하나뿐이고 다리가 없어요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [[[1], [0]]],
      expected: 1,
      failureNote: "다리 하나가 두 번 적혀 있어요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [1, 2, 3],
          [0, 2, 3],
          [0, 1, 3],
          [0, 1, 2],
        ],
      ],
      expected: 6,
      failureNote: "섬 4개가 모두 서로 이어져 있어요. 목록 길이의 합 12를 그대로 쓰면 안 돼요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "edge",
      args: [[[], [2], [1], []]],
      expected: 1,
      failureNote: "다리가 없는 섬이 섞여 있어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 1000 }, (_, i) => Array.from({ length: 1000 }, (_, j) => j).filter((j) => j !== i))],
      expected: 499500,
      failureNote: "섬 1,000개가 모두 서로 이어져 있어요.",
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
        "섬은 **노드**, 다리는 **간선**이에요. 섬마다 이어진 섬 목록이 곧 **인접 리스트**예요.",
        "",
        "양쪽으로 건널 수 있는 다리는 **무방향 간선**이에요. 무방향 그래프의 인접 리스트에는 간선 하나가 **양쪽 노드에 한 번씩**, 모두 두 번 적혀요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 모든 섬의 목록 길이를 더해요. 목록 길이는 그 섬의 **차수**(이어진 다리 수)예요.",
        "2. 다리 하나가 두 번씩 세어졌으니 합을 **2로 나눠요**.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "total = 0",
        "for 목록 in neighbors:",
        "    total += 목록의 길이",
        "return total / 2",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["차수를 모두 더한 다음에 해야 할 일이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["total = 0", "for islands in neighbors:", "    total += len(islands)", "return ______"].join("\n"),
          javascript: [
            "let total = 0;",
            "for (const islands of neighbors) total += islands.length;",
            "return ______;",
          ].join("\n"),
          java: ["int total = 0;", "for (int[] islands : neighbors) total += islands.length;", "return ______;"].join(
            "\n",
          ),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["adjacency-list", "degree-count"],
  signalIds: ["sig-degree"],
  visualization: {
    presets: [
      problemPreset(
        "island-bridges-ex1",
        "graph-adjacency",
        "예제 1",
        "간선 0–1을 넣으면 0번 목록과 1번 목록에 모두 적혀요. 무방향 간선은 두 번 적혀요.",
        [
          3,
          [
            [0, 1],
            [0, 2],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
