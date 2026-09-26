import type {
  GraphEdgeStatus,
  GraphEdgeViz,
  GraphNodeStatus,
  GraphSnapshot,
  HighlightTone,
  JsonValue,
  LinearSnapshot,
  VisualizationStep,
  VizState,
} from "@/types";
import { DIRECTIONS, StepRecorder, arrowJoin, asInt, circleLayout, edgeKey, fail } from "./shared";

const INF = "∞";

/** 입력: [노드 수 n, 간선 목록 [[a, b, 비용], ...], 시작 노드, (도착 노드)] — 무방향 */
interface WeightedGraphInput {
  n: number;
  edges: [number, number, number][];
  start: number;
  target: number;
}

export function asWeightedEdges(value: JsonValue | undefined, n: number, maxEdges: number): [number, number, number][] {
  if (!Array.isArray(value)) fail("간선 목록은 [[a, b, 비용], ...] 형태여야 해요");
  if (value.length > maxEdges) fail(`간선은 ${maxEdges}개 이하여야 해요`);
  const seen = new Set<string>();
  return value.map((edge) => {
    if (!Array.isArray(edge) || edge.length !== 3 || !edge.every((v) => typeof v === "number" && Number.isInteger(v))) {
      fail("간선은 [a, b, 비용] 형태의 정수 세 개여야 해요");
    }
    const [a, b, w] = edge as [number, number, number];
    if (a < 0 || a >= n || b < 0 || b >= n)
      fail(`간선 [${a}, ${b}, ${w}]: 없는 노드 번호예요 (0 ~ ${n - 1}만 쓸 수 있어요)`);
    if (a === b) fail(`간선 [${a}, ${b}, ${w}]: 자기 자신으로 가는 간선은 쓸 수 없어요`);
    if (w < 1 || w > 99) fail(`간선 [${a}, ${b}, ${w}]: 비용은 1 이상 99 이하여야 해요`);
    const key = edgeKey(a, b);
    if (seen.has(key)) fail(`간선 [${a}, ${b}, ${w}]: 같은 두 노드를 잇는 간선이 두 번 있어요`);
    seen.add(key);
    return [a, b, w];
  });
}

function parseWeightedGraph(input: JsonValue[], withTarget: boolean): WeightedGraphInput {
  const n = asInt(input[0], "노드 수", 2, 8);
  const edges = asWeightedEdges(input[1], n, 12);
  const start = asInt(input[2], "시작 노드", 0, n - 1);
  const target = withTarget ? asInt(input[3], "도착 노드", 0, n - 1) : -1;
  return { n, edges, start, target };
}

/** 힙에 든 후보들을 (거리, …) 작은 순으로 보여 준다. 맨 앞이 다음에 꺼낼 후보 */
class CandidateHeap<T extends number[]> {
  private entries: { id: string; key: T }[] = [];
  private seq = 0;

  constructor(private readonly title: string) {}

  get size() {
    return this.entries.length;
  }

  push(key: T): string {
    const id = `c${this.seq++}`;
    this.entries.push({ id, key });
    this.entries.sort((a, b) => {
      for (let i = 0; i < a.key.length; i++) if (a.key[i] !== b.key[i]) return a.key[i]! - b.key[i]!;
      return 0;
    });
    return id;
  }

  peek(): { id: string; key: T } {
    return this.entries[0]!;
  }

  pop(): { id: string; key: T } {
    return this.entries.shift()!;
  }

  snapshot(marks: Record<string, HighlightTone> = {}): LinearSnapshot {
    return {
      title: this.title,
      items: this.entries.map((e) => ({ id: e.id, value: `(${e.key.join(", ")})` })),
      highlights: Object.entries(marks).map(([itemId, tone]) => ({ itemId, tone })),
      pointerLabels: this.entries.length ? [{ itemId: this.entries[0]!.id, label: "맨 위" }] : [],
    };
  }
}

