import type {
  CallFrame,
  GraphEdgeViz,
  GraphNodeStatus,
  GraphNodeViz,
  GraphEdgeStatus,
  GraphSnapshot,
  JsonValue,
  VisualizationStep,
  VizItem,
} from "@/types";
import { StepRecorder, adjacencyList, arrowJoin, asEdges, asInt, circleLayout, edgeKey } from "./shared";

/** 입력: [노드 수 n, 간선 목록, (시작 노드)] */
interface GraphInput {
  n: number;
  edges: [number, number][];
  start: number;
}

function parseGraph(input: JsonValue[], withStart: boolean): GraphInput {
  const n = asInt(input[0], "노드 수", 2, 9);
  const edges = asEdges(input[1], n, 14);
  const start = withStart ? asInt(input[2], "시작 노드", 0, n - 1) : 0;
  return { n, edges, start };
}

/** 노드·간선 상태를 들고 있다가 스냅샷을 만든다 */
class GraphCanvas {
  private readonly positions: { x: number; y: number }[];
  readonly nodeStatus: GraphNodeStatus[];
  readonly order: (number | null)[];
  readonly distance: (number | null)[];
  private readonly edgeStatus = new Map<string, GraphEdgeStatus>();
  current: number | null = null;

  constructor(
    private readonly n: number,
    private readonly edges: [number, number][],
    private readonly visibleEdges: "all" | "added" = "all",
  ) {
    this.positions = circleLayout(n);
    this.nodeStatus = Array.from({ length: n }, () => "idle");
    this.order = Array.from({ length: n }, () => null);
    this.distance = Array.from({ length: n }, () => null);
    if (visibleEdges === "all") for (const [a, b] of edges) this.edgeStatus.set(edgeKey(a, b), "idle");
  }

  setEdge(a: number, b: number, status: GraphEdgeStatus) {
    this.edgeStatus.set(edgeKey(a, b), status);
  }

  edge(a: number, b: number): GraphEdgeStatus | undefined {
    return this.edgeStatus.get(edgeKey(a, b));
  }

  snapshot(): GraphSnapshot {
    const nodes: GraphNodeViz[] = this.positions.map((pos, i) => ({
      id: String(i),
      label: String(i),
      x: pos.x,
      y: pos.y,
      status: this.current === i ? "current" : (this.nodeStatus[i] ?? "idle"),
      order: this.order[i] ?? null,
      distance: this.distance[i] ?? null,
    }));
    const edges: GraphEdgeViz[] = this.edges
      .filter(([a, b]) => this.edgeStatus.has(edgeKey(a, b)))
      .map(([a, b]) => ({ from: String(a), to: String(b), status: this.edgeStatus.get(edgeKey(a, b)) ?? "idle" }));
    return { directed: false, nodes, edges, current: this.current === null ? null : String(this.current) };
  }
}

const adjacencyVariables = (graph: number[][]) =>
  Object.fromEntries(graph.map((neighbors, i) => [`graph[${i}]`, [...neighbors]])) as Record<string, JsonValue>;

/* ───────────── 인접 리스트 만들기 ───────────── */

export const GRAPH_ADJACENCY_PSEUDOCODE = [
  "graph = [[] for _ in range(n)]      # 노드마다 빈 리스트",
  "for a, b in edges:",
  "    graph[a].append(b)",
  "    graph[b].append(a)              # 무방향이면 반대쪽도!",
];

export function validateGraphAdjacency(input: JsonValue[]): void {
  parseGraph(input, false);
}

