import type {
  GraphEdgeViz,
  GraphNodeStatus,
  GraphSnapshot,
  HighlightTone,
  JsonValue,
  VisualizationStep,
  VizState,
} from "@/types";
import { StepRecorder, asInt, asIntArray, asStringArray, fail, round } from "./shared";

/** 최소 힙을 배열로 들고, 칸 번호 = 트리 노드로 그린다 (값이 바뀌어도 칸 위치는 그대로) */
class HeapCanvas {
  readonly a: number[] = [];

  /** 층마다 가로로 고르게 놓는다: 0번은 맨 위 가운데 */
  private position(i: number): { x: number; y: number } {
    const level = Math.floor(Math.log2(i + 1));
    const first = 2 ** level - 1;
    const slots = 2 ** level;
    return { x: round(((i - first + 0.5) / slots) * 100), y: round(12 + level * 26) };
  }

  snapshot(marks: Partial<Record<number, GraphNodeStatus>> = {}): GraphSnapshot {
    const nodes = this.a.map((value, i) => ({
      id: `h${i}`,
      label: String(value),
      ...this.position(i),
      status: marks[i] ?? "idle",
      order: null,
      distance: null,
      caption: i === 0 ? "맨 위" : null,
    }));
    const edges: GraphEdgeViz[] = [];
    for (let i = 1; i < this.a.length; i++) {
      const parent = Math.floor((i - 1) / 2);
      const active = marks[i] !== undefined && marks[parent] !== undefined;
      edges.push({ from: `h${parent}`, to: `h${i}`, status: active ? "active" : "idle" });
    }
    return { directed: false, nodes, edges, current: null };
  }

  array(highlights: Partial<Record<number, HighlightTone>> = {}) {
    return {
      label: "힙 배열 (칸 i의 자식은 2i+1, 2i+2)",
      items: this.a.map((value, i) => ({ id: `s${i}`, value })),
      cursor: null,
      done: 0,
      highlights: Object.entries(highlights).map(([i, tone]) => ({ itemId: `s${i}`, tone: tone! })),
    };
  }
}

type Push = (action: VisualizationStep["action"], message: string, line: number | null, state: VizState) => void;

/** 맨 끝에 넣고 부모보다 작으면 올려 보낸다 (단계마다 기록) */
function pushValue(
  h: HeapCanvas,
  value: number,
  push: Push,
  lines: { add: number; up: number },
  extra: () => VizState,
) {
  h.a.push(value);
  let i = h.a.length - 1;
  push("push", `${value} 넣기: 맨 끝 칸(${i}번)에 둬요`, lines.add, {
    ...extra(),
    graph: h.snapshot({ [i]: "current" }),
    sequence: h.array({ [i]: "current" }),
  });
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (h.a[parent]! <= h.a[i]!) {
      push("compare", `부모 ${h.a[parent]} ≤ ${h.a[i]} → 제자리예요`, lines.up, {
        ...extra(),
        graph: h.snapshot({ [i]: "current", [parent]: "visited" }),
        sequence: h.array({ [i]: "current", [parent]: "visited" }),
      });
      return;
    }
    [h.a[parent], h.a[i]] = [h.a[i]!, h.a[parent]!];
    push("swap", `부모보다 작아요 → 위로 한 칸 (${i}번 ↔ ${parent}번)`, lines.up, {
      ...extra(),
      graph: h.snapshot({ [parent]: "current", [i]: "frontier" }),
      sequence: h.array({ [parent]: "current", [i]: "frontier" }),
    });
    i = parent;
  }
}

/** 맨 위를 꺼내고, 맨 끝 값을 위로 올린 뒤 더 작은 자식과 바꾸며 내려 보낸다 */
function popValue(h: HeapCanvas, push: Push, lines: { take: number; down: number }, extra: () => VizState): number {
  const top = h.a[0]!;
  push("pop", `맨 위(가장 작은 값) ${top} 꺼내기`, lines.take, {
    ...extra(),
    graph: h.snapshot({ 0: "current" }),
    sequence: h.array({ 0: "result" }),
  });
  const last = h.a.pop()!;
  if (h.a.length === 0) return top;
  h.a[0] = last;
  push("swap", `맨 끝 값(${last})을 맨 위로 올려요`, lines.down, {
    ...extra(),
    graph: h.snapshot({ 0: "current" }),
    sequence: h.array({ 0: "current" }),
  });
  let i = 0;
  for (;;) {
    const l = 2 * i + 1;
    const r = l + 1;
    let small = i;
    if (l < h.a.length && h.a[l]! < h.a[small]!) small = l;
    if (r < h.a.length && h.a[r]! < h.a[small]!) small = r;
    if (small === i) {
      push("compare", `자식들보다 작거나 같아요 → 제자리`, lines.down, {
        ...extra(),
        graph: h.snapshot({ [i]: "visited" }),
        sequence: h.array({ [i]: "visited" }),
      });
      return top;
    }
    [h.a[small], h.a[i]] = [h.a[i]!, h.a[small]!];
    push("swap", `더 작은 자식과 자리 바꾸기 (${i}번 ↔ ${small}번)`, lines.down, {
      ...extra(),
      graph: h.snapshot({ [small]: "current", [i]: "frontier" }),
      sequence: h.array({ [small]: "current", [i]: "frontier" }),
    });
    i = small;
  }
}

