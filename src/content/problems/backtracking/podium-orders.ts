import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["mina", "jun", "ara"], 2],
    expected: [
      ["mina", "jun"],
      ["mina", "ara"],
      ["jun", "mina"],
      ["jun", "ara"],
      ["ara", "mina"],
      ["ara", "jun"],
    ],
    explanation: "1등이 mina일 때 2등은 jun, ara 순서로 세워 봐요. 그다음 1등이 jun, ara인 경우예요. 모두 6가지예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["bo"], 1],
    expected: [["bo"]],
    explanation: "후보가 한 명이면 한 가지예요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [["a", "b", "c"], 3],
    expected: [
      ["a", "b", "c"],
      ["a", "c", "b"],
      ["b", "a", "c"],
      ["b", "c", "a"],
      ["c", "a", "b"],
      ["c", "b", "a"],
    ],
    failureNote: "셋 모두 서는 순서는 6가지예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [["zed", "amy", "kai"], 2],
    expected: [
      ["zed", "amy"],
      ["zed", "kai"],
      ["amy", "zed"],
      ["amy", "kai"],
      ["kai", "zed"],
      ["kai", "amy"],
    ],
    failureNote: "이름을 가나다(알파벳)순으로 정렬하지 말고 주어진 순서대로 세워 봐요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [["x", "y", "z", "w"], 1],
    expected: [["x"], ["y"], ["z"], ["w"]],
    failureNote: "한 자리면 한 명씩이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "tricky",
    args: [["a", "b", "c", "d"], 3],
    // prettier-ignore
    expected: [["a","b","c"],["a","b","d"],["a","c","b"],["a","c","d"],["a","d","b"],["a","d","c"],["b","a","c"],["b","a","d"],["b","c","a"],["b","c","d"],["b","d","a"],["b","d","c"],["c","a","b"],["c","a","d"],["c","b","a"],["c","b","d"],["c","d","a"],["c","d","b"],["d","a","b"],["d","a","c"],["d","b","a"],["d","b","c"],["d","c","a"],["d","c","b"]],
    failureNote: "한 사람을 세웠다 내린 뒤에는 '사용 안 함'으로 되돌려야 다음 순서에서 다시 세울 수 있어요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 7 }, (_, i) => "p" + i), 4],
    expected: (() => {
      const names = Array.from({ length: 7 }, (_, i) => "p" + i);
      const out: string[][] = [];
      const go = (p: string[], used: Set<number>) => {
        if (p.length === 4) {
          out.push([...p]);
          return;
        }
        names.forEach((nm, i) => {
          if (!used.has(i)) go([...p, nm], new Set([...used, i]));
        });
      };
      go([], new Set());
      return out;
    })(),
    failureNote: "7명 중 4명을 세우는 순서, 840가지예요.",
  },
]);

export const backtrackingPodiumOrders: Problem = {
  id: "c:backtracking-podium-orders",
  slug: "backtracking-podium-orders",
  source: "curated",
  topic: "backtracking",
  level: 2,
  title: "시상대에 서는 순서",
  summary: "후보 중 k명을 골라 1등부터 k등까지 세우는 모든 순서를 나열해요",
  statement: [
    "노디네 반 달리기 대회 후보 `names`가 있어요. 시상대에는 **1등부터 k등까지** `k`명이 서요.",
    "",
    "누가 몇 등에 서는지까지 따져서, 시상대에 서는 **모든 순서**를 나열하려고 해요. 한 사람이 두 자리에 설 수는 없어요.",
    "",
    "각 순서를 `[1등, 2등, …, k등]` 이름 리스트로 나타내 모두 담은 리스트를 반환해 주세요. 순서는 이렇게 정해요: 1등 자리에 `names`의 **앞사람부터** 차례로 세워 보고, 그다음 자리도 남은 사람 중 `names`의 앞사람부터 세워 봐요.",
  ].join("\n"),
  inputFormat: "`names`: 후보 이름 리스트(서로 다름), `k`: 시상대 자리 수예요.",
  outputFormat: "시상대 순서(이름 리스트)들을 정해진 순서로 담은 리스트",
  constraints: ["1 ≤ names의 길이 ≤ 7", "1 ≤ k ≤ names의 길이", "이름은 영어 소문자와 숫자로 된 1~10글자예요"],
  signature: {
    name: "solution",
    params: [
      {
        name: "names",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "후보 이름",
      },
      { name: "k", type: { python: "int", javascript: "number", java: "int" }, description: "시상대 자리 수" },
    ],
    returns: {
      type: { python: "list[list[str]]", javascript: "string[][]", java: "List<List<String>>" },
      description: "모든 시상대 순서",
    },
  },
  starterCode: {
    python: ["def solution(names, k):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(names, k) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<List<String>> solution(String[] names, int k) {",
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
      body: ["누가 **몇 등**인지(순서)가 중요하고, 모든 경우를 나열해요 → **순열** 백트래킹이에요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. `used` 배열로 이미 시상대에 선 사람을 표시해요.",
        "2. `path`(지금까지 세운 사람들)의 길이가 k가 되면 복사본을 answer에 넣어요.",
        "3. 아니면 names를 앞에서부터 보며, 아직 안 선 사람을 세워요: `used = True`, path에 추가 → 다음 자리 → path에서 빼고 **`used = False`로 되돌리기**.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "function pick():",
        "    if len(path) == k: answer에 path의 복사본 추가, return",
        "    for i in 0..n-1:",
        "        if not used[i]:",
        "            used[i] = true, path에 names[i] 추가",
        "            pick()",
        "            path에서 마지막 빼기, used[i] = false",
        "pick()",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["세웠던 사람을 내리는 되돌리기 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for i, name in enumerate(names):",
            "    if not used[i]:",
            "        used[i] = True",
            "        path.append(name)",
            "        pick()",
            "        path.pop()",
            "        ______   # 되돌리기",
          ].join("\n"),
          javascript: [
            "names.forEach((name, i) => {",
            "  if (used[i]) return;",
            "  used[i] = true;",
            "  path.push(name);",
            "  pick();",
            "  path.pop();",
            "  ______; // 되돌리기",
            "});",
          ].join("\n"),
          java: [
            "for (int i = 0; i < names.length; i++) {",
            "    if (used[i]) continue;",
            "    used[i] = true;",
            "    path.add(names[i]);",
            "    pick();",
            "    path.remove(path.size() - 1);",
            "    ______;   // 되돌리기",
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
        "podium-orders-tree",
        "backtracking-permutation",
        "순열 선택 트리",
        "세 명을 모두 세우는 경우예요. 고르고, 들어가고, 되돌리는 흐름을 봐요.",
        [[1, 2, 3]],
      ),
    ],
  },
  estimatedMinutes: 12,
  xp: 20,
};