export function graphAdjacency(input: JsonValue[]): VisualizationStep[] {
  const { n, edges } = parseGraph(input, false);
  const rec = new StepRecorder();
  const canvas = new GraphCanvas(n, edges, "added");
  const graph: number[][] = Array.from({ length: n }, () => []);

  rec.push("init", `노드 ${n}개, 간선 ${edges.length}개. 노드마다 이웃을 적을 빈 리스트를 준비해요.`, 1, {
    graph: canvas.snapshot(),
    variables: adjacencyVariables(graph),
  });

  for (const [a, b] of edges) {
    canvas.setEdge(a, b, "active");
    canvas.nodeStatus[a] = "frontier";
    canvas.nodeStatus[b] = "frontier";
    graph[a]!.push(b);
    rec.push("discover", `간선 (${a}, ${b}): graph[${a}]에 ${b} 추가`, 3, {
      graph: canvas.snapshot(),
      variables: adjacencyVariables(graph),
    });
    graph[b]!.push(a);
    rec.push("discover", `반대 방향도 이어져 있으니 graph[${b}]에 ${a} 추가`, 4, {
      graph: canvas.snapshot(),
      variables: adjacencyVariables(graph),
    });
    canvas.setEdge(a, b, "tree");
    canvas.nodeStatus[a] = "visited";
    canvas.nodeStatus[b] = "visited";
  }

  rec.push("done", "인접 리스트 완성! 이제 graph[v]만 보면 v의 이웃을 바로 찾을 수 있어요.", null, {
    graph: canvas.snapshot(),
    variables: adjacencyVariables(graph),
  });
  return rec.steps;
}

/* ───────────── 그래프 DFS (재귀) ───────────── */

export const GRAPH_DFS_PSEUDOCODE = [
  "visited = [False] * n",
  "dfs(v):",
  "    visited[v] = True               # 들어오자마자 방문 표시",
  "    for w in graph[v]:              # 이웃을 번호 순서대로",
  "        if not visited[w]:",
  "            dfs(w)                  # 더 깊이 들어가기",
  "dfs(start)",
];

export function validateGraphDfs(input: JsonValue[]): void {
  parseGraph(input, true);
}

export function graphDfs(input: JsonValue[]): VisualizationStep[] {
  const { n, edges, start } = parseGraph(input, true);
  const graph = adjacencyList(n, edges);
  const rec = new StepRecorder();
  const canvas = new GraphCanvas(n, edges);
  const visited = Array.from({ length: n }, () => false);
  const visitOrder: number[] = [];
  const frames: number[] = [];

  const state = () => ({
    graph: canvas.snapshot(),
    callStack: frames.map((v, i): CallFrame => ({
      id: `dfs-${v}`,
      label: `dfs(${v})`,
      locals: { v },
      status: i === frames.length - 1 ? "active" : "waiting",
    })),
    variables: { "방문 순서": [...visitOrder] },
  });
  const refresh = () => {
    frames.forEach((v) => (canvas.nodeStatus[v] = "frontier"));
    canvas.current = frames[frames.length - 1] ?? null;
  };

  rec.push("init", `${start}번 노드에서 DFS를 시작해요. 아직 아무 데도 방문하지 않았어요.`, 7, state());

  const dfs = (v: number) => {
    frames.push(v);
    visited[v] = true;
    visitOrder.push(v);
    canvas.order[v] = visitOrder.length;
    refresh();
    rec.push("visit", `dfs(${v}): ${v}번 노드에 방문 표시 (방문 순서 ${visitOrder.length})`, 3, state());

    for (const w of graph[v]!) {
      const before = canvas.edge(v, w);
      canvas.setEdge(v, w, "active");
      if (visited[w]) {
        rec.push("check", `이웃 ${w}번은 이미 방문했어요 → 건너뛰기`, 5, state());
        canvas.setEdge(v, w, before === "tree" ? "tree" : "rejected");
        continue;
      }
      rec.push("check", `이웃 ${w}번은 아직 방문하지 않았어요 → dfs(${w}) 호출`, 6, state());
      canvas.setEdge(v, w, "tree");
      dfs(w);
      refresh();
      rec.push("return-to", `dfs(${w}) 탐색이 끝나서 ${v}번 노드로 돌아왔어요. 남은 이웃을 계속 봐요.`, 4, state());
    }

    frames.pop();
    canvas.nodeStatus[v] = "visited";
    refresh();
    rec.push("return", `${v}번 노드의 이웃을 모두 확인했어요 → dfs(${v}) 끝`, 4, state());
  };

  dfs(start);
  const unreached = visited.map((seen, i) => (seen ? null : i)).filter((i): i is number => i !== null);
  rec.push(
    "done",
    `방문 순서: ${arrowJoin(visitOrder)}${unreached.length ? ` · ${unreached.join(", ")}번은 연결되어 있지 않아 닿지 못했어요` : ""}`,
    null,
    state(),
  );
  return rec.steps;
}

