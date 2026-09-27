import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [5],
    expected: [5, 4, 3, 2, 1],
    explanation: "5, 4, 3, 2, 1을 차례로 세요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [1],
    expected: [1],
    explanation: "1부터 세면 [1] 하나뿐이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [2],
    expected: [2, 1],
    failureNote: "두 번 세요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [10],
    expected: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    failureNote: "10부터 세요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [3],
    expected: [3, 2, 1],
    failureNote: "3부터 세요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [500],
    expected: Array.from({ length: 500 }, (_, i) => 500 - i),
    failureNote: "500부터 세면 재귀가 500번 깊어져요.",
  },
]);

export const recursionRocketCountdown: Problem = {
  id: "c:recursion-rocket-countdown",
  slug: "recursion-rocket-countdown",
  source: "curated",
  topic: "recursion",
  level: 1,
  title: "로켓 카운트다운",
  summary: "n부터 1까지 거꾸로 세는 목록을 재귀로 만들어요",
  statement: [
    "노디가 종이 로켓을 쏘아 올리려고 해요. 발사 전에 `n`부터 `1`까지 거꾸로 셉니다.",
    "",
    "`n, n-1, …, 2, 1`을 차례로 담은 리스트를 반환해 주세요.",
    "",
    '> 이 문제는 **재귀**를 연습하는 문제예요. "n부터 세기"는 "n을 말하고, 나머지는 n-1부터 세기"와 같다는 점을 이용해 보세요.',
  ].join("\n"),
  inputFormat: "`n`: 카운트다운을 시작할 수예요.",
  outputFormat: "`[n, n-1, ..., 1]` 리스트",
  constraints: ["1 ≤ n ≤ 500"],
  signature: {
    name: "solution",
    params: [{ name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "시작하는 수" }],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" },
      description: "카운트다운 목록",
    },
  },
  starterCode: {
    python: ["def solution(n):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(n) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(int n) {",
      "        List<Integer> answer = new ArrayList<>();",
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
        '"n부터 세기" = "n을 말하고 **n−1부터 세기**"예요. 큰 문제 안에 **한 단계 작은 같은 문제**가 들어 있어요 → **재귀**.',
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "재귀 함수는 두 부분으로 만들어요.",
        "1. **종료 조건**: n이 1이면 더 셀 게 없으니 `[1]`을 반환해요.",
        "2. **재귀 호출**: 그 외에는 `[n]` 뒤에 `solution(n - 1)`의 결과를 이어 붙여요.",
        "",
        "종료 조건이 없으면 함수가 끝없이 자기 자신을 불러서 RecursionError가 나요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "solution(n):", "    if n == 1: return [1]", "    return [n] + solution(n - 1)", "~~~"].join(
        "\n",
      ),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["재귀 호출 부분을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["def solution(n):", "    if n == 1:", "        return [1]", "    return [n] + ______"].join("\n"),
          javascript: ["function solution(n) {", "  if (n === 1) return [1];", "  return [n, ...______];", "}"].join(
            "\n",
          ),
          java: [
            "public List<Integer> solution(int n) {",
            "    if (n == 1) return new ArrayList<>(List.of(1));",
            "    List<Integer> answer = new ArrayList<>();",
            "    answer.add(n);",
            "    answer.addAll(______);",
            "    return answer;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["recursive-definition"],
  signalIds: ["sig-shrink-by-one"],
  visualization: {
    presets: [
      problemPreset(
        "countdown-calls",
        "recursion-factorial",
        "호출이 쌓였다 풀리는 모습",
        "팩토리얼로 보는 재귀 호출 스택이에요. n을 하나씩 줄여 가며 부르고, 종료 조건에서 돌아와요.",
        [4],
      ),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
