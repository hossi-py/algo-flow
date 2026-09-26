import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      4,
      [
        [0, 1],
        [1, 2],
        [2, 1],
        [0, 3],
      ],
    ],
    expected: 2,
    explanation: "1·2번은 서로를 기다려서 못 해요. 0·3번만 끝내서 2예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [
      3,
      [
        [0, 1],
        [1, 2],
      ],
    ],
    expected: 3,
    explanation: "0 → 1 → 2 순서로 모두 끝내요: 3.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [
      3,
      [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    ],
    expected: 0,
    failureNote: "셋이 고리라 하나도 못 해요: 0.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      5,
      [
        [0, 1],
        [1, 0],
        [1, 2],
        [3, 4],
      ],
    ],
    expected: 2,
    failureNote: "2번은 고리에 묶인 1번을 기다려서 못 해요. 3·4번만 돼서 2예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [2, []],
    expected: 2,
    failureNote: "조건이 없으면 모두 돼요: 2.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      50000,
      [
        ...Array.from({ length: 49999 }, (_, i) => [i, i + 1]),
        ...Array.from({ length: 100000 }, (_, i) => {
          const a = (i * 7919) % 49999;
          return [a, a + 1 + ((i * 104729) % (49999 - a))];
        }),
        [30000, 10000],
      ],
    ],
    expected: 10000,
    failureNote: "과제 5만 개예요. 10000번부터 고리에 걸려 앞의 1만 개만 끝내요.",
  },
]);

export const topoCanFinish: Problem = {
  id: "c:topo-can-finish",
  slug: "topo-can-finish",
  source: "curated",
  topic: "graph-advanced",
  level: 4,
  title: "끝낼 수 있는 과제는 몇 개?",
  summary: "위상 정렬로 꺼낸 과제만 끝낼 수 있어요. 고리에 묶이거나 그 뒤에 있는 과제는 못 꺼내요",
  statement: [
    "과제 `n`개와 조건 `prereqs`가 있어요. `[a, b]`는 **a번을 끝내야 b번을 시작할 수 있다**는 뜻이에요.",
    "",
    "조건이 꼬여서 영원히 시작할 수 없는 과제가 있을 수 있어요. **끝낼 수 있는 과제**는 몇 개인지 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 과제 수, `prereqs`: `[a, b]` 조건이에요.",
  outputFormat: "끝낼 수 있는 과제 수",
  constraints: ["1 ≤ n ≤ 50,000", "0 ≤ prereqs의 길이 ≤ 150,000", "0 ≤ a, b < n, a ≠ b"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "과제 수" },
      {
        name: "prereqs",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[먼저, 나중] 조건",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "끝낼 수 있는 과제 수" },
  },
  starterCode: {
    python: ["def solution(n, prereqs):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, prereqs) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n, int[][] prereqs) {",
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
      body: [
        "'a를 끝내야 b를 시작' → **위상 정렬**이에요. 끝까지 꺼내지 못한 과제가 고리 때문에 못 하는 과제예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "칸 알고리즘을 그대로 돌리며 **꺼낸 과제 수**를 세요.",
        "",
        "고리 안의 과제는 진입 차수가 끝까지 0이 되지 않아요. 고리 뒤에 있는 과제도 고리 안의 과제를 기다리니 마찬가지예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "queue = [진입 차수가 0인 과제들];  done = 0",
        "while queue:",
        "    v = queue.popleft();  done += 1",
        "    for w in graph[v]:",
        "        indeg[w] -= 1",
        "        if indeg[w] == 0: queue.append(w)",
        "return done",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["꺼낸 과제를 세는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "while queue:",
            "    v = queue.popleft()",
            "    done += 1",
            "    for w in graph[v]:",
            "        indeg[w] -= 1",
            "        if indeg[w] == 0:",
            "            ______",
          ].join("\n"),
          javascript: [
            "for (let head = 0; head < queue.length; head++) {",
            "  const v = queue[head];",
            "  for (const w of graph[v]) {",
            "    if (--indeg[w] === 0) ______;",
            "  }",
            "}",
            "return queue.length;",
          ].join("\n"),
          java: [
            "while (!queue.isEmpty()) {",
            "    int v = queue.poll();",
            "    done++;",
            "    for (int w : graph.get(v)) {",
            "        if (--indeg[w] == 0) ______;",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["topological-sort"],
  signalIds: ["sig-prerequisites"],
  visualization: {
    presets: [
      problemPreset(
        "topo-can-finish-ex1",
        "topo-kahn",
        "고리에 묶인 과제",
        "0번과 3번은 꺼내지만, 1·2번은 서로를 기다려서 진입 차수가 끝까지 0이 되지 않아요.",
        [
          4,
          [
            [0, 1],
            [1, 2],
            [2, 1],
            [0, 3],
          ],
        ],
      ),
    ],
  },
  estimatedMinutes: 15,
  xp: 40,
};