/** 가중치 그래프를 그린다. 노드 아래에 지금까지 알려진 거리를 붙인다 */
class WeightedCanvas {
  private readonly positions: { x: number; y: number }[];
  readonly settled: boolean[];
  readonly inHeap: boolean[];
  readonly dist: number[];
  private readonly edgeStatus = new Map<string, GraphEdgeStatus>();
  current: number | null = null;

  constructor(
    private readonly n: number,
    private readonly edges: [number, number, number][],
  ) {
    this.positions = circleLayout(n);
    this.settled = Array.from({ length: n }, () => false);
    this.inHeap = Array.from({ length: n }, () => false);
    this.dist = Array.from({ length: n }, () => Infinity);
  }

  setEdge(a: number, b: number, status: GraphEdgeStatus) {
    if (status === "idle") this.edgeStatus.delete(edgeKey(a, b));
    else this.edgeStatus.set(edgeKey(a, b), status);
  }

  edge(a: number, b: number): GraphEdgeStatus {
    return this.edgeStatus.get(edgeKey(a, b)) ?? "idle";
  }

  snapshot(): GraphSnapshot {
    const status = (i: number): GraphNodeStatus =>
      this.current === i ? "current" : this.settled[i] ? "visited" : this.inHeap[i] ? "frontier" : "idle";
    const nodes = this.positions.map((pos, i) => ({
      id: String(i),
      label: String(i),
      x: pos.x,
      y: pos.y,
      status: status(i),
      order: null,
      distance: null,
      caption: `거리 ${showDist(this.dist[i]!)}`,
    }));
    const edges: GraphEdgeViz[] = this.edges.map(([a, b, w]) => ({
      from: String(a),
      to: String(b),
      status: this.edge(a, b),
      label: String(w),
    }));
    return { directed: false, nodes, edges, current: this.current === null ? null : String(this.current) };
  }
}

const showDist = (d: number): JsonValue => (Number.isFinite(d) ? d : INF);

function weightedAdjacency(n: number, edges: [number, number, number][]): [number, number][][] {
  const graph: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [a, b, w] of edges) {
    graph[a]!.push([b, w]);
    graph[b]!.push([a, w]);
  }
  return graph.map((neighbors) => neighbors.sort((x, y) => x[0] - y[0]));
}

interface DijkstraLines {
  push: number;
  pop: number;
  stale: number;
  scan: number;
  better: number;
  update: number;
}

/** 다익스트라 본체. 스텝을 기록하고 dist·prev를 돌려준다 */
function runDijkstra(
  rec: StepRecorder,
  canvas: WeightedCanvas,
  graph: [number, number][][],
  start: number,
  lines: DijkstraLines,
  extra: (dist: number[], prev: number[]) => VizState,
): { dist: number[]; prev: number[] } {
  const n = graph.length;
  const dist = canvas.dist;
  const prev = Array.from({ length: n }, () => -1);
  const heap = new CandidateHeap<[number, number]>("힙 (거리, 노드)");
  const state = (marks: Record<string, HighlightTone> = {}): VizState => ({
    graph: canvas.snapshot(),
    queue: heap.snapshot(marks),
    ...extra(dist, prev),
  });

  dist[start] = 0;
  rec.push("init", `시작 ${start}번까지 거리는 0이에요. 나머지는 아직 몰라서 ∞로 둬요.`, 1, state());
  const first = heap.push([0, start]);
  canvas.inHeap[start] = true;
  rec.push("push", `힙에 (0, ${start}) 넣고 출발!`, lines.push, state({ [first]: "current" }));

  while (heap.size > 0) {
    const top = heap.peek();
    const [d, v] = top.key;
    if (d > dist[v]!) {
      rec.push(
        "skip",
        `꺼낸 (${d}, ${v})은 오래된 기록이에요. ${v}번은 이미 더 짧은 거리(${dist[v]})로 확정 → 버려요`,
        lines.stale,
        state({ [top.id]: "blocked" }),
      );
      heap.pop();
      continue;
    }
    canvas.current = v;
    rec.push("pop", `힙 맨 위 후보 꺼내기: (${d}, ${v})`, lines.pop, state({ [top.id]: "current" }));
    heap.pop();
    canvas.settled[v] = true;
    canvas.inHeap[v] = false;
    rec.push("settle", `${v}번까지 거리 확정: ${d}. 힙에서 가장 가까웠으니 더 짧은 길은 없어요.`, lines.stale, state());

    for (const [w, cost] of graph[v]!) {
      const before = canvas.edge(v, w);
      canvas.setEdge(v, w, "active");
      const nd = d + cost;
      if (canvas.settled[w]) {
        rec.push("check", `이웃 ${w}번은 이미 확정했어요 (거리 ${dist[w]}) → 그대로`, lines.scan, state());
        canvas.setEdge(v, w, before);
        continue;
      }
      if (nd >= dist[w]!) {
        rec.push(
          "compare",
          `${d} + ${cost} = ${nd}, 지금 아는 ${w}번 거리(${dist[w]})보다 짧지 않아요 → 그대로`,
          lines.better,
          state(),
        );
        canvas.setEdge(v, w, before === "tree" ? "tree" : "rejected");
        continue;
      }
      const old = dist[w]!;
      if (prev[w] !== -1) canvas.setEdge(prev[w]!, w, "rejected");
      dist[w] = nd;
      prev[w] = v;
      canvas.setEdge(v, w, "tree");
      canvas.inHeap[w] = true;
      const pushed = heap.push([nd, w]);
      rec.push(
        "relax",
        `${d} + ${cost} = ${nd} < ${showDist(old)} → ${w}번 거리 줄이기, 힙에 (${nd}, ${w}) 넣기`,
        lines.update,
        state({ [pushed]: "current" }),
      );
    }
    canvas.current = null;
  }
  return { dist, prev };
}

