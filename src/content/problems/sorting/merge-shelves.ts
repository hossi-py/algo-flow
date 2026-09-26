import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [1, 4, 7],
      [2, 3, 9],
    ],
    expected: [1, 2, 3, 4, 7, 9],
    explanation: "맨 앞끼리 비교하며 1, 2, 3, 4, 7, 9 순서로 합쳐요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[], [5, 6]],
    expected: [5, 6],
    explanation: "한쪽이 비어 있으면 다른 쪽 그대로예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[], []],
    expected: [],
    failureNote: "둘 다 비어 있으면 빈 리스트예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [2, 2, 5],
      [2, 5, 5],
    ],
    expected: [2, 2, 2, 5, 5, 5],
    failureNote: "같은 번호도 모두 남겨요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [1, 2, 3],
      [10, 20],
    ],
    expected: [1, 2, 3, 10, 20],
    failureNote: "한쪽이 먼저 끝나면, 남은 쪽을 그대로 뒤에 붙여요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => 2 * i), Array.from({ length: 100000 }, (_, i) => 2 * i + 1)],
    expected: Array.from({ length: 200000 }, (_, i) => i),
    failureNote: "책이 20만 권이에요. 합칠 때마다 맞는 자리를 처음부터 찾아 끼우면(O(N²)) 시간 초과예요.",
  },
]);

export const sortingMergeShelves: Problem = {
  id: "c:sorting-merge-shelves",
  slug: "sorting-merge-shelves",
  source: "curated",
  topic: "sorting",
  level: 2,
  title: "정렬된 두 책장 합치기",
  summary: "두 줄의 맨 앞끼리 비교하며 한 줄로 합쳐요",
  statement: [
    "도서관 책장 두 개에 책 번호가 각각 **작은 번호부터** 꽂혀 있어요. 두 책장을 하나로 합쳐서, 역시 작은 번호부터 꽂힌 한 줄을 만들려고 해요.",
    "",
    "합친 결과를 반환해 주세요. 같은 번호가 있으면 모두 남겨요.",
  ].join("\n"),
  inputFormat: "`a`, `b`: 각각 작은 번호부터 정렬된 책 번호 리스트예요.",
  outputFormat: "두 책장을 합쳐 정렬한 리스트",
  constraints: ["0 ≤ a, b의 길이 ≤ 100,000", "0 ≤ 책 번호 ≤ 1,000,000,000", "a, b는 각각 오름차순이에요"],
  signature: {
    name: "solution",
    params: [
      { name: "a", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "첫 번째 책장" },
      { name: "b", type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "두 번째 책장" },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "합친 책장" },
  },
  starterCode: {
    python: ["def solution(a, b):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(a, b) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] a, int[] b) {",
      "        int[] answer = new int[a.length + b.length];",
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
        "이미 **정렬된 두 줄을 합치기** → 병합 정렬의 합치기 단계예요.",
        "",
        "합쳐서 다시 정렬해도 답은 나오지만, 이미 정렬돼 있다는 걸 쓰면 O(N + M)이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 두 책장의 맨 앞을 가리키는 `i`, `j`를 0에서 시작해요.",
        "2. `a[i]`와 `b[j]` 중 **작은 쪽**을 결과에 붙이고, 그쪽 포인터만 한 칸 옮겨요.",
        "3. 한쪽이 끝나면 다른 쪽의 남은 책을 그대로 붙여요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "i = j = 0, out = []",
        "while i < len(a) and j < len(b):",
        "    if a[i] <= b[j]: out에 a[i] 추가, i += 1",
        "    else: out에 b[j] 추가, j += 1",
        "out에 a[i:], b[j:] 이어 붙이기",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["작은 쪽을 고르는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "while i < len(a) and j < len(b):",
            "    if ______:",
            "        out.append(a[i]); i += 1",
            "    else:",
            "        out.append(b[j]); j += 1",
            "return out + a[i:] + b[j:]",
          ].join("\n"),
          javascript: [
            "while (i < a.length && j < b.length) {",
            "  if (______) out.push(a[i++]);",
            "  else out.push(b[j++]);",
            "}",
            "return out.concat(a.slice(i), b.slice(j));",
          ].join("\n"),
          java: [
            "while (i < a.length && j < b.length) {",
            "    if (______) out[k++] = a[i++];",
            "    else out[k++] = b[j++];",
            "}",
            "while (i < a.length) out[k++] = a[i++];",
            "while (j < b.length) out[k++] = b[j++];",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["merge-step"],
  signalIds: ["sig-neighbor-after-sort"],
  visualization: {
    presets: [
      problemPreset(
        "sorting-merge-shelves-ex1",
        "sort-merge",
        "병합 정렬의 합치기",
        "마지막 합치기 단계를 보세요. 정렬된 두 절반의 맨 앞끼리 비교하며 한 줄로 합쳐요.",
        [[1, 4, 7, 2, 3, 9]],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
