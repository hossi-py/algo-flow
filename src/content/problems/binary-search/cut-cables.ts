import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[80, 43, 57, 39], 11],
    expected: 19,
    explanation: "19로 자르면 4 + 2 + 3 + 2 = 11도막, 20이면 9도막이라 19예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[3], 4],
    expected: 0,
    explanation: "길이 1로 잘라도 3도막뿐이라 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[10], 1],
    expected: 10,
    failureNote: "한 도막이면 줄 전체 길이 10이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [[5, 5, 5], 3],
    expected: 5,
    failureNote: "5씩 한 도막씩, 5예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 1000000000], 2],
    expected: 500000000,
    failureNote: "긴 줄 하나에서 2도막(5억씩)이 나와요. 짧은 줄은 못 써도 괜찮아요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [[7, 7, 7, 7], 28],
    expected: 1,
    failureNote: "길이 1이면 딱 28도막이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 10000 }, (_, i) => ((i * 7919) % 999999937) + 1), 10000000],
    expected: 39571,
    failureNote:
      "줄 1만 개, 길이 최대 10억이에요. 길이를 1부터 하나씩 해 보면 시간 초과예요. (Java는 도막 수 합을 long으로)",
  },
]);

export const binarySearchCutCables: Problem = {
  id: "c:binary-search-cut-cables",
  slug: "binary-search-cut-cables",
  source: "curated",
  topic: "binary-search",
  level: 3,
  title: "넝쿨 줄 자르기",
  summary: "'길이 X로 k도막 이상 나오나?'를 확인하며 X를 이분 탐색해요",
  statement: [
    "노디가 길이가 제각각인 넝쿨 줄 `vines`를 가지고 있어요. 모든 줄을 **같은 길이 X**(정수)로 잘라 **적어도 k도막**을 만들려고 해요. 남는 자투리는 버려요.",
    "",
    "가능한 **가장 긴 X**를 반환해 주세요. 길이 1로 잘라도 k도막이 안 되면 0이에요.",
  ].join("\n"),
  inputFormat: "`vines`: 줄의 길이들, `k`: 필요한 도막 수예요.",
  outputFormat: "도막의 최대 길이 (불가능하면 0)",
  constraints: ["1 ≤ vines의 길이 ≤ 10,000", "1 ≤ 줄 길이 ≤ 1,000,000,000", "1 ≤ k ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      { name: "vines", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "줄 길이" },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "필요한 도막 수" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 길이" },
  },
  starterCode: {
    python: ["def solution(vines, k):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(vines, k) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] vines, int k) {",
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
        "'**적어도 k개**를 만들 수 있는 **최대** 길이' → 길이 X가 길수록 도막이 줄어서, 가능 → 불가능으로 한 번만 바뀌어요. **답을 이분 탐색**해요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 답의 범위는 1 ~ 가장 긴 줄이에요.",
        "2. `mid`로 자른 도막 수 = `sum(v // mid)`를 세요.",
        "3. k 이상이면 가능 → 답으로 적고 더 길게(`lo = mid + 1`). 아니면 더 짧게(`hi = mid - 1`).",
        "",
        "확인 한 번에 O(N), 약 30번 반복해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "lo, hi, answer = 1, max(vines), 0",
        "while lo <= hi:",
        "    mid = (lo + hi) // 2",
        "    if sum(v // mid for v in vines) >= k: answer = mid; lo = mid + 1",
        "    else: hi = mid - 1",
        "return answer",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["가능한지 확인하는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "while lo <= hi:",
            "    mid = (lo + hi) // 2",
            "    if ______ >= k:",
            "        answer = mid",
            "        lo = mid + 1",
            "    else:",
            "        hi = mid - 1",
          ].join("\n"),
          javascript: [
            "while (lo <= hi) {",
            "  const mid = Math.floor((lo + hi) / 2);",
            "  let pieces = 0;",
            "  for (const v of vines) pieces += Math.floor(v / mid);",
            "  if (______) {",
            "    answer = mid;",
            "    lo = mid + 1;",
            "  } else hi = mid - 1;",
            "}",
          ].join("\n"),
          java: [
            "while (lo <= hi) {",
            "    long mid = (lo + hi) / 2;",
            "    long pieces = 0;",
            "    for (int v : vines) pieces += v / mid;",
            "    if (______) {",
            "        answer = mid;",
            "        lo = mid + 1;",
            "    } else hi = mid - 1;",
            "}",
          ].join("\n"),
        },
        caption: "도막 수 합은 21억을 넘을 수 있어서 long으로 세요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["parametric-search"],
  signalIds: ["sig-max-min-answer", "sig-huge-range"],
  visualization: {
    presets: [
      problemPreset(
        "binary-search-cut-cables-ex1",
        "bsearch-answer",
        "도막 길이 이분 탐색",
        "길이 X로 가능한지 확인하고, 되면 더 길게, 안 되면 더 짧게 범위를 좁혀요.",
        [[80, 43, 57, 39], 11],
      ),
    ],
  },
  estimatedMinutes: 15,
  xp: 30,
};
