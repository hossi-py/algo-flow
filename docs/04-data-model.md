# 04. 데이터 모델

- **정적 콘텐츠**(Topic, Level, Problem, Hint, PatternSignal, VisualizationPreset)는 `src/content/*.ts`에 TS 객체로 저장한다.
- **사용자 데이터**(진도, 제출, 배지, AI 코치 대화, AI 생성 문제)는 Supabase에 저장한다. 게스트는 같은 구조(`UserProgress`)를 localStorage에 저장한다.
- 문제 식별자는 `ProblemKey` = `c:<slug>`(큐레이션) / `g:<uuid>`(AI 생성). DB는 이 키로 콘텐츠와 연결된다.
- 아래 각 코드 블록의 첫 줄 주석은 Step 2 이후 실제로 놓일 파일 경로다. (이 블록들은 추출해서 `tsc --strict`로 타입 검사를 통과한 상태)

---

## 1. TypeScript 인터페이스

### 1.1 공통

```ts
// src/types/common.ts
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/** ISO 8601 UTC 시각. 예: "2026-09-23T01:00:00.000Z" */
export type IsoDateTime = string;
/** Asia/Seoul 기준 날짜. 예: "2026-09-23" */
export type LocalDate = string;

/** MVP 지원 언어. 테스트케이스는 JSON이라 언어와 무관하게 공유된다 */
export const LANGUAGES = ["python", "javascript"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
};

/** 큐레이션 문제는 "c:<slug>", AI 생성 문제는 "g:<uuid>" */
export type ProblemKey = `c:${string}` | `g:${string}`;
```

### 1.2 콘텐츠 (Topic · Level · Problem · Hint · PatternSignal)

```ts
// src/types/content.ts
import type { JsonValue, Language, ProblemKey } from "./common";
import type { VisualizationPreset } from "./visualization";

export const TOPIC_SLUGS = [
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
] as const;
export type TopicSlug = (typeof TOPIC_SLUGS)[number];

/** 이후 확장 예정 주제 (로드맵에 "곧 열려요"로 표시) */
export type UpcomingTopicSlug = "dp";

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

export type TopicColor = "peach" | "mint" | "lilac" | "sky" | "blossom" | "lemon" | "sage" | "sand" | "slate" | "plum";
export type TopicIcon = "plates" | "line" | "mirror" | "map" | "dive" | "ripple" | "maze" | "lockers" | "bars" | "target";

export const PATTERN_TAGS = [
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
] as const;
export type PatternTag = (typeof PATTERN_TAGS)[number];

export type TopicUnlockRule =
  | { type: "always" }
  | { type: "level-cleared"; topic: TopicSlug; level: LevelNumber };

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
  | "bsearch-yes-no";

/** 같은 코드를 언어별로 제공. 사용자가 고른 언어의 코드만 보여준다 */
export interface CodeSnippet {
  code: Record<Language, string>;
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
export type HintSet = readonly [
  Hint<1, "pattern">,
  Hint<2, "approach">,
  Hint<3, "pseudocode">,
  Hint<4, "key-code">,
];

/** 타입 표기는 언어별로 보여준다. 예: { python: "list[str]", javascript: "string[]" } */
export type TypeNotation = Record<Language, string>;

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
}

export type CompareMode =
  | { type: "exact" }
  | { type: "unordered" }
  | { type: "float"; tolerance: number };

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
  starterCode: Record<Language, string>;
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
```

### 1.3 시각화

```ts
// src/types/visualization.ts
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
  | "sort-counting"
  | "bsearch-exact"
  | "bsearch-lower-bound"
  | "bsearch-answer";

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
  // 이분 탐색
  | "narrow"
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
```

### 1.4 채점 & 실행

