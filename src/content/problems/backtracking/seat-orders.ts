import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["노디", "보리", "새싹"]],
    expected: [
      ["노디", "보리", "새싹"],
      ["노디", "새싹", "보리"],
      ["보리", "노디", "새싹"],
      ["보리", "새싹", "노디"],
      ["새싹", "노디", "보리"],
      ["새싹", "보리", "노디"],
    ],
    explanation: "3 × 2 × 1 = 6가지예요. 첫 자리에 노디가 앉는 두 가지가 먼저 나와요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["노디"]],
    expected: [["노디"]],
    explanation: "혼자면 한 가지예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["b", "a"]],
    expected: [
      ["b", "a"],
      ["a", "b"],
    ],
    failureNote: "이름의 가나다순이 아니라 names에 적힌 순서를 따라요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [["A", "B", "C", "D"]],
    // prettier-ignore
    expected: [["A","B","C","D"],["A","B","D","C"],["A","C","B","D"],["A","C","D","B"],["A","D","B","C"],["A","D","C","B"],["B","A","C","D"],["B","A","D","C"],["B","C","A","D"],["B","C","D","A"],["B","D","A","C"],["B","D","C","A"],["C","A","B","D"],["C","A","D","B"],["C","B","A","D"],["C","B","D","A"],["C","D","A","B"],["C","D","B","A"],["D","A","B","C"],["D","A","C","B"],["D","B","A","C"],["D","B","C","A"],["D","C","A","B"],["D","C","B","A"]],
    failureNote: "4명이면 24가지예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [["해", "달", "별"]],
    expected: [
      ["해", "달", "별"],
      ["해", "별", "달"],
      ["달", "해", "별"],
      ["달", "별", "해"],
      ["별", "해", "달"],
      ["별", "달", "해"],
    ],
    failureNote: "names 순서대로 해, 달, 별을 먼저 앉혀 봐요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [["가", "나", "다", "라", "마", "바"]],
    expected: Array.from({ length: 720 }, (_, i) => {
      const pool = ["가", "나", "다", "라", "마", "바"];
      const fact = [120, 24, 6, 2, 1, 1];
      const out = [];
      let rest = i;
      for (const f of fact) {
        out.push(pool.splice(Math.floor(rest / f), 1)[0]);
        rest %= f;
      }
      return out;
    }),
    failureNote: "6명이면 720가지예요.",
  },
]);

export const backtrackingSeatOrders: Problem = {
  id: "c:backtracking-seat-orders",
  slug: "backtracking-seat-orders",
  source: "curated",
  topic: "backtracking",
  level: 2,
  title: "자리 배치표",
  summary: "친구들이 한 줄로 앉는 모든 순서를 만들어요",
  statement: [
    "노디와 친구들이 영화관에 한 줄로 앉아요. 친구 이름 목록 `names`가 주어질 때, 모두가 앉는 **모든 순서**를 반환해 주세요.",
    "",
    "나열 순서: 첫 자리에 `names`의 앞쪽 친구가 앉는 경우부터, 그다음 자리도 **남은 친구 중 `names`에서 앞쪽인 친구부터** 앉혀 보는 순서예요.",
  ].join("\n"),
  inputFormat: "`names`: 서로 다른 이름들의 리스트예요.",
  outputFormat: "앉는 순서(이름 리스트)들의 리스트",
  constraints: ["1 ≤ names의 길이 ≤ 6"],
  signature: {
    name: "solution",
    params: [
      {
        name: "names",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "친구 이름",
      },
    ],
    returns: {
      type: { python: "list[list[str]]", javascript: "string[][]", java: "List<List<String>>" },
      description: "모든 앉는 순서",
    },
  },
  starterCode: {
    python: ["def solution(names):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(names) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<List<String>> solution(String[] names) {",
      "        List<List<String>> answer = new ArrayList<>();",
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
        "모든 **순서**를 만들어요 → **순열** 백트래킹이에요.",
        "",
        '자리마다 "아직 안 앉은 친구" 중 한 명을 골라요.',
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "`used[i]`로 i번째 친구가 이미 앉았는지 기록해요.",
        "",
        "1. `path`에 n명이 모두 앉았으면 복사본을 결과에 추가해요.",
        "2. 아니면 i = 0, 1, … 순서로 **안 앉은 친구**를 골라:",
        "   - `used[i] = True`, `path`에 추가 (고르기)",
        "   - 다음 자리로 재귀 (더 깊이)",
        "   - `path`에서 빼고 `used[i] = False` (되돌리기)",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "place():",
        "    if len(path) == n: result에 path 복사본 추가; return",
        "    for i in 0..n-1:",
        "        if not used[i]:",
        "            used[i] = True; path에 names[i] 추가",
        "            place()",
        "            path에서 빼기; used[i] = False",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["되돌리기에서 빠진 한 줄을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i in range(n):",
            "    if not used[i]:",
            "        used[i] = True",
            "        path.append(names[i])",
            "        place()",
            "        path.pop()",
            "        ______",
          ].join("\n"),
          javascript: [
            "for (let i = 0; i < n; i += 1) {",
            "  if (!used[i]) {",
            "    used[i] = true;",
            "    path.push(names[i]);",
            "    place();",
            "    path.pop();",
            "    ______;",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "for (int i = 0; i < n; i++) {",
            "    if (!used[i]) {",
            "        used[i] = true;",
            "        path.add(names[i]);",
            "        place();",
            "        path.remove(path.size() - 1);",
            "        ______;",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["permutation"],
  signalIds: ["sig-all-cases", "sig-small-n"],
  visualization: {
    presets: [
      problemPreset(
        "seat-tree",
        "backtracking-permutation",
        "3명 자리 배치 트리",
        "자리마다 안 앉은 친구를 고르고, 돌아와서 다른 친구를 골라 봐요.",
        [[1, 2, 3]],
      ),
    ],
  },
  estimatedMinutes: 15,
  xp: 20,
};
