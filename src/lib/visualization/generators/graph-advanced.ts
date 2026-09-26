import type {
  GraphEdgeStatus,
  GraphEdgeViz,
  GraphNodeStatus,
  GraphSnapshot,
  HighlightTone,
  JsonValue,
  SequenceSnapshot,
  VisualizationStep,
  VizItem,
} from "@/types";
import { asWeightedEdges } from "./dijkstra";
import { StepRecorder, arrowJoin, asInt, circleLayout, fail } from "./shared";

/** 정수 쌍 목록. 같은 쌍이 여러 번 나와도 된다 (예: 이미 같은 그룹인 두 노드 합치기) */
function asPairs(value: JsonValue | undefined, n: number, name: string, max: number): [number, number][] {
  if (!Array.isArray(value)) fail(`${name}은 [[a, b], ...] 형태여야 해요`);
  if (value.length < 1 || value.length > max) fail(`${name}은 1 ~ ${max}개여야 해요`);
  return value.map((pair) => {
    if (!Array.isArray(pair) || pair.length !== 2 || !pair.every((v) => typeof v === "number" && Number.isInteger(v))) {
      fail(`${name}의 각 항목은 [a, b] 형태의 정수 쌍이어야 해요`);
    }
    const [a, b] = pair as [number, number];
    if (a < 0 || a >= n || b < 0 || b >= n) fail(`[${a}, ${b}]: 없는 노드 번호예요 (0 ~ ${n - 1}만 쓸 수 있어요)`);
    if (a === b) fail(`[${a}, ${b}]: 서로 다른 두 노드여야 해요`);
    return [a, b];
  });
}

/** 유니온 파인드 (크기로 합치기 + 경로 압축). 스텝 기록 없이 쓸 때 */
class DisjointSet {
  readonly parent: number[];
  readonly size: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array.from({ length: n }, () => 1);
  }

  /** x에서 대표까지 지나는 노드 (마지막이 대표) */
  path(x: number): number[] {
    const path = [x];
    while (this.parent[path[path.length - 1]!] !== path[path.length - 1])
      path.push(this.parent[path[path.length - 1]!]!);
    return path;
  }

  find(x: number): number {
    const path = this.path(x);
    const root = path[path.length - 1]!;
    for (const v of path) this.parent[v] = root;
    return root;
  }

  /** 합쳤으면 [새 대표, 붙은 대표], 이미 같은 그룹이면 null */
  union(a: number, b: number): [number, number] | null {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return null;
    if (this.size[ra]! < this.size[rb]!) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra]! += this.size[rb]!;
    return [ra, rb];
  }

  /** 그룹 목록. 그림을 그릴 때도 쓰므로 parent를 바꾸지 않는다 */
  groups(): number[][] {
    const byRoot = new Map<number, number[]>();
    this.parent.forEach((_, i) => {
      const root = this.path(i).at(-1)!;
      byRoot.set(root, [...(byRoot.get(root) ?? []), i]);
    });
    return [...byRoot.values()];
  }
}

const groupText = (groups: number[][]) => groups.map((g) => `{${g.join(", ")}}`).join(" ");

/* ───────────── 유니온 파인드 ───────────── */

export const UF_UNION_PSEUDOCODE = [
  "parent = [0, 1, ..., n-1];  size = [1] * n",
  "def find(x):",
  "    root = x",
  "    while parent[root] != root: root = parent[root]",
  "    while x != root:                 # 지나온 노드가 대표를 바로 가리키게",
  "        nxt = parent[x];  parent[x] = root;  x = nxt",
  "    return root",
  "def union(a, b):",
  "    ra, rb = find(a), find(b)",
  "    if ra == rb: return False        # 이미 같은 그룹",
  "    if size[ra] < size[rb]: ra, rb = rb, ra",
  "    parent[rb] = ra;  size[ra] += size[rb]   # 작은 그룹을 큰 그룹 밑에",
  "    return True",
];

function parseUnion(input: JsonValue[]) {
  const n = asInt(input[0], "노드 수", 2, 8);
  const unions = asPairs(input[1], n, "합치기 목록", 10);
  return { n, unions };
}

export function validateUfUnion(input: JsonValue[]): void {
  parseUnion(input);
}