/* ───────────── 기본 다익스트라 ───────────── */

export const DIJKSTRA_BASIC_PSEUDOCODE = [
  "dist = [INF] * n;  dist[start] = 0",
  "heap = [(0, start)]",
  "while heap:",
  "    d, v = heappop(heap)             # 가장 가까운 후보",
  "    if d > dist[v]: continue         # 오래된 기록은 버려요",
  "    for w, cost in graph[v]:",
  "        if d + cost < dist[w]:       # 더 짧은 길을 찾으면",
  "            dist[w] = d + cost",
  "            heappush(heap, (dist[w], w))",
  "return dist",
];

export function validateDijkstraBasic(input: JsonValue[]): void {
  parseWeightedGraph(input, false);
}

export function dijkstraBasic(input: JsonValue[]): VisualizationStep[] {
  const { n, edges, start } = parseWeightedGraph(input, false);
  const rec = new StepRecorder();
  const canvas = new WeightedCanvas(n, edges);
  const extra = (dist: number[]) => ({ variables: { dist: dist.map(showDist) } });
  const { dist } = runDijkstra(
    rec,
    canvas,
    weightedAdjacency(n, edges),
    start,
    { push: 2, pop: 4, stale: 5, scan: 6, better: 7, update: 8 },
    extra,
  );
  rec.push(
    "done",
    `힙이 비었어요. ${start}번에서의 최단 거리: ${dist.map((d, i) => `${i}번=${showDist(d)}`).join(", ")}`,
    10,
    { graph: canvas.snapshot(), queue: new CandidateHeap("힙 (거리, 노드)").snapshot(), ...extra(dist) },
  );
  return rec.steps;
}

/* ───────────── 경로 되짚기 ───────────── */

export const DIJKSTRA_PATH_PSEUDOCODE = [
  "dist = [INF] * n;  dist[start] = 0;  prev = [-1] * n",
  "heap = [(0, start)]",
  "while heap:",
  "    d, v = heappop(heap)",
  "    if d > dist[v]: continue",
  "    for w, cost in graph[v]:",
  "        if d + cost < dist[w]:",
  "            dist[w] = d + cost;  prev[w] = v   # 어디서 왔는지 적어 둬요",
  "            heappush(heap, (dist[w], w))",
  "path = [];  v = target",
  "while v != -1:",
  "    path.append(v);  v = prev[v]",
  "return path[::-1]",
];

