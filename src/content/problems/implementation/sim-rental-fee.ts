import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      ["08:00 0002 OUT", "08:30 0001 OUT", "09:10 0002 IN", "10:00 0001 IN", "23:00 0002 OUT"],
      [60, 1000, 10, 200],
    ],
    expected: [1600, 2400],
    explanation:
      "0001은 90분이라 1000 + 3 × 200 = 1600원이에요. 0002는 70분 + 59분(23:59까지) = 129분이라 1000 + 7 × 200 = 2400원이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["12:00 0007 OUT"], [60, 1000, 10, 200]],
    expected: [14200],
    explanation: "23:59까지 719분이라 1000 + 66 × 200 = 14200원이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [
      ["10:00 0001 OUT", "11:00 0001 IN"],
      [60, 1000, 10, 200],
    ],
    expected: [1000],
    failureNote: "딱 기본 시간이라 1000원이에요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      ["10:00 0003 OUT", "11:21 0003 IN"],
      [60, 1000, 10, 200],
    ],
    expected: [1600],
    failureNote: "넘은 21분은 올림해서 3단위라 1600원이에요. 버리면 1400원이 돼서 틀려요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: [
      ["09:00 0010 OUT", "09:45 0002 OUT", "10:00 0010 IN", "10:30 0002 IN"],
      [30, 500, 15, 100],
    ],
    expected: [600, 700],
    failureNote: "번호 순서라 0002(45분, 600원)가 먼저, 0010(60분, 700원)이 나중이에요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "edge",
    args: [["23:58 0005 OUT"], [1, 10, 1, 1]],
    expected: [10],
    failureNote: "1분만 타서 기본 요금 10원이에요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [
      (() => {
        const recs = [""].slice(1);
        const f = (t = 0) => String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
        for (let k = 0; k < 60; k++)
          for (let b = 0; b < 300; b++) {
            const s = k * 24 + (b % 10);
            const e = k * 24 + 10 + ((b * 7 + k) % 13);
            const id = String(b).padStart(4, "0");
            recs.push(f(s) + " " + id + " OUT", f(e) + " " + id + " IN");
          }
        return recs.sort((x, y) => (x.slice(0, 5) < y.slice(0, 5) ? -1 : x.slice(0, 5) > y.slice(0, 5) ? 1 : 0));
      })(),
      [30, 1000, 7, 300],
    ],
    // prettier-ignore
    expected: [40000,38800,35200,33400,30400,28000,25600,22900,20800,17500,41800,37900,36400,32500,31000,27700,25900,22900,20500,18100,40900,38800,35500,34000,30100,28900,24700,23500,19900,18100,40900,38500,36100,33100,31300,27700,26500,22300,21100,16900,41500,37900,36100,33100,30700,28300,25300,23500,19900,18700,40300,39100,34900,33700,30100,28300,25300,22900,20500,17500,41500,37900,36700,32500,31300,27400,25900,22600,20500,17800,40900,38500,35500,33700,30400,28900,25000,23500,19600,18400,40600,38500,35800,33400,31000,28000,26200,22600,21400,17200,41500,37600,36400,32800,31000,28000,25600,23200,20200,18400,40600,39400,35200,34000,29800,28600,25000,23200,20200,17800,41200,38200,36400,32800,31600,27400,26200,22000,20800,17200,41200,38200,35800,33400,30400,28600,25000,23800,19900,18400,40000,38800,35200,33400,30400,28000,25600,22900,20800,17500,41800,37900,36400,32500,31000,27700,25900,22900,20500,18100,40900,38800,35500,34000,30100,28900,24700,23500,19900,18100,40900,38500,36100,33100,31300,27700,26500,22300,21100,16900,41500,37900,36100,33100,30700,28300,25300,23500,19900,18700,40300,39100,34900,33700,30100,28300,25300,22900,20500,17500,41500,37900,36700,32500,31300,27400,25900,22600,20500,17800,40900,38500,35500,33700,30400,28900,25000,23500,19600,18400,40600,38500,35800,33400,31000,28000,26200,22600,21400,17200,41500,37600,36400,32800,31000,28000,25600,23200,20200,18400,40600,39400,35200,34000,29800,28600,25000,23200,20200,17800,41200,38200,36400,32800,31600,27400,26200,22000,20800,17200,41200,38200,35800,33400,30400,28600,25000,23800,19900,18400,40000,38800,35200,33400,30400,28000,25600,22900,20800,17500,41800,37900,36400,32500,31000,27700,25900,22900,20500,18100,40900,38800,35500,34000,30100,28900,24700,23500,19900,18100,40900,38500,36100,33100,31300,27700,26500,22300,21100,16900],
    failureNote: "자전거 300대가 하루에 60번씩 빌려요.",
  },
]);

