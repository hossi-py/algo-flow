import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [3, 8, 15, 21, 27, 34, 42],
      [21, 3, 42],
    ],
    expected: [3, 0, 6],
    explanation: "21은 3번, 3은 0번, 42는 6번 칸이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [
      [5, 10],
      [7, 0, 11],
    ],
    expected: [-1, -1, -1],
    explanation: "없는 번호는 모두 -1이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[9], [9, 8]],
    expected: [0, -1],
    failureNote: "책이 한 권뿐이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 8, 4, 5],
    ],
    expected: [0, 7, 3, 4],
    failureNote: "맨 앞, 맨 끝, 가운데 근처 모두 찾아야 해요. lo·hi의 ±1을 빼먹으면 끝에서 멈추지 않아요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "edge",
    args: [
      [0, 1000000000],
      [1000000000, 0, 500000000],
    ],
    expected: [1, 0, -1],
    failureNote: "가장 작은 번호와 가장 큰 번호예요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => i * 3), Array.from({ length: 100000 }, (_, i) => i * 2)],
    expected: Array.from({ length: 100000 }, (_, i) => ((i * 2) % 3 === 0 ? (i * 2) / 3 : -1)),
    failureNote: "책 10만 권, 질문 10만 개예요. 질문마다 처음부터 훑으면 약 100억 번이라 시간 초과예요.",
  },
]);

export const binarySearchPageFinder: Problem = {
  id: "c:binary-search-page-finder",
  slug: "binary-search-page-finder",
  source: "curated",
  topic: "binary-search",
  level: 1,
  title: "도서 번호 찾기",
  summary: "정렬된 책 번호에서 질문마다 반씩 버리며 위치를 찾아요",
  statement: [
    "숲 도서관 책장에는 책 번호가 **작은 번호부터** 차례로 꽂혀 있어요. 번호는 서로 달라요.",
    "",
    "질문 `queries`의 번호마다, 그 책이 책장의 **몇 번째 칸**(0부터)에 있는지 차례로 담아 반환해 주세요. 없는 번호면 `-1`이에요.",
  ].join("\n"),
  inputFormat: "`books`: 작은 번호부터 정렬된 책 번호, `queries`: 찾을 번호들이에요.",
  outputFormat: "질문마다 칸 번호(없으면 -1)를 담은 리스트",
  constraints: [
    "1 ≤ books의 길이 ≤ 100,000, 번호는 서로 다르고 오름차순이에요",
    "1 ≤ queries의 길이 ≤ 100,000",
    "0 ≤ 번호 ≤ 1,000,000,000",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "books",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "정렬된 책 번호",
      },
      {
        name: "queries",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "찾을 번호",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "int[]" },
      description: "칸 번호 (없으면 -1)",
    },
  },
  starterCode: {
    python: ["def solution(books, queries):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(books, queries) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[] books, int[] queries) {",
      "        int[] answer = new int[queries.length];",
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
    timeLimitMs: 3000,
    compare: { type: "exact" },
    recursionLimit: 3000,
    revealFirstFailure: true,
  },
  hints: [
    {
      step: 1,
      kind: "pattern",
      title: "어떤 유형일까요?",
      body: ["**정렬된** 목록 + **질문이 많음** → 질문마다 **이분 탐색**이에요. 질문 하나에 약 17번이면 돼요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "질문마다:",
        "",
        "1. `lo = 0`, `hi = n - 1`로 시작해요.",
        "2. `mid = (lo + hi) // 2`를 보고, 같으면 mid가 답이에요.",
        "3. `books[mid]`가 찾는 번호보다 작으면 `lo = mid + 1`, 크면 `hi = mid - 1`.",
        "4. `lo > hi`가 되면 없는 번호예요 → -1.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "def find(x):",
        "    lo, hi = 0, n - 1",
        "    while lo <= hi:",
        "        mid = (lo + hi) // 2",
        "        if books[mid] == x: return mid",
        "        if books[mid] < x: lo = mid + 1",
        "        else: hi = mid - 1",
        "    return -1",
        "return [find(q) for q in queries]",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["범위를 좁히는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "while lo <= hi:",
            "    mid = (lo + hi) // 2",
            "    if books[mid] == x:",
            "        return mid",
            "    if books[mid] < x:",
            "        lo = ______",
            "    else:",
            "        hi = mid - 1",
          ].join("\n"),
          javascript: [
            "while (lo <= hi) {",
            "  const mid = (lo + hi) >> 1;",
            "  if (books[mid] === x) return mid;",
            "  if (books[mid] < x) lo = ______;",
            "  else hi = mid - 1;",
            "}",
          ].join("\n"),
          java: [
            "while (lo <= hi) {",
            "    int mid = (lo + hi) >>> 1;",
            "    if (books[mid] == x) return mid;",
            "    if (books[mid] < x) lo = ______;",
            "    else hi = mid - 1;",
            "}",
          ].join("\n"),
        },
        caption: "Java의 (lo + hi) >>> 1은 int가 넘쳐도 올바른 가운데를 구해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["exact-search"],
  signalIds: ["sig-sorted-many-queries"],
  visualization: {
    presets: [
      problemPreset(
        "binary-search-page-finder-ex1",
        "bsearch-exact",
        "21번 책 찾기",
        "가운데 칸을 보고 절반씩 버려요.",
        [[3, 8, 15, 21, 27, 34, 42], 21],
      ),
    ],
  },
  estimatedMinutes: 10,
  xp: 10,
};
