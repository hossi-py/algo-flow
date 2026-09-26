import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["1100", "1100", "0011", "0010"]],
    expected: [3, 4],
    explanation:
      "왼쪽 위 1, 오른쪽 위 0, 왼쪽 아래 0은 한 조각씩이고, 오른쪽 아래는 다시 4조각(1, 1, 1, 0)으로 나뉘어요. 0 조각 3개, 1 조각 4개예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["11", "11"]],
    expected: [0, 1],
    explanation: "전체가 1이라 조각 하나로 끝나요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["0"]],
    expected: [1, 0],
    failureNote: "1×1 사진이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [["10", "01"]],
    expected: [2, 2],
    failureNote: "네 칸이 모두 따로 기록돼요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [["11110000", "11110000", "11110000", "11110000", "00001111", "00001111", "00001111", "00001110"]],
    expected: [3, 7],
    failureNote: "큰 조각과 아주 작은 조각이 섞여 있어요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 128 }, (_, r) => Array.from({ length: 128 }, (_, c) => ((r ^ c) & 1 ? "1" : "0")).join("")),
    ],
    expected: [8192, 8192],
    failureNote: "128×128 체크무늬라 모든 칸이 따로 기록돼요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      Array.from({ length: 128 }, (_, r) =>
        Array.from({ length: 128 }, (_, c) => (r < 64 || c >= 96 ? "1" : "0")).join(""),
      ),
    ],
    expected: [3, 4],
    failureNote: "128×128 사진이 큰 조각 몇 개로 압축돼요.",
  },
]);

export const recursionQuadGarden: Problem = {
  id: "c:recursion-quad-garden",
  slug: "recursion-quad-garden",
  source: "curated",
  topic: "recursion",
  level: 4,
  title: "정원 사진 압축",
  summary: "4등분을 반복하며 한 색으로 채워진 조각 수를 세요",
  statement: [
    "노디가 위에서 찍은 정사각형 정원 사진을 친구에게 보내려고 해요. 사진은 `garden`의 각 칸이 `'1'`(꽃) 또는 `'0'`(흙)인 `2^k × 2^k` 격자예요. 용량을 줄이려고 이렇게 압축해요.",
    "",
    "1. 지금 보고 있는 정사각형이 **모두 같은 글자**면, 그 정사각형을 그 글자 **조각 하나**로 기록해요.",
    "2. 아니면 정사각형을 **가로세로 반씩, 똑같은 크기의 4조각**으로 나누고, 각 조각을 같은 방법으로 압축해요.",
    "",
    "압축이 끝났을 때 기록된 `'0'` 조각의 수와 `'1'` 조각의 수를 `[0 조각 수, 1 조각 수]`로 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`garden`: 길이가 `2^k`인 문자열 `2^k`개의 리스트예요.",
  outputFormat: "`[0 조각 수, 1 조각 수]`",
  constraints: ["0 ≤ k ≤ 7 (한 변은 1 ~ 128칸)", "각 문자는 '0' 또는 '1'이에요."],
  signature: {
    name: "solution",
    params: [
      {
        name: "garden",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "정원 사진",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "int[]" },
      description: "[0 조각 수, 1 조각 수]",
    },
  },
  starterCode: {
    python: ["def solution(garden):", "    answer = [0, 0]", "    return answer", ""].join("\n"),
    javascript: ["function solution(garden) {", "  let answer = [0, 0];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(String[] garden) {",
      "        int[] answer = new int[2];",
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
        "정사각형을 4조각으로 나누고, 각 조각을 **같은 규칙으로 또 나눠요** → 안에 같은 모양이 들어 있는 **분할 정복(재귀)** 이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`compress(r, c, size)`: 왼쪽 위가 (r, c)이고 한 변이 size인 정사각형을 압축해요.",
        "",
        "1. 정사각형 안이 모두 같은 글자면 그 글자의 조각 수를 1 늘리고 끝.",
        "2. 아니면 `half = size / 2`로 네 조각 (r, c), (r, c+half), (r+half, c), (r+half, c+half)에 대해 재귀 호출.",
        "",
        "size가 1이면 늘 같은 글자라서 자연스럽게 멈춰요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "compress(r, c, size):",
        "    first = garden[r][c]",
        "    if 정사각형 안의 모든 칸 == first:",
        "        count[first] += 1; return",
        "    half = size / 2",
        "    compress(r, c, half); compress(r, c + half, half)",
        "    compress(r + half, c, half); compress(r + half, c + half, half)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["네 조각으로 나눠 부르는 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            "half = size // 2",
            "compress(r, c, half)",
            "compress(r, c + half, half)",
            "compress(r + half, c, half)",
            "______",
          ].join("\n"),
          javascript: [
            "const half = size / 2;",
            "compress(r, c, half);",
            "compress(r, c + half, half);",
            "compress(r + half, c, half);",
            "______;",
          ].join("\n"),
          java: [
            "int half = size / 2;",
            "compress(r, c, half);",
            "compress(r, c + half, half);",
            "compress(r + half, c, half);",
            "______;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["divide-and-conquer", "recursion-tree"],
  signalIds: ["sig-nested-structure"],
  estimatedMinutes: 25,
  xp: 40,
};