export function validateDijkstraPath(input: JsonValue[]): void {
  parseWeightedGraph(input, true);
}

export function dijkstraPath(input: JsonValue[]): VisualizationStep[] {
  const { n, edges, start, target } = parseWeightedGraph(input, true);
  const rec = new StepRecorder();
  const canvas = new WeightedCanvas(n, edges);
  const extra = (dist: number[], prev: number[]) => ({
    variables: { dist: dist.map(showDist), prev: [...prev] },
  });
  const { dist, prev } = runDijkstra(
    rec,
    canvas,
    weightedAdjacency(n, edges),
    start,
    { push: 2, pop: 4, stale: 5, scan: 6, better: 7, update: 8 },
    extra,
  );

  const emptyHeap = new CandidateHeap("힙 (거리, 노드)").snapshot();
  if (!Number.isFinite(dist[target]!)) {
    rec.push("not-found", `${target}번까지 가는 길이 없어요. prev를 따라가도 출발점에 닿지 않아요.`, 10, {
      graph: canvas.snapshot(),
      queue: emptyHeap,
      ...extra(dist, prev),
    });
    return rec.steps;
  }

  // 최단 경로 트리에서 target까지의 길만 남긴다
  for (const [a, b] of edges) if (canvas.edge(a, b) !== "idle") canvas.setEdge(a, b, "idle");
  const path: number[] = [];
  let v = target;
  while (v !== -1) {
    path.push(v);
    canvas.current = v;
    const from = prev[v]!;
    if (from !== -1) canvas.setEdge(from, v, "tree");
    rec.push(
      "record",
      from === -1
        ? `${v}번은 출발점이에요 (prev = -1) → 멈춰요`
        : `${v}번의 prev는 ${from}번 → 경로에 ${v}번을 적고 ${from}번으로 거슬러 가요`,
      12,
      { graph: canvas.snapshot(), queue: emptyHeap, ...extra(dist, prev), variables: { 거꾸로: [...path] } },
    );
    v = from;
  }
  canvas.current = null;
  path.reverse();
  rec.push("done", `뒤집으면 최단 경로: ${arrowJoin(path)} (비용 ${dist[target]})`, 13, {
    graph: canvas.snapshot(),
    queue: emptyHeap,
    variables: { 경로: path, 비용: dist[target]! },
  });
  return rec.steps;
}

/* ───────────── 격자 위의 다익스트라 ───────────── */

export const DIJKSTRA_GRID_PSEUDOCODE = [
  "dist[0][0] = grid[0][0]              # 출발 칸 비용도 내요",
  "heap = [(grid[0][0], 0, 0)]",
  "while heap:",
  "    d, r, c = heappop(heap)",
  "    if d > dist[r][c]: continue",
  "    if (r, c) == (n - 1, m - 1): return d   # 도착 칸을 꺼내면 끝",
  "    for nr, nc in 상하좌우:",
  "        nd = d + grid[nr][nc]",
  "        if nd < dist[nr][nc]:",
  "            dist[nr][nc] = nd;  heappush(heap, (nd, nr, nc))",
];

function parseCostGrid(input: JsonValue[]): number[][] {
  const grid = input[0];
  if (!Array.isArray(grid) || grid.length < 2 || grid.length > 5) fail("격자는 2 ~ 5줄이어야 해요");
  const cols = Array.isArray(grid[0]) ? grid[0].length : 0;
  if (cols < 2 || cols > 5) fail("격자의 한 줄은 2 ~ 5칸이어야 해요");
  return grid.map((row, r) => {
    if (!Array.isArray(row) || row.length !== cols) fail(`${r}번 줄의 칸 수가 달라요 (모든 줄이 ${cols}칸이어야 해요)`);
    if (!row.every((v) => typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 9)) {
      fail(`${r}번 줄: 칸 비용은 1 ~ 9 정수여야 해요`);
    }
    return row as number[];
  });
}

export function validateDijkstraGrid(input: JsonValue[]): void {
  parseCostGrid(input);
}