```ts
// src/types/judge.ts
import type { JsonValue } from "./common";
import type { TestCaseVisibility } from "./content";

export type Verdict =
  | "accepted"
  | "wrong-answer"
  | "runtime-error"
  | "time-limit-exceeded"
  | "syntax-error"
  | "internal-error";

export type CaseVerdict = "passed" | "failed" | "runtime-error" | "time-limit-exceeded" | "not-run";

export interface CodeError {
  /** 예: "IndexError", "TypeError" */
  type: string;
  message: string;
  /** 사용자 코드 기준 줄 번호 */
  line: number | null;
  traceback: string;
}

export interface TestCaseResult {
  testCaseId: string;
  visibility: TestCaseVisibility;
  verdict: CaseVerdict;
  timeMs: number | null;
  stdout: string;
  /** 입력·기대값·실제값을 사용자에게 공개하는지 (예제 or 처음 틀린 숨은 케이스) */
  revealed: boolean;
  args?: JsonValue[];
  expected?: JsonValue;
  actual?: JsonValue;
  error?: CodeError;
}

export type JudgeMode = "run" | "submit";

export interface JudgeResult {
  mode: JudgeMode;
  verdict: Verdict;
  passed: number;
  total: number;
  results: TestCaseResult[];
  totalTimeMs: number;
  /** syntax-error일 때 */
  compileError?: CodeError;
  /** internal-error일 때: 실행 엔진 로딩 실패·워커 충돌 등 */
  engineError?: string;
}

/** 메인 스레드 → 워커 (Python: public/workers/pyodide.worker.mjs, JS: src/workers/js.worker.ts — 같은 프로토콜) */
export type WorkerRequest =
  /** Python 워커는 Pyodide 위치와 채점 하네스 코드를 함께 받는다 */
  | { type: "init"; indexURL?: string; harness?: string }
  | {
      type: "run-case";
      runId: string;
      code: string;
      functionName: string;
      args: JsonValue[];
      recursionLimit: number;
      stdoutLimitBytes: number;
    };

/** 워커 → 메인 스레드 */
export type WorkerResponse =
  | { type: "ready"; runtime: string }
  | { type: "init-error"; message: string }
  | { type: "case-result"; runId: string; ok: true; value: JsonValue; stdout: string; timeMs: number }
  | {
      type: "case-result";
      runId: string;
      ok: false;
      /** compile: 문법 오류(모든 케이스 공통) · runtime: 실행 중 예외 */
      phase: "compile" | "runtime";
      error: CodeError;
      stdout: string;
      timeMs: number;
    };
```

### 1.5 진도 · 제출 · 통계

```ts
// src/types/progress.ts
import type { IsoDateTime, Language, LocalDate, ProblemKey } from "./common";
import type { LevelNumber, PatternTag, ProblemSource, TopicSlug } from "./content";
import type { TestCaseResult, Verdict } from "./judge";

export type HintsOpened = 0 | 1 | 2 | 3 | 4;

export interface Submission {
  id: string;
  userId: string;
  problemKey: ProblemKey;
  source: ProblemSource;
  topic: TopicSlug;
  level: LevelNumber;
  /** 제출 시점의 문제 태그 스냅샷 (약점 분석용) */
  patternTags: PatternTag[];
  language: Language;
  code: string;
  verdict: Verdict;
  passed: number;
  total: number;
  runtimeMs: number | null;
  hintsOpened: HintsOpened;
  failedTestCaseId: string | null;
  results: TestCaseResult[];
  createdAt: IsoDateTime;
}

export type ProblemStatus = "attempted" | "solved";

export interface ProblemProgress {
  problemKey: ProblemKey;
  source: ProblemSource;
  topic: TopicSlug;
  level: LevelNumber;
  status: ProblemStatus;
  attempts: number;
  maxHintOpened: HintsOpened;
  lastCode: string | null;
  solvedAt: IsoDateTime | null;
  bestRuntimeMs: number | null;
  xpAwarded: number;
  updatedAt: IsoDateTime;
}

export interface ConceptProgress {
  topic: TopicSlug;
  completedCardIds: string[];
  completedAt: IsoDateTime | null;
  /** 0~1 */
  quizBestScore: number | null;
  quizAttempts: number;
  /** 만점으로 끝낸 퀴즈 수 ("유형 탐정" 배지, Step 6 추가) */
  quizPerfectCount?: number;
}

export interface LevelClear {
  topic: TopicSlug;
  level: LevelNumber;
  clearedAt: IsoDateTime;
}

export interface UserStats {
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: LocalDate | null;
}

export interface ActivityDay {
  date: LocalDate;
  xpEarned: number;
  solvedCount: number;
}

export type BadgeId =
  | "first-accept"
  | "no-hint-lv3"
  | "streak-3"
  | "streak-7"
  | "streak-30"
  | "topic-master"
  | "signal-detective"
  | "ai-pioneer"
  | "never-give-up";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
}

export interface EarnedBadge {
  badgeId: BadgeId;
  earnedAt: IsoDateTime;
}

/** 게스트(localStorage)와 로그인 사용자(Supabase) 공통 진도 구조 */
export interface UserProgress {
  /** 게스트면 null */
  userId: string | null;
  stats: UserStats;
  concepts: Partial<Record<TopicSlug, ConceptProgress>>;
  problems: Partial<Record<ProblemKey, ProblemProgress>>;
  levelClears: LevelClear[];
  activity: ActivityDay[];
  badges: EarnedBadge[];
}

/* ── 저장하지 않고 계산하는 값 (lib/progress/unlock.ts) ── */

export type LevelStatus = "locked" | "available" | "in-progress" | "cleared";
export type TopicStatus = "locked" | "available" | "in-progress" | "mastered";

export interface LevelView {
  topic: TopicSlug;
  level: LevelNumber;
  status: LevelStatus;
  solved: number;
  required: number;
  total: number;
  /** 잠금 사유. 예: "Lv2를 클리어하면 열려요" */
  lockedReason: string | null;
}

export interface TopicView {
  topic: TopicSlug;
  status: TopicStatus;
  /** 0~1 */
  progress: number;
  levels: LevelView[];
  lockedReason: string | null;
}

/* ── 약점 분석 (lib/progress/weakness.ts) ── */

export interface PatternStat {
  pattern: PatternTag;
  problemsAttempted: number;
  problemsSolved: number;
  submissions: number;
  acceptedSubmissions: number;
  /** 정답 제출의 평균 힌트 단계 */
  avgHintsOnAccept: number | null;
  lastAttemptAt: IsoDateTime;
}

export interface WeaknessScore {
  pattern: PatternTag;
  /** 0~1, 높을수록 약함 */
  score: number;
  /** 사용자에게 보여줄 근거 문장 */
  reasons: string[];
}
```