export function ufUnion(input: JsonValue[]): VisualizationStep[] {
  const { n, unions } = parseUnion(input);
  const rec = new StepRecorder();
  const ds = new DisjointSet(n);
  const positions = circleLayout(n);

  const state = (path: number[] = [], extra: Record<string, JsonValue> = {}) => {
    const onPath = new Set(path);
    const root = path.length ? path[path.length - 1]! : null;
    const status = (i: number): GraphNodeStatus =>
      i === root ? "current" : onPath.has(i) ? "frontier" : ds.parent[i] === i ? "visited" : "idle";
    const graph: GraphSnapshot = {
      directed: true,
      nodes: positions.map((pos, i) => ({
        id: String(i),
        label: String(i),
        x: pos.x,
        y: pos.y,
        status: status(i),
        order: null,
        distance: null,
        caption: ds.parent[i] === i ? `대표 · ${ds.size[i]}명` : null,
      })),
      edges: ds.parent.flatMap((p, i): GraphEdgeViz[] =>
        p === i ? [] : [{ from: String(i), to: String(p), status: onPath.has(i) && onPath.has(p) ? "active" : "tree" }],
      ),
      current: root === null ? null : String(root),
    };
    const sequence: SequenceSnapshot = {
      label: "parent",
      items: ds.parent.map((p, i) => ({ id: `p${i}`, value: p })),
      cursor: null,
      done: 0,
      highlights: path.map((v) => ({ itemId: `p${v}`, tone: (v === root ? "current" : "frontier") as HighlightTone })),
    };
    return { graph, sequence, variables: { 그룹: groupText(ds.groups()), ...extra } };
  };

  rec.push("init", `처음엔 ${n}개 노드가 모두 자기 자신이 대표인 그룹이에요.`, 1, state());

  /** find를 한 단계씩 보여 준다: 대표까지 올라가고, 지나온 노드를 대표에 바로 붙인다 */
  const findWithSteps = (x: number): number => {
    const path = ds.path(x);
    const root = path[path.length - 1]!;
    rec.push(
      "find",
      path.length === 1 ? `find(${x}): ${x}번이 곧 대표예요` : `find(${x}): ${arrowJoin(path)} (대표 ${root}번)`,
      4,
      state(path),
    );
    const moved = path.slice(0, -2);
    if (moved.length > 0) {
      for (const v of moved) ds.parent[v] = root;
      rec.push(
        "compress",
        `경로 줄이기: ${moved.join(", ")}번의 parent를 대표 ${root}번으로 바꿔요`,
        6,
        state([...moved, root]),
      );
    }
    return root;
  };

  for (const [a, b] of unions) {
    const ra = findWithSteps(a);
    const rb = findWithSteps(b);
    if (ra === rb) {
      rec.push("skip", `${a}번과 ${b}번은 이미 같은 그룹이에요 (대표 ${ra}번) → 그대로`, 10, state([ra]));
      continue;
    }
    const sizes = [ds.size[ra]!, ds.size[rb]!];
    const [big, small] = ds.union(a, b)!;
    rec.push(
      "union",
      sizes[0] === sizes[1]
        ? `${a}번과 ${b}번의 그룹 합치기: 크기가 같아서 대표 ${small}번을 대표 ${big}번 밑에 붙여요`
        : `${a}번과 ${b}번의 그룹 합치기: 작은 그룹의 대표 ${small}번을 큰 그룹의 대표 ${big}번 밑에 붙여요`,
      12,
      state([small, big]),
    );
  }

  const groups = ds.groups();
  rec.push("done", `그룹 ${groups.length}개: ${groupText(groups)}`, 13, state());
  return rec.steps;
}

/* ───────────── 크루스칼 (최소 신장 트리) ───────────── */

export const MST_KRUSKAL_PSEUDOCODE = [
  "edges.sort(key=비용)                  # 싼 간선부터",
  "total = 0;  picked = 0",
  "for a, b, cost in edges:",
  "    if find(a) == find(b): continue   # 이미 이어져 있으면 고리가 생겨요",
  "    union(a, b);  total += cost;  picked += 1",
  "    if picked == n - 1: break         # 간선 n-1개면 모두 이어져요",
  "return total",
];

