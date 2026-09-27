import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [[1, 2, 3, 0, 2]],
    expected: 3,
    explanation: "1일에 사고 2일에 팔고(+1), 3일 쉬고, 4일에 사서 5일에 팔면(+2) 3이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[5, 4, 3]],
    expected: 0,
    explanation: "값이 계속 내려가면 아무것도 안 해서 0이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [[7]],
    expected: 0,
    failureNote: "하루뿐이면 0이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [[1, 5]],
    expected: 4,
    failureNote: "사서 바로 팔면 4예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [[1, 3, 1, 3]],
    expected: 2,
    failureNote:
      "2일에 팔면 3일엔 쉬어야 해서 4일에만 팔 수 있어요. 한 번(1→3)과 같은 2예요. 쉬는 날을 빼먹으면 4가 나와요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [[2, 1, 4, 5, 2, 9, 7]],
    expected: 10,
    failureNote: "10이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 100000 }, (_, i) => ((i * 7919) % 1000) + 1)],
    expected: 7443900,
    failureNote: "10만 일이에요. 사고파는 날을 모두 골라 보면 끝나지 않아요.",
  },
]);

export const dpBerryMarket: Problem = {
  id: "c:dp-berry-market",
  slug: "dp-berry-market",
  source: "curated",
  topic: "dp",
  level: 5,
  title: "딸기 장터에서 사고팔기",
  summary: "'들고 있음 / 방금 팖 / 쉬는 중' 세 상태의 최대 이익을 날마다 갱신해요",
  statement: [
    "노디가 딸기 장터에서 딸기 한 상자를 사고팔아요. `prices[i]`는 i일의 딸기 값이에요.",
    "",
    "- 한 번에 **한 상자**만 들고 있을 수 있어요 (팔아야 다시 살 수 있어요).",
    "- 판 **다음 날은 쉬어야** 해서 살 수 없어요.",
    "- 여러 번 사고팔 수 있고, 아무것도 안 해도 돼요.",
    "",
    "얻을 수 있는 **최대 이익**을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`prices`: 날마다 딸기 값이에요.",
  outputFormat: "최대 이익",
  constraints: ["1 ≤ prices의 길이 ≤ 100,000", "1 ≤ 값 ≤ 1,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "prices",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "날마다 딸기 값",
      },
    ],
    returns: { type: { python: "int", javascript: "number", java: "int" }, description: "최대 이익" },
  },
  starterCode: {
    python: ["def solution(prices):", "    answer = 0", "    return answer", ""].join("\n"),
    javascript: ["function solution(prices) {", "  let answer = 0;", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int solution(int[] prices) {",
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
        "날마다 할 수 있는 일이 **지금 상태**(들고 있나? 방금 팔았나?)에 따라 달라요 → **상태를 나눈 DP**예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "하루가 끝났을 때 세 상태의 최대 이익을 적어요.",
        "",
        "- `hold`: 상자를 **들고 있음** = max(어제도 hold, 어제 **rest**였고 오늘 삼 → rest − 값)",
        "- `sold`: 오늘 **팔았음** = 어제 hold + 값",
        "- `rest`: 들고 있지 않고 오늘 안 팖 = max(어제 rest, 어제 sold)",
        "",
        "오늘 사려면 어제가 sold가 아니라 **rest**여야 해요. 그게 쉬는 날 규칙이에요. 답은 max(sold, rest)예요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "hold, sold, rest = -무한대, 0, 0",
        "for p in prices:",
        "    hold, sold, rest = max(hold, rest - p), hold + p, max(rest, sold)",
        "return max(sold, rest)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["세 상태를 한꺼번에 갱신하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "for p in prices:",
            "    hold, sold, rest = max(hold, ______), hold + p, max(rest, sold)",
            "return max(sold, rest)",
          ].join("\n"),
          javascript: [
            "for (const p of prices) {",
            "  const nextHold = Math.max(hold, ______);",
            "  const nextSold = hold + p;",
            "  const nextRest = Math.max(rest, sold);",
            "  hold = nextHold; sold = nextSold; rest = nextRest;",
            "}",
          ].join("\n"),
          java: [
            "for (int p : prices) {",
            "    long nextHold = Math.max(hold, ______);",
            "    long nextSold = hold + p;",
            "    long nextRest = Math.max(rest, sold);",
            "    hold = nextHold; sold = nextSold; rest = nextRest;",
            "}",
          ].join("\n"),
        },
        caption: "−무한대 대신 아주 작은 long 값을 써서 더해도 넘치지 않게 해요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["state-dp"],
  signalIds: ["sig-best-choice-sequence"],
  estimatedMinutes: 25,
  xp: 50,
};