### 1.6 AI (코치 · 문제 생성)

```ts
// src/types/ai.ts
import type { IsoDateTime, ProblemKey } from "./common";
import type { LevelNumber, PatternTag, Problem, TopicSlug } from "./content";
import type { HintsOpened } from "./progress";

export type MascotMood =
  | "idle"
  | "happy"
  | "cheer"
  | "thinking"
  | "oops"
  | "sleepy"
  | "curious"
  | "loading";

export interface CoachMessage {
  id: string;
  problemKey: ProblemKey;
  role: "user" | "assistant";
  content: string;
  /** 이 메시지 시점에 열려 있던 힌트 단계 */
  hintLevel: HintsOpened;
  mood?: MascotMood;
  createdAt: IsoDateTime;
}

export type GenerationStatus =
  | "queued"
  | "generating"
  | "verifying"
  | "verified"
  | "rejected"
  | "failed";

export interface GenerationRequest {
  topic: TopicSlug;
  level: Exclude<LevelNumber, 1>;
  focusPatterns: PatternTag[];
  weakSignalIds: string[];
  /** 선택: 문제 스토리 테마. 예: "우주", "카페" */
  theme?: string;
}

export type VerificationStage = "schema" | "static-check" | "execution" | "determinism" | "quality";

export interface VerificationAttempt {
  attempt: number;
  stage: VerificationStage;
  ok: boolean;
  /** 실패 사유 (재생성 프롬프트에 그대로 전달) */
  reason: string | null;
  durationMs: number;
  at: IsoDateTime;
}

export interface GeneratedProblem {
  id: string;
  ownerId: string;
  status: GenerationStatus;
  request: GenerationRequest;
  /** status === "verified"일 때만 존재. source는 "generated", id는 "g:<uuid>" */
  problem: Problem | null;
  attempts: VerificationAttempt[];
  model: string;
  error: string | null;
  createdAt: IsoDateTime;
  verifiedAt: IsoDateTime | null;
}
```

### 1.7 AI 구조화 출력 zod 스키마

