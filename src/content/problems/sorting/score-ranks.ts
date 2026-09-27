import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[70, 95, 80]],
    expected: [3, 1, 2],
    explanation: "95점이 1등, 80점이 2등, 70점이 3등이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [[90, 100, 90, 80]],
    expected: [2, 1, 2, 4],
    explanation: "90점 두 명은 둘 다 2등이에요. 80점은 위에 세 명이 있어서 4등이에요 (3등이 아니에요).",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[0]],
    expected: [1],
    failureNote: "혼자면 1등이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[50, 50, 50]],
    expected: [1, 1, 1],
    failureNote: "모두 같은 점수면 모두 1등이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [[0, 100]],
    expected: [2, 1],
    failureNote: "가장 낮은 점수와 가장 높은 점수예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i * 37) % 101)],
    expected: (() => {
      const s = Array.from({ length: 100000 }, (_, i) => (i * 37) % 101);
      const cnt = Array(102).fill(0);
      for (const x of s) cnt[x]++;
      const higher = Array(102).fill(0);
      for (let v = 99; v >= 0; v--) higher[v] = higher[v + 1] + cnt[v + 1];
      return s.map((x) => higher[x] + 1);
    })(),
    failureNote: "학생 10만 명이에요. 학생마다 모든 학생과 비교하면 약 100억 번이라 시간 초과예요.",
  },
]);

export const sortingScoreRanks: Problem = {
  id: "c:sorting-score-ranks",
  slug: "sorting-score-ranks",
  source: "curated",
  topic: "sorting",
  level: 2,
  title: "시험 등수 매기기",
  summary: "점수가 0~100뿐이니 점수별 인원을 세어 등수를 구해요",
  statement: [
    "숲속 학교 시험 점수 `scores`가 번호 순으로 주어져요. 점수는 0점부터 100점 사이예요.",
    "",
    "학생마다 **등수**를 구해 번호 순으로 담아 반환해 주세요. 등수는 '나보다 점수가 **높은** 학생 수 + 1'이에요. 그래서 점수가 같으면 등수도 같아요.",
  ].join("\n"),
  inputFormat: "`scores`: 번호 순서대로의 점수예요.",
  outputFormat: "번호 순서대로의 등수",
  constraints: ["1 ≤ scores의 길이 ≤ 100,000", "0 ≤ 점수 ≤ 100"],
  signature: {
    name: "solution",
    params: [
      {
        name: "scores",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "학생 점수",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "학생별 등수" },
  },
  starterCode: {
    python: ["def solution(scores):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(scores) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] scores) {",
      "        int[] answer = new int[scores.length];",
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
      body: ["점수가 **0~100뿐**이에요 → 점수마다 몇 명인지 세는 **계수 정렬**의 아이디어를 써요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `count[점수]`에 점수별 인원을 세요. (길이 101)",
        "2. 100점부터 거꾸로 내려오며 `higher[v]` = v보다 높은 점수의 인원을 누적해요.",
        "3. 학생마다 등수는 `higher[점수] + 1`이에요.",
        "",
        "정렬해서 구해도 되지만, 값의 범위가 작으면 세는 쪽이 더 간단하고 빨라요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "count = [0] * 101",
        "for s in scores: count[s] += 1",
        "higher[100] = 0",
        "for v in 99 .. 0: higher[v] = higher[v + 1] + count[v + 1]",
        "return [higher[s] + 1 for s in scores]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["나보다 높은 인원을 누적하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "higher = [0] * 101",
            "for v in range(99, -1, -1):",
            "    higher[v] = ______",
            "return [higher[s] + 1 for s in scores]",
          ].join("\n"),
          javascript: [
            "const higher = Array(101).fill(0);",
            "for (let v = 99; v >= 0; v--) higher[v] = ______;",
            "return scores.map((s) => higher[s] + 1);",
          ].join("\n"),
          java: [
            "int[] higher = new int[101];",
            "for (int v = 99; v >= 0; v--) higher[v] = ______;",
            "for (int i = 0; i < scores.length; i++) answer[i] = higher[scores[i]] + 1;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["counting-sort"],
  signalIds: ["sig-small-value-range"],
  estimatedMinutes: 12,
  xp: 20,
};
