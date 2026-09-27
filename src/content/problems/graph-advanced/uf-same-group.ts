import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      4,
      [
        [0, 0, 1],
        [1, 0, 1],
        [1, 0, 2],
        [0, 1, 2],
        [1, 0, 2],
      ],
    ],
    expected: ["YES", "NO", "YES"],
    explanation: "0·1을 합친 뒤 0과 1은 같고, 0과 2는 달라요. 1·2를 합치면 0과 2도 같아져요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [3, [[1, 2, 2]]],
    expected: ["YES"],
    explanation: "자기 자신과는 늘 같은 동아리예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      5,
      [
        [0, 0, 1],
        [0, 2, 3],
        [1, 1, 3],
        [0, 1, 2],
        [1, 0, 3],
        [1, 4, 0],
      ],
    ],
    expected: ["NO", "YES", "NO"],
    failureNote: "1과 3은 처음엔 달라요. 1·2를 합치면 {0, 1, 2, 3}이 한 동아리라 0과 3은 같아요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [
      3,
      [
        [1, 0, 1],
        [1, 1, 2],
      ],
    ],
    expected: ["NO", "NO"],
    failureNote: "합친 적이 없으면 모두 달라요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      2,
      [
        [0, 0, 1],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
    expected: ["YES"],
    failureNote: "이미 합친 두 명을 또 합쳐도 괜찮아요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      50000,
      [
        ...Array.from({ length: 25000 }, (_, k) => [0, 2 * k, 2 * k + 1]),
        ...Array.from({ length: 49999 }, (_, i) => [1, i, i + 1]),
      ],
    ],
    expected: Array.from({ length: 49999 }, (_, i) => (i % 2 === 0 ? "YES" : "NO")),
    failureNote: "일이 7만 5천 개예요. 질문마다 그룹을 새로 찾으면 느려요.",
  },
]);

export const ufSameGroup: Problem = {
  id: "c:uf-same-group",
  slug: "uf-same-group",
  source: "curated",
  topic: "graph-advanced",
  level: 1,
  title: "같은 동아리인가요?",
  summary: "합치기와 질문이 섞여 들어와도, 대표가 같은지만 보면 돼요",
  statement: [
    "학생 `n`명이 있어요. `ops`에는 두 가지 일이 순서대로 적혀 있어요.",
    "",
    "- `[0, a, b]`: a번과 b번이 속한 동아리를 하나로 합쳐요.",
    "- `[1, a, b]`: a번과 b번이 지금 **같은 동아리인지** 물어요.",
    "",
    '질문마다 같으면 `"YES"`, 다르면 `"NO"`를 순서대로 담아 반환해 주세요.',
  ].join("\n"),
  inputFormat: "`n`: 학생 수, `ops`: `[종류, a, b]` 목록이에요.",
  outputFormat: '질문마다 "YES" 또는 "NO"',
  constraints: ["1 ≤ n ≤ 100,000", "1 ≤ ops의 길이 ≤ 200,000", "0 ≤ a, b < n (질문에서는 a = b일 수 있어요)"],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "학생 수" },
      {
        name: "ops",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "[종류, a, b] 목록",
      },
    ],
    returns: {
      type: { python: "list[str]", javascript: "string[]", java: "List<String>" },
      description: "질문마다 YES 또는 NO",
    },
  },
  starterCode: {
    python: ["def solution(n, ops):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, ops) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<String> solution(int n, int[][] ops) {",
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
      title: "어떤 유형일까요?",
      body: ["합치기와 '같은 그룹인가?' 질문이 섞여 계속 들어와요 → **유니온 파인드**예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "- `[0, a, b]`: union(a, b)",
        "- `[1, a, b]`: find(a)와 find(b)가 같으면 YES",
        "",
        "경로 압축과 크기로 합치기를 쓰면 일 하나가 사실상 O(1)이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for kind, a, b in ops:",
        "    if kind == 0: union(a, b)",
        '    else: answer.append("YES" if find(a) == find(b) else "NO")',
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["질문에 답하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for kind, a, b in ops:",
            "    if kind == 0:",
            "        union(a, b)",
            "    else:",
            '        answer.append("YES" if ______ else "NO")',
          ].join("\n"),
          javascript: [
            "for (const [kind, a, b] of ops) {",
            "  if (kind === 0) dsu.union(a, b);",
            '  else answer.push(______ ? "YES" : "NO");',
            "}",
          ].join("\n"),
          java: [
            "for (int[] op : ops) {",
            "    if (op[0] == 0) union(op[1], op[2]);",
            '    else answer.add(______ ? "YES" : "NO");',
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["union-find"],
  signalIds: ["sig-merge-groups"],
  estimatedMinutes: 12,
  xp: 10,
};