LLM에게 받는 "초안(ProblemDraft)"은 `Problem`과 다르다. **기대 출력(expected)은 LLM이 쓰지 않고**, 검증 파이프라인이 정답 코드를 실행해 채운다.
인자는 재귀 JSON 스키마를 지원하지 않는 제공자가 있으므로 `argsJson` 문자열로 받고 파싱 단계에서 검증한다.

```ts
// src/lib/ai/schemas.ts
import { z } from "zod";
import { PATTERN_TAGS } from "@/types/content";

/** Python·JS 양쪽에서 쓸 수 있는 변수명 (snake_case) */
const identifier = z.string().regex(/^[a-z_][a-z0-9_]*$/, "영문 소문자, 숫자, _ 로만 된 변수명이어야 해요");

export const problemDraftSchema = z.object({
  title: z.string().min(2).max(30).describe("한국어 문제 제목, 30자 이내"),
  summary: z.string().min(5).max(80).describe("문제 목록에 보일 한 줄 요약"),
  statement: z
    .string()
    .min(80)
    .describe("마크다운 문제 설명. 짧은 스토리와 요구사항. 풀이 방법이나 알고리즘 이름을 직접 쓰지 말 것"),
  inputFormat: z.string().min(5).describe("solution 함수 인자 설명"),
  outputFormat: z.string().min(5).describe("반환값 설명"),
  constraints: z
    .array(z.string())
    .min(1)
    .max(8)
    .describe("입력 크기 등 제약 조건. 모든 정수 값과 결과는 -2^53 ~ 2^53 범위 (JS 호환)"),
  params: z
    .array(
      z.object({
        name: identifier,
        type: z.object({
          python: z.string().describe("Python 타입 힌트. 예: list[list[int]]"),
          javascript: z.string().describe("TypeScript 표기. 예: number[][]"),
        }),
        description: z.string(),
      }),
    )
    .min(1)
    .max(4),
  returns: z.object({
    type: z.object({ python: z.string(), javascript: z.string() }),
    description: z.string(),
  }),
  compare: z.enum(["exact", "unordered"]).describe("반환 리스트의 순서가 상관없으면 unordered"),
  referenceSolution: z
    .string()
    .min(30)
    .describe(
      "def solution(...)을 포함한 완전한 Python 3 코드. import는 collections, heapq, itertools, math, functools, bisect만 허용. input/print/파일 접근 금지",
    ),
  testInputs: z
    .array(
      z.object({
        argsJson: z.string().describe('solution에 전달할 인자 배열의 JSON. 예: [["110", "011"]]'),
        visibility: z.enum(["example", "hidden"]),
        purpose: z.enum(["basic", "edge", "tricky", "stress"]),
        note: z.string().describe("이 케이스가 확인하는 것. 예: 대각선은 연결이 아님"),
      }),
    )
    .min(6)
    .max(16)
    .describe("example 2~3개, 나머지는 hidden. 경계값과 최대 크기 케이스 포함"),
  patternTags: z.array(z.enum(PATTERN_TAGS)).min(1).max(3),
  signalIds: z.array(z.string()).max(3).describe("제공된 신호 목록 중 이 문제에 해당하는 id"),
  hints: z
    .array(
      z.object({
        title: z.string().max(30),
        body: z.string().min(20),
        code: z
          .object({ python: z.string(), javascript: z.string() })
          .nullable()
          .describe("같은 코드 조각을 Python과 JavaScript로 각각 작성"),
      }),
    )
    .length(4)
    .describe("[0] 유형과 판단 근거 [1] 접근 아이디어 [2] 의사코드 [3] 핵심 부분 코드(빈칸 포함, 전체 정답 금지)"),
  estimatedMinutes: z.number().int().min(5).max(60),
});
export type ProblemDraft = z.infer<typeof problemDraftSchema>;

/** AI 코치 응답과 함께 받는 메타데이터 */
export const coachMetaSchema = z.object({
  mood: z.enum(["idle", "happy", "cheer", "thinking", "oops", "sleepy", "curious", "loading"]),
  /** 다음에 열어보면 좋을 힌트 단계. 추천하지 않으면 null */
  suggestHintStep: z.number().int().min(1).max(4).nullable(),
  /** 사용자에게 보여줄 후속 질문 버튼 (최대 3개) */
  followUps: z.array(z.string().max(40)).max(3),
});
export type CoachMeta = z.infer<typeof coachMetaSchema>;
```

