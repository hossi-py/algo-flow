import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[-1, 2, 1, -4], 1],
    expected: 2,
    explanation: "−1 + 2 + 1 = 2가 가장 가까워요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[0, 0, 0], 1],
    expected: 0,
    explanation: "고를 수 있는 건 0뿐이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 1, 1, 1], 3],
    expected: 3,
    failureNote: "딱 3이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 2, 5, 8], 11],
    expected: 11,
    failureNote: "1 + 2 + 8 = 11로 딱 맞아요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[-3, 0, 2, 4], 0],
    expected: -1,
    failureNote: "거리 1인 합이 −1(−3 + 0 + 2)과 1(−3 + 0 + 4)이에요. 작은 쪽 −1이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 500 }, (_, i) => ((i * 7919) % 2001) - 1000), 9999],
    expected: 2973,
    failureNote:
      "500개예요. 목표가 너무 커서 끝까지 찾아야 해요. 세 개를 모두 고르면 약 2천만 가지라 느려요. 정렬 + 두 포인터로 O(N²)이에요.",
  },
]);

export const twoPointersThreeClosest: Problem = {
  id: "c:two-pointers-three-closest",
  slug: "two-pointers-three-closest",
  source: "curated",
  topic: "two-pointers",
  level: 5,
  title: "세 수의 합을 목표에 가깝게",
  summary: "정렬하고 하나를 고정한 뒤, 나머지 둘은 양 끝에서 좁혀요",
  statement: [
    "정수 목록 `nums`에서 **서로 다른 위치의 세 수**를 골라, 그 합이 `target`에 **가장 가깝게** 하려고 해요.",
    "",
    "가장 가까운 합을 반환해 주세요. 거리가 같은 합이 둘이면 **작은 쪽**을 반환해요.",
  ].join("\n"),
  inputFormat: "`nums`: 정수 목록, `target`: 목표예요.",
  outputFormat: "target에 가장 가까운 세 수의 합",
  constraints: ["3 ≤ nums의 길이 ≤ 500", "−1,000 ≤ nums[i] ≤ 1,000", "−10,000 ≤ target ≤ 10,000"],
  signature: {
    name: "solution",
    params: [
      { name: "nums", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "정수 목록" },
      { name: "target", type: { python: "int", javascript: "number", java: "int" }, description: "목표" },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "가장 가까운 합" },
  },
  starterCode: {
    python: ["def solution(nums, target):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(nums, target) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] nums, int target) {",
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
      body: ["세 수 중 하나를 **고정**하면 나머지는 '정렬된 배열에서 두 수의 합' → **양 끝 두 포인터**예요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 정렬해요.",
        "2. 첫 번째 수 i를 고정하고 `l = i + 1`, `r = n - 1`",
        "3. 합이 target보다 작으면 `l += 1`, 크면 `r -= 1`, 같으면 바로 끝",
        "4. 매번 target과의 거리를 비교해 가장 가까운 합(거리가 같으면 작은 합)을 기록해요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "nums 정렬, best = None",
        "for i in 0..n-3:",
        "    l, r = i + 1, n - 1",
        "    while l < r:",
        "        s = nums[i] + nums[l] + nums[r]",
        "        best를 (|s - target|, s)가 더 작으면 s로",
        "        if s < target: l += 1 elif s > target: r -= 1 else: return s",
        "return best",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["더 가까운 합인지 비교하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "s = nums[i] + nums[l] + nums[r]",
            "if best is None or ______ < (abs(best - target), best):",
            "    best = s",
          ].join("\n"),
          javascript: [
            "const s = nums[i] + nums[l] + nums[r];",
            "const d = Math.abs(s - target), bd = Math.abs(best - target);",
            "if (______) best = s;",
          ].join("\n"),
          java: [
            "int s = a[i] + a[l] + a[r];",
            "int d = Math.abs(s - target), bd = Math.abs(best - target);",
            "if (______) best = s;",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["opposite-ends"],
  signalIds: ["sig-sorted-pair-ends"],
  estimatedMinutes: 25,
  xp: 50,
};
