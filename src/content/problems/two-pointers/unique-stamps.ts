import type { Problem } from "@/types/content";
import { problemPreset } from "@/content/visualizations";

export const twoPointersUniqueStamps: Problem = {
  id: "c:two-pointers-unique-stamps",
  slug: "two-pointers-unique-stamps",
  source: "curated",
  topic: "two-pointers",
  level: 1,
  title: "도장 중복 없애기",
  summary: "읽는 손가락과 쓰는 손가락으로, 새 값만 앞쪽에 남겨요",
  statement: [
    "노디의 도장 번호 목록 `stamps`가 **작은 번호부터** 정렬돼 있어요. 같은 번호가 여러 번 있을 수 있어요.",
    "",
    "같은 번호는 하나만 남기고, 순서를 그대로 지킨 목록을 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`stamps`: 오름차순 도장 번호예요.",
  outputFormat: "중복을 없앤 목록",
  constraints: ["1 ≤ stamps의 길이 ≤ 100,000", "−1,000,000 ≤ 번호 ≤ 1,000,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "stamps",
        type: { python: "list[int]", javascript: "number[]", java: "int[]" },
        description: "오름차순 도장 번호",
      },
    ],
    returns: {
      type: { python: "list[int]", javascript: "number[]", java: "List<Integer>" },
      description: "중복 없는 목록",
    },
  },
  starterCode: {
    python: ["def solution(stamps):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(stamps) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<Integer> solution(int[] stamps) {",
      "        List<Integer> answer = new ArrayList<>();",
      "        return answer;",
      "    }",
      "}",
      "",
    ].join("\n"),
  },
  testCases: [
    {
      id: "ex-1",
      visibility: "example",
      purpose: "basic",
      args: [[1, 1, 2, 3, 3, 3, 5]],
      expected: [1, 2, 3, 5],
      explanation: "[1, 2, 3, 5]예요.",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "edge",
      args: [[4, 4, 4]],
      expected: [4],
      explanation: "모두 같으면 [4]예요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[7]],
      expected: [7],
      failureNote: "하나면 그대로예요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "basic",
      args: [[-3, -3, 0, 2, 2]],
      expected: [-3, 0, 2],
      failureNote: "음수도 똑같아요: [-3, 0, 2].",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "basic",
      args: [[1, 2, 3]],
      expected: [1, 2, 3],
      failureNote: "중복이 없으면 그대로예요.",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 100000 }, (_, i) => Math.floor(i / 3))],
      expected: Array.from({ length: 33334 }, (_, i) => i),
      failureNote:
        "10만 개예요. 값마다 앞에서 이미 넣었는지 리스트를 훑으면 시간 초과예요. 정렬돼 있으니 바로 앞 값만 보면 돼요.",
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
      body: ["**정렬된** 목록에서 순서를 지키며 걸러 내기 → 같은 값은 붙어 있어요. **같은 방향 두 포인터**예요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 결과 목록(쓰는 손가락)에 첫 값을 넣어요.",
        "2. 읽는 손가락으로 나머지를 훑으며, 결과의 **마지막 값과 다를 때만** 결과에 붙여요.",
        "",
        "정렬돼 있어서 같은 값은 반드시 붙어 있으니, 바로 앞 값만 비교하면 돼요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "result = [stamps[0]]",
        "for x in stamps[1:]:",
        "    if x != result[-1]: result에 x 추가",
        "return result",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["새 값인지 확인하는 조건이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: ["result = [stamps[0]]", "for x in stamps[1:]:", "    if ______:", "        result.append(x)"].join(
            "\n",
          ),
          javascript: [
            "const result = [stamps[0]];",
            "for (let i = 1; i < stamps.length; i++) {",
            "  if (______) result.push(stamps[i]);",
            "}",
          ].join("\n"),
          java: [
            "answer.add(stamps[0]);",
            "for (int i = 1; i < stamps.length; i++) {",
            "    if (______) answer.add(stamps[i]);",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["same-direction"],
  signalIds: ["sig-in-place"],
  visualization: {
    presets: [
      problemPreset(
        "two-pointers-unique-stamps-ex1",
        "tp-dedupe",
        "새 값만 앞쪽에 쓰기",
        "읽는 손가락은 매번, 쓰는 손가락은 새 값일 때만 앞으로 가요.",
        [[1, 1, 2, 3, 3, 3, 5]],
      ),
    ],
  },
  estimatedMinutes: 8,
  xp: 10,
};
