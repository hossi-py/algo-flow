import { lazy } from "@/content/problems/lazy";
import type { Problem, TestCase } from "@/types/content";

const testCases = lazy((): TestCase[] => [
  {
    id: "ex-1",
    visibility: "example",
    purpose: "basic",
    args: [
      [
        ["pie", 5],
        ["bun", 2],
        ["tart", 4],
      ],
      3,
    ],
    expected: ["bun", "pie", "tart"],
    explanation: "pie 3분(남은 2) → bun 완성 → tart 3분(남은 1) → pie 완성 → tart 완성.",
  },
  {
    id: "ex-2",
    visibility: "example",
    purpose: "edge",
    args: [[["cake", 7]], 10],
    expected: ["cake"],
    explanation: "한 번에 다 구워지면 바로 완성이에요.",
  },
  {
    id: "hid-1",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        ["a", 1],
        ["b", 1],
        ["c", 1],
      ],
      1,
    ],
    expected: ["a", "b", "c"],
    failureNote: "모두 한 번에 끝나면 도착 순서 그대로예요.",
  },
  {
    id: "hid-2",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        ["a", 6],
        ["b", 3],
      ],
      3,
    ],
    expected: ["b", "a"],
    failureNote: "정확히 q분 남은 요리는 그 차례에 완성돼요.",
  },
  {
    id: "hid-3",
    visibility: "hidden",
    purpose: "tricky",
    args: [
      [
        ["long", 10],
        ["short", 1],
        ["mid", 4],
      ],
      2,
    ],
    expected: ["short", "mid", "long"],
    failureNote: "오래 걸리는 요리가 여러 바퀴를 돌아요.",
  },
  {
    id: "hid-4",
    visibility: "hidden",
    purpose: "basic",
    args: [
      [
        ["x", 4],
        ["y", 4],
        ["z", 4],
      ],
      1,
    ],
    expected: ["x", "y", "z"],
    failureNote: "모두 같은 시간이면 도착 순서대로 끝나요.",
  },
  {
    id: "hid-5",
    visibility: "hidden",
    purpose: "stress",
    args: [Array.from({ length: 300 }, (_, i) => [`d${i}`, ((i * 37) % 100) + 1]), 7],
    // prettier-ignore
    expected: ["d0","d19","d38","d46","d65","d73","d92","d100","d119","d138","d146","d165","d173","d192","d200","d219","d238","d246","d265","d273","d292","d3","d11","d30","d49","d57","d76","d84","d103","d111","d130","d149","d157","d176","d184","d203","d211","d230","d249","d257","d276","d284","d14","d22","d41","d60","d68","d87","d95","d114","d122","d141","d160","d168","d187","d195","d214","d222","d241","d260","d268","d287","d295","d6","d25","d33","d52","d71","d79","d98","d106","d125","d133","d152","d171","d179","d198","d206","d225","d233","d252","d271","d279","d298","d9","d17","d36","d44","d63","d82","d90","d109","d117","d136","d144","d163","d182","d190","d209","d217","d236","d244","d263","d282","d290","d1","d20","d28","d47","d55","d74","d93","d101","d120","d128","d147","d155","d174","d193","d201","d220","d228","d247","d255","d274","d293","d4","d12","d31","d39","d58","d66","d85","d104","d112","d131","d139","d158","d166","d185","d204","d212","d231","d239","d258","d266","d285","d15","d23","d42","d50","d69","d77","d96","d115","d123","d142","d150","d169","d177","d196","d215","d223","d242","d250","d269","d277","d296","d7","d26","d34","d53","d61","d80","d88","d107","d126","d134","d153","d161","d180","d188","d207","d226","d234","d253","d261","d280","d288","d18","d37","d45","d64","d72","d91","d99","d118","d137","d145","d164","d172","d191","d199","d218","d237","d245","d264","d272","d291","d299","d2","d10","d29","d48","d56","d75","d83","d102","d110","d129","d148","d156","d175","d183","d202","d210","d229","d248","d256","d275","d283","d13","d21","d40","d59","d67","d86","d94","d113","d121","d140","d159","d167","d186","d194","d213","d221","d240","d259","d267","d286","d294","d5","d24","d32","d51","d70","d78","d97","d105","d124","d132","d151","d170","d178","d197","d205","d224","d232","d251","d270","d278","d297","d8","d16","d35","d43","d62","d81","d89","d108","d116","d135","d143","d162","d181","d189","d208","d216","d235","d243","d262","d281","d289","d27","d54","d127","d154","d227","d254"],
    failureNote: "요리 300개가 여러 바퀴를 돌아요.",
  },
]);

