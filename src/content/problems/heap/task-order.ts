import type { Problem } from "@/types/content";

export const heapTaskOrder: Problem = {
  id: "c:heap-task-order",
  slug: "heap-task-order",
  source: "curated",
  topic: "heap",
  level: 4,
  title: "짧은 일부터 하는 요정",
  summary: "들어온 일을 힙에 넣고, 쉴 때마다 가장 짧은 일을 꺼내요",
  statement: [
    "일하는 요정이 한 명 있어요. `tasks[i] = [들어오는 시각, 걸리는 시간]`이에요. 요정은 이렇게 일해요.",
    "",
    "- 쉬고 있을 때 들어와 기다리는 일이 있으면, **걸리는 시간이 가장 짧은** 일을 시작해요. 같으면 **번호가 작은** 일이에요.",
    "- 기다리는 일이 없으면 다음 일이 들어올 때까지 쉬어요.",
    "- 일을 시작하면 끝날 때까지 멈추지 않아요.",
    "",
    "요정이 일을 처리한 **번호 순서**를 반환해 주세요.",
  ].join("\n"),
  inputFormat: "`tasks`: `[들어오는 시각, 걸리는 시간]` 목록이에요 (번호는 목록의 위치).",
  outputFormat: "처리한 순서대로의 일 번호",
  constraints: ["1 ≤ tasks의 길이 ≤ 5,000", "0 ≤ 들어오는 시각 ≤ 1,000,000", "1 ≤ 걸리는 시간 ≤ 1,000"],
  signature: {
    name: "solution",
    params: [
      {
        name: "tasks",
        type: { python: "list[list[int]]", javascript: "number[][]", java: "int[][]" },
        description: "일 목록",
      },
    ],
    returns: { type: { python: "list[int]", javascript: "number[]", java: "int[]" }, description: "처리 순서" },
  },
  starterCode: {
    python: ["def solution(tasks):", "    answer = []", "    return answer", ""].join("\n"),
    javascript: ["function solution(tasks) {", "  let answer = [];", "  return answer;", "}", ""].join("\n"),
    java: [
      "class Solution {",
      "    public int[] solution(int[][] tasks) {",
      "        int[] answer = new int[tasks.length];",
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
      args: [
        [
          [1, 2],
          [2, 4],
          [3, 2],
          [4, 1],
        ],
      ],
      expected: [0, 2, 3, 1],
      explanation: "1초에 0번 시작(3초 끝), 그때 1·2번 대기 → 짧은 2번(5초 끝), 3번(6초 끝), 1번이에요: [0, 2, 3, 1].",
    },
    {
      id: "ex-2",
      visibility: "example",
      purpose: "tricky",
      args: [
        [
          [7, 10],
          [7, 12],
          [7, 5],
          [7, 4],
          [7, 2],
        ],
      ],
      expected: [4, 3, 2, 0, 1],
      explanation: "모두 동시에 들어와요. 짧은 순서로 [4, 3, 2, 0, 1]이에요.",
    },
    {
      id: "hid-1",
      visibility: "hidden",
      purpose: "edge",
      args: [[[5, 3]]],
      expected: [0],
      failureNote: "일이 하나면 [0]이에요.",
    },
    {
      id: "hid-2",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [0, 5],
          [10, 1],
          [10, 1],
        ],
      ],
      expected: [0, 1, 2],
      failureNote: "5초부터 10초까지는 쉬어요. 시간이 같으면 번호 순: [0, 1, 2].",
    },
    {
      id: "hid-3",
      visibility: "hidden",
      purpose: "tricky",
      args: [
        [
          [0, 10],
          [1, 1],
          [2, 1],
        ],
      ],
      expected: [0, 1, 2],
      failureNote: "짧은 일이 들어와도 하던 일을 멈추지 않아요: [0, 1, 2].",
    },
    {
      id: "hid-4",
      visibility: "hidden",
      purpose: "stress",
      args: [Array.from({ length: 5000 }, (_, i) => [((i * 7919) % 5000) * 3, ((i * 104729) % 50) + 1])],
      expected: (() => {
        const t = Array.from({ length: 5000 }, (_, i) => [((i * 7919) % 5000) * 3, ((i * 104729) % 50) + 1]).map(
          ([e, d], i) => ({ e, d, i }),
        );
        const order = [];
        const done = new Array(t.length).fill(false);
        let time = 0;
        for (let n = 0; n < t.length; n++) {
          let best = -1;
          for (let j = 0; j < t.length; j++) {
            if (done[j] || t[j].e > time) continue;
            if (best < 0 || t[j].d < t[best].d || (t[j].d === t[best].d && j < best)) best = j;
          }
          if (best < 0) {
            let next = -1;
            for (let j = 0; j < t.length; j++)
              if (
                !done[j] &&
                (next < 0 ||
                  t[j].e < t[next].e ||
                  (t[j].e === t[next].e && t[j].d < t[next].d) ||
                  (t[j].e === t[next].e && t[j].d === t[next].d && j < next))
              )
                next = j;
            time = t[next].e;
            n--;
            continue;
          }
          done[best] = true;
          order.push(best);
          time += t[best].d;
        }
        return order;
      })(),
      failureNote:
        "일 5,000개예요. 쉴 때마다 기다리는 일을 모두 훑으면 약 2천5백만 번이라 느려요. 들어온 일을 힙에 넣으세요.",
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
      body: ["기다리는 일이 **계속 바뀌고**, 매번 **가장 짧은** 것을 꺼내요 → 들어온 일을 넣는 **힙**이에요."].join(
        "\n",
      ),
      xpPenaltyRate: 0.05,
    },
    {
      step: 2,
      kind: "approach",
      title: "어떻게 접근할까요?",
      body: [
        "1. 일을 들어오는 시각 순으로 정렬해요 (번호도 함께).",
        "2. 지금 시각까지 들어온 일을 모두 힙 `(걸리는 시간, 번호)`에 넣어요.",
        "3. 힙이 비었으면 다음 일이 들어오는 시각으로 건너뛰어요.",
        "4. 아니면 가장 짧은 일을 꺼내 처리하고, 시각을 그만큼 늘려요.",
      ].join("\n"),
      xpPenaltyRate: 0.15,
    },
    {
      step: 3,
      kind: "pseudocode",
      title: "의사코드",
      body: [
        "~~~text",
        "order = 들어오는 시각 순 번호들; i = 0; time = 0",
        "while 결과 < n:",
        "    while i < n and 들어온 시각[order[i]] <= time: push((시간, 번호)); i += 1",
        "    if 힙이 비었으면: time = 들어온 시각[order[i]]; continue",
        "    d, j = pop(); 결과에 j 추가; time += d",
        "~~~",
      ].join("\n"),
      xpPenaltyRate: 0.3,
    },
    {
      step: 4,
      kind: "key-code",
      title: "핵심 코드",
      body: ["지금까지 들어온 일을 힙에 넣는 반복이에요. 빈칸을 채워 보세요."].join("\n"),
      code: {
        code: {
          python: [
            "while i < n and ______:",
            "    j = order[i]",
            "    heapq.heappush(h, (tasks[j][1], j))",
            "    i += 1",
          ].join("\n"),
          javascript: [
            "while (i < n && ______) {",
            "  const j = order[i];",
            "  h.push([tasks[j][1], j]);",
            "  i++;",
            "}",
          ].join("\n"),
          java: [
            "while (i < n && ______) {",
            "    int j = order[i];",
            "    h.offer(new int[] {tasks[j][1], j});",
            "    i++;",
            "}",
          ].join("\n"),
        },
      },
      xpPenaltyRate: 0.5,
    },
  ],
  patternTags: ["heap-scheduling"],
  signalIds: ["sig-repeated-min"],
  estimatedMinutes: 20,
  xp: 40,
};
