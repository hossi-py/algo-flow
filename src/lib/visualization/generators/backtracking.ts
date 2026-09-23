import type {
  CallFrame,
  GraphEdgeViz,
  GraphNodeStatus,
  GraphNodeViz,
  HighlightTone,
  JsonValue,
  LinearSnapshot,
  VisualizationStep,
  VizItem,
} from "@/types";
import { StepRecorder, asIntArray, fail, round } from "./shared";

function asDistinctItems(value: JsonValue | undefined, max: number): number[] {
  const items = asIntArray(value, "원소 목록", 1, max);
  if (new Set(items).size !== items.length) fail("원소는 서로 달라야 해요");
  return items;
}

function pathStack(path: VizItem[], highlight?: { itemId: string; tone: HighlightTone }): LinearSnapshot {
  return {
    title: "path",
    items: path.map((item) => ({ ...item })),
    highlights: highlight ? [highlight] : [],
    pointerLabels: path.length ? [{ itemId: path[path.length - 1]!.id, label: "마지막 선택" }] : [],
  };
}

const format = (values: JsonValue[]) => `[${values.join(", ")}]`;

/* ───────────── 순열 ───────────── */

export const PERMUTATION_PSEUDOCODE = [
  "backtrack(path):",
  "    if len(path) == n: 결과에 path 기록; return",
  "    for x in items:",
  "        if x를 아직 안 썼다면:",
  "            path에 x 추가, 사용 표시      # 고르기",
  "            backtrack(path)              # 더 깊이",
  "            path에서 x 빼기, 사용 해제    # 되돌리기",
];

export function validatePermutation(input: JsonValue[]): void {
  asDistinctItems(input[0], 4);
}

export function permutation(input: JsonValue[]): VisualizationStep[] {
  const items = input[0] as number[];
  const n = items.length;
  const rec = new StepRecorder();
  const used = items.map(() => false);
  const path: VizItem[] = [];
  const results: number[][] = [];
  let seq = 0;

  const state = (highlight?: { itemId: string; tone: HighlightTone }, current?: number) => ({
    sequence: {
      label: "items",
      items: items.map((x, i) => ({ id: `i${i}`, value: x })),
      cursor: current ?? null,
      done: 0,
      highlights: items.flatMap((_, i): { itemId: string; tone: HighlightTone }[] =>
        i === current ? [{ itemId: `i${i}`, tone: "current" }] : used[i] ? [{ itemId: `i${i}`, tone: "visited" }] : [],
      ),
    },
    stack: pathStack(path, highlight),
    callStack: Array.from(
      { length: path.length + 1 },
      (_, depth): CallFrame => ({
        id: `bt-${depth}`,
        label: `backtrack(${format(path.slice(0, depth).map((p) => p.value))})`,
        locals: { "깊이": depth },
        status: depth === path.length ? "active" : "waiting",
      }),
    ),
    variables: { "찾은 순열": results.map((r) => format(r)), "개수": results.length },
  });

  rec.push("init", `${format(items)}로 만들 수 있는 모든 순서를 찾아요. 빈 path에서 시작!`, 1, state());

  const backtrack = () => {
    if (path.length === n) {
      results.push(path.map((p) => p.value as number));
      rec.push("record", `path가 ${n}개로 꽉 찼어요 → 순열 ${format(results[results.length - 1]!)} 기록`, 2, state());
      return;
    }
    for (const [i, x] of items.entries()) {
      if (used[i]) continue;
      used[i] = true;
      const item = { id: `p${seq++}`, value: x };
      path.push(item);
      rec.push("choose", `아직 안 쓴 ${x} 고르기 → path = ${format(path.map((p) => p.value))}`, 5, state({ itemId: item.id, tone: "current" }, i));
      backtrack();
      path.pop();
      used[i] = false;
      rec.push("unchoose", `되돌리기: path에서 ${x} 빼고 다음 선택지를 봐요 → path = ${format(path.map((p) => p.value))}`, 7, state(undefined, i));
    }
  };

  backtrack();
  rec.push("done", `모든 경우를 다 봤어요. 순열은 모두 ${results.length}개 (${n}! = ${results.length})`, null, state());
  return rec.steps;
}

/* ───────────── 부분집합 (결정 트리) ───────────── */

export const SUBSET_PSEUDOCODE = [
  "backtrack(i, path):",
  "    if i == n: 결과에 path 기록; return",
  "    path에 items[i] 추가              # 넣는 경우",
  "    backtrack(i + 1, path)",
  "    path에서 items[i] 빼기            # 되돌리기",
  "    backtrack(i + 1, path)            # 안 넣는 경우",
];

