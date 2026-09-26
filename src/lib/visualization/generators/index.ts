import type { JsonValue, VisualizationGeneratorKey, VisualizationStep } from "@/types";
import {
  PERMUTATION_PSEUDOCODE,
  SUBSET_PSEUDOCODE,
  permutation,
  subset,
  validatePermutation,
  validateSubset,
} from "./backtracking";
import {
  HASH_BUCKETS_PSEUDOCODE,
  HASH_COUNT_PSEUDOCODE,
  HASH_TWO_SUM_PSEUDOCODE,
  hashBuckets,
  hashCount,
  hashTwoSum,
  validateHashBuckets,
  validateHashCount,
  validateHashTwoSum,
} from "./hash";
import {
  DEQUE_BASIC_PSEUDOCODE,
  QUEUE_BASIC_PSEUDOCODE,
  STACK_BASIC_PSEUDOCODE,
  STACK_BRACKET_PSEUDOCODE,
  dequeBasic,
  queueBasic,
  stackBasic,
  stackBracket,
  validateDequeBasic,
  validateQueueBasic,
  validateStackBasic,
  validateStackBracket,
} from "./linear";
import {
  GRAPH_ADJACENCY_PSEUDOCODE,
  GRAPH_BFS_PSEUDOCODE,
  GRAPH_DFS_PSEUDOCODE,
  graphAdjacency,
  graphBfs,
  graphDfs,
  validateGraphAdjacency,
  validateGraphBfs,
  validateGraphDfs,
} from "./graph";
import { GRID_BFS_PSEUDOCODE, GRID_DFS_PSEUDOCODE, gridBfs, gridDfs, validateGridBfs, validateGridDfs } from "./grid";
import {
  FACTORIAL_PSEUDOCODE,
  FIBONACCI_PSEUDOCODE,
  factorial,
  fibonacci,
  validateFactorial,
  validateFibonacci,
} from "./recursion";
import {
  ANSWER_PSEUDOCODE,
  EXACT_PSEUDOCODE,
  LOWER_BOUND_PSEUDOCODE,
  answerSearch,
  exactSearch,
  lowerBound,
  validateAnswer,
  validateExact,
  validateLowerBound,
} from "./binary-search";
import {
  GRID_PATHS_PSEUDOCODE,
  LCS_PSEUDOCODE,
  STAIRS_PSEUDOCODE,
  gridPaths,
  lcs,
  stairs,
  validateGridPaths,
  validateLcs,
  validateStairs,
} from "./dp";
import {
  COINS_PSEUDOCODE,
  DIGITS_PSEUDOCODE,
  INTERVALS_PSEUDOCODE,
  coins,
  digits,
  intervals,
  validateCoins,
  validateDigits,
  validateIntervals,
} from "./greedy";
import {
  DIJKSTRA_BASIC_PSEUDOCODE,
  DIJKSTRA_GRID_PSEUDOCODE,
  DIJKSTRA_PATH_PSEUDOCODE,
  dijkstraBasic,
  dijkstraGrid,
  dijkstraPath,
  validateDijkstraBasic,
  validateDijkstraGrid,
  validateDijkstraPath,
} from "./dijkstra";
import {
  HEAP_MERGE_PSEUDOCODE,
  HEAP_OPS_PSEUDOCODE,
  HEAP_TOP_K_PSEUDOCODE,
  heapMerge,
  heapOps,
  heapTopK,
  validateHeapMerge,
  validateHeapOps,
  validateHeapTopK,
} from "./heap";
import { InputError } from "./shared";
import {
  DEDUPE_PSEUDOCODE,
  MIN_WINDOW_PSEUDOCODE,
  PAIR_SUM_PSEUDOCODE,
  dedupe,
  minWindow,
  pairSum,
  validateDedupe,
  validateMinWindow,
  validatePairSum,
} from "./two-pointers";
import {
  COUNTING_PSEUDOCODE,
  INSERTION_PSEUDOCODE,
  MERGE_PSEUDOCODE,
  countingSort,
  insertionSort,
  mergeSort,
  validateCounting,
  validateInsertion,
  validateMerge,
} from "./sorting";

export interface GeneratorDefinition {
  key: VisualizationGeneratorKey;
  /** 입력 편집기에 보여 줄 형식 설명 */
  inputHint: string;
  pseudocode: string[];
  /** 문제가 있으면 예외를 던진다 (InputError) */
  validate: (input: JsonValue[]) => void;
  generate: (input: JsonValue[]) => VisualizationStep[];
}

