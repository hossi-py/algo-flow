import type { Problem } from "@/types/content";

export const dfsDownhillRoutes: Problem = {
  id: "c:dfs-downhill-routes",
  slug: "dfs-downhill-routes",
  source: "curated",
  topic: "dfs",
  level: 4,
  title: "하산 길의 수",
  summary: "내리막 길만 따라 산꼭대기에서 마을까지 가는 길의 수를 세요",
  statement: [
    "노디가 산을 내려가요. 쉼터가 `n`개(0번 ~ `n-1`번) 있는데, 0번은 **산꼭대기**, `n-1`번은 **마을**이에요. 길 목록 `trails`의 `[a, b]`는 a에서 b로 내려가는 **한 방향 길**이에요. 모든 길이 내리막이라 한 번 지난 쉼터로 되돌아오는 일은 없어요.",
    "",
    "꼭대기에서 마을까지 가는 **서로 다른 길의 수**를 구해 주세요. 수가 매우 커질 수 있으니 `1,000,000,007`로 나눈 나머지를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`n`: 쉼터 수, `trails`: `[a, b]`(a → b) 길 목록이에요. 순환은 없어요.",
  outputFormat: "0번에서 n-1번까지 가는 길의 수를 1,000,000,007로 나눈 나머지",
  constraints: ["1 ≤ n ≤ 2,000", "0 ≤ trails의 길이 ≤ 5,000", "a ≠ b", "같은 길은 두 번 주어지지 않아요."],
  signature: {
    name: "solution",
    params: [
      { name: "n", type: { python: "int", javascript: "number" }, description: "쉼터 수" },
      { name: "trails", type: { python: "list[list[int]]", javascript: "number[][]" }, description: "내리막 길 목록" },
    ],
    returns: { type: { python: "int", javascript: "number" }, description: "길의 수 (나머지)" },
  },
  starterCode: {
    python: ["def solution(n, trails):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(n, trails) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [
        4,
        [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3],
        ],
      ],
      expected: 2,
      explanation: "0 → 1 → 3, 0 → 2 → 3 두 길이에요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "tricky",
      args: [
        4,
        [
          [0, 1],
          [0, 2],
          [1, 2],
          [2, 3],
        ],
      ],
      expected: 2,
      explanation: "0 → 2 → 3, 0 → 1 → 2 → 3 두 길이에요. 2번에서 마을까지의 길 수는 한 번만 계산하면 돼요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [1, []],
      expected: 1,
      failureNote: "꼭대기가 곧 마을이면 길은 1가지(움직이지 않기)예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "edge",
      args: [3, [[0, 1]]],
      expected: 0,
      failureNote: "마을까지 이어진 길이 없어요.",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [
        5,
        [
          [0, 1],
          [0, 2],
          [0, 3],
          [1, 4],
          [2, 4],
          [3, 4],
          [1, 2],
          [2, 3],
        ],
      ],
      expected: 6,
      failureNote: "여러 갈래가 섞여 있어요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        4,
        [
          [2, 3],
          [0, 3],
          [1, 0],
        ],
      ],
      expected: 1,
      failureNote: "꼭대기로 들어오는 길은 쓸 일이 없어요. 0 → 3 한 가지예요.",
    },
    {
      id: "hid-5",
      visibility: "hidden",
      purpose: "stress",
      args: [
        2000,
        [
          [0, 1],
          [0, 2],
          ...Array.from({ length: 998 * 4 }, (_, k) => {
            const layer = Math.floor(k / 4) + 1;
            const a = 2 * layer - 1 + (k % 4 >= 2 ? 1 : 0);
            const b = 2 * layer + 1 + (k % 2);
            return [a, b];
          }),
          [1997, 1999],
          [1998, 1999],
        ],
      ],
      expected: (() => {
        let x = 1;
        for (let i = 0; i < 999; i += 1) x = (x * 2) % 1000000007;
        return x;
      })(),
      failureNote: "두 갈래 길이 999번 이어져 길이 2^999가지예요. 길을 하나씩 세면 절대 끝나지 않아요.",
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
      body: [
        "순환 없는 방향 그래프에서 **경로의 개수**를 세요. 길을 하나하나 따라가면 갈래가 곱절로 늘어나서 너무 많아요.",
        "",
        '"v에서 마을까지 가는 길의 수"는 v에 **어떻게 도착했든 같아요**. → DFS + **메모이제이션**이에요.',
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`ways(v)` = v에서 마을까지 가는 길의 수",
        "- v가 마을이면 1",
        "- 아니면 v에서 내려갈 수 있는 모든 w의 `ways(w)`를 더한 값",
        "",
        "한 번 계산한 `ways(v)`는 `memo`에 저장해 두면 각 쉼터를 한 번씩만 계산해요. 더할 때마다 1,000,000,007로 나눈 나머지를 남겨요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "ways(v):",
        "    if v == n - 1: return 1",
        "    if v in memo: return memo[v]",
        "    total = 0",
        "    for w in graph[v]:",
        "        total = (total + ways(w)) % MOD",
        "    memo[v] = total",
        "    return total",
        "return ways(0)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["메모를 확인하고 저장하는 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            "def ways(v):",
            "    if v == n - 1:",
            "        return 1",
            "    if memo[v] != -1:",
            "        return ______",
            "    total = 0",
            "    for w in graph[v]:",
            "        total = (total + ways(w)) % MOD",
            "    memo[v] = total",
            "    return total",
          ].join("\n"),
          javascript: [
            "function ways(v) {",
            "  if (v === n - 1) return 1;",
            "  if (memo[v] !== -1) return ______;",
            "  let total = 0;",
            "  for (const w of graph[v]) total = (total + ways(w)) % MOD;",
            "  memo[v] = total;",
            "  return total;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["path-existence"],
  signalIds: ["sig-path-exists"],
  estimatedMinutes: 25,
  xp: 40,
};
