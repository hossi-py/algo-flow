import type { ConceptCard, RecognitionQuestion } from "@/types";

export const DFS_CARDS: ConceptCard[] = [
  {
    id: "dfs-what",
    title: "한 길로 끝까지 가 보기",
    analogy: "미로에서 갈림길을 만나면 한쪽 길로 끝까지 가 보고, 막히면 마지막 갈림길로 돌아와 다른 길을 가요.",
    body: [
      "DFS(Depth-First Search, 깊이 우선 탐색)는 **갈 수 있는 한 깊이** 들어갔다가, 더 갈 곳이 없으면 **바로 전 갈림길로 돌아오는** 탐색이에요.",
      "",
      '"바로 전으로 돌아온다"는 건 가장 최근 것을 꺼낸다는 뜻이에요. 그래서 DFS는 **재귀**(호출 스택)나 **스택**으로 구현해요.',
    ].join("\n"),
    illustration: "dfs-maze-dive",
    keyPoints: [
      "깊이 먼저, 막히면 돌아오기",
      "재귀 호출 스택이 '돌아올 곳'을 기억해 줘요",
      "모든 곳을 한 번씩 방문하는 데 좋아요",
    ],
  },
  {
    id: "dfs-visited",
    title: "방문 표시가 핵심이에요",
    analogy: "가 본 방 문에 스티커를 붙여 두면 같은 방을 또 헤매지 않아요.",
    body: [
      "그래프에는 **순환**(한 바퀴 돌아 제자리로 오는 길)이 있을 수 있어요. 방문 표시가 없으면 같은 노드를 끝없이 다시 방문해요.",
      "",
      "노드에 **들어가자마자** `visited[v] = True`로 표시하고, 이웃으로 가기 전에 **이미 방문했는지** 확인해요.",
    ].join("\n"),
    illustration: "graph-map",
    keyPoints: ["들어가자마자 방문 표시", "이웃은 방문 여부를 확인한 뒤에만", "표시가 없으면 순환에서 무한 반복"],
  },
  {
    id: "dfs-code",
    title: "재귀로 쓰는 DFS",
    analogy: '"이 방을 다 둘러보고 오세요"를 옆방에도 똑같이 부탁하는 모습이에요.',
    body: [
      "재귀 DFS는 딱 네 줄이에요: **방문 표시 → 이웃 훑기 → 안 가 본 이웃이면 dfs(이웃)**.",
      "",
      "그래프가 아주 깊으면(수만 단계) 재귀 한도에 걸릴 수 있어요. 그럴 때는 리스트를 스택처럼 써서 반복문으로 바꿔요.",
    ].join("\n"),
    illustration: "dfs-maze-dive",
    keyPoints: ["방문 표시 → 이웃 확인 → 재귀 호출", "아주 깊으면 스택 + 반복문으로"],
    code: {
      code: {
        python: [
          "def dfs(v):",
          "    visited[v] = True",
          "    for w in graph[v]:",
          "        if not visited[w]:",
          "            dfs(w)",
        ].join("\n"),
        javascript: [
          "function dfs(v) {",
          "  visited[v] = true;",
          "  for (const w of graph[v]) {",
          "    if (!visited[w]) dfs(w);",
          "  }",
          "}",
        ].join("\n"),
        java: [
          "void dfs(int v) {",
          "    visited[v] = true;",
          "    for (int w : graph.get(v)) {",
          "        if (!visited[w]) dfs(w);",
          "    }",
          "}",
        ].join("\n"),
      },
    },
  },
  {
    id: "dfs-grid",
    title: "격자도 그래프예요",
    analogy: "바둑판의 칸 하나하나가 노드, 상하좌우로 붙은 칸이 이웃이에요.",
    body: [
      "지도·미로처럼 **격자**로 주어지는 문제도 DFS로 풀어요. 인접 리스트를 따로 만들지 않고, **방향 배열**로 이웃 칸을 계산해요.",
      "",
      "이웃 칸이 **격자 안인지 먼저** 확인해야 인덱스 오류가 나지 않아요.",
    ].join("\n"),
    illustration: "graph-matrix",
    keyPoints: ["칸 = 노드, 붙은 칸 = 이웃", "방향 배열 (-1,0) (1,0) (0,-1) (0,1)", "범위 검사를 가장 먼저"],
    code: {
      code: {
        python: [
          "for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):",
          "    nr, nc = r + dr, c + dc",
          "    if 0 <= nr < n and 0 <= nc < m and not visited[nr][nc]:",
          "        dfs(nr, nc)",
        ].join("\n"),
        javascript: [
          "for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {",
          "  const nr = r + dr, nc = c + dc;",
          "  if (0 <= nr && nr < n && 0 <= nc && nc < m && !visited[nr][nc]) dfs(nr, nc);",
          "}",
        ].join("\n"),
        java: [
          "for (int[] d : new int[][] {{-1, 0}, {1, 0}, {0, -1}, {0, 1}}) {",
          "    int nr = r + d[0], nc = c + d[1];",
          "    if (0 <= nr && nr < n && 0 <= nc && nc < m && !visited[nr][nc]) dfs(nr, nc);",
          "}",
        ].join("\n"),
      },
    },
  },
  {
    id: "dfs-return",
    title: "돌아오면서 답을 모아요",
    analogy: '팀장이 부하 팀장들에게 "너희 팀 몇 명이야?"라고 묻고, 받은 답을 더해 자기 팀 인원을 보고해요.',
    body: [
      "DFS 함수가 **값을 반환**하게 만들면, 재귀가 돌아올 때 자식들의 답을 모아 내 답을 만들 수 있어요.",
      "",
      "- **서브트리 크기**: `size(v) = 1 + 자식들의 size 합`",
      "- **경로 수**: `ways(v) = 다음 노드들의 ways 합` (같은 v는 메모로 한 번만)",
      "",
      "방향 그래프에서 **순환**을 찾을 때는 상태를 셋으로 나눠요: 안 감(0) · **탐색 중**(1) · 끝남(2). 탐색 중인 노드를 다시 만나면 지금 걸어온 길로 되돌아온 것이라 순환이에요.",
    ].join("\n"),
    illustration: "dfs-maze-dive",
    keyPoints: [
      "자식 답을 다 받은 뒤 내 답을 계산",
      "같은 노드의 답은 메모로 재사용",
      "순환 찾기: 0 · 1(탐색 중) · 2(끝남)",
    ],
    code: {
      code: {
        python: [
          "def size(v):",
          "    total = 1",
          "    for w in children[v]:",
          "        total += size(w)    # 자식의 답을 모아요",
          "    return total",
        ].join("\n"),
        javascript: [
          "function size(v) {",
          "  let total = 1;",
          "  for (const w of children[v]) total += size(w);   // 자식의 답을 모아요",
          "  return total;",
          "}",
        ].join("\n"),
        java: [
          "int size(int v) {",
          "    int total = 1;",
          "    for (int w : children.get(v)) total += size(w);   // 자식의 답을 모아요",
          "    return total;",
          "}",
        ].join("\n"),
      },
    },
  },
];

