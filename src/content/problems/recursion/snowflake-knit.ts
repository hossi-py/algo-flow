import type { Problem } from "@/types/content";

export const recursionSnowflakeKnit: Problem = {
  id: "c:recursion-snowflake-knit",
  slug: "recursion-snowflake-knit",
  source: "curated",
  topic: "recursion",
  level: 5,
  title: "눈송이 무늬 뜨개질",
  summary: "가운데를 비우는 규칙을 반복한 3^k 크기 무늬를 그려요",
  statement: [
    "노디가 겨울 목도리에 넣을 눈송이 무늬를 뜨려고 해요. 무늬는 `3^k × 3^k` 크기이고 이렇게 만들어요.",
    "",
    '- `k = 0`이면 무늬는 뜨개 코 하나 `"*"`예요.',
    "- `k ≥ 1`이면 무늬를 **3×3칸으로 나눠요**. 가운데 칸은 **모두 빈칸(공백)** 으로 두고, 나머지 8칸에는 각각 `k − 1` 무늬를 그대로 넣어요.",
    "",
    "완성된 무늬를 한 줄에 한 행씩, 문자열 리스트로 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`k`: 무늬의 단계예요.",
  outputFormat: "길이 `3^k`인 문자열 `3^k`개의 리스트 (`'*'`와 공백 `' '`로 이루어짐)",
  constraints: ["0 ≤ k ≤ 5"],
  signature: {
    name: "solution",
    params: [{ name: "k", type: { python: "int", javascript: "number" }, description: "무늬 단계" }],
    returns: { type: { python: "list[str]", javascript: "string[]" }, description: "무늬의 각 행" },
  },
  starterCode: {
    python: ["def solution(k):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(k) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [1],
      expected: ["***", "* *", "***"],
      explanation: "3×3에서 가운데 한 칸만 비어요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [0],
      expected: ["*"],
      explanation: '코 하나 ["*"]예요.',
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "basic",
      args: [2],
      expected: [
        "*********",
        "* ** ** *",
        "*********",
        "***   ***",
        "* *   * *",
        "***   ***",
        "*********",
        "* ** ** *",
        "*********",
      ],
      failureNote: "9×9 무늬예요. 가운데 3×3이 통째로 비고, 8칸 각각의 가운데도 비어요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [3],
      // prettier-ignore
      expected: ["***************************","* ** ** ** ** ** ** ** ** *","***************************","***   ******   ******   ***","* *   * ** *   * ** *   * *","***   ******   ******   ***","***************************","* ** ** ** ** ** ** ** ** *","***************************","*********         *********","* ** ** *         * ** ** *","*********         *********","***   ***         ***   ***","* *   * *         * *   * *","***   ***         ***   ***","*********         *********","* ** ** *         * ** ** *","*********         *********","***************************","* ** ** ** ** ** ** ** ** *","***************************","***   ******   ******   ***","* *   * ** *   * ** *   * *","***   ******   ******   ***","***************************","* ** ** ** ** ** ** ** ** *","***************************"],
      failureNote: "27×27 무늬예요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "stress",
      args: [5],
      expected: Array.from({ length: 243 }, (_, r) =>
        Array.from({ length: 243 }, (_, c) => {
          for (let a = r, b = c; a > 0 || b > 0; a = Math.floor(a / 3), b = Math.floor(b / 3))
            if (a % 3 === 1 && b % 3 === 1) return " ";
          return "*";
        }).join(""),
      ),
      failureNote: "243×243 무늬예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [4],
      expected: Array.from({ length: 81 }, (_, r) =>
        Array.from({ length: 81 }, (_, c) => {
          for (let a = r, b = c; a > 0 || b > 0; a = Math.floor(a / 3), b = Math.floor(b / 3))
            if (a % 3 === 1 && b % 3 === 1) return " ";
          return "*";
        }).join(""),
      ),
      failureNote: "81×81 무늬예요.",
    },
  ],
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
      body: ["k 무늬 안에 **k−1 무늬가 8개** 들어 있어요 → 같은 모양이 안에 들어 있는 **재귀(분할)** 예요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`pattern(k)`가 k 무늬의 행 리스트를 돌려준다고 해요.",
        "",
        '1. k = 0이면 `["*"]`.',
        "2. 아니면 `small = pattern(k-1)`을 한 번만 구하고, 같은 크기의 빈칸 줄 `blank`를 준비해요.",
        "3. 위 3칸 줄: 각 행을 `small + small + small`, 가운데 줄: `small + blank + small`, 아래 줄: 위와 같게 이어 붙여요.",
        "",
        "`small`을 한 번만 계산해 재사용하면 호출이 k번뿐이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "pattern(k):",
        '    if k == 0: return ["*"]',
        "    small = pattern(k - 1); blank = 공백 len(small)개",
        "    top = [row + row + row for row in small]",
        "    mid = [row + blank + row for row in small]",
        "    return top + mid + top",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["가운데 줄을 만드는 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            "small = pattern(k - 1)",
            'blank = " " * len(small)',
            "top = [row * 3 for row in small]",
            "mid = ______",
            "return top + mid + top",
          ].join("\n"),
          javascript: [
            "const small = pattern(k - 1);",
            'const blank = " ".repeat(small.length);',
            "const top = small.map((row) => row.repeat(3));",
            "const mid = ______;",
            "return [...top, ...mid, ...top];",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["divide-and-conquer", "recursion-tree"],
  signalIds: ["sig-nested-structure"],
  estimatedMinutes: 25,
  xp: 50,
};
