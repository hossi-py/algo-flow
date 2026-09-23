import type { JsonValue, VisualizationStep, VizAction, VizState } from "@/types";

/** 스텝을 순서대로 쌓는다. 상태는 매번 깊은 복사해 스냅샷으로 저장한다 */
export class StepRecorder {
  readonly steps: VisualizationStep[] = [];

  push(action: VizAction, message: string, codeLine: number | null, state: VizState): void {
    this.steps.push({ index: this.steps.length, action, message, codeLine, state: structuredClone(state) });
  }
}

/* ───────────── 입력 검증 도우미 (실패하면 한국어 메시지를 던진다) ───────────── */

export class InputError extends Error {}

export function fail(message: string): never {
  throw new InputError(message);
}

export function asInt(value: JsonValue | undefined, name: string, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isInteger(value)) fail(`${name} 값은 정수여야 해요`);
  if (value < min || value > max) fail(`${name} 값은 ${min} 이상 ${max} 이하여야 해요`);
  return value;
}

export function asString(value: JsonValue | undefined, name: string, maxLength: number): string {
  if (typeof value !== "string") fail(`${name} 값은 문자열이어야 해요`);
  if (value.length === 0) fail(`${name} 값이 비어 있어요`);
  if (value.length > maxLength) fail(`${name} 값은 ${maxLength}글자 이하여야 해요`);
  return value;
}

export function asStringArray(value: JsonValue | undefined, name: string, min: number, max: number): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    fail(`${name} 값은 문자열 배열이어야 해요`);
  }
  if (value.length < min || value.length > max) fail(`${name}의 길이는 ${min}~${max}여야 해요`);
  return value as string[];
}

export function asIntArray(value: JsonValue | undefined, name: string, min: number, max: number): number[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "number" && Number.isInteger(item))) {
    fail(`${name} 값은 정수 배열이어야 해요`);
  }
  if (value.length < min || value.length > max) fail(`${name}의 길이는 ${min}~${max}여야 해요`);
  if (value.some((item) => Math.abs(item as number) > 999)) fail(`${name}의 값은 -999~999 사이여야 해요`);
  return value as number[];
}

/** 무방향 그래프의 간선 목록 검증 */
export function asEdges(value: JsonValue | undefined, n: number, maxEdges: number): [number, number][] {
  if (!Array.isArray(value)) fail("간선 목록은 [[a, b], ...] 형태여야 해요");
  if (value.length > maxEdges) fail(`간선은 ${maxEdges}개 이하여야 해요`);
  const seen = new Set<string>();
  return value.map((edge) => {
    if (!Array.isArray(edge) || edge.length !== 2 || !edge.every((v) => typeof v === "number" && Number.isInteger(v))) {
      fail("간선은 [a, b] 형태의 정수 쌍이어야 해요");
    }
    const [a, b] = edge as [number, number];
    if (a < 0 || a >= n || b < 0 || b >= n) fail(`간선 [${a}, ${b}]: 없는 노드 번호예요 (0 ~ ${n - 1}만 쓸 수 있어요)`);
    if (a === b) fail(`간선 [${a}, ${b}]: 자기 자신으로 가는 간선은 쓸 수 없어요`);
    const key = edgeKey(a, b);
    if (seen.has(key)) fail(`간선 [${a}, ${b}]: 같은 간선이 두 번 있어요`);
    seen.add(key);
    return [a, b];
  });
}

export function edgeKey(a: number | string, b: number | string): string {
  return Number(a) < Number(b) ? `${a}-${b}` : `${b}-${a}`;
}

/** 무방향 인접 리스트 (이웃은 번호 오름차순) */
export function adjacencyList(n: number, edges: [number, number][]): number[][] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a]?.push(b);
    graph[b]?.push(a);
  }
  return graph.map((neighbors) => neighbors.sort((x, y) => x - y));
}

/** 노드를 원 위에 배치 (0번이 12시 방향, 시계 방향) */
export function circleLayout(n: number): { x: number; y: number }[] {
  if (n === 1) return [{ x: 50, y: 50 }];
  return Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: round(50 + 38 * Math.cos(angle)), y: round(50 + 38 * Math.sin(angle)) };
  });
}

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** 목록을 "a → b → c" 형태로 */
export function arrowJoin(values: (string | number)[]): string {
  return values.length ? values.join(" → ") : "(없음)";
}

export const DIRECTIONS: readonly [number, number, string][] = [
  [-1, 0, "위"],
  [1, 0, "아래"],
  [0, -1, "왼쪽"],
  [0, 1, "오른쪽"],
];
