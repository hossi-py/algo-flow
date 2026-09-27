import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[2, 3, 1, 1, 4]],
    expected: true,
    explanation: "0 → 1 → 4로 갈 수 있어요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "tricky",
    args: [[3, 2, 1, 0, 4]],
    expected: false,
    explanation: "어디서 뛰어도 3번 돌(0)에 막혀요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[0]],
    expected: true,
    failureNote: "이미 마지막 돌이에요. true예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "edge",
    args: [[0, 1]],
    expected: false,
    failureNote: "첫 돌에서 못 움직여요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 0, 1, 0]],
    expected: false,
    failureNote: "1번 돌에서 막혀요. 가장 먼 거리가 지금 위치보다 뒤처지면 멈춰야 해요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [[5, 0, 0, 0, 0, 0]],
    expected: true,
    failureNote: "한 번에 5칸 뛰어 끝이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => 1 + ((i * 7) % 3))],
    expected: true,
    failureNote: "돌 10만 개예요. 가능한 모든 점프를 따라가면 느려요.",
  },
  {
    id: "hid-6",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => (i === 50000 ? 0 : i >= 49999 && i <= 50000 ? 1 : 1))],
    expected: false,
    failureNote: "중간의 0 하나에 막혀요.",
  },
]);

export const greedyStoneJump: Problem = {
  id: "c:greedy-stone-jump",
  slug: "greedy-stone-jump",
  source: "curated",
  topic: "greedy",
  level: 3,
  title: "징검돌 끝까지 가기",
  summary: "지금까지 닿을 수 있는 가장 먼 돌만 늘려 가요",
  statement: [
    "개울에 징검돌이 한 줄로 놓여 있어요. i번 돌에서는 앞으로 **최대** `jumps[i]`칸까지 뛸 수 있어요 (그보다 적게 뛰어도 돼요).",
    "",
    "0번 돌에서 출발해 **마지막 돌**까지 갈 수 있으면 `true`, 없으면 `false`를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`jumps`: 돌마다 뛸 수 있는 최대 칸 수예요.",
  outputFormat: "마지막 돌까지 갈 수 있는지 (참/거짓)",
  constraints: ["1 ≤ jumps의 길이 ≤ 100,000", "0 ≤ jumps[i] ≤ 100,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "jumps",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "최대 뛸 수 있는 칸",
      },
    ],
    returns: { type: { python: "bool", javascript: "boolean", java: "boolean" }, description: "갈 수 있는지" },
  },
  starterCode: {
    python: ["def solution(jumps):", "    answer = False", "    return answer", ""].join("\n"),
    javascript: ["function solution(jumps) {", "  let answer = false;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public boolean solution(int[] jumps) {",
      "        boolean answer = false;",
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
        "'끝까지 **갈 수 있나?**' → 한 번 훑으며 '지금까지 닿을 수 있는 가장 먼 곳'만 들고 가는 **그리디**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `far` = 지금까지 닿을 수 있는 가장 먼 돌 번호 (처음엔 0)",
        "2. 앞에서부터 i를 보며, i가 `far`보다 크면 i에는 못 와요 → false",
        "3. 아니면 `far = max(far, i + jumps[i])`",
        "4. `far`가 마지막 돌에 닿으면 true예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "far = 0",
        "for i in 0..n-1:",
        "    if i > far: return false",
        "    far = max(far, i + jumps[i])",
        "return true",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["닿을 수 있는 범위를 늘리는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i, j in enumerate(jumps):",
            "    if i > far:",
            "        return False",
            "    far = ______",
            "return True",
          ].join("\n"),
          javascript: [
            "for (let i = 0; i < jumps.length; i++) {",
            "  if (i > far) return false;",
            "  far = ______;",
            "}",
            "return true;",
          ].join("\n"),
          java: [
            "for (int i = 0; i < jumps.length; i++) {",
            "    if (i > far) return false;",
            "    far = ______;",
            "}",
            "return true;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["greedy-accumulate"],
  signalIds: ["sig-running-reach"],
  estimatedMinutes: 15,
  xp: 30,
};