export const GENERATORS: Record<VisualizationGeneratorKey, GeneratorDefinition> = {
  "stack-basic": {
    key: "stack-basic",
    inputHint: '[명령 목록] 예: [["push 3", "push 5", "peek", "pop"]] — push x / pop / peek, 최대 16개',
    pseudocode: STACK_BASIC_PSEUDOCODE,
    validate: validateStackBasic,
    generate: stackBasic,
  },
  "stack-bracket": {
    key: "stack-bracket",
    inputHint: '[괄호 문자열] 예: ["({[]})"] — ( ) [ ] { } 만, 최대 16글자',
    pseudocode: STACK_BRACKET_PSEUDOCODE,
    validate: validateStackBracket,
    generate: stackBracket,
  },
  "queue-basic": {
    key: "queue-basic",
    inputHint: '[명령 목록] 예: [["enqueue 1", "enqueue 2", "dequeue"]] — enqueue x / dequeue / peek, 최대 16개',
    pseudocode: QUEUE_BASIC_PSEUDOCODE,
    validate: validateQueueBasic,
    generate: queueBasic,
  },
  "deque-basic": {
    key: "deque-basic",
    inputHint:
      '[명령 목록] 예: [["push_back 1", "push_front 2", "pop_back"]] — push_front x / push_back x / pop_front / pop_back',
    pseudocode: DEQUE_BASIC_PSEUDOCODE,
    validate: validateDequeBasic,
    generate: dequeBasic,
  },
  "recursion-factorial": {
    key: "recursion-factorial",
    inputHint: "[n] 예: [4] — 1 ~ 8",
    pseudocode: FACTORIAL_PSEUDOCODE,
    validate: validateFactorial,
    generate: factorial,
  },
  "recursion-fibonacci": {
    key: "recursion-fibonacci",
    inputHint: "[n] 예: [4] — 0 ~ 5 (n이 1 늘 때마다 호출 수가 약 1.6배로 늘어나요)",
    pseudocode: FIBONACCI_PSEUDOCODE,
    validate: validateFibonacci,
    generate: fibonacci,
  },
  "graph-adjacency": {
    key: "graph-adjacency",
    inputHint: "[노드 수, 간선 목록] 예: [4, [[0, 1], [1, 2], [0, 3]]] — 노드 2 ~ 9개, 간선 최대 14개",
    pseudocode: GRAPH_ADJACENCY_PSEUDOCODE,
    validate: validateGraphAdjacency,
    generate: graphAdjacency,
  },
  "graph-dfs": {
    key: "graph-dfs",
    inputHint: "[노드 수, 간선 목록, 시작 노드] 예: [5, [[0, 1], [0, 2], [1, 3]], 0]",
    pseudocode: GRAPH_DFS_PSEUDOCODE,
    validate: validateGraphDfs,
    generate: graphDfs,
  },
  "graph-bfs": {
    key: "graph-bfs",
    inputHint: "[노드 수, 간선 목록, 시작 노드] 예: [5, [[0, 1], [0, 2], [1, 3]], 0]",
    pseudocode: GRAPH_BFS_PSEUDOCODE,
    validate: validateGraphBfs,
    generate: graphBfs,
  },
  "grid-dfs": {
    key: "grid-dfs",
    inputHint: '[격자] 예: [["110", "010", "001"]] — 1은 꽃, 0은 빈 땅, 최대 8×8',
    pseudocode: GRID_DFS_PSEUDOCODE,
    validate: validateGridDfs,
    generate: gridDfs,
  },
  "grid-bfs": {
    key: "grid-bfs",
    inputHint: '[미로] 예: [["S.#", "..#", "#.E"]] — S 출발, E 도착, . 길, # 벽, 최대 8×8',
    pseudocode: GRID_BFS_PSEUDOCODE,
    validate: validateGridBfs,
    generate: gridBfs,
  },
  "backtracking-permutation": {
    key: "backtracking-permutation",
    inputHint: "[원소 목록] 예: [[1, 2, 3]] — 서로 다른 정수 1 ~ 4개",
    pseudocode: PERMUTATION_PSEUDOCODE,
    validate: validatePermutation,
    generate: permutation,
  },
  "backtracking-subset": {
    key: "backtracking-subset",
    inputHint: "[원소 목록] 예: [[1, 2, 3]] — 서로 다른 정수 1 ~ 3개",
    pseudocode: SUBSET_PSEUDOCODE,
    validate: validateSubset,
    generate: subset,
  },
  "hash-buckets": {
    key: "hash-buckets",
    inputHint:
      '[명령 목록, 칸 수] 예: [["add cat", "add dog", "find cat"], 5] — add 단어 / find 단어 (영어 소문자), 최대 12개, 칸 2 ~ 8',
    pseudocode: HASH_BUCKETS_PSEUDOCODE,
    validate: validateHashBuckets,
    generate: hashBuckets,
  },
  "hash-count": {
    key: "hash-count",
    inputHint: '[단어 목록] 예: [["apple", "kiwi", "apple"]] — 영어 소문자 1~8글자, 최대 12개',
    pseudocode: HASH_COUNT_PSEUDOCODE,
    validate: validateHashCount,
    generate: hashCount,
  },
  "hash-two-sum": {
    key: "hash-two-sum",
    inputHint: "[수 목록, target] 예: [[4, 9, 1, 6], 7] — 정수 2 ~ 10개",
    pseudocode: HASH_TWO_SUM_PSEUDOCODE,
    validate: validateHashTwoSum,
    generate: hashTwoSum,
  },
  "sort-insertion": {
    key: "sort-insertion",
    inputHint: "[수 목록] 예: [[5, 2, 4, 6, 1, 3]] — 1~99 정수 1 ~ 10개",
    pseudocode: INSERTION_PSEUDOCODE,
    validate: validateInsertion,
    generate: insertionSort,
  },
  "sort-merge": {
    key: "sort-merge",
    inputHint: "[수 목록] 예: [[38, 27, 43, 3, 9]] — 1~99 정수 1 ~ 8개",
    pseudocode: MERGE_PSEUDOCODE,
    validate: validateMerge,
    generate: mergeSort,
  },
  "sort-counting": {
    key: "sort-counting",
    inputHint: "[수 목록] 예: [[3, 1, 4, 1, 5]] — 0~9 정수 1 ~ 12개",
    pseudocode: COUNTING_PSEUDOCODE,
    validate: validateCounting,
    generate: countingSort,
  },
  "bsearch-exact": {
    key: "bsearch-exact",
    inputHint: "[정렬된 수 목록, target] 예: [[3, 8, 15, 21, 27], 21] — 1~99 정수 1 ~ 16개",
    pseudocode: EXACT_PSEUDOCODE,
    validate: validateExact,
    generate: exactSearch,
  },
  "bsearch-lower-bound": {
    key: "bsearch-lower-bound",
    inputHint: "[정렬된 수 목록, target] 예: [[2, 4, 4, 7], 4] — 1~99 정수 1 ~ 16개",
    pseudocode: LOWER_BOUND_PSEUDOCODE,
    validate: validateLowerBound,
    generate: lowerBound,
  },
  "bsearch-answer": {
    key: "bsearch-answer",
    inputHint: "[줄 길이 목록, k] 예: [[80, 43, 57, 39], 11] — 1~99 정수 1 ~ 8개, k 1 ~ 50",
    pseudocode: ANSWER_PSEUDOCODE,
    validate: validateAnswer,
    generate: answerSearch,
  },
  "dp-stairs": {
    key: "dp-stairs",
    inputHint: "[n] 예: [6] — 계단 칸 수 1 ~ 12",
    pseudocode: STAIRS_PSEUDOCODE,
    validate: validateStairs,
    generate: stairs,
  },
  "dp-grid-paths": {
    key: "dp-grid-paths",
    inputHint: '[격자] 예: [["....", ".#..", "...."]] — . 길, # 막힘, 최대 6×6 (출발·도착 칸은 길)',
    pseudocode: GRID_PATHS_PSEUDOCODE,
    validate: validateGridPaths,
    generate: gridPaths,
  },
  "dp-lcs": {
    key: "dp-lcs",
    inputHint: '[단어 A, 단어 B] 예: ["acbde", "abcfe"] — 영어 소문자 1 ~ 7글자',
    pseudocode: LCS_PSEUDOCODE,
    validate: validateLcs,
    generate: lcs,
  },
  "greedy-intervals": {
    key: "greedy-intervals",
    inputHint: "[회의 목록] 예: [[[1, 4], [3, 5], [5, 7]]] — [시작, 끝] 1 ~ 8개, 0 ≤ 시작 < 끝 ≤ 16",
    pseudocode: INTERVALS_PSEUDOCODE,
    validate: validateIntervals,
    generate: intervals,
  },
  "greedy-coins": {
    key: "greedy-coins",
    inputHint: "[동전 목록, 금액] 예: [[500, 100, 50, 10], 1260] — 서로 다른 동전 1 ~ 6개, 금액 1 ~ 9999",
    pseudocode: COINS_PSEUDOCODE,
    validate: validateCoins,
    generate: coins,
  },
  "greedy-digits": {
    key: "greedy-digits",
    inputHint: '[수, k] 예: ["4177252841", 4] — 2 ~ 12자리 숫자, 지울 개수 k',
    pseudocode: DIGITS_PSEUDOCODE,
    validate: validateDigits,
    generate: digits,
  },
  "tp-pair-sum": {
    key: "tp-pair-sum",
    inputHint: "[정렬된 수 목록, target] 예: [[1, 2, 4, 6, 9], 10] — 1~99 정수 2 ~ 12개",
    pseudocode: PAIR_SUM_PSEUDOCODE,
    validate: validatePairSum,
    generate: pairSum,
  },
  "tp-min-window": {
    key: "tp-min-window",
    inputHint: "[양수 목록, S] 예: [[2, 3, 1, 2, 4, 3], 7] — 1~30 정수 2 ~ 12개",
    pseudocode: MIN_WINDOW_PSEUDOCODE,
    validate: validateMinWindow,
    generate: minWindow,
  },
  "tp-dedupe": {
    key: "tp-dedupe",
    inputHint: "[정렬된 수 목록] 예: [[1, 1, 2, 3, 3]] — 1~99 정수 2 ~ 12개",
    pseudocode: DEDUPE_PSEUDOCODE,
    validate: validateDedupe,
    generate: dedupe,
  },
  "heap-ops": {
    key: "heap-ops",
    inputHint: '[명령 목록] 예: [["push 5", "push 3", "pop"]] — push 수 / pop, 최대 12개 (힙에는 15개까지)',
    pseudocode: HEAP_OPS_PSEUDOCODE,
    validate: validateHeapOps,
    generate: heapOps,
  },
  "heap-merge": {
    key: "heap-merge",
    inputHint: "[더미 크기 목록] 예: [[10, 20, 40]] — 1~99 정수 2 ~ 8개",
    pseudocode: HEAP_MERGE_PSEUDOCODE,
    validate: validateHeapMerge,
    generate: heapMerge,
  },
  "heap-top-k": {
    key: "heap-top-k",
    inputHint: "[수 목록, K] 예: [[5, 1, 9, 3, 7], 3] — 정수 1 ~ 12개, K 1 ~ 5",
    pseudocode: HEAP_TOP_K_PSEUDOCODE,
    validate: validateHeapTopK,
    generate: heapTopK,
  },
  "dijkstra-basic": {
    key: "dijkstra-basic",
    inputHint:
      "[노드 수, 간선 [[a, b, 비용]], 시작] 예: [4, [[0, 1, 4], [0, 2, 1], [2, 1, 2]], 0] — 노드 2~8개, 간선 12개까지, 비용 1~99",
    pseudocode: DIJKSTRA_BASIC_PSEUDOCODE,
    validate: validateDijkstraBasic,
    generate: dijkstraBasic,
  },
  "dijkstra-path": {
    key: "dijkstra-path",
    inputHint:
      "[노드 수, 간선 [[a, b, 비용]], 시작, 도착] 예: [4, [[0, 1, 4], [0, 2, 1], [2, 1, 2]], 0, 1] — 노드 2~8개, 간선 12개까지",
    pseudocode: DIJKSTRA_PATH_PSEUDOCODE,
    validate: validateDijkstraPath,
    generate: dijkstraPath,
  },
  "dijkstra-grid": {
    key: "dijkstra-grid",
    inputHint: "[칸 비용 격자] 예: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]] — 2~5줄 × 2~5칸, 비용 1~9",
    pseudocode: DIJKSTRA_GRID_PSEUDOCODE,
    validate: validateDijkstraGrid,
    generate: dijkstraGrid,
  },
};

/** 입력을 검사하고 스텝을 만든다. 입력 오류는 사용자에게 보여 줄 메시지로 돌려준다 */
export function runGenerator(
  key: VisualizationGeneratorKey,
  input: JsonValue[],
): { ok: true; steps: VisualizationStep[] } | { ok: false; error: string } {
  const definition = GENERATORS[key];
  try {
    definition.validate(input);
    return { ok: true, steps: definition.generate(input) };
  } catch (error) {
    if (error instanceof InputError) return { ok: false, error: error.message };
    throw error;
  }
}
