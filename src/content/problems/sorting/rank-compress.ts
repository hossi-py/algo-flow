import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[40, 10, 30, 10]],
    expected: [2, 0, 1, 0],
    explanation: "서로 다른 번호는 10, 30, 40이라 차례로 0, 1, 2예요. 답은 [2, 0, 1, 0]이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[7]],
    expected: [0],
    explanation: "하나면 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [[5, 5, 5, 9]],
    expected: [0, 0, 0, 1],
    failureNote: "5는 셋 다 0, 9는 1이에요. 작은 번호의 '개수'를 세면 9가 3이 되어 틀려요. 서로 다른 번호만 세요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[-3, 1000000000, -1000000000]],
    expected: [1, 2, 0],
    failureNote: "음수와 아주 큰 수도 순서만 봐요: [1, 2, 0].",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 2, 3]],
    expected: [0, 1, 2],
    failureNote: "이미 촘촘하면 [0, 1, 2]예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * i) % 100003) - 50000)],
    expected: (() => {
      const a = Array.from({ length: 100000 }, (_, i) => ((i * i) % 100003) - 50000);
      const u = [...new Set(a)].sort((x, y) => x - y);
      const m = new Map(u.map((v, i) => [v, i]));
      return a.map((v) => m.get(v) ?? 0);
    })(),
    failureNote: "번호 10만 개예요. 번호마다 다른 번호를 모두 비교하면 시간 초과예요.",
  },
]);

export const sortingRankCompress: Problem = {
  id: "c:sorting-rank-compress",
  slug: "sorting-rank-compress",
  source: "curated",
  topic: "sorting",
  level: 5,
  title: "번호표 압축하기",
  summary: "중복을 없애고 정렬한 뒤, 각 값의 자리 번호로 바꿔요",
  statement: [
    "숲속 운동회에서 받은 번호표 `nums`는 수가 너무 크고 띄엄띄엄해요. 크기 순서는 그대로 두고 **작은 번호로 바꾸려고** 해요.",
    "",
    "각 번호를 '나보다 **작은 서로 다른** 번호의 개수'로 바꾼 리스트를 반환해 주세요. 같은 번호는 같은 값으로 바뀌어요.",
  ].join("\n"),
  inputFormat: "`nums`: 번호표들이에요.",
  outputFormat: "바꾼 번호 리스트 (입력과 같은 순서)",
  constraints: ["1 ≤ nums의 길이 ≤ 100,000", "−1,000,000,000 ≤ 번호 ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      { name: "nums", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "번호표" },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "압축한 번호" },
  },
  starterCode: {
    python: ["def solution(nums):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(nums) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] nums) {",
      "        int[] answer = new int[nums.length];",
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
        "크기 **순서만** 남기고 값을 바꿔요 → 정렬해서 자리 번호를 매기는 **좌표 압축**이에요. 정렬 + 해시의 조합이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 중복을 없애고(set) 정렬해요. 그러면 k번째 자리의 값보다 작은 서로 다른 값은 딱 k개예요.",
        "2. dict에 `값 → 자리 번호`를 적어요.",
        "3. 원래 순서대로 dict에서 꺼내요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "u = sorted(set(nums))",
        "rank = {v: i for i, v in enumerate(u)}",
        "return [rank[x] for x in nums]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["자리 번호를 적는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "u = sorted(set(nums))",
            "rank = {______ for i, v in enumerate(u)}",
            "return [rank[x] for x in nums]",
          ].join("\n"),
          javascript: [
            "const u = [...new Set(nums)].sort((a, b) => a - b);",
            "const rank = new Map(u.map((v, i) => ______));",
            "return nums.map((x) => rank.get(x));",
          ].join("\n"),
          java: [
            "int[] u = Arrays.stream(nums).distinct().sorted().toArray();",
            "Map<Integer, Integer> rank = new HashMap<>();",
            "for (int i = 0; i < u.length; i++) rank.put(______);",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["sort-then-scan"],
  signalIds: ["sig-neighbor-after-sort"],
  estimatedMinutes: 20,
  xp: 50,
};
