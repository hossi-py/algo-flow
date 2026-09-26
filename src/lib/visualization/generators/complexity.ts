import type { BarsSnapshot, HighlightTone, JsonValue, SequenceSnapshot, VisualizationStep } from "@/types";
import { StepRecorder, asInt, asIntArray, fail } from "./shared";

const round1 = (value: number) => Math.round(value * 10) / 10;

/* ───────────── 입력이 커질 때 연산 횟수 ───────────── */

export const CX_GROWTH_PSEUDOCODE = [
  "# O(log N): 절반씩 줄이기",
  "while n > 1: n //= 2",
  "# O(N): 한 번 훑기",
  "for x in arr: ...",
  "# O(N log N): 정렬",
  "arr.sort()",
  "# O(N²): 모든 쌍",
  "for i in range(n): for j in range(n): ...",
];

function parseGrowth(input: JsonValue[]) {
  return asInt(input[0], "N", 2, 20);
}

export function validateCxGrowth(input: JsonValue[]): void {
  parseGrowth(input);
}

export function cxGrowth(input: JsonValue[]): VisualizationStep[] {
  const max = parseGrowth(input);
  const rec = new StepRecorder();
  const bars = (n: number, highlight: HighlightTone | null): BarsSnapshot => {
    const values = [round1(Math.log2(n)), n, round1(n * Math.log2(n)), n * n];
    return {
      title: `N = ${n}일 때 연산 횟수`,
      items: values.map((value, i) => ({ id: `b${i}`, value })),
      highlights: highlight ? [{ itemId: "b3", tone: highlight }] : [],
      sorted: [],
      pointers: ["log N", "N", "N log N", "N²"].map((label, index) => ({ index, label })),
    };
  };
  const vars = (n: number) => ({
    "log N": round1(Math.log2(n)),
    N: n,
    "N log N": round1(n * Math.log2(n)),
    "N²": n * n,
  });

  rec.push("init", "N이 커질 때 네 가지 방법의 연산 횟수가 어떻게 늘어나는지 봐요.", null, {
    bars: bars(1, null),
    variables: vars(1),
  });
  for (let n = 2; n <= max; n++) {
    rec.push(
      "count",
      `N = ${n}: log N ≈ ${round1(Math.log2(n))}, N log N ≈ ${round1(n * Math.log2(n))}, N² = ${n * n}`,
      n * n > 4 * n ? 8 : null,
      { bars: bars(n, n * n > 4 * n ? "blocked" : null), variables: vars(n) },
    );
  }
  rec.push(
    "done",
    `N이 ${max}배가 되는 동안 N²는 ${max * max}배로 늘었어요. N이 10만이면 N²는 100억이라 시간 안에 못 끝나요.`,
    7,
    { bars: bars(max, "blocked"), variables: vars(max) },
  );
  return rec.steps;
}

/* ───────────── 모든 쌍 vs 한 번 훑기 ───────────── */

export const CX_PAIRS_PSEUDOCODE = [
  "# 방법 1: 모든 쌍 — O(N²)",
  "for i in range(n):",
  "    for j in range(i + 1, n):",
  "        best = max(best, prices[j] - prices[i])",
  "# 방법 2: 한 번 훑기 — O(N)",
  "low = prices[0]",
  "for p in prices[1:]:",
  "    best = max(best, p - low)",
  "    low = min(low, p)          # 지금까지 가장 싼 날",
];

function parsePairs(input: JsonValue[]) {
  const prices = asIntArray(input[0], "가격", 2, 8);
  if (prices.some((p) => p < 1)) fail("가격은 1 이상이어야 해요");
  return prices;
}

export function validateCxPairs(input: JsonValue[]): void {
  parsePairs(input);
}

