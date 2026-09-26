import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const binarySearchCutoffCount: Problem = {
  id: "c:binary-search-cutoff-count",
  slug: "binary-search-cutoff-count",
  source: "curated",
  topic: "binary-search",
  level: 2,
  title: "합격선 넘은 학생 수",
  summary: "점수를 한 번 정렬하고, 질문마다 'q 이상인 첫 위치'를 찾아요",
  statement: [
    "숲속 학교 시험 점수 `scores`가 있어요. 선생님이 합격선을 여러 번 바꿔 보며 물어봐요.",
    "",
    "합격선 `queries`마다 **그 점수 이상**을 받은 학생 수를 차례로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`scores`: 학생들의 점수(순서 없음), `queries`: 합격선들이에요.",
  outputFormat: "합격선마다 합격한 학생 수",
  constraints: ["1 ≤ scores의 길이 ≤ 100,000", "1 ≤ queries의 길이 ≤ 100,000", "0 ≤ 점수, 합격선 ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      { name: "scores", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "점수" },
      { name: "queries", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "합격선" },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "합격한 학생 수" },
  },
  starterCode: {
    python: ["def solution(scores, queries):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(scores, queries) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] scores, int[] queries) {",
      "        int[] answer = new int[queries.length];",
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
        [70, 95, 60, 85, 70],
        [70, 90, 100],
      ],
      expected: [4, 1, 0],
      explanation: "70점 이상은 4명(70이 두 명), 90점 이상은 1명, 100점 이상은 0명이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[50], [0, 50, 51]],
      expected: [1, 1, 0],
      explanation: "합격선이 점수와 같으면 합격이에요 (이상).",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [4, 4, 4, 4],
        [4, 5, 3],
      ],
      expected: [4, 0, 4],
      failureNote: "같은 점수가 많을 때 '4 이상인 첫 위치'를 찾아야 해요. 아무 4나 찾으면 개수가 틀려요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [
        [10, 20, 30],
        [15, 25, 35, 5],
      ],
      expected: [2, 1, 0, 3],
      failureNote: "2명, 1명, 0명, 3명이에요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "edge",
      args: [[1, 2, 3], [0]],
      expected: [3],
      failureNote: "합격선이 모든 점수보다 낮으면 전원 합격이에요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [
        Array.from({ length: 100000 }, (_, i) => (i * 37) % 101),
        Array.from({ length: 100000 }, (_, i) => (i * 13) % 102),
      ],
      expected: (() => {
        const s = Array.from({ length: 100000 }, (_, i) => (i * 37) % 101);
        const cnt = Array(103).fill(0);
        for (const x of s) cnt[x]++;
        const atLeast = Array(103).fill(0);
        for (let v = 101; v >= 0; v--) atLeast[v] = atLeast[v + 1] + cnt[v];
        return Array.from({ length: 100000 }, (_, i) => (i * 13) % 102).map((q) => atLeast[q]);
      })(),
      failureNote: "학생 10만 명, 질문 10만 개예요. 질문마다 모두 세면 약 100억 번이라 시간 초과예요.",
    },
  ],
  judge: {
    timeLimitMs: 3000,
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
        "'**q 이상**인 개수'를 질문마다 물어요 → 한 번 **정렬**하고, 'q 이상인 첫 위치'를 **이분 탐색**(경계 찾기)해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 점수를 정렬해요.",
        "2. 질문마다 'q 이상인 첫 위치' `i`를 찾아요 (lower bound).",
        "3. 그 위치부터 끝까지가 모두 q 이상이니, 답은 `n − i`예요.",
        "",
        "Python은 `bisect_left(sorted_scores, q)`가 바로 이 위치예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "s = scores를 정렬",
        "def lower_bound(q):",
        "    lo, hi = 0, n",
        "    while lo < hi:",
        "        mid = (lo + hi) // 2",
        "        if s[mid] >= q: hi = mid",
        "        else: lo = mid + 1",
        "    return lo",
        "return [n - lower_bound(q) for q in queries]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["경계를 좁히는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "lo, hi = 0, len(s)",
            "while lo < hi:",
            "    mid = (lo + hi) // 2",
            "    if s[mid] >= q:",
            "        ______",
            "    else:",
            "        lo = mid + 1",
            "answer.append(len(s) - lo)",
          ].join("\n"),
          javascript: [
            "let lo = 0, hi = s.length;",
            "while (lo < hi) {",
            "  const mid = (lo + hi) >> 1;",
            "  if (s[mid] >= q) ______;",
            "  else lo = mid + 1;",
            "}",
            "answer.push(s.length - lo);",
          ].join("\n"),
          java: [
            "int lo = 0, hi = s.length;",
            "while (lo < hi) {",
            "    int mid = (lo + hi) >>> 1;",
            "    if (s[mid] >= q) ______;",
            "    else lo = mid + 1;",
            "}",
            "answer[i] = s.length - lo;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["boundary-search", "range-count"],
  signalIds: ["sig-first-true", "sig-sorted-many-queries"],
  visualization: {
    presets: [
      problemPreset(
        "binary-search-cutoff-count-ex1",
        "bsearch-lower-bound",
        "70점 이상인 첫 자리",
        "정렬한 점수에서 70 이상이 시작되는 자리를 찾으면, 그 뒤가 모두 합격이에요.",
        [[60, 70, 70, 85, 95], 70],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
