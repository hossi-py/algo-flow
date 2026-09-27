import type { JsonValue, Language, LanguageMap, ProblemKey } from "./common";
import type { VisualizationPreset } from "./visualization";

export const TOPIC_SLUGS = [
  "complexity",
  "stack",
  "queue-deque",
  "recursion",
  "graph-representation",
  "dfs",
  "bfs",
  "backtracking",
  "hash",
  "sorting",
  "binary-search",
  "dp",
  "greedy",
  "two-pointers",
  "heap",
  "dijkstra",
  "graph-advanced",
  "implementation",
] as const;
export type TopicSlug = (typeof TOPIC_SLUGS)[number];

/** 이후 확장 예정 주제 (로드맵에 "곧 열려요"로 표시) */
export type UpcomingTopicSlug = never;

export type LevelNumber = 1 | 2 | 3 | 4 | 5;

export const LEVEL_STAGES = {
  1: "concept",
  2: "implementation",
  3: "pattern",
  4: "application",
  5: "exam",
} as const satisfies Record<LevelNumber, string>;
export type LevelStage = (typeof LEVEL_STAGES)[LevelNumber];

export const LEVEL_STAGE_LABELS: Record<LevelStage, string> = {
  concept: "개념 이해",
  implementation: "기본 구현",
  pattern: "대표 유형",
  application: "응용",
  exam: "코딩테스트 실전",
};

export type TopicColor =
  | "peach"
  | "mint"
  | "lilac"
  | "sky"
  | "blossom"
  | "lemon"
  | "sage"
  | "sand"
  | "slate"
  | "plum"
  | "teal"
  | "coral"
  | "indigo";
export type TopicIcon =
  | "plates"
  | "line"
  | "mirror"
  | "map"
  | "dive"
  | "ripple"
  | "maze"
  | "lockers"
  | "bars"
  | "target"
  | "table"
  | "coins"
  | "pointers"
  | "heap"
  | "route"
  | "network"
  | "timer"
  | "cog";

export const PATTERN_TAGS = [
  // 시간 복잡도 입문
  "formula-o1",
  "single-pass",
  "precompute",
  "halving-log",
  "sqrt-bound",
  // 스택
  "bracket-matching",
  "stack-simulation",
  "monotonic-stack",
  "undo-history",
  // 큐 / 덱
  "queue-simulation",
  "round-robin",
  "sliding-window-deque",
  "two-ended-deque",
  // 재귀
  "recursive-definition",
  "divide-and-conquer",
  "recursion-tree",
  // 그래프 표현
  "adjacency-list",
  "adjacency-matrix",
  "edge-list-conversion",
  "degree-count",
  // DFS
  "connected-components",
  "grid-flood-fill",
  "path-existence",
  "cycle-detection",
  "tree-traversal",
  // BFS
  "shortest-path-unweighted",
  "grid-shortest-path",
  "multi-source-bfs",
  "state-space-bfs",
  "level-order",
  // 백트래킹
  "permutation",
  "combination",
  "subset",
  "constraint-pruning",
  // 해시
  "existence-check",
  "frequency-count",
  "complement-lookup",
  "group-by-key",
  "prefix-sum-hash",
  // 정렬
  "sort-then-scan",
  "custom-order",
  "merge-step",
  "counting-sort",
  "interval-sweep",
  // 이분 탐색
  "exact-search",
  "boundary-search",
  "range-count",
  "parametric-search",
  // DP
  "linear-dp",
  "grid-dp",
  "knapsack",
  "sequence-dp",
  "state-dp",
  // 그리디
  "greedy-by-sort",
  "interval-scheduling",
  "greedy-accumulate",
  "digit-greedy",
  // 두 포인터
  "opposite-ends",
  "same-direction",
  "fixed-window",
  "variable-window",
  // 힙
  "top-k",
  "repeated-min",
  "k-way-merge",
  "two-heaps",
  "heap-scheduling",
  // 다익스트라
  "weighted-shortest-path",
  "path-restore",
  "reverse-or-multi-source",
  "state-dijkstra",
  "minimax-path",
  // 그래프 심화
  "union-find",
  "reverse-union",
  "minimum-spanning-tree",
  "topological-sort",
  "dag-dp",
  // 구현 / 시뮬레이션
  "direction-move",
  "matrix-transform",
  "step-simulation",
  "string-parse",
  "time-calc",
] as const;
export type PatternTag = (typeof PATTERN_TAGS)[number];