function parseKruskal(input: JsonValue[]) {
  const n = asInt(input[0], "노드 수", 2, 8);
  const edges = asWeightedEdges(input[1], n, 12);
  if (edges.length === 0) fail("간선이 하나 이상 있어야 해요");
  return { n, edges };
}

export function validateMstKruskal(input: JsonValue[]): void {
  parseKruskal(input);
}

export function mstKruskal(input: JsonValue[]): VisualizationStep[] {
  const { n, edges } = parseKruskal(input);
  const rec = new StepRecorder();
  const ds = new DisjointSet(n);
  const positions = circleLayout(n);
  const sorted = edges.map((e, i) => ({ e, i })).sort((x, y) => x.e[2] - y.e[2]);
  const edgeStatus = new Map<number, GraphEdgeStatus>();
  const itemTone = new Map<number, HighlightTone>();
  let total = 0;
  let picked = 0;

  const state = (cursor: number | null, done: number) => {
    const graph: GraphSnapshot = {
      directed: false,
      nodes: positions.map((pos, i) => ({
        id: String(i),
        label: String(i),
        x: pos.x,
        y: pos.y,
        status: (cursor !== null && (sorted[cursor]!.e[0] === i || sorted[cursor]!.e[1] === i)
          ? "current"
          : "idle") as GraphNodeStatus,
        order: null,
        distance: null,
        caption: `대표 ${ds.find(i)}`,
      })),
      edges: edges.map(([a, b, w], i) => ({
        from: String(a),
        to: String(b),
        status: edgeStatus.get(i) ?? "idle",
        label: String(w),
      })),
      current: null,
    };
    const sequence: SequenceSnapshot = {
      label: "비용 순 간선",
      items: sorted.map(({ e: [a, b, w], i }): VizItem => ({ id: `e${i}`, value: `${a}-${b}:${w}` })),
      cursor,
      done,
      highlights: sorted.flatMap(({ i }, k) => {
        const tone = k === cursor ? "current" : itemTone.get(i);
        return tone ? [{ itemId: `e${i}`, tone }] : [];
      }),
    };
    return { graph, sequence, variables: { "총 비용": total, "고른 간선": `${picked} / ${n - 1}` } };
  };

  rec.push("init", `간선 ${edges.length}개를 비용이 싼 순서로 줄 세워요.`, 1, state(null, 0));

  for (let k = 0; k < sorted.length; k++) {
    const { e, i } = sorted[k]!;
    const [a, b, w] = e;
    const ra = ds.find(a);
    const rb = ds.find(b);
    edgeStatus.set(i, "active");
    rec.push("check", `${a}-${b} (비용 ${w}): ${a}번의 대표 ${ra}, ${b}번의 대표 ${rb}`, 4, state(k, k));
    if (ra === rb) {
      edgeStatus.set(i, "rejected");
      itemTone.set(i, "blocked");
      rec.push("skip", `이미 같은 그룹이라 이으면 고리가 생겨요 → 건너뛰기`, 4, state(k, k + 1));
      continue;
    }
    ds.union(a, b);
    total += w;
    picked += 1;
    edgeStatus.set(i, "tree");
    itemTone.set(i, "visited");
    rec.push("pick", `다른 그룹이라 이어요 → 총 비용 ${total}`, 5, state(k, k + 1));
    if (picked === n - 1) {
      rec.push("done", `간선 ${n - 1}개로 모두 이었어요. 최소 비용 = ${total}`, 6, state(null, k + 1));
      return rec.steps;
    }
  }
  rec.push(
    "done",
    `간선을 다 봐도 모두 잇지 못했어요 (그룹 ${ds.groups().length}개). 이은 비용 = ${total}`,
    7,
    state(null, sorted.length),
  );
  return rec.steps;
}

/* ───────────── 위상 정렬 (칸 알고리즘) ───────────── */

export const TOPO_KAHN_PSEUDOCODE = [
  "indeg = 각 노드로 들어오는 화살표 수",
  "queue = 진입 차수가 0인 노드들",
  "while queue:",
  "    v = queue.popleft();  order.append(v)",
  "    for w in graph[v]:",
  "        indeg[w] -= 1               # v를 끝냈으니 w의 조건 하나 해결",
  "        if indeg[w] == 0: queue.append(w)",
  "return order  # n개가 안 되면 고리가 있어요",
];

