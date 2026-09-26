import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [3],
    expected: 3,
    explanation: "[1, 1, 1], [1, 2], [2, 1] 세 가지예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "basic",
    args: [5],
    expected: 8,
    explanation: "1, 1, 2, 3, 5, 8 순서로 늘어서 8가지예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [1],
    expected: 1,
    failureNote: "한 칸이면 1가지예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [2],
    expected: 2,
    failureNote: "[1, 1]과 [2], 2가지예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [45],
    expected: 836311896,
    failureNote:
      "1,836,311,903가지라 나머지를 구하면 836,311,896이에요. 더할 때마다 나머지를 구해야 수가 넘치지 않아요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [100000],
    expected: 967618232,
    failureNote: "10만 칸이에요. 재귀로 그대로 풀면 같은 계산을 끝없이 반복해요. 표에 적어 두면 10만 번이면 돼요.",
  },
]);

export const dpStairWays: Problem = {
  id: "c:dp-stair-ways",
  slug: "dp-stair-ways",
  source: "curated",
  topic: "dp",
  level: 1,
  title: "계단 오르는 방법의 수",
  summary: "i칸까지 오는 방법 = (i-1칸) + (i-2칸), 표에 적어 두며 세요",
  statement: [
    "노디가 `n`칸짜리 계단을 올라가요. 한 번에 **1칸 또는 2칸**씩 오를 수 있어요.",
    "",
    "꼭대기(n칸)에 정확히 도착하는 방법의 수를 반환해 주세요. 수가 아주 커질 수 있으니 **1,000,000,007로 나눈 나머지**를 반환해요.",
  ].join("\n"),
  inputFormat: "`n`: 계단 칸 수예요.",
  outputFormat: "방법의 수를 1,000,000,007로 나눈 나머지",
  constraints: ["1 ≤ n ≤ 100,000"],
  signature: {
    name: "solution",
    params: [{ name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "계단 칸 수" }],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "방법의 수 (나머지)" },
  },
  starterCode: {
    python: ["def solution(n):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int n) {",
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
        "'**방법의 수**를 1,000,000,007로 나눈 나머지' → 하나씩 셀 수 없을 만큼 많아요. 작은 답을 적어 두고 쌓아 가는 **DP**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 표의 뜻: `ways[i]` = i칸까지 오는 방법의 수",
        "2. 마지막에 무엇을 했나? 1칸 올라왔다면 i-1칸에서, 2칸 올라왔다면 i-2칸에서 왔어요. → `ways[i] = ways[i-1] + ways[i-2]`",
        "3. 시작 값: `ways[0] = 1`(출발), `ways[1] = 1`",
        "",
        "더할 때마다 `% 1,000,000,007`을 해 줘요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "MOD = 1_000_000_007",
        "ways[0] = ways[1] = 1",
        "for i in 2 .. n:",
        "    ways[i] = (ways[i-1] + ways[i-2]) % MOD",
        "return ways[n]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["점화식 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "ways = [0] * (n + 1)",
            "ways[0] = ways[1] = 1",
            "for i in range(2, n + 1):",
            "    ways[i] = ______ % MOD",
          ].join("\n"),
          javascript: [
            "const ways = Array(n + 1).fill(0);",
            "ways[0] = ways[1] = 1;",
            "for (let i = 2; i <= n; i++) ways[i] = ______ % MOD;",
          ].join("\n"),
          java: [
            "long[] ways = new long[n + 1];",
            "ways[0] = 1;",
            "ways[1] = 1;",
            "for (int i = 2; i <= n; i++) ways[i] = ______ % MOD;",
          ].join("\n"),
        },
        caption: "두 수를 더하면 int를 넘을 수 있어서 long 배열을 써요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["linear-dp"],
  signalIds: ["sig-count-ways-mod", "sig-overlapping-subproblems"],
  visualization: {
    presets: [
      problemPreset("dp-stair-ways-ex2", "dp-stairs", "5칸 계단 표", "앞의 두 칸을 더해 다음 칸을 채워요.", [5]),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