---

## 2. 게임화 규칙 (lib/progress 구현 기준)

| 항목 | 규칙 |
| --- | --- |
| 문제 XP | 기본값 Lv1 10 · Lv2 20 · Lv3 30 · Lv4 40 · Lv5 50. **첫 정답 때만** 지급 |
| 힌트 감소 | 최종 XP = 기본 XP × (1 − 열었던 마지막 힌트의 `xpPenaltyRate`). 기본값 힌트1 5% · 힌트2 15% · 힌트3 30% · 힌트4 50%. 반올림, 최소 1XP |
| 개념 XP | 개념 카드 전부 완료 10XP, 유형 인식 퀴즈 첫 통과 15XP |
| 사용자 레벨 | 레벨 n 도달 누적 XP = 25 × n × (n − 1) → Lv2 50, Lv3 150, Lv5 500, Lv10 2,250 |
| 노디 성장 | 사용자 레벨 1–3 떡잎 · 4–6 본잎 · 7–9 꽃봉오리 · 10+ 만개 (+ Lv5 마스터 토픽 꽃) |
| 스트릭 | Asia/Seoul 날짜 기준. 그날 XP ≥ 1이면 활동일. 마지막 활동일이 어제면 +1, 오늘이면 유지, 그 외 1로 리셋 |
| 토픽 해제 | 스택은 항상 열림. 나머지는 **이전 토픽 Lv3 클리어** 시 열림 |
| 레벨 해제 | 토픽이 열리면 Lv1 열림. LvN은 Lv(N−1) 클리어 시 열림 |
| 레벨 클리어 | 해당 레벨 문제 중 `minSolved`개 해결(기본: 레벨당 3문제 중 2문제). Lv1은 개념 완료 + 퀴즈 통과도 필요 |
| 약점 점수 | 패턴별 `score = 0.5 × (1 − 문제 해결률) + 0.3 × (평균 힌트 단계 / 4) + 0.2 × (1 − 정답 제출 비율)`. 시도 문제가 2개 미만인 패턴은 제외 |

---

## 3. Supabase 테이블 설계

### 3.1 테이블 요약

| 테이블 | PK | 설명 | 클라이언트 권한 |
| --- | --- | --- | --- |
| `profiles` | `id` (= auth.users.id) | 닉네임, 일일 목표, 테마, 에디터 설정 | 본인 조회·수정 |
| `user_stats` | `user_id` | XP, 스트릭 | 본인 조회 (쓰기는 RPC) |
| `activity_days` | `(user_id, activity_date)` | 날짜별 XP/해결 수 (스트릭, 잔디) | 본인 조회 (쓰기는 RPC) |
| `concept_progress` | `(user_id, topic_slug)` | 개념 카드 완료, 퀴즈 점수 | 본인 조회 (쓰기는 RPC) |
| `level_clears` | `(user_id, topic_slug, level)` | 레벨 클리어 시각 | 본인 조회 (쓰기는 RPC) |
| `problem_progress` | `(user_id, problem_key)` | 문제별 상태, 시도 수, 힌트, 코드 초안 | 본인 조회 (쓰기는 RPC) |
| `submissions` | `id` | 제출 기록 (패턴 태그 스냅샷 포함) | 본인 조회 (쓰기는 RPC) |
| `generated_problems` | `id` | AI 생성 문제 (공개 가능한 부분) | 본인 조회 (쓰기는 서버) |
| `generated_problem_solutions` | `problem_id` | AI 생성 문제 정답 코드 | **접근 불가** (service role 전용) |
| `badges` | `id` | 배지 정의 | 누구나 조회 |
| `user_badges` | `(user_id, badge_id)` | 획득 배지 | 본인 조회 (쓰기는 RPC) |
| `coach_messages` | `id` | AI 코치 대화 | 본인 조회·작성 |
| `user_pattern_stats` (view) | — | 패턴별 제출 통계 (약점 분석) | 본인 행만 (security_invoker) |
| `error_events` | `id` | 에러 모니터링 기록 (server·client·boundary·engine, 쿼리·이메일·토큰을 가린 뒤 저장) | **접근 불가** (service role 전용) |
| `error_groups` (view) | — | `error_events`를 지문(fingerprint)별로 묶은 통계 | **접근 불가** (service role 전용) |
| `admins` | `user_id` | 관리자 계정 목록 (관리자 화면 접근 권한) | **접근 불가** (service role 전용) |