export type TopicUnlockRule = { type: "always" } | { type: "level-cleared"; topic: TopicSlug; level: LevelNumber };

export interface Topic {
  slug: TopicSlug;
  order: number;
  title: string;
  /** 한 줄 비유. 예: "접시 쌓기처럼, 마지막에 올린 것을 먼저 꺼내요" */
  tagline: string;
  color: TopicColor;
  icon: TopicIcon;
  unlock: TopicUnlockRule;
  concept: ConceptLesson;
  levels: readonly [Level, Level, Level, Level, Level];
  /** 이 토픽을 의심하게 만드는 대표 신호 */
  signalIds: string[];
}

export interface LevelClearRule {
  /** 이 레벨에서 해결해야 하는 최소 문제 수 */
  minSolved: number;
  /** Lv1 전용: 개념 카드 완료 + 유형 인식 퀴즈 통과 필요 */
  requiresConcept: boolean;
}

export interface Level {
  topic: TopicSlug;
  level: LevelNumber;
  stage: LevelStage;
  title: string;
  /** 이 레벨을 마치면 할 수 있게 되는 것 */
  goal: string;
  problemSlugs: string[];
  clearRule: LevelClearRule;
}

export type IllustrationKey =
  | "stack-plates"
  | "stack-undo"
  | "queue-line"
  | "deque-train"
  | "recursion-mirror"
  | "recursion-dolls"
  | "graph-map"
  | "graph-matrix"
  | "dfs-maze-dive"
  | "bfs-ripple"
  | "backtracking-tree"
  | "hash-lockers"
  | "hash-tally"
  | "sorting-bars"
  | "sorting-merge"
  | "bsearch-halving"
  | "bsearch-yes-no"
  | "dp-memo-notebook"
  | "dp-table-fill"
  | "greedy-meetings"
  | "greedy-counterexample"
  | "tp-squeeze"
  | "tp-window"
  | "heap-tree"
  | "heap-emergency"
  | "dijkstra-map"
  | "dijkstra-settle"
  | "uf-groups"
  | "topo-order"
  | "cx-growth-curves"
  | "cx-count-steps"
  | "sim-robot-grid"
  | "sim-rulebook";

/** 같은 코드를 언어별로 제공. 사용자가 고른 언어의 코드만 보여준다 */
export interface CodeSnippet {
  code: LanguageMap<string>;
  caption?: string;
}

export interface ConceptCard {
  id: string;
  title: string;
  /** 일상 비유 */
  analogy: string;
  /** 마크다운 본문 */
  body: string;
  illustration: IllustrationKey;
  keyPoints: string[];
  code?: CodeSnippet;
}

export interface RecognitionQuestion {
  id: string;
  /** 실제 문제처럼 쓰인 짧은 지문 */
  snippet: string;
  choices: TopicSlug[];
  answer: TopicSlug;
  /** 정답 근거가 되는 신호 (지문 속 해당 문구를 하이라이트) */
  signalIds: string[];
  /** 지문에서 하이라이트할 문구 */
  highlightPhrases: string[];
  explanation: string;
}

export interface ConceptLesson {
  topic: TopicSlug;
  cards: ConceptCard[];
  visualizations: VisualizationPreset[];
  recognitionQuiz: RecognitionQuestion[];
  /** 퀴즈 통과 기준 (0~1) */
  passScore: number;
}

export type SignalStrength = "strong" | "medium" | "weak";

