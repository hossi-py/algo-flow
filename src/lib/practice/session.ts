import type { Problem, TopicSlug } from "@/types";

/**
 * 섞어 풀기: 토픽을 숨긴 채 여러 토픽의 문제를 섞어 내고, 풀기 전에 유형부터 고르게 한다.
 * 이 파일은 순수 함수만 둔다 (난수는 밖에서 넣어 테스트할 수 있게).
 */

export const PRACTICE_SIZES = [5, 10] as const;
export type PracticeSize = (typeof PRACTICE_SIZES)[number];
export const CHOICE_COUNT = 4;

export type Rng = () => number;

/** 같은 시드면 같은 순서 (테스트·재현용) */
export function seededRng(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 본문에 이 말이 나오면 정답을 알려 주는 셈이라 출제하지 않는다 */
const TOPIC_NAMES: Record<TopicSlug, RegExp> = {
  stack: /스택/,
  "queue-deque": /큐|덱/,
  recursion: /재귀/,
  "graph-representation": /인접\s*(리스트|행렬)/,
  dfs: /DFS|깊이\s*우선/,
  bfs: /BFS|너비\s*우선/,
  backtracking: /백트래킹/,
  hash: /해시/,
  sorting: /정렬/,
  "binary-search": /이분\s*탐색|이진\s*탐색/,
  dp: /\bDP\b|동적\s*계획/,
  greedy: /그리디|탐욕/,
  "two-pointers": /두\s*포인터|투\s*포인터|슬라이딩\s*윈도우/,
  heap: /힙|우선순위\s*큐/,
  dijkstra: /다익스트라|데이크스트라/,
  "graph-advanced": /유니온\s*파인드|위상\s*정렬|크루스칼|최소\s*신장/,
  complexity: /시간\s*복잡도/,
  implementation: /시뮬레이션/,
};

export function revealsTopic(problem: Problem): boolean {
  return TOPIC_NAMES[problem.topic].test(problem.statement);
}

/**
 * 헷갈리기 쉬운 토픽. 보기에 먼저 넣어서 "그럴듯한 오답"이 되게 한다.
 * (아무 토픽이나 섞으면 스택 문제에 DP 보기처럼 너무 쉬워진다)
 */
const CONFUSABLE: Record<TopicSlug, TopicSlug[]> = {
  stack: ["queue-deque", "recursion", "hash"],
  "queue-deque": ["stack", "bfs", "sorting"],
  recursion: ["backtracking", "dp", "stack"],
  "graph-representation": ["dfs", "bfs", "hash"],
  dfs: ["bfs", "backtracking", "graph-representation"],
  bfs: ["dfs", "dp", "queue-deque"],
  backtracking: ["dp", "dfs", "recursion"],
  hash: ["sorting", "binary-search", "stack"],
  sorting: ["hash", "binary-search", "greedy"],
  "binary-search": ["sorting", "hash", "dp"],
  dp: ["backtracking", "greedy", "recursion"],
  greedy: ["dp", "sorting", "two-pointers"],
  "two-pointers": ["hash", "binary-search", "greedy"],
  heap: ["sorting", "greedy", "queue-deque"],
  dijkstra: ["bfs", "dp", "heap"],
  "graph-advanced": ["dfs", "bfs", "dijkstra"],
  complexity: ["binary-search", "dp", "greedy"],
  implementation: ["bfs", "greedy", "sorting"],
};

/** 정답 + 헷갈리는 토픽 2개 + 나머지 중 하나를 섞어 4지선다 */
export function pickChoices(answer: TopicSlug, allTopics: readonly TopicSlug[], rng: Rng): TopicSlug[] {
  const confusable = shuffle(
    CONFUSABLE[answer].filter((t) => t !== answer && allTopics.includes(t)),
    rng,
  ).slice(0, CHOICE_COUNT - 2);
  const rest = shuffle(
    allTopics.filter((t) => t !== answer && !confusable.includes(t)),
    rng,
  ).slice(0, CHOICE_COUNT - 1 - confusable.length);
  return shuffle([answer, ...confusable, ...rest], rng);
}

/** 출제 후보: 큐레이션 문제 중 Lv2 이상, 본문에 토픽 이름이 없는 것 */
export function practicePool(problems: readonly Problem[], topics?: readonly TopicSlug[]): Problem[] {
  return problems.filter(
    (p) =>
      p.source === "curated" && p.level >= 2 && !revealsTopic(p) && (topics === undefined || topics.includes(p.topic)),
  );
}

export interface PracticeQuestion {
  problem: Problem;
  choices: TopicSlug[];
}

/**
 * 문제를 골고루 섞는다: 토픽 순서를 섞고 한 토픽씩 돌아가며 뽑아서, 한 토픽이 몰리지 않게 한다.
 * 후보가 모자라면 있는 만큼만 낸다.
 */
export function buildSession(
  pool: readonly Problem[],
  count: number,
  allTopics: readonly TopicSlug[],
  rng: Rng,
): PracticeQuestion[] {
  const byTopic = new Map<TopicSlug, Problem[]>();
  for (const problem of shuffle(pool, rng)) {
    const list = byTopic.get(problem.topic) ?? [];
    list.push(problem);
    byTopic.set(problem.topic, list);
  }
  const order = shuffle([...byTopic.keys()], rng);
  const picked: Problem[] = [];
  while (picked.length < count && order.some((t) => (byTopic.get(t)?.length ?? 0) > 0)) {
    for (const topic of order) {
      const next = byTopic.get(topic)?.pop();
      if (next) picked.push(next);
      if (picked.length === count) break;
    }
  }
  return shuffle(picked, rng).map((problem) => ({ problem, choices: pickChoices(problem.topic, allTopics, rng) }));
}

export interface PracticeAnswer {
  problemKey: string;
  topic: TopicSlug;
  picked: TopicSlug;
}

/** 토픽별로 몇 번 나왔고 몇 번 맞혔는지 */
export function tallyByTopic(answers: readonly PracticeAnswer[]): Map<TopicSlug, { seen: number; correct: number }> {
  const tally = new Map<TopicSlug, { seen: number; correct: number }>();
  for (const answer of answers) {
    const entry = tally.get(answer.topic) ?? { seen: 0, correct: 0 };
    entry.seen += 1;
    if (answer.picked === answer.topic) entry.correct += 1;
    tally.set(answer.topic, entry);
  }
  return tally;
}