> 주간 랭킹(`20260926000003_weekly_ranking.sql`): `profiles.show_in_ranking`(본인만 수정), `weekly_ranking(user, limit, today)`·`ranking_flags(from, to)` 함수(service role 전용). 서버는 닉네임·XP만 브라우저로 넘긴다.

> 관리자 조회 함수 `admin_list_users`, `admin_user_account`, `admin_overview`(`20260926000001_admin.sql`)도 service role만 실행할 수 있다. 서버가 요청한 사람이 `admins`에 있는지 확인한 뒤에만 부른다 (`src/lib/admin`).

> 쓰기 RPC(`record_submission`, `record_concept_progress`, `record_problem_state`, `merge_guest_progress`, `complete_generated_problem`)는 Step 6에서 `supabase/migrations/20260924000000_progress_rpc.sql`로 작성했다. XP·스트릭·레벨 클리어·배지 **계산은 서버의 TS 규칙**(`lib/progress/actions.ts`)이 하고, RPC는 계산된 행들을 `revision` 확인 뒤 한 트랜잭션으로 기록한다 (service role만 실행 가능).

### 3.2 마이그레이션 SQL

> **실제 파일이 기준이다**: `supabase/migrations/`. 아래는 Step 1 설계안이며, Step 6에서 이렇게 바뀌었다.
> - `user_stats.revision` (낙관적 잠금), `concept_progress.quiz_perfect_count` (유형 탐정 배지) 추가
> - `profiles.theme` 기본값 `'system'`, 가입 시 OAuth 이름을 닉네임으로 (`handle_new_user`)
> - `profiles`는 설정 컬럼만 UPDATE 권한, `generated_problem_solutions`는 anon·authenticated 권한 자체를 회수
> - `pgcrypto` 확장 대신 기본 `gen_random_uuid()` 사용, `user_pattern_stats` 뷰는 `internal-error` 제외
> - 배지 정의는 시드가 아니라 마이그레이션(`20260924000001_badges.sql`)으로 넣는다 (user_badges가 참조)