export function cxPairs(input: JsonValue[]): VisualizationStep[] {
  const prices = parsePairs(input);
  const n = prices.length;
  const rec = new StepRecorder();
  const seq = (marks: Record<number, HighlightTone>, cursor: number | null): SequenceSnapshot => ({
    label: "가격",
    items: prices.map((value, i) => ({ id: `p${i}`, value })),
    cursor,
    done: 0,
    highlights: Object.entries(marks).map(([i, tone]) => ({ itemId: `p${i}`, tone })),
  });

  let best = 0;
  let count = 0;
  rec.push("init", "방법 1: 사는 날 i와 파는 날 j의 모든 쌍을 비교해요.", 1, {
    sequence: seq({}, null),
    variables: { "비교 횟수": 0, 최대이익: 0 },
  });
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      count++;
      const profit = prices[j]! - prices[i]!;
      const better = profit > best;
      if (better) best = profit;
      rec.push(
        better ? "pick" : "compare",
        `${i}일에 사고 ${j}일에 팔면 ${profit}${better ? " → 지금까지 최대" : ""}`,
        4,
        { sequence: seq({ [i]: "current", [j]: "frontier" }, j), variables: { "비교 횟수": count, 최대이익: best } },
      );
    }
  }
  const pairCount = count;

  best = 0;
  count = 0;
  let low = prices[0]!;
  rec.push("init", `방법 2: 왼쪽부터 한 번만 훑으며 지금까지 가장 싼 가격(${low})만 기억해요.`, 6, {
    sequence: seq({ 0: "visited" }, 0),
    variables: { "비교 횟수": 0, 최대이익: 0, 가장싼가격: low },
  });
  let lowIndex = 0;
  for (let j = 1; j < n; j++) {
    count++;
    const profit = prices[j]! - low;
    const better = profit > best;
    if (better) best = profit;
    rec.push(
      better ? "pick" : "compare",
      `${j}일에 팔면 ${prices[j]} − ${low} = ${profit}${better ? " → 지금까지 최대" : ""}`,
      8,
      {
        sequence: seq({ [lowIndex]: "visited", [j]: "current" }, j),
        variables: { "비교 횟수": count, 최대이익: best, 가장싼가격: low },
      },
    );
    if (prices[j]! < low) {
      low = prices[j]!;
      lowIndex = j;
    }
  }
  rec.push(
    "done",
    `같은 답(${best})을 모든 쌍은 ${pairCount}번, 한 번 훑기는 ${count}번 비교로 구했어요. N이 10만이면 약 50억 번과 10만 번이에요.`,
    9,
    { sequence: seq({}, null), variables: { "모든 쌍": pairCount, "한 번 훑기": count, 최대이익: best } },
  );
  return rec.steps;
}

/* ───────────── 절반씩 줄이기 ───────────── */

export const CX_HALVING_PSEUDOCODE = [
  "steps = 0",
  "while n > 1:",
  "    n //= 2          # 절반으로",
  "    steps += 1",
  "return steps        # 약 log₂ N",
];

function parseHalving(input: JsonValue[]) {
  return asInt(input[0], "N", 1, 1_000_000);
}

export function validateCxHalving(input: JsonValue[]): void {
  parseHalving(input);
}

export function cxHalving(input: JsonValue[]): VisualizationStep[] {
  const start = parseHalving(input);
  const rec = new StepRecorder();
  const values = [start];
  const seq = (): SequenceSnapshot => ({
    label: "n",
    items: values.map((value, i) => ({ id: `v${i}`, value })),
    cursor: values.length - 1,
    done: values.length - 1,
    highlights: [{ itemId: `v${values.length - 1}`, tone: "current" }],
  });

  rec.push("init", `N = ${start}에서 시작해요. 하나씩 빼면 ${start - 1}번 걸려요.`, 1, {
    sequence: seq(),
    variables: { steps: 0 },
  });
  let n = start;
  while (n > 1) {
    const next = Math.floor(n / 2);
    values.push(next);
    rec.push("narrow", `${n}의 절반: ${next}`, 3, { sequence: seq(), variables: { steps: values.length - 1 } });
    n = next;
  }
  const steps = values.length - 1;
  rec.push(
    "done",
    `${steps}번 만에 1이 됐어요 (log₂ ${start} ≈ ${round1(Math.log2(start))}). N이 10억이어도 30번이면 돼요.`,
    5,
    { sequence: seq(), variables: { steps } },
  );
  return rec.steps;
}