export function dijkstraGrid(input: JsonValue[]): VisualizationStep[] {
  const grid = parseCostGrid(input);
  const rows = grid.length;
  const cols = grid[0]!.length;
  const rec = new StepRecorder();
  const dist = grid.map((row) => row.map(() => Infinity));
  const settled = grid.map((row) => row.map(() => false));
  const heap = new CandidateHeap<[number, number, number]>("힙 (비용, 줄, 칸)");
  let cursor: [number, number] | null = null;
  let checking: [number, number] | null = null;

  const state = (marks: Record<string, HighlightTone> = {}): VizState => {
    const highlights: { row: number; col: number; tone: HighlightTone }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (cursor && cursor[0] === r && cursor[1] === c) highlights.push({ row: r, col: c, tone: "current" });
        else if (checking && checking[0] === r && checking[1] === c)
          highlights.push({ row: r, col: c, tone: "result" });
        else if (settled[r]![c]) highlights.push({ row: r, col: c, tone: "visited" });
        else if (Number.isFinite(dist[r]![c]!)) highlights.push({ row: r, col: c, tone: "frontier" });
      }
    }
    return {
      table: {
        title: "dist (이 칸까지 드는 최소 비용)",
        colLabels: Array.from({ length: cols }, (_, c) => String(c)),
        rowLabels: Array.from({ length: rows }, (_, r) => String(r)),
        cells: dist.map((row) => row.map(showDist)),
        highlights,
      },
      queue: heap.snapshot(marks),
      variables: Object.fromEntries(grid.map((row, r) => [`비용 ${r}줄`, row.join(" ")])),
    };
  };

  dist[0]![0] = grid[0]![0]!;
  rec.push("init", `출발 칸 (0, 0)의 비용 ${grid[0]![0]}도 내요. 나머지 칸은 아직 ∞예요.`, 1, state());
  const first = heap.push([grid[0]![0]!, 0, 0]);
  rec.push("push", `힙에 (${grid[0]![0]}, 0, 0) 넣기`, 2, state({ [first]: "current" }));

  while (heap.size > 0) {
    const top = heap.peek();
    const [d, r, c] = top.key;
    if (d > dist[r]![c]!) {
      rec.push(
        "skip",
        `꺼낸 (${d}, ${r}, ${c})은 오래된 기록이에요. 이미 더 싼 비용(${dist[r]![c]})으로 확정 → 버려요`,
        5,
        state({ [top.id]: "blocked" }),
      );
      heap.pop();
      continue;
    }
    cursor = [r, c];
    rec.push("pop", `힙 맨 위 후보 꺼내기: (${d}, ${r}, ${c})`, 4, state({ [top.id]: "current" }));
    heap.pop();
    settled[r]![c] = true;
    rec.push("settle", `(${r}, ${c}) 칸까지 비용 확정: ${d}`, 5, state());
    if (r === rows - 1 && c === cols - 1) {
      rec.push("done", `도착 칸을 꺼냈어요. 최소 비용 = ${d}`, 6, state());
      return rec.steps;
    }
    for (const [dr, dc, dirName] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || settled[nr]![nc]) continue;
      checking = [nr, nc];
      const nd = d + grid[nr]![nc]!;
      if (nd >= dist[nr]![nc]!) {
        rec.push(
          "compare",
          `${dirName} (${nr}, ${nc}): ${d} + ${grid[nr]![nc]} = ${nd}, 지금 아는 비용(${dist[nr]![nc]})보다 싸지 않아요`,
          9,
          state(),
        );
      } else {
        const old = dist[nr]![nc]!;
        dist[nr]![nc] = nd;
        const pushed = heap.push([nd, nr, nc]);
        rec.push(
          "relax",
          `${dirName} (${nr}, ${nc}): ${d} + ${grid[nr]![nc]} = ${nd} < ${showDist(old)} → 줄이고 힙에 넣어요`,
          10,
          state({ [pushed]: "current" }),
        );
      }
      checking = null;
    }
    cursor = null;
  }
  // 격자는 모두 이어져 있어 여기까지 오지 않는다
  return rec.steps;
}
