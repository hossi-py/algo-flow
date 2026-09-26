import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: ["23:50", 20],
    expected: "00:10",
    explanation: '자정을 넘어 "00:10"이에요.',
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: ["09:05", 0],
    expected: "09:05",
    explanation: '그대로 "09:05"예요. 앞의 0을 빼먹지 마세요.',
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: ["00:00", 1440],
    expected: "00:00",
    failureNote: '딱 하루 뒤라 "00:00"이에요.',
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: ["00:59", 1],
    expected: "01:00",
    failureNote: '"01:00"이에요.',
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "basic",
    args: ["10:00", 59],
    expected: "10:59",
    failureNote: '"10:59"예요.',
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: ["12:34", 1000000000],
    expected: "23:14",
    failureNote: "10억 분 뒤예요. 1분씩 더하면 느려요.",
  },
]);

export const simClockAdd: Problem = {
  id: "c:sim-clock-add",
  slug: "sim-clock-add",
  source: "curated",
  topic: "implementation",
  level: 1,
  title: "몇 분 뒤는 몇 시?",
  summary: "시각을 '자정부터 몇 분'으로 바꿔 더하고, 하루(1440분)로 나눈 나머지를 다시 시각으로 적어요",
  statement: [
    '지금 시각 `time`이 `"HH:MM"`(24시간제) 꼴로 주어져요. `minutes`분 뒤의 시각을 같은 꼴로 반환해 주세요.',
    "",
    '시와 분은 늘 두 자리로 적어요. (예: `"09:05"`) 자정을 넘기면 다음 날로 넘어가요.',
  ].join("\n"),
  inputFormat: "`time`: 지금 시각, `minutes`: 지날 분이에요.",
  outputFormat: '"HH:MM" 꼴의 시각',
  constraints: ['time은 "00:00" ~ "23:59"', "0 ≤ minutes ≤ 1,000,000,000"],
  signature: {
    name: "solution",
    params: [
      { name: "time", type: { python: "str", javascript: "string", java: "String" }, description: "지금 시각" },
      { name: "minutes", type: { python: "int", javascript: "number", java: "int" }, description: "지날 분" },
    ],
    returns: { type: { python: "str", javascript: "string", java: "String" }, description: "시각" },
  },
  starterCode: {
    python: ["def solution(time, minutes):", '    answer = ""', "    return answer", ""].join("\n"),
    javascript: ["function solution(time, minutes) {", '  let answer = "";', "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public String solution(String time, int minutes) {",
      '        String answer = "";',
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
      body: ["**시각 형식**을 읽고 계산하는 구현이에요. 시각은 분으로 바꾸면 더하기 쉬워요."].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        '1. `"HH:MM"`을 `:`로 쪼개 `시 × 60 + 분`을 구해요.',
        "2. `minutes`를 더하고 하루(1440분)로 나눈 나머지를 구해요.",
        "3. 다시 `시 = 총 분 ÷ 60`, `분 = 총 분 % 60`으로 바꾸고 두 자리로 채워 적어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "h, m = time을 ':'로 쪼개 정수로",
        "total = (h * 60 + m + minutes) % 1440",
        "return 두자리(total // 60) + ':' + 두자리(total % 60)",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["다시 시각으로 적는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["total = (h * 60 + m + minutes) % 1440", 'return f"{total // 60:02d}:{______:02d}"'].join("\n"),
          javascript: [
            "const total = (h * 60 + m + minutes) % 1440;",
            'const hh = String(Math.floor(total / 60)).padStart(2, "0");',
            'const mm = String(______).padStart(2, "0");',
            "return `${hh}:${mm}`;",
          ].join("\n"),
          java: [
            "long total = (h * 60L + m + minutes) % 1440;",
            'return String.format("%02d:%02d", total / 60, ______);',
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["time-calc"],
  signalIds: ["sig-time-format"],
  estimatedMinutes: 8,
  xp: 10,
};