function parseTopo(input: JsonValue[]) {
  const n = asInt(input[0], "노드 수", 2, 8);
  const edges = asPairs(input[1], n, "화살표 목록", 12);
  const seen = new Set<string>();
  for (const [a, b] of edges) {
    if (seen.has(`${a}>${b}`)) fail(`[${a}, ${b}]: 같은 화살표가 두 번 있어요`);
    seen.add(`${a}>${b}`);
  }
  return { n, edges };
}

export function validateTopoKahn(input: JsonValue[]): void {
  parseTopo(input);
}

export function topoKahn(input: JsonValue[]): VisualizationStep[] {
  const { n, edges } = parseTopo(input);
  const rec = new StepRecorder();
  const positions = circleLayout(n);
  const graph: number[][] = Array.from({ length: n }, () => []);
  const indeg = Array.from({ length: n }, () => 0);
  edges.forEach(([a, b]) => {
    graph[a]!.push(b);
    indeg[b]! += 1;
  });
  for (const list of graph) list.sort((x, y) => x - y);
  const edgeStatus = new Map<string, GraphEdgeStatus>();
  const done = new Set<number>();
  const inQueue = new Set<number>();
  const queue: VizItem[] = [];
  const order: number[] = [];
  let seq = 0;
  let current: number | null = null;

  const state = () => ({
    graph: {
      directed: true,
      nodes: positions.map((pos, i) => ({
        id: String(i),
        label: String(i),
        x: pos.x,
        y: pos.y,
        status: (i === current
          ? "current"
          : done.has(i)
            ? "visited"
            : inQueue.has(i)
              ? "frontier"
              : "idle") as GraphNodeStatus,
        order: null,
        distance: null,
        caption: done.has(i) ? null : `진입 ${indeg[i]}`,
      })),
      edges: edges.map(([a, b]) => ({ from: String(a), to: String(b), status: edgeStatus.get(`${a}>${b}`) ?? "idle" })),
      current: current === null ? null : String(current),
    },
    queue: {
      items: queue.map((item) => ({ ...item })),
      highlights: [],
      pointerLabels: queue.length ? [{ itemId: queue[0]!.id, label: "front" }] : [],
    },
    sequence: {
      label: "순서",
      items: order.map((v, k) => ({ id: `o${k}`, value: v })),
      cursor: null,
      done: order.length,
      highlights: [],
    },
    variables: { indeg: [...indeg] },
  });
  const enqueue = (v: number) => {
    queue.push({ id: `q${seq++}`, value: v });
    inQueue.add(v);
  };

  rec.push("init", `노드마다 들어오는 화살표 수(진입 차수)를 세요. 먼저 끝내야 하는 일의 수예요.`, 1, state());
  const zeros = indeg.flatMap((d, i) => (d === 0 ? [i] : []));
  zeros.forEach(enqueue);
  rec.push(
    "enqueue",
    zeros.length
      ? `진입 차수가 0인 ${zeros.join(", ")}번은 바로 시작할 수 있어요 → 큐에 넣어요`
      : "진입 차수가 0인 노드가 없어요. 모두 고리에 묶여 있어요.",
    2,
    state(),
  );

  while (queue.length > 0) {
    const v = queue.shift()!.value as number;
    inQueue.delete(v);
    current = v;
    order.push(v);
    rec.push("dequeue", `${v}번을 꺼내 순서에 적어요`, 4, state());
    for (const w of graph[v]!) {
      indeg[w]! -= 1;
      edgeStatus.set(`${v}>${w}`, "tree");
      if (indeg[w] === 0) {
        enqueue(w);
        rec.push("enqueue", `${v} → ${w}: ${w}번의 조건을 모두 끝냈어요 → 큐에 넣어요`, 7, state());
      } else {
        rec.push("check", `${v} → ${w}: ${w}번은 아직 먼저 끝낼 일이 남았어요 (진입 ${indeg[w]})`, 6, state());
      }
    }
    done.add(v);
    current = null;
  }

  const stuck = n - order.length;
  rec.push(
    "done",
    stuck === 0
      ? `모든 노드를 꺼냈어요. 순서: ${arrowJoin(order)}`
      : `${stuck}개 노드가 고리에 묶여 꺼내지 못했어요. 이 조건들은 동시에 지킬 수 없어요.`,
    8,
    state(),
  );
  return rec.steps;
}