export const simRentalFee: Problem = {
  id: "c:sim-rental-fee",
  slug: "sim-rental-fee",
  source: "curated",
  topic: "implementation",
  level: 4,
  title: "자전거 대여 요금",
  summary: "기록을 쪼개 시각을 분으로 바꾸고, 자전거마다 탄 시간을 모은 뒤 요금 규칙대로 계산해요",
  statement: [
    '자전거 대여소의 하루 기록 `records`가 시각 순서대로 있어요. 기록은 `"HH:MM 번호 OUT"`(빌림)이나 `"HH:MM 번호 IN"`(돌려줌) 꼴이에요. 번호는 네 자리 숫자예요.',
    "",
    "자전거마다 그날 **탄 시간을 모두 더해** 요금을 매겨요. `fees = [기본 시간, 기본 요금, 단위 시간, 단위 요금]`이에요.",
    "",
    "- 탄 시간이 기본 시간 이하면 기본 요금만 내요.",
    "- 넘으면 기본 요금 + (넘은 시간을 단위 시간으로 나눠 **올림**) × 단위 요금이에요.",
    "- 23:59까지 돌려주지 않은 자전거는 23:59에 돌려준 것으로 봐요.",
    "",
    "그날 빌린 적 있는 자전거의 요금을 **번호가 작은 순서**대로 담아 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`records`: 대여 기록, `fees`: 요금 규칙이에요.",
  outputFormat: "자전거 번호 순서대로 요금",
  constraints: [
    "1 ≤ records의 길이 ≤ 40,000",
    "1 ≤ 기본 시간, 단위 시간 ≤ 1,439",
    "1 ≤ 기본 요금, 단위 요금 ≤ 100,000",
    "같은 자전거는 빌린 뒤에만 돌려줘요",
  ],
  signature: {
    name: "solution",
    params: [
      {
        name: "records",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "대여 기록",
      },
      {
        name: "fees",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "[기본 시간, 기본 요금, 단위 시간, 단위 요금]",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "int[]" },
      description: "번호 순서대로 요금",
    },
  },
  starterCode: {
    python: ["def solution(records, fees):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(records, fees) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(String[] records, int[] fees) {",
      "        int[] answer = new int[0];",
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
      body: ["**형식이 있는 기록**을 쪼개고 시각을 계산하는 구현이에요. 자전거별로 모으는 데 딕셔너리를 써요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 기록을 공백으로 쪼개 시각·번호·종류를 얻고, 시각은 `시 × 60 + 분`으로 바꿔요.",
        "2. `OUT`이면 빌린 시각을 적어 두고, `IN`이면 (지금 − 빌린 시각)을 그 자전거의 합계에 더하고 빌린 시각을 지워요.",
        "3. 끝까지 남은 빌린 시각은 23:59(1439분)에 돌려준 것으로 더해요.",
        "4. 번호 순으로 요금을 계산해요. 올림은 `(넘은 시간 + 단위 − 1) // 단위`로 할 수 있어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for 기록 in records:",
        "    t, 번호, 종류 = 쪼개기",
        "    OUT이면 start[번호] = t",
        "    IN이면 total[번호] += t - start[번호];  start에서 지우기",
        "남은 start마다 total += 1439 - 시작",
        "번호 순으로 요금 계산",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["요금을 계산하는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "base_time, base_fee, unit_time, unit_fee = fees",
            "if t <= base_time:",
            "    return base_fee",
            "return base_fee + ______ * unit_fee",
          ].join("\n"),
          javascript: [
            "const [baseTime, baseFee, unitTime, unitFee] = fees;",
            "if (t <= baseTime) return baseFee;",
            "return baseFee + ______ * unitFee;",
          ].join("\n"),
          java: ["if (t <= fees[0]) return fees[1];", "return fees[1] + ______ * fees[3];"].join("\n"),
        },
        caption: "TreeMap은 번호(키) 순서대로 꺼내 줘요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["time-calc"],
  signalIds: ["sig-time-format"],
  estimatedMinutes: 20,
  xp: 40,
};