export interface PatternSignal {
  id: string;
  /** 신호 문구. 예: "최단 거리 / 최소 횟수" */
  phrase: string;
  /** 실제 문제에서 이 신호가 등장하는 표현 예시 */
  examples: string[];
  /** 의심할 알고리즘 (우선순위 순) */
  suspects: TopicSlug[];
  patterns: PatternTag[];
  /** 왜 이 신호가 이 알고리즘을 가리키는가 */
  reason: string;
  /** 함정 / 예외 */
  caution?: string;
  strength: SignalStrength;
}

export type HintStep = 1 | 2 | 3 | 4;
export type HintKind = "pattern" | "approach" | "pseudocode" | "key-code";

export interface Hint<S extends HintStep = HintStep, K extends HintKind = HintKind> {
  step: S;
  kind: K;
  title: string;
  /** 마크다운 */
  body: string;
  code?: CodeSnippet;
  /** 이 힌트까지 열었을 때의 누적 XP 감소율 (0~1) */
  xpPenaltyRate: number;
}

/** 힌트는 항상 4단계이며 순서와 종류가 고정된다 */
export type HintSet = readonly [Hint<1, "pattern">, Hint<2, "approach">, Hint<3, "pseudocode">, Hint<4, "key-code">];

/** 타입 표기는 언어별로 보여준다. 예: { python: "list[str]", javascript: "string[]" } */
export type TypeNotation = LanguageMap<string>;

export interface ParamSpec {
  name: string;
  type: TypeNotation;
  description: string;
}

export interface FunctionSignature {
  name: "solution";
  params: ParamSpec[];
  returns: { type: TypeNotation; description: string };
}

export type TestCaseVisibility = "example" | "hidden";
export type TestCasePurpose = "basic" | "edge" | "tricky" | "stress";

export interface TestCase {
  id: string;
  visibility: TestCaseVisibility;
  /** solution(*args) 로 전달되는 인자 배열 */
  args: JsonValue[];
  expected: JsonValue;
  purpose: TestCasePurpose;
  /** 예제 케이스에만: 사용자에게 보여줄 해설 */
  explanation?: string;
  /** 틀렸을 때 보여줄 짧은 설명. 예: "대각선은 연결이 아니에요" */
  failureNote?: string;
  /** 입력·정답을 빼고 보낸 숨은 테스트. 채점 직전에 원래 문제에서 채운다 */
  deferred?: boolean;
}

export type CompareMode = { type: "exact" } | { type: "unordered" } | { type: "float"; tolerance: number };

export interface JudgeConfig {
  /** 케이스당 제한 시간 */
  timeLimitMs: number;
  compare: CompareMode;
  /** Python 전용 (sys.setrecursionlimit). JS는 엔진 기본 스택 사용 */
  recursionLimit: number;
  /** 제출 시 처음 틀린 숨은 케이스의 입력/기대값 공개 여부 */
  revealFirstFailure: boolean;
}

export interface ProblemVisualization {
  /** 풀이 화면 우측 패널에서 선택 가능한 프리셋들 (첫 번째가 기본값) */
  presets: VisualizationPreset[];
}

export type ProblemSource = "curated" | "generated";

export interface Problem {
  id: ProblemKey;
  slug: string;
  source: ProblemSource;
  topic: TopicSlug;
  level: LevelNumber;
  title: string;
  summary: string;
  /** 마크다운 */
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  signature: FunctionSignature;
  starterCode: LanguageMap<string>;
  testCases: TestCase[];
  judge: JudgeConfig;
  hints: HintSet;
  patternTags: PatternTag[];
  signalIds: string[];
  visualization?: ProblemVisualization;
  estimatedMinutes: number;
  /** 힌트 없이 첫 정답 시 받는 기본 XP */
  xp: number;
}

/** 정답 코드는 Problem과 분리 보관 (클라이언트 번들 / 공개 API에 포함 금지) */
export interface ProblemSolution {
  problemId: ProblemKey;
  language: Language;
  code: string;
}