```sql
-- supabase/migrations/20260923000000_init.sql

create extension if not exists pgcrypto;

-- ─────────────────────────────── enums
create type public.problem_source as enum ('curated', 'generated');
create type public.problem_status as enum ('attempted', 'solved');
create type public.verdict as enum (
  'accepted', 'wrong-answer', 'runtime-error', 'time-limit-exceeded', 'syntax-error', 'internal-error'
);
create type public.generation_status as enum (
  'queued', 'generating', 'verifying', 'verified', 'rejected', 'failed'
);
create type public.coach_role as enum ('user', 'assistant');

-- ─────────────────────────────── helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────── profiles
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  nickname         text not null default '새싹 학습자' check (char_length(nickname) between 1 and 20),
  daily_goal_xp    integer not null default 30 check (daily_goal_xp between 10 and 500),
  theme            text not null default 'light' check (theme in ('light', 'dark', 'system')),
  editor_font_size smallint not null default 14 check (editor_font_size between 12 and 22),
  preferred_language text not null default 'python' check (preferred_language in ('python', 'javascript')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────── stats & activity
create table public.user_stats (
  user_id          uuid primary key references public.profiles (id) on delete cascade,
  xp               integer not null default 0 check (xp >= 0),
  current_streak   integer not null default 0 check (current_streak >= 0),
  longest_streak   integer not null default 0 check (longest_streak >= 0),
  last_active_date date,
  updated_at       timestamptz not null default now()
);
create trigger user_stats_set_updated_at
  before update on public.user_stats
  for each row execute function public.set_updated_at();

create table public.activity_days (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  xp_earned     integer not null default 0 check (xp_earned >= 0),
  solved_count  integer not null default 0 check (solved_count >= 0),
  primary key (user_id, activity_date)
);

-- ─────────────────────────────── learning progress
create table public.concept_progress (
  user_id            uuid not null references public.profiles (id) on delete cascade,
  topic_slug         text not null,
  completed_card_ids text[] not null default '{}',
  completed_at       timestamptz,
  quiz_best_score    numeric(4, 3) check (quiz_best_score between 0 and 1),
  quiz_attempts      integer not null default 0 check (quiz_attempts >= 0),
  updated_at         timestamptz not null default now(),
  primary key (user_id, topic_slug)
);
create trigger concept_progress_set_updated_at
  before update on public.concept_progress
  for each row execute function public.set_updated_at();

create table public.level_clears (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  topic_slug text not null,
  level      smallint not null check (level between 1 and 5),
  cleared_at timestamptz not null default now(),
  primary key (user_id, topic_slug, level)
);

create table public.problem_progress (
  user_id         uuid not null references public.profiles (id) on delete cascade,
  problem_key     text not null check (problem_key ~ '^(c|g):.+$'),
  source          public.problem_source not null,
  topic_slug      text not null,
  level           smallint not null check (level between 1 and 5),
  status          public.problem_status not null default 'attempted',
  attempts        integer not null default 0 check (attempts >= 0),
  max_hint_opened smallint not null default 0 check (max_hint_opened between 0 and 4),
  last_code       text check (char_length(last_code) <= 20000),
  solved_at       timestamptz,
  best_runtime_ms integer check (best_runtime_ms >= 0),
  xp_awarded      integer not null default 0 check (xp_awarded >= 0),
  updated_at      timestamptz not null default now(),
  primary key (user_id, problem_key),
  constraint solved_has_timestamp check (status <> 'solved' or solved_at is not null)
);
create trigger problem_progress_set_updated_at
  before update on public.problem_progress
  for each row execute function public.set_updated_at();

create table public.submissions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  problem_key        text not null check (problem_key ~ '^(c|g):.+$'),
  source             public.problem_source not null,
  topic_slug         text not null,
  level              smallint not null check (level between 1 and 5),
  pattern_tags       text[] not null default '{}',
  language           text not null default 'python' check (language in ('python', 'javascript')),
  code               text not null check (char_length(code) <= 20000),
  verdict            public.verdict not null,
  passed             integer not null check (passed >= 0),
  total              integer not null check (total > 0),
  runtime_ms         integer check (runtime_ms >= 0),
  hints_opened       smallint not null default 0 check (hints_opened between 0 and 4),
  failed_test_case_id text,
  results            jsonb not null default '[]'::jsonb,
  created_at         timestamptz not null default now(),
  constraint passed_not_over_total check (passed <= total)
);
create index submissions_user_created_idx on public.submissions (user_id, created_at desc);
create index submissions_user_problem_idx on public.submissions (user_id, problem_key);

-- ─────────────────────────────── AI generated problems
create table public.generated_problems (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  status      public.generation_status not null default 'queued',
  topic_slug  text not null,
  level       smallint not null check (level between 2 and 5),
  request     jsonb not null,
  problem     jsonb,
  pattern_tags text[] not null default '{}',
  attempts    jsonb not null default '[]'::jsonb,
  model       text not null,
  error       text,
  created_at  timestamptz not null default now(),
  verified_at timestamptz,
  -- 검증을 통과한 문제만 본문을 가진다
  constraint problem_only_when_verified check ((status = 'verified') = (problem is not null)),
  constraint verified_has_timestamp check (status <> 'verified' or verified_at is not null)
);
create index generated_problems_owner_created_idx on public.generated_problems (owner_id, created_at desc);

create table public.generated_problem_solutions (
  problem_id uuid primary key references public.generated_problems (id) on delete cascade,
  language   text not null default 'python' check (language = 'python'),
  code       text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────── badges
create table public.badges (
  id          text primary key,
  name        text not null,
  description text not null,
  icon        text not null,
  sort_order  integer not null default 0
);

create table public.user_badges (
  user_id   uuid not null references public.profiles (id) on delete cascade,
  badge_id  text not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ─────────────────────────────── AI coach
create table public.coach_messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  problem_key text not null check (problem_key ~ '^(c|g):.+$'),
  role        public.coach_role not null,
  content     text not null check (char_length(content) <= 8000),
  hint_level  smallint not null default 0 check (hint_level between 0 and 4),
  mood        text,
  created_at  timestamptz not null default now()
);
create index coach_messages_thread_idx on public.coach_messages (user_id, problem_key, created_at);

-- ─────────────────────────────── new user bootstrap
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────── row level security
alter table public.profiles                    enable row level security;
alter table public.user_stats                  enable row level security;
alter table public.activity_days               enable row level security;
alter table public.concept_progress            enable row level security;
alter table public.level_clears                enable row level security;
alter table public.problem_progress            enable row level security;
alter table public.submissions                 enable row level security;
alter table public.generated_problems          enable row level security;
alter table public.generated_problem_solutions enable row level security; -- 정책 없음 = service role 전용
alter table public.badges                      enable row level security;
alter table public.user_badges                 enable row level security;
alter table public.coach_messages              enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy user_stats_select_own on public.user_stats
  for select to authenticated using ((select auth.uid()) = user_id);
create policy activity_days_select_own on public.activity_days
  for select to authenticated using ((select auth.uid()) = user_id);
create policy concept_progress_select_own on public.concept_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy level_clears_select_own on public.level_clears
  for select to authenticated using ((select auth.uid()) = user_id);
create policy problem_progress_select_own on public.problem_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy submissions_select_own on public.submissions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy user_badges_select_own on public.user_badges
  for select to authenticated using ((select auth.uid()) = user_id);

create policy generated_problems_select_own on public.generated_problems
  for select to authenticated using ((select auth.uid()) = owner_id);

create policy badges_select_all on public.badges
  for select to anon, authenticated using (true);

create policy coach_messages_select_own on public.coach_messages
  for select to authenticated using ((select auth.uid()) = user_id);
create policy coach_messages_insert_own on public.coach_messages
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- ─────────────────────────────── weakness analysis view
create view public.user_pattern_stats
with (security_invoker = true)
as
select
  s.user_id,
  tag                                                              as pattern,
  count(distinct s.problem_key)                                    as problems_attempted,
  count(distinct s.problem_key) filter (where s.verdict = 'accepted') as problems_solved,
  count(*)                                                         as submissions,
  count(*) filter (where s.verdict = 'accepted')                   as accepted_submissions,
  avg(s.hints_opened) filter (where s.verdict = 'accepted')        as avg_hints_on_accept,
  max(s.created_at)                                                as last_attempt_at
from public.submissions s
cross join lateral unnest(s.pattern_tags) as tag
group by s.user_id, tag;
```