export const queueRoundKitchen: Problem = {
  id: "c:queue-round-kitchen",
  slug: "queue-round-kitchen",
  source: "curated",
  topic: "queue-deque",
  level: 3,
  title: "돌아가며 굽는 오븐",
  summary: "오븐을 정해진 시간씩 돌아가며 쓸 때 요리가 끝나는 순서를 구해요",
  statement: [
    "노디의 주방에는 오븐이 하나뿐이에요. 요리들이 도착한 순서대로 줄을 서 있고, 오븐은 이렇게 써요.",
    "",
    "1. 줄 맨 앞 요리를 오븐에 넣고 **최대 q분** 동안 구워요.",
    "2. 남은 굽는 시간이 0이 되면 그 요리는 완성이에요.",
    "3. 아직 덜 구워졌으면 남은 시간을 줄여 두고 줄의 **맨 뒤**로 보내요.",
    "",
    "요리 목록 `dishes`의 각 원소는 `[이름, 필요한 굽는 시간]`이에요. 요리가 완성되는 순서대로 이름을 담은 리스트를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`dishes`: `[이름, 시간]` 쌍의 리스트 (도착 순서), `q`: 한 번에 구울 수 있는 최대 시간(분)이에요.",
  outputFormat: "완성되는 순서대로의 요리 이름 리스트",
  constraints: ["1 ≤ dishes의 길이 ≤ 1,000", "1 ≤ 시간 ≤ 1,000", "1 ≤ q ≤ 1,000", "요리 이름은 서로 달라요."],
  signature: {
    name: "solution",
    params: [
      {
        name: "dishes",
        type: { python: "list[list]", javascript: "Array<[string, number]>", java: "Object[][]" },
        description: "[이름, 굽는 시간] 목록",
      },
      { name: "q", type: { python: "int", javascript: "number", java: "int" }, description: "한 번에 굽는 최대 시간" },
    ],
    returns: { type: { python: "list[str]", javascript: "string[]", java: "List<String>" }, description: "완성 순서" },
  },
  starterCode: {
    python: ["def solution(dishes, q):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(dishes, q) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "import java.util.*;",
      "",
      "class Solution {",
      "    public List<String> solution(Object[][] dishes, int q) {",
      "        List<String> answer = new ArrayList<>();",
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
      body: ['"줄 맨 앞 요리를 넣고, 덜 되면 맨 뒤로" → **돌아가며 처리하기(라운드 로빈)** = **큐**예요.'].join("\n"),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 큐에 `[이름, 남은 시간]`을 도착 순서대로 넣어요.",
        "2. 큐가 빌 때까지: 앞에서 꺼내 남은 시간에서 q를 빼요.",
        "3. 0 이하가 되면 완성 목록에 추가, 아니면 줄어든 남은 시간으로 뒤에 다시 넣어요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "queue = dishes (도착 순서)",
        "while queue가 비어 있지 않음:",
        "    이름, 남은 = queue 앞에서 꺼내기",
        "    남은 = 남은 - q",
        "    if 남은 <= 0: done에 이름 추가",
        "    else: queue 뒤에 [이름, 남은] 넣기",
        "return done",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["덜 구워진 요리를 다시 줄 세우는 부분이에요."].join("\n"),
      code: {
        code: {
          python: [
            "while oven_line:",
            "    name, left = oven_line.popleft()",
            "    left -= q",
            "    if left <= 0:",
            "        done.append(name)",
            "    else:",
            "        ______",
          ].join("\n"),
          javascript: [
            "while (head < line.length) {",
            "  const [name, left] = line[head++];",
            "  if (left - q <= 0) done.push(name);",
            "  else ______;",
            "}",
          ].join("\n"),
          java: [
            "while (!line.isEmpty()) {",
            "    Object[] dish = line.poll();",
            "    String name = (String) dish[0];",
            "    int left = (int) dish[1];",
            "    if (left - q <= 0) done.add(name);",
            "    else ______;",
            "}",
          ].join("\n"),
        },
        caption: "요리 이름(문자열)과 시간(정수)이 섞여 있어서 Object[]로 받고, 꺼낼 때 (String) · (int)로 바꿔요.",
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["round-robin", "queue-simulation"],
  signalIds: ["sig-arrival-order"],
  estimatedMinutes: 15,
  xp: 30,
};
