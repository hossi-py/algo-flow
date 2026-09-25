import type { CallFrame, GraphEdgeViz, GraphNodeViz, JsonValue, VisualizationStep } from "@/types";
import { StepRecorder, asInt, round } from "./shared";

/* ───────────── 팩토리얼 ───────────── */

export const FACTORIAL_PSEUDOCODE = [
  "factorial(n):",
  "    if n <= 1: return 1              # 종료 조건",
  "    return n × factorial(n - 1)      # 더 작은 문제로 재귀 호출",
];

export function validateFactorial(input: JsonValue[]): void {
  asInt(input[0], "n", 1, 8);
}

export function factorial(input: JsonValue[]): VisualizationStep[] {
  const n = input[0] as number;
  const rec = new StepRecorder();
  const frames: { k: number; result: number | null }[] = [];

  const callStack = (): CallFrame[] =>
    frames.map((f, i) => ({
      id: `f${f.k}`,
      label: `factorial(${f.k})`,
      locals: (f.result === null ? { n: f.k } : { n: f.k, 결과: f.result }) as Record<string, JsonValue>,
      status: i === frames.length - 1 ? "active" : "waiting",
    }));
  const state = () => ({ callStack: callStack(), variables: { "호출 깊이": frames.length } });

  const call = (k: number): number => {
    frames.push({ k, result: null });
    rec.push("call", `factorial(${k}) 호출 — 호출 스택에 새 칸이 쌓여요`, 1, state());
    if (k <= 1) {
      frames[frames.length - 1]!.result = 1;
      rec.push("return", `n = ${k} → 종료 조건! 더 부르지 않고 1을 돌려줘요`, 2, state());
      frames.pop();
      return 1;
    }
    rec.push(
      "call",
      `${k} × factorial(${k - 1}) 계산에는 먼저 factorial(${k - 1}) 값이 필요해요 → 재귀 호출`,
      3,
      state(),
    );
    const sub = call(k - 1);
    const value = k * sub;
    frames[frames.length - 1]!.result = value;
    rec.push("return-to", `factorial(${k - 1}) = ${sub} 값이 돌아왔어요 → ${k} × ${sub} = ${value}`, 3, state());
    rec.push("return", `factorial(${k})의 계산이 끝났어요. 결과 ${value} 반환, 칸이 사라져요`, 3, state());
    frames.pop();
    return value;
  };

  const result = call(n);
  rec.push("done", `factorial(${n}) = ${result}. 호출은 ${n}칸까지 쌓였다가 거꾸로 풀렸어요.`, null, {
    callStack: [],
    variables: { 결과: result },
  });
  return rec.steps;
}

/* ───────────── 피보나치 (재귀 트리) ───────────── */

export const FIBONACCI_PSEUDOCODE = [
  "fib(n):",
  "    if n <= 1: return n              # 종료 조건",
  "    return fib(n - 1) + fib(n - 2)   # 두 번 재귀 호출",
];

export function validateFibonacci(input: JsonValue[]): void {
  asInt(input[0], "n", 0, 5);
}

interface TreeNode {
  id: string;
  k: number;
  depth: number;
  parent: string | null;
  children: TreeNode[];
  x: number;
  y: number;
}

/** 호출 트리를 미리 만들고 좌표를 정한다 (잎은 왼쪽부터 같은 간격, 부모는 자식들의 가운데) */
function buildTree(n: number): TreeNode[] {
  const all: TreeNode[] = [];
  let seq = 0;
  const make = (k: number, depth: number, parent: string | null): TreeNode => {
    const node: TreeNode = { id: `t${seq++}`, k, depth, parent, children: [], x: 0, y: 0 };
    all.push(node);
    if (k > 1) node.children = [make(k - 1, depth + 1, node.id), make(k - 2, depth + 1, node.id)];
    return node;
  };
  const root = make(n, 0, null);

  let leaf = 0;
  const place = (node: TreeNode) => {
    if (node.children.length === 0) {
      node.x = leaf++;
      return;
    }
    node.children.forEach(place);
    node.x = (node.children[0]!.x + node.children[node.children.length - 1]!.x) / 2;
  };
  place(root);
  const maxDepth = Math.max(...all.map((node) => node.depth), 1);
  const span = Math.max(leaf - 1, 1);
  for (const node of all) {
    node.x = leaf === 1 ? 50 : round(8 + (node.x / span) * 84);
    node.y = round(10 + (node.depth / maxDepth) * 78);
  }
  return all;
}

