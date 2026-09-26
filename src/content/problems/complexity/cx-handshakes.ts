import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [4],
    expected: 6,
    explanation: "4명이면 3 + 2 + 1 = 6번이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [1],
    expected: 0,
    explanation: "혼자면 0번이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [2],
    expected: 1,
    failureNote: "두 명이면 1번이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [10],
    expected: 45,
    failureNote: "45번이에요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [100],
    expected: 4950,
    failureNote: "99 + 98 + … + 1 = 4,950번이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [10000000],
    expected: 49999995000000,
    failureNote: "1,000만 명이면 약 50조 번이에요. 두 겹 반복문으로 세면 끝나지 않아요.",
  },
]);

export const cxHandshakes: Problem = {
  id: "c:cx-handshakes",
  slug: "cx-handshakes",
  source: "curated",
  topic: "complexity",
  level: 1,
  title: "모두와 한 번씩 악수",
  summary: "두 겹 반복문(O(N²)) 대신 N × (N − 1) ÷ 2 공식으로 세요",
  statement: [
    "`n`명이 모였어요. 모든 사람이 다른 모든 사람과 **딱 한 번씩** 악수해요.",
    "",
    "악수는 모두 몇 번인지 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 사람 수예요.",
  outputFormat: "악수 횟수",
  constraints: ["1 ≤ n ≤ 10,000,000"],
  signature: {
    name: "solution",
    params: [{ name: "n", type: { python: "int", javascript: "number", java: "int" }, description: "사람 수" }],
    returns: { type: { python: "int", javascript: "number", java: "long" }, description: "악수 횟수" },
  },
  starterCode: {
    python: ["def solution(n):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public long solution(int n) {",
      "        long answer = 0;",
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
      body: ["'모든 쌍'을 하나씩 세면 `O(N²)`이에요. N이 1,000만이라 공식이 필요해요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "한 사람은 나머지 `n − 1`명과 악수해요. n명이 모두 그러면 `n × (n − 1)`번인데, 악수 한 번을 두 사람이 한 번씩 세었으니 **2로 나눠요**.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: ["~~~text", "return n * (n - 1) / 2", "~~~"].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["공식 한 줄이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["return ______ // 2"].join("\n"),
          javascript: ["return (______) / 2;"].join("\n"),
          java: ["return (long) n * ______ / 2;"].join("\n"),
        },
        caption: "n × (n − 1)은 int를 넘을 수 있어서 먼저 long으로 바꿔 곱해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["formula-o1"],
  signalIds: ["sig-huge-n"],
  estimatedMinutes: 5,
  xp: 10,
};
