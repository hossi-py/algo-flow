import type { ProblemDraft } from "@/lib/ai/schemas";
import type { GenerationRequest } from "@/types";

export const DRAFT_REQUEST: GenerationRequest = {
  topic: "dfs",
  level: 3,
  focusPatterns: ["connected-components"],
  weakSignalIds: ["sig-connected-group"],
};

export const REFERENCE_SOLUTION = [
  "def solution(n, links):",
  "    graph = [[] for _ in range(n)]",
  "    for a, b in links:",
  "        graph[a].append(b)",
  "        graph[b].append(a)",
  "    seen = [False] * n",
  "    groups = 0",
  "    for start in range(n):",
  "        if seen[start]:",
  "            continue",
  "        groups += 1",
  "        stack = [start]",
  "        seen[start] = True",
  "        while stack:",
  "            node = stack.pop()",
  "            for nxt in graph[node]:",
  "                if not seen[nxt]:",
  "                    seen[nxt] = True",
  "                    stack.append(nxt)",
  "    return groups",
  "",
].join("\n");

/** 검증을 통과하는 초안: 섬 사이 다리로 이어진 무리 수 세기 (테스트와 개발용 모의 AI가 함께 쓴다) */
export function validDraft(overrides: Partial<ProblemDraft> = {}): ProblemDraft {
  return {
    title: "다리로 이어진 섬 무리",
    summary: "다리로 오갈 수 있는 섬끼리 묶었을 때 무리가 몇 개인지 세요",
    statement: [
      "노디는 섬이 `n`개 있는 바다를 여행하고 있어요. 섬에는 0부터 `n - 1`까지 번호가 붙어 있어요.",
      "",
      "`links`의 각 원소 `[a, b]`는 섬 a와 섬 b 사이에 양방향 다리가 있다는 뜻이에요. 다리를 여러 번 건너서라도 오갈 수 있는 섬들은 같은 **무리**예요.",
      "",
      "섬 무리가 모두 몇 개인지 반환해 주세요.",
    ].join("\n"),
    inputFormat: "`n`: 섬의 수, `links`: 다리 목록 ([a, b] 쌍의 리스트)",
    outputFormat: "섬 무리의 개수 (정수)",
    constraints: ["1 ≤ n ≤ 1,000", "0 ≤ links의 길이 ≤ 2,000", "0 ≤ a, b < n, a ≠ b"],
    params: [
      { name: "n", type: { python: "int", javascript: "number" }, description: "섬의 수" },
      {
        name: "links",
        type: { python: "list[list[int]]", javascript: "number[][]" },
        description: "다리 목록",
      },
    ],
    returns: { type: { python: "int", javascript: "number" }, description: "무리의 개수" },
    compare: "exact",
    referenceSolution: REFERENCE_SOLUTION,
    testInputs: [
      {
        argsJson: "[5, [[0, 1], [1, 2], [3, 4]]]",
        visibility: "example",
        purpose: "basic",
        note: "0-1-2와 3-4, 두 무리예요",
      },
      { argsJson: "[3, []]", visibility: "example", purpose: "edge", note: "다리가 없으면 섬마다 따로예요" },
      { argsJson: "[1, []]", visibility: "hidden", purpose: "edge", note: "섬이 하나뿐이에요" },
      {
        argsJson: "[4, [[0, 1], [1, 2], [2, 3], [3, 0]]]",
        visibility: "hidden",
        purpose: "tricky",
        note: "고리 모양으로 이어진 섬들이에요",
      },
      {
        argsJson: "[6, [[0, 1], [0, 1], [2, 3]]]",
        visibility: "hidden",
        purpose: "tricky",
        note: "같은 다리가 두 번 주어져요",
      },
      {
        argsJson: "[7, [[5, 6], [4, 5], [0, 3]]]",
        visibility: "hidden",
        purpose: "basic",
        note: "번호 순서와 상관없이 이어져요",
      },
      {
        argsJson: JSON.stringify([1000, Array.from({ length: 999 }, (_, i) => [i, i + 1])]),
        visibility: "hidden",
        purpose: "stress",
        note: "1,000개 섬이 한 줄로 길게 이어져요",
      },
    ],
    patternTags: ["connected-components"],
    signalIds: ["sig-connected-group", "sig-relations-given", "sig-unknown"],
    hints: [
      { title: "어떤 유형일까요?", body: "이어진 덩어리의 개수를 세는 **연결 요소** 문제예요.", code: null },
      {
        title: "접근 아이디어",
        body: "아직 방문하지 않은 섬에서 탐색을 시작할 때마다 무리가 하나 늘어나요.",
        code: null,
      },
      {
        title: "의사코드",
        body: "~~~text\nfor 섬 s:\n  if 미방문: groups += 1, s에서 탐색\n~~~",
        code: null,
      },
      {
        title: "핵심 코드",
        body: "이웃 섬을 스택에 넣는 부분이에요. 빈칸을 채워 보세요.",
        code: {
          python: "for nxt in graph[node]:\n    if not seen[nxt]:\n        seen[nxt] = True\n        ______",
          javascript:
            "for (const nxt of graph[node]) {\n  if (!seen[nxt]) {\n    seen[nxt] = true;\n    ______;\n  }\n}",
        },
      },
    ],
    estimatedMinutes: 15,
    ...overrides,
  };
}