export function fibonacci(input: JsonValue[]): VisualizationStep[] {
  const n = input[0] as number;
  const rec = new StepRecorder();
  const tree = buildTree(n);
  const byId = new Map(tree.map((node) => [node.id, node]));

  const revealed = new Map<string, { status: GraphNodeViz["status"]; value: number | null }>();
  const frames: { node: TreeNode; value: number | null }[] = [];
  const callCount = new Map<number, number>();
  let calls = 0;

  const graph = () => {
    const nodes: GraphNodeViz[] = [...revealed.entries()].map(([id, info]) => {
      const node = byId.get(id)!;
      return {
        id,
        label: String(node.k),
        x: node.x,
        y: node.y,
        status: info.status,
        order: null,
        distance: null,
        caption: info.value === null ? `fib(${node.k})` : `fib(${node.k})=${info.value}`,
      };
    });
    const edges: GraphEdgeViz[] = [...revealed.keys()]
      .map((id) => byId.get(id)!)
      .filter((node) => node.parent !== null)
      .map((node) => ({
        from: node.parent!,
        to: node.id,
        status: revealed.get(node.id)?.value !== null ? ("tree" as const) : ("active" as const),
      }));
    return { directed: false, nodes, edges, current: frames[frames.length - 1]?.node.id ?? null };
  };
  const duplicates = () => [...callCount.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const state = () => ({
    graph: graph(),
    callStack: frames.map((f, i): CallFrame => ({
      id: f.node.id,
      label: `fib(${f.node.k})`,
      locals: f.value === null ? { n: f.node.k } : { n: f.node.k, 지금까지: f.value },
      status: i === frames.length - 1 ? "active" : "waiting",
    })),
    variables: { "총 호출": calls, "같은 계산 반복": duplicates() },
  });

  const setStatus = () => {
    frames.forEach((f, i) => {
      revealed.set(f.node.id, { status: i === frames.length - 1 ? "current" : "frontier", value: null });
    });
  };

  const visit = (node: TreeNode): number => {
    calls += 1;
    callCount.set(node.k, (callCount.get(node.k) ?? 0) + 1);
    frames.push({ node, value: null });
    setStatus();
    const repeat = (callCount.get(node.k) ?? 0) > 1;
    rec.push(
      "call",
      repeat
        ? `fib(${node.k}) 호출 — 앞에서 이미 계산한 적 있는 값이에요! 같은 일을 또 하고 있어요`
        : `fib(${node.k}) 호출`,
      1,
      state(),
    );
    if (node.k <= 1) {
      frames.pop();
      revealed.set(node.id, { status: "visited", value: node.k });
      setStatus();
      rec.push("return", `n = ${node.k} → 종료 조건! 바로 ${node.k} 반환`, 2, state());
      return node.k;
    }
    let total = 0;
    for (const [index, child] of node.children.entries()) {
      rec.push(
        "call",
        `fib(${node.k})의 ${index === 0 ? "첫 번째" : "두 번째"} 재귀 호출: fib(${child.k})`,
        3,
        state(),
      );
      const value = visit(child);
      total += value;
      frames[frames.length - 1]!.value = total;
      rec.push("return-to", `fib(${child.k}) = ${value} 값이 돌아왔어요 (지금까지 합 ${total})`, 3, state());
    }
    frames.pop();
    revealed.set(node.id, { status: "visited", value: total });
    setStatus();
    rec.push("return", `fib(${node.k}) = ${total} 반환`, 3, state());
    return total;
  };

  const result = visit(tree[0]!);
  rec.push(
    "done",
    `fib(${n}) = ${result}. 호출은 모두 ${calls}번, 그중 ${duplicates()}번은 이미 했던 계산이에요 — 기억해 두면(메모이제이션) 줄일 수 있어요.`,
    null,
    { ...state(), callStack: [] },
  );
  return rec.steps;
}
