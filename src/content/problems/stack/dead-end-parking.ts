import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [["in 3", "in 7", "out", "in 5"]],
    expected: [7, 5, 3],
    explanation: "7이 먼저 나가요. 문을 닫을 때는 입구 쪽인 5, 그다음 3이 나가서 [7, 5, 3]이에요.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [["out", "in 1", "out", "out"]],
    expected: [1],
    explanation: "빈 골목의 out은 아무 일도 없어요. 1만 한 번 나가요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "edge",
    args: [["in 1", "in 2", "in 3"]],
    expected: [3, 2, 1],
    failureNote: "out이 없어도 문을 닫을 때 모두 나가요. 입구 쪽(늦게 온 차)부터예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "basic",
    args: [["in 4", "out", "in 8", "out", "in 6", "out"]],
    expected: [4, 8, 6],
    failureNote: "들어오자마자 나가면 들어온 순서 그대로예요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [["in 10", "in 20", "out", "out", "out", "in 30"]],
    expected: [20, 10, 30],
    failureNote: "세 번째 out은 빈 골목이라 무시해요. 30은 문 닫을 때 나가요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 1000 }, (_, i) => (i < 600 ? "in " + (i + 1) : "out"))],
    expected: Array.from({ length: 600 }, (_, i) => 600 - i),
    failureNote: "차 600대가 들어오고 400대가 나간 뒤, 나머지는 문 닫을 때 나가요.",
  },
]);

export const stackDeadEndParking: Problem = {
  id: "c:stack-dead-end-parking",
  slug: "stack-dead-end-parking",
  source: "curated",
  topic: "stack",
  level: 1,
  title: "막다른 골목 주차장",
  summary: "한쪽이 막힌 골목에서 차가 나가는 순서를 구해요",
  statement: [
    "노디네 동네에는 한쪽이 막힌 좁은 주차 골목이 있어요. 차는 입구로 들어가고 **입구로만 나올 수 있어서**, 가장 늦게 들어온 차가 가장 먼저 나와요.",
    "",
    '- `"in x"`: x번 차가 골목에 들어와요.',
    '- `"out"`: 입구에 가장 가까운 차가 나가요. 골목이 비어 있으면 아무 일도 없어요.',
    "",
    "명령을 모두 실행한 뒤에는 골목 문을 닫아야 해서, 남은 차가 **입구 쪽부터 한 대씩** 모두 나가요.",
    "",
    "차가 나간 순서대로 차 번호를 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: '`commands`: `"in x"`, `"out"` 문자열의 리스트예요.',
  outputFormat: "나간 차 번호를 나간 순서대로 담은 리스트",
  constraints: ["1 ≤ commands의 길이 ≤ 1,000", "1 ≤ x ≤ 10,000", "차 번호는 서로 달라요"],
  signature: {
    name: "solution",
    params: [
      {
        name: "commands",
        type: { python: "list[str]", javascript: "string[]", java: "String[]" },
        description: "명령 목록",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" },
      description: "나간 차 번호 (나간 순서)",
    },
  },
  starterCode: {
    python: ["def solution(commands):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(commands) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(String[] commands) {",
      "        List<Integer> answer = new ArrayList<>();",
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
      title: "어떤 구조일까요?",
      body: [
        "들어간 곳(입구)으로만 나오고, **가장 늦게 들어온 차가 가장 먼저** 나와요 → **스택**이에요.",
        "",
        "in은 push, out은 pop이에요. 골목 입구가 스택의 맨 위(top)예요.",
      ].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 리스트 `lane`(골목)과 결과 리스트 `answer`를 준비해요.",
        "2. in → lane 끝에 추가. out → lane이 비어 있지 않을 때만 끝에서 꺼내 answer에 추가.",
        "3. 명령이 끝나면 lane이 빌 때까지 끝에서 꺼내 answer에 추가해요 (문 닫기).",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "for 명령 in commands:",
        "    in x → lane에 x 추가",
        "    out  → lane이 비어 있지 않으면 lane에서 꺼낸 값을 answer에 추가",
        "while lane이 비어 있지 않은 동안:",
        "    lane에서 꺼낸 값을 answer에 추가",
        "return answer",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드: 문 닫기",
      body: ["명령이 끝난 뒤 남은 차를 모두 내보내는 부분이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["# 문 닫기: 남은 차를 입구 쪽부터", "while ______:", "    answer.append(lane.pop())"].join("\n"),
          javascript: ["// 문 닫기: 남은 차를 입구 쪽부터", "while (______) {", "  answer.push(lane.pop());", "}"].join(
            "\n",
          ),
          java: ["// 문 닫기: 남은 차를 입구 쪽부터", "while (______) {", "    answer.add(lane.pop());", "}"].join(
            "\n",
          ),
        },
        caption: "Java는 Deque<Integer> lane = new ArrayDeque<>()를 스택으로 써요 (push · pop · isEmpty).",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["stack-simulation"],
  signalIds: ["sig-latest-first"],
  visualization: {
    presets: [
      problemPreset(
        "dead-end-parking-ex1",
        "stack-basic",
        "예제 1",
        "in은 push, out은 pop이에요. 마지막 두 번의 pop은 문을 닫을 때 나가는 차예요.",
        [["push 3", "push 7", "pop", "push 5", "pop", "pop"]],
      ),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
