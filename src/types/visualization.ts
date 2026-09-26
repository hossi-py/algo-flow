import type { JsonValue } from "./common";

export type VisualizationGeneratorKey =
  | "stack-basic"
  | "stack-bracket"
  | "queue-basic"
  | "deque-basic"
  | "recursion-factorial"
  | "recursion-fibonacci"
  | "graph-adjacency"
  | "graph-dfs"
  | "graph-bfs"
  | "grid-dfs"
  | "grid-bfs"
  | "backtracking-permutation"
  | "backtracking-subset"
  | "hash-buckets"
  | "hash-count"
  | "hash-two-sum"
  | "sort-insertion"
  | "sort-merge"
  | "sort-counting";

export interface VisualizationPreset {
  id: string;
  title: string;
  description: string;
  generator: VisualizationGeneratorKey;
  /** generator에 전달할 입력 (문제의 solution 인자와 같은 형태) */
  input: JsonValue[];
  /** 한 줄씩 표시할 의사코드. VisualizationStep.codeLine은 1부터 시작하는 이 배열의 줄 번호 */
  pseudocode: string[];
  /** 개념 학습 화면에서 사용자가 입력을 바꿔볼 수 있는지 */
  editableInput: boolean;
}

export type VizAction =
  // 스택 / 큐 / 덱
  | "push"
  | "pop"
  | "peek"
  | "enqueue"
  | "dequeue"
  | "push-front"
  | "push-back"
  | "pop-front"
  | "pop-back"
  // 재귀 / 호출 스택
  | "call"
  | "return"
  | "return-to"
  // 그래프 / 격자 탐색
  | "scan"
  | "zone-start"
  | "visit"
  | "check"
  | "discover"
  | "zone-complete"
  // 백트래킹
  | "choose"
  | "unchoose"
  | "prune"
  | "record"
  // 해시
  | "hash"
  | "insert"
  | "found"
  | "not-found"
  | "count"
  // 정렬
  | "shift"
  | "split"
  | "merge"
  | "place"
  // 공통
  | "compare"
  | "init"
  | "done";

export type HighlightTone = "current" | "frontier" | "visited" | "blocked" | "result";

export interface VizItem {
  /** 애니메이션용 고정 id (같은 값이 여러 번 들어가도 구분) */
  id: string;
  value: JsonValue;
}

export interface LinearSnapshot {
  /** 패널 제목. 기본값은 레이어 이름(스택·큐·덱). 예: 백트래킹의 "path" */
  title?: string;
  items: VizItem[];
  highlights: { itemId: string; tone: HighlightTone }[];
  /** 예: "top", "front / rear" 라벨 표시용 */
  pointerLabels: { itemId: string; label: string }[];
}

export type GraphNodeStatus = "idle" | "frontier" | "current" | "visited";
export type GraphEdgeStatus = "idle" | "active" | "tree" | "rejected";

export interface GraphNodeViz {
  id: string;
  label: string;
  /** 0~100 정규화 좌표 (SVG viewBox 기준) */
  x: number;
  y: number;
  status: GraphNodeStatus;
  /** 방문 순서 배지 (1부터) */
  order: number | null;
  /** BFS 거리 */
  distance: number | null;
  /** 노드 아래에 붙는 설명. 예: 재귀 트리의 "fib(3)=2" */
  caption?: string | null;
}

export interface GraphEdgeViz {
  from: string;
  to: string;
  status: GraphEdgeStatus;
}

export interface GraphSnapshot {
  directed: boolean;
  nodes: GraphNodeViz[];
  edges: GraphEdgeViz[];
  current: string | null;
}

export type GridCheckResult = "go" | "blocked" | "visited";

export interface GridSnapshot {
  /** 원본 격자 (문자열 한 줄 = 한 행) */
  cells: string[];
  /** 0 = 미방문, k(≥1) = k번째 구역에 속함 */
  zone: number[][];
  /** 현재 탐색 중인 칸 [row, col] */
  cursor: [number, number] | null;
  /** 지금 검사 중인 이웃 칸 */
  checking?: [number, number];
  checkResult?: GridCheckResult;
  /** BFS 거리 격자 (grid-bfs 전용) */
  distance?: (number | null)[][];
}

/** 문자열·배열을 칸으로 보여 준다 (괄호 문자열, 현재 순열 등) */
export interface SequenceSnapshot {
  label: string;
  items: VizItem[];
  /** 지금 보고 있는 칸 (없으면 null) */
  cursor: number | null;
  /** 앞에서부터 처리를 끝낸 칸 수 */
  done: number;
  highlights: { itemId: string; tone: HighlightTone }[];
}

export interface HashEntryViz {
  /** 애니메이션용 고정 id */
  id: string;
  key: JsonValue;
  value: JsonValue;
}

/** 해시 테이블. buckets가 있으면 칸(버킷) 그림, 없으면 entries를 키 → 값 표로 그린다 */
export interface HashSnapshot {
  /** 패널 제목. 예: "count", "seen" */
  title?: string;
  /** 버킷 그림: 칸마다 들어 있는 항목 (충돌하면 한 칸에 여러 개가 줄 선다) */
  buckets?: HashEntryViz[][];
  /** 표 그림: 들어간 순서대로 */
  entries?: HashEntryViz[];
  /** 지금 보고 있는 버킷 */
  activeBucket?: number | null;
  highlights: { entryId: string; tone: HighlightTone }[];
  /** 방금 계산한 해시 (버킷 그림 전용) */
  hashing?: { key: string; formula: string; bucket: number } | null;
}

/** 값의 크기를 막대 높이로 보여 준다 (정렬) */
export interface BarsSnapshot {
  title?: string;
  /** 막대 값 (0 이상). 같은 id는 자리를 옮겨도 같은 막대로 움직인다 */
  items: VizItem[];
  highlights: { itemId: string; tone: HighlightTone }[];
  /** 자리가 확정된 막대 */
  sorted: string[];
  /** 지금 다루는 범위 [시작, 끝] (포함) */
  range?: [number, number] | null;
  /** 막대 아래에 붙는 표시. 예: "i", "j" */
  pointers: { index: number; label: string }[];
}

export interface CallFrame {
  id: string;
  /** 예: "dfs(0, 1)" */
  label: string;
  locals: Record<string, JsonValue>;
  status: "active" | "waiting";
}

export interface VizState {
  stack?: LinearSnapshot;
  queue?: LinearSnapshot;
  deque?: LinearSnapshot;
  sequence?: SequenceSnapshot;
  graph?: GraphSnapshot;
  grid?: GridSnapshot;
  hash?: HashSnapshot;
  bars?: BarsSnapshot;
  callStack?: CallFrame[];
  variables?: Record<string, JsonValue>;
}

export interface VisualizationStep {
  index: number;
  action: VizAction;
  /** 한국어 한 문장 설명 */
  message: string;
  /** 하이라이트할 의사코드 줄 (1부터). 없으면 null */
  codeLine: number | null;
  /** 이 시점의 전체 상태 스냅샷 */
  state: VizState;
}

export type VisualizationGenerator = (input: JsonValue[]) => VisualizationStep[];