function recorder() {
  const rec = new StepRecorder();
  const push: Push = (action, message, line, state) => rec.push(action, message, line, state);
  return { rec, push };
}

/* ───────────── 넣기 · 꺼내기 ───────────── */

export const HEAP_OPS_PSEUDOCODE = [
  "push(x):",
  "    맨 끝 칸에 x를 둬요",
  "    부모보다 작으면 부모와 자리를 바꾸며 위로",
  "pop():",
  "    맨 위(가장 작은 값)를 꺼내요",
  "    맨 끝 값을 맨 위로 올리고, 더 작은 자식과 바꾸며 아래로",
];

function parseOps(value: JsonValue | undefined): { op: "push" | "pop"; x: number }[] {
  const commands = asStringArray(value, "명령 목록", 1, 12);
  return commands.map((command) => {
    const push = /^push (-?\d{1,3})$/.exec(command.trim());
    if (push) return { op: "push", x: Number(push[1]) };
    if (command.trim() === "pop") return { op: "pop", x: 0 };
    fail(`"${command}": push 수 / pop 형태로 써 주세요 (수는 -999~999)`);
  });
}

export function validateHeapOps(input: JsonValue[]): void {
  const ops = parseOps(input[0]);
  let size = 0;
  for (const { op } of ops) {
    size += op === "push" ? 1 : -1;
    if (size < 0) fail("비어 있는 힙에서는 꺼낼 수 없어요");
    if (size > 15) fail("힙에는 15개까지만 넣을 수 있어요");
  }
}

export function heapOps(input: JsonValue[]): VisualizationStep[] {
  const ops = parseOps(input[0]);
  const h = new HeapCanvas();
  const { rec, push } = recorder();
  const popped: number[] = [];
  const extra = () => ({ variables: { "꺼낸 값": popped.length ? popped.join(", ") : "(없음)" } });
  rec.push("init", "빈 최소 힙이에요. 부모는 언제나 자식보다 작거나 같아요.", null, {
    ...extra(),
    graph: h.snapshot(),
    sequence: h.array(),
  });
  for (const { op, x } of ops) {
    if (op === "push") pushValue(h, x, push, { add: 2, up: 3 }, extra);
    else popped.push(popValue(h, push, { take: 5, down: 6 }, extra));
  }
  rec.push(
    "done",
    popped.length
      ? `꺼낸 순서: ${popped.join(", ")} — 넣은 순서와 상관없이 늘 가장 작은 값부터 나와요.`
      : "넣기만 했어요. 맨 위에는 늘 가장 작은 값이 있어요.",
    null,
    { ...extra(), graph: h.snapshot(), sequence: h.array() },
  );
  return rec.steps;
}

/* ───────────── 가장 작은 두 더미 합치기 ───────────── */

export const HEAP_MERGE_PSEUDOCODE = [
  "모든 더미를 최소 힙에 넣어요",
  "while 힙에 2개 이상:",
  "    a = pop(); b = pop()        # 가장 작은 두 더미",
  "    비용 += a + b",
  "    push(a + b)",
  "return 비용",
];

export function validateHeapMerge(input: JsonValue[]): void {
  const sizes = asIntArray(input[0], "더미 크기", 2, 8);
  if (sizes.some((x) => x < 1 || x > 99)) fail("더미 크기는 1~99 사이여야 해요");
}