/* ───────────── 그래프 BFS (최단 거리) ───────────── */

export const GRAPH_BFS_PSEUDOCODE = [
  "dist = [-1] * n;  dist[start] = 0",
  "queue = deque([start])",
  "while queue:",
  "    v = queue.popleft()",
  "    for w in graph[v]:",
  "        if dist[w] == -1:            # 처음 발견한 노드만",
  "            dist[w] = dist[v] + 1;  queue.append(w)",
  "return dist",
];

export function validateGraphBfs(input: JsonValue[]): void {
  parseGraph(input, true);
}

export function graphBfs(input: JsonValue[]): VisualizationStep[] {
  const { n, edges, start } = parseGraph(input, true);
  const graph = adjacencyList(n, edges);
  const rec = new StepRecorder();
  const canvas = new GraphCanvas(n, edges);
  const dist = Array.from({ length: n }, () => -1);
  const queue: VizItem[] = [];
  let seq = 0;
  let orderCount = 0;

  const queueSnapshot = () => ({
    items: queue.map((item) => ({ ...item })),
    highlights: [],
    pointerLabels: queue.length
      ? queue.length === 1
        ? [{ itemId: queue[0]!.id, label: "front · rear" }]
        : [
            { itemId: queue[0]!.id, label: "front" },
            { itemId: queue[queue.length - 1]!.id, label: "rear" },
          ]
      : [],
  });
  const state = () => ({ graph: canvas.snapshot(), queue: queueSnapshot(), variables: { dist: [...dist] } });
  const enqueue = (v: number) => {
    queue.push({ id: `q${seq++}`, value: v });
    canvas.nodeStatus[v] = "frontier";
  };

  dist[start] = 0;
  canvas.distance[start] = 0;
  rec.push("init", `시작 ${start}번 노드의 거리는 0. 나머지는 아직 모르니 -1이에요.`, 1, state());
  enqueue(start);
  rec.push("enqueue", `${start}번 노드를 큐에 넣고 출발!`, 2, state());

  while (queue.length > 0) {
    const item = queue.shift()!;
    const v = item.value as number;
    canvas.current = v;
    canvas.order[v] = ++orderCount;
    rec.push("dequeue", `큐 맨 앞의 ${v}번 노드를 꺼내요 (거리 ${dist[v]})`, 4, state());

    for (const w of graph[v]!) {
      const before = canvas.edge(v, w);
      canvas.setEdge(v, w, "active");
      if (dist[w] !== -1) {
        rec.push("check", `이웃 ${w}번은 이미 발견했어요 (거리 ${dist[w]}) → 건너뛰기`, 6, state());
        canvas.setEdge(v, w, before === "tree" ? "tree" : "rejected");
        continue;
      }
      dist[w] = dist[v]! + 1;
      canvas.distance[w] = dist[w]!;
      canvas.setEdge(v, w, "tree");
      enqueue(w);
      rec.push("discover", `이웃 ${w}번을 처음 발견! 거리 ${dist[v]} + 1 = ${dist[w]}, 큐 뒤에 넣어요`, 7, state());
    }
    canvas.nodeStatus[v] = "visited";
    canvas.current = null;
  }

  rec.push(
    "done",
    `큐가 비었어요. 시작점에서의 최단 거리: ${dist.map((d, i) => `${i}번=${d}`).join(", ")}`,
    8,
    state(),
  );
  return rec.steps;
}