export const DFS_QUIZ: RecognitionQuestion[] = [
  {
    id: "dfs-q1",
    snippet: "N×M 지도에서 상하좌우로 붙어 있는 땅은 하나의 섬이에요. 섬이 모두 몇 개인지 구하세요.",
    choices: ["dfs", "stack", "backtracking"],
    answer: "dfs",
    signalIds: ["sig-connected-group", "sig-grid-neighbors"],
    highlightPhrases: ["상하좌우로 붙어 있는", "섬이 모두 몇 개"],
    explanation:
      "이어진 덩어리(연결 요소)를 세는 대표 유형이에요. 땅 하나에서 DFS로 닿는 칸을 모두 칠하면 섬 하나가 끝나요. (BFS로도 풀 수 있어요)",
  },
  {
    id: "dfs-q2",
    snippet:
      "컴퓨터들의 연결 정보가 주어져요. 1번 컴퓨터가 바이러스에 걸렸을 때, 연결을 타고 감염되는 컴퓨터는 몇 대인가요?",
    choices: ["queue-deque", "dfs", "stack"],
    answer: "dfs",
    signalIds: ["sig-relations-given", "sig-connected-group"],
    highlightPhrases: ["연결 정보", "감염되는 컴퓨터는 몇 대"],
    explanation: "1번에서 닿을 수 있는 노드의 개수만 세면 돼요. 거리를 묻지 않으니 DFS 한 번이면 끝나요.",
  },
  {
    id: "dfs-q3",
    snippet: "도로 정보가 주어질 때, A 도시에서 B 도시로 갈 수 있는 길이 있는지 판단하세요.",
    choices: ["backtracking", "dfs", "queue-deque"],
    answer: "dfs",
    signalIds: ["sig-path-exists"],
    highlightPhrases: ["갈 수 있는 길이 있는지"],
    explanation: "'있다/없다'만 알면 되니 A에서 DFS를 돌려 B를 방문하는지 보면 돼요.",
  },
  {
    id: "dfs-q4",
    snippet: "미로에서 출발점부터 도착점까지 최소 몇 칸을 지나야 하는지 구하세요.",
    choices: ["dfs", "bfs", "stack"],
    answer: "bfs",
    signalIds: ["sig-shortest-steps"],
    highlightPhrases: ["최소 몇 칸"],
    explanation: "DFS는 길을 '찾을' 수는 있지만 가장 짧은 길을 보장하지 않아요. '최소'가 보이면 BFS예요.",
  },
  {
    id: "dfs-q5",
    snippet: "1부터 N까지의 수로 만들 수 있는 모든 순서를 출력하세요. (1 ≤ N ≤ 8)",
    choices: ["dfs", "backtracking", "bfs"],
    answer: "backtracking",
    signalIds: ["sig-all-cases", "sig-small-n"],
    highlightPhrases: ["모든 순서", "1 ≤ N ≤ 8"],
    explanation: "모든 경우를 만들어야 하고 N이 작아요. DFS처럼 깊이 들어가되 고르고·되돌리는 백트래킹이 딱 맞아요.",
  },
];