export function heapMerge(input: JsonValue[]): VisualizationStep[] {
  const sizes = input[0] as number[];
  const h = new HeapCanvas();
  const { rec, push } = recorder();
  let cost = 0;
  const extra = () => ({ variables: { "총 비용": cost } });
  // 처음 넣는 과정은 결과만 보여 준다 (합치기에 집중)
  for (const s of [...sizes].sort((x, y) => x - y)) h.a.push(s);
  rec.push("init", `더미 ${sizes.length}개를 최소 힙에 넣었어요. 두 더미를 합치면 두 크기의 합만큼 비용이 들어요.`, 1, {
    ...extra(),
    graph: h.snapshot(),
    sequence: h.array(),
  });
  const quiet: Push = () => undefined;
  while (h.a.length > 1) {
    const a = popValue(h, quiet, { take: 3, down: 3 }, extra);
    const b = popValue(h, quiet, { take: 3, down: 3 }, extra);
    cost += a + b;
    rec.push("pop", `가장 작은 두 더미 ${a}, ${b} 꺼내 합치기 → 비용 +${a + b}`, 4, {
      ...extra(),
      graph: h.snapshot(),
      sequence: h.array(),
    });
    pushValue(h, a + b, push, { add: 5, up: 5 }, extra);
  }
  rec.push("done", `하나로 합쳤어요. 총 비용 ${cost} — 작은 더미부터 합쳐야 큰 수가 여러 번 더해지지 않아요.`, 6, {
    ...extra(),
    graph: h.snapshot({ 0: "visited" }),
    sequence: h.array(),
  });
  return rec.steps;
}

/* ───────────── 상위 K개 (크기 K인 최소 힙) ───────────── */

export const HEAP_TOP_K_PSEUDOCODE = [
  "힙 = 빈 최소 힙 (크기 K까지만)",
  "for x in 들어오는 수:",
  "    if 크기 < K: push(x)",
  "    elif x > 힙의 맨 위:",
  "        pop(); push(x)          # 가장 작은 것을 밀어내요",
  "힙의 맨 위 = K번째로 큰 수",
];

export function validateHeapTopK(input: JsonValue[]): void {
  asIntArray(input[0], "수 목록", 1, 12);
  asInt(input[1], "K", 1, 5);
}

export function heapTopK(input: JsonValue[]): VisualizationStep[] {
  const nums = input[0] as number[];
  const k = input[1] as number;
  const h = new HeapCanvas();
  const { rec, push } = recorder();
  let index: number | null = null;
  const extra = () => ({
    variables: { K: k, [`지금 ${k}번째로 큰 수`]: h.a.length === k ? h.a[0]! : "(아직 모자라요)" },
    sequence: {
      label: "들어오는 수",
      items: nums.map((x, i) => ({ id: `n${i}`, value: x })),
      cursor: index,
      done: index ?? 0,
      highlights: index === null ? [] : [{ itemId: `n${index}`, tone: "current" as const }],
    },
  });
  const state = (marks: Partial<Record<number, GraphNodeStatus>> = {}): VizState => ({
    ...extra(),
    graph: h.snapshot(marks),
  });
  // 이 generator는 입력 줄(sequence)을 보여 주려고 힙 배열 대신 들어오는 수를 sequence에 둔다
  const withStream: Push = (action, message, line, s) =>
    push(action, message, line, { ...s, sequence: extra().sequence });

  rec.push("init", `수가 하나씩 들어와요. 크기 ${k}인 최소 힙으로 큰 수 ${k}개만 남겨요.`, 1, state());
  nums.forEach((x, i) => {
    index = i;
    if (h.a.length < k) {
      pushValue(h, x, withStream, { add: 3, up: 3 }, extra);
    } else if (x > h.a[0]!) {
      rec.push("compare", `${x} > 맨 위 ${h.a[0]} → 큰 수 ${k}개 안에 들어와요`, 4, state({ 0: "frontier" }));
      popValue(h, withStream, { take: 5, down: 5 }, extra);
      pushValue(h, x, withStream, { add: 5, up: 5 }, extra);
    } else {
      rec.push("skip", `${x} ≤ 맨 위 ${h.a[0]} → 큰 수 ${k}개에 못 들어가요`, 4, state({ 0: "visited" }));
    }
  });
  index = null;
  rec.push(
    "done",
    h.a.length === k
      ? `맨 위 값(${h.a[0]})이 ${k}번째로 큰 수예요. 힙에는 늘 ${k}개만 있어서 빨라요.`
      : `수가 ${k}개보다 적어서 ${k}번째로 큰 수가 없어요.`,
    6,
    state({ 0: "visited" }),
  );
  return rec.steps;
}