### 3.3 배지 시드

```sql
-- supabase/seed.sql
insert into public.badges (id, name, description, icon, sort_order) values
  ('first-accept',     '첫 새싹',       '첫 문제를 맞혔어요',                          'sprout',     1),
  ('no-hint-lv3',      '혼자서도 척척', 'Lv3 이상 문제를 힌트 없이 풀었어요',          'sparkles',   2),
  ('streak-3',         '사흘의 약속',   '3일 연속으로 학습했어요',                      'flame',      3),
  ('streak-7',         '일주일 개근',   '7일 연속으로 학습했어요',                      'flame-2',    4),
  ('streak-30',        '한 달의 숲',    '30일 연속으로 학습했어요',                     'trees',      5),
  ('topic-master',     '토픽 마스터',   '한 토픽의 Lv5를 클리어했어요',                 'crown',      6),
  ('signal-detective', '유형 탐정',     '유형 인식 퀴즈를 만점으로 5번 통과했어요',     'search',     7),
  ('ai-pioneer',       'AI 개척자',     'AI가 만든 맞춤 문제를 처음 풀었어요',          'wand',       8),
  ('never-give-up',    '끈기왕',        '5번 이상 도전한 끝에 정답을 맞혔어요',         'mountain',   9)
on conflict (id) do update
  set name = excluded.name,
      description = excluded.description,
      icon = excluded.icon,
      sort_order = excluded.sort_order;
```

### 3.4 ERD (요약)

```
auth.users 1─1 profiles 1─1 user_stats
                 │
                 ├─< activity_days
                 ├─< concept_progress        (topic_slug → src/content)
                 ├─< level_clears            (topic_slug, level → src/content)
                 ├─< problem_progress        (problem_key → src/content | generated_problems)
                 ├─< submissions             (problem_key …)
                 ├─< user_badges >─ badges
                 ├─< coach_messages
                 └─< generated_problems 1─1 generated_problem_solutions
```
