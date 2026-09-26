import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[2, 3, 5], 8],
    expected: [
      [2, 2, 2, 2],
      [2, 3, 3],
      [3, 5],
    ],
    explanation: "2를 네 번, 2 하나와 3 두 개, 3과 5. 모두 세 가지예요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[4], 3],
    expected: [],
    explanation: "4점 스티커로는 3점을 만들 수 없어요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "tricky",
    args: [[7, 3, 2], 7],
    expected: [[2, 2, 3], [7]],
    failureNote: "values가 정렬되어 있지 않아요. 조합 안도, 조합끼리도 정해진 순서로 담아야 해요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [[2, 3], 5],
    expected: [[2, 3]],
    failureNote: "[2, 3]과 [3, 2]는 같은 조합이라 한 번만 넣어요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [[6, 4], 12],
    expected: [
      [4, 4, 4],
      [6, 6],
    ],
    failureNote: "같은 스티커만 써도 되고 섞어도 돼요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "edge",
    args: [[5, 10], 1],
    expected: [],
    failureNote: "목표가 가장 작은 스티커보다 작아요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [[29, 2, 23, 3, 19, 5, 17, 7, 13, 11], 30],
    expected: (() => {
      const v = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
      const out: number[][] = [];
      const go = (s: number, r: number, p: number[]) => {
        if (r === 0) {
          out.push([...p]);
          return;
        }
        for (let i = s; i < v.length && v[i] <= r; i++) go(i, r - v[i], [...p, v[i]]);
      };
      go(0, 30, []);
      return out;
    })(),
    failureNote: "스티커 10종류로 30점을 만드는 조합 98가지예요.",
  },
]);

export const backtrackingStickerScore: Problem = {
  id: "c:backtracking-sticker-score",
  slug: "backtracking-sticker-score",
  source: "curated",
  topic: "backtracking",
  level: 3,
  title: "스티커로 점수 만들기",
  summary: "같은 스티커를 여러 번 써서 목표 점수를 만드는 모든 조합을 나열해요",
  statement: [
    "노디의 칭찬 스티커는 종류마다 점수가 달라요. 스티커 종류별 점수가 `values`로 주어지고, **같은 종류를 몇 장이든** 쓸 수 있어요.",
    "",
    "스티커 점수의 합이 정확히 `target`이 되는 **모든 조합**을 찾으려고 해요. 스티커를 붙이는 순서는 상관없어서, `[2, 3]`과 `[3, 2]`는 같은 조합이에요.",
    "",
    "조합마다 점수를 **오름차순**으로 적은 리스트로 나타내고, 조합들도 **사전순**(앞에서부터 비교해 작은 것 먼저)으로 담아 반환해 주세요. 만들 수 없으면 빈 리스트예요.",
  ].join("\n"),
  inputFormat: "`values`: 스티커 종류별 점수(서로 다름), `target`: 목표 점수예요.",
  outputFormat: "합이 target인 조합(오름차순 리스트)들을 사전순으로 담은 리스트",
  constraints: [
    "1 ≤ values의 길이 ≤ 10",
    "2 ≤ values[i] ≤ 40, 서로 달라요",
    "1 ≤ target ≤ 40",
    "만들 수 있는 조합은 150가지 이하예요",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "values",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "스티커 종류별 점수",
      },
      { name: "target", type: { python: "int", javascript: "number", java: "int" }, description: "목표 점수" },
    ],
    returns: {
      type: { python: "list[list[int]]", javascript: "number[][]", java: "List<List<Integer>>" },
      description: "합이 target인 모든 조합",
    },
  },
  starterCode: {
    python: ["def solution(values, target):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(values, target) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<List<Integer>> solution(int[] values, int target) {",
      "        List<List<Integer>> answer = new ArrayList<>();",
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
        "합이 딱 맞는 **모든 조합**을 찾아요 → **조합** 백트래킹이에요.",
        "",
        "순서가 상관없으니 같은 조합이 두 번 나오지 않게 하는 게 핵심이에요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. values를 **오름차순 정렬**해요.",
        "2. `pick(start, remain)`: start번 스티커부터만 고를 수 있어요. 그래서 조합 안의 점수가 늘 오름차순이 되고, [3, 2] 같은 순서는 나오지 않아요.",
        "3. 같은 스티커를 또 쓸 수 있으니, i번을 고른 다음에는 `pick(i, …)`로 **i부터 다시** 골라요 (i + 1이 아니에요).",
        "4. `remain`이 0이면 복사본을 저장해요. 고른 스티커가 remain보다 크면 그 뒤는 더 크니까 **멈춰요**(가지치기).",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "values 정렬",
        "function pick(start, remain):",
        "    if remain == 0: answer에 path의 복사본 추가, return",
        "    for i in start..len(values)-1:",
        "        if values[i] > remain: break",
        "        path에 values[i] 추가",
        "        pick(i, remain - values[i])     # 같은 스티커 다시 가능",
        "        path에서 마지막 빼기",
        "pick(0, target)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["같은 스티커를 또 쓸 수 있게 하면서도 순서만 다른 조합을 막는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "def pick(start, remain):",
            "    if remain == 0:",
            "        answer.append(path[:])",
            "        return",
            "    for i in range(start, len(values)):",
            "        if values[i] > remain:",
            "            break",
            "        path.append(values[i])",
            "        pick(______, remain - values[i])",
            "        path.pop()",
          ].join("\n"),
          javascript: [
            "function pick(start, remain) {",
            "  if (remain === 0) {",
            "    answer.push([...path]);",
            "    return;",
            "  }",
            "  for (let i = start; i < values.length && values[i] <= remain; i++) {",
            "    path.push(values[i]);",
            "    pick(______, remain - values[i]);",
            "    path.pop();",
            "  }",
            "}",
          ].join("\n"),
          java: [
            "void pick(int start, int remain) {",
            "    if (remain == 0) {",
            "        answer.add(new ArrayList<>(path));",
            "        return;",
            "    }",
            "    for (int i = start; i < values.length && values[i] <= remain; i++) {",
            "        path.add(values[i]);",
            "        pick(______, remain - values[i]);",
            "        path.remove(path.size() - 1);",
            "    }",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["combination", "constraint-pruning"],
  signalIds: ["sig-all-cases"],
  visualization: {
    presets: [
      problemPreset(
        "sticker-score-subset",
        "backtracking-subset",
        "고를까, 말까 트리",
        "부분집합 트리로 '앞에서부터 고르기'를 봐요. 시작 위치를 넘기면 같은 조합이 두 번 나오지 않아요.",
        [[1, 2, 3]],
      ),
    ],
  },
  estimatedMinutes: 18,
  xp: 30,
};