export function validateSubset(input: JsonValue[]): void {
  asDistinctItems(input[0], 3);
}

export function subset(input: JsonValue[]): VisualizationStep[] {
  const items = input[0] as number[];
  const n = items.length;
  const rec = new StepRecorder();
  const path: VizItem[] = [];
  const results: number[][] = [];
  let seq = 0;

  // 결정 트리 노드: id = 지금까지의 선택 ("I" 넣기 / "O" 안 넣기), 루트는 ""
  const revealed = new Map<string, { status: GraphNodeStatus; caption: string | null }>();
  const position = (decisions: string) => {
    const depth = decisions.length;
    const index = [...decisions].reduce((acc, d) => acc * 2 + (d === "I" ? 0 : 1), 0);
    return { x: round(6 + ((index + 0.5) / 2 ** depth) * 88), y: round(10 + (depth / n) * 76) };
  };
  const nodeLabel = (decisions: string) => {
    if (decisions === "") return "시작";
    const i = decisions.length - 1;
    return `${decisions[i] === "I" ? "+" : "−"}${items[i]}`;
  };
  /** 지금 서 있는 트리 노드 (탐색이 끝나면 null) */
  let current: string | null = "";

  const graph = () => {
    const nodes: GraphNodeViz[] = [...revealed.entries()].map(([id, info]) => ({
      id: id || "root",
      label: nodeLabel(id),
      ...position(id),
      status: current !== null && id === current ? "current" : info.status,
      order: null,
      distance: null,
      caption: info.caption,
    }));
    const edges: GraphEdgeViz[] = [...revealed.keys()]
      .filter((id) => id !== "")
      .map((id) => ({
        from: id.slice(0, -1) || "root",
        to: id,
        status: revealed.get(id)?.status === "visited" ? "tree" : "active",
      }));
    return { directed: false, nodes, edges, current: current === null ? null : current || "root" };
  };
  const state = () => ({
    graph: graph(),
    stack: pathStack(path),
    callStack: Array.from(
      { length: current === null ? 0 : current.length + 1 },
      (_, depth): CallFrame => ({
        id: `bt-${depth}`,
        label: `backtrack(${depth})`,
        locals: { i: depth },
        status: depth === (current?.length ?? 0) ? "active" : "waiting",
      }),
    ),
    variables: { "찾은 부분집합": results.map((r) => format(r)), "개수": results.length },
  });

  const enter = (decisions: string) => {
    for (const [id, info] of revealed) if (info.status === "current") revealed.set(id, { ...info, status: "frontier" });
    revealed.set(decisions, { status: "frontier", caption: null });
    current = decisions;
  };
  const leave = (decisions: string) => {
    const info = revealed.get(decisions);
    revealed.set(decisions, { status: "visited", caption: info?.caption ?? null });
    current = decisions.slice(0, -1);
  };

  enter("");
  rec.push("init", `${format(items)}의 원소마다 "넣는다 / 안 넣는다"를 정하며 내려가요.`, 1, state());

  const backtrack = (decisions: string) => {
    const i = decisions.length;
    if (i === n) {
      const chosen = path.map((p) => p.value as number);
      results.push(chosen);
      revealed.set(decisions, { status: "visited", caption: `{${chosen.join(",")}}` });
      rec.push("record", `모든 원소를 정했어요 → 부분집합 {${chosen.join(", ")}} 기록`, 2, state());
      return;
    }
    const x = items[i]!;
    const item = { id: `s${seq++}`, value: x };
    path.push(item);
    enter(`${decisions}I`);
    rec.push("choose", `${x} 값을 넣는 쪽으로 가요 → path = ${format(path.map((p) => p.value))}`, 3, state());
    backtrack(`${decisions}I`);
    leave(`${decisions}I`);
    path.pop();
    rec.push("unchoose", `되돌리기: path에서 ${x} 빼기 → path = ${format(path.map((p) => p.value))}`, 5, state());
    enter(`${decisions}O`);
    rec.push("choose", `이번엔 ${x} 값을 넣지 않는 쪽으로 가요`, 6, state());
    backtrack(`${decisions}O`);
    leave(`${decisions}O`);
  };

  backtrack("");
  leave("");
  current = null;
  rec.push("done", `부분집합은 모두 ${results.length}개 (2^${n} = ${results.length}). 트리의 잎 하나가 부분집합 하나예요.`, null, state());
  return rec.steps;
}
