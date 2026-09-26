import type {
  BarsSnapshot,
  CallFrame,
  HighlightTone,
  JsonValue,
  LinearSnapshot,
  VisualizationStep,
  VizItem,
} from "@/types";
import { StepRecorder, asIntArray, fail } from "./shared";

type Highlight = { itemId: string; tone: HighlightTone };

function asBarValues(value: JsonValue | undefined, max: number, low: number, high: number): number[] {
  const nums = asIntArray(value, "수 목록", 1, max);
  if (nums.some((x) => x < low || x > high)) fail(`수 목록의 값은 ${low}~${high} 사이여야 해요`);
  return nums;
}

const list = (items: VizItem[]) => `[${items.map((item) => item.value).join(", ")}]`;

function bars(items: VizItem[], extra: Partial<Omit<BarsSnapshot, "items">> = {}): BarsSnapshot {
  return {
    title: extra.title ?? "a",
    items: items.map((item) => ({ ...item })),
    highlights: extra.highlights ?? [],
    sorted: extra.sorted ?? [],
    range: extra.range ?? null,
    pointers: extra.pointers ?? [],
  };
}

/* ───────────── 삽입 정렬 ───────────── */

export const INSERTION_PSEUDOCODE = [
  "for i in 1 .. n-1:",
  "    key = a[i]",
  "    j = i - 1",
  "    while j >= 0 and a[j] > key:",
  "        a[j + 1] = a[j]        # 한 칸 오른쪽으로 밀기",
  "        j -= 1",
  "    a[j + 1] = key             # 빈자리에 넣기",
];

export function validateInsertion(input: JsonValue[]): void {
  asBarValues(input[0], 10, 1, 99);
}

export function insertionSort(input: JsonValue[]): VisualizationStep[] {
  const nums = input[0] as number[];
  const rec = new StepRecorder();
  const a: VizItem[] = nums.map((x, i) => ({ id: `b${i}`, value: x }));
  let compares = 0;
  let moves = 0;

  const state = (
    i: number | null,
    j: number | null,
    highlights: Highlight[] = [],
    key: number | null = null,
    done = false,
  ) => ({
    bars: bars(a, {
      highlights,
      sorted: done ? a.map((item) => item.id) : [],
      range: i === null || done ? null : [0, i],
      pointers: [
        ...(i === null || done ? [] : [{ index: i, label: "i" }]),
        ...(j === null || j < 0 ? [] : [{ index: j, label: "j" }]),
      ],
    }),
    variables: { ...(key === null ? {} : { key }), "비교 횟수": compares, "밀기 횟수": moves },
  });

  rec.push(
    "init",
    `삽입 정렬 시작: ${list(a)}. 앞에서부터 한 장씩 뽑아 알맞은 자리에 끼워 넣어요.`,
    1,
    state(null, null),
  );

  for (let i = 1; i < a.length; i++) {
    const keyItem = a[i]!;
    const key = keyItem.value as number;
    rec.push(
      "check",
      `${i}번 막대 뽑기 (key = ${key}). 왼쪽 ${i}개는 이미 서로 정렬돼 있어요.`,
      2,
      state(i, i - 1, [{ itemId: keyItem.id, tone: "current" }], key),
    );
    let j = i - 1;
    let at = i; // key가 지금 있는 자리
    while (j >= 0) {
      const left = a[j]!;
      compares += 1;
      const bigger = (left.value as number) > key;
      rec.push(
        "compare",
        bigger ? `${left.value} > ${key} → 큰 쪽을 오른쪽으로 밀어요` : `${left.value} ≤ ${key} → 여기서 멈춰요`,
        4,
        state(
          i,
          j,
          [
            { itemId: keyItem.id, tone: "current" },
            { itemId: left.id, tone: bigger ? "frontier" : "visited" },
          ],
          key,
        ),
      );
      if (!bigger) break;
      a[at] = left;
      a[j] = keyItem;
      at = j;
      moves += 1;
      rec.push(
        "shift",
        `한 칸 오른쪽(${j + 1}번)으로 밀기: ${left.value}`,
        5,
        state(
          i,
          j - 1,
          [
            { itemId: keyItem.id, tone: "current" },
            { itemId: left.id, tone: "frontier" },
          ],
          key,
        ),
      );
      j -= 1;
    }
    rec.push(
      "place",
      at === i ? "제자리가 맞아요. 그대로 둬요." : `빈자리 ${at}번에 key 넣기 → ${list(a)}`,
      7,
      state(i, null, [{ itemId: keyItem.id, tone: "result" }], key),
    );
  }

  rec.push(
    "done",
    `정렬 끝! ${list(a)} — 비교 ${compares}번, 밀기 ${moves}번. 거의 정렬된 배열이면 밀 일이 적어서 빨라요.`,
    null,
    state(null, null, [], null, true),
  );
  return rec.steps;
}

/* ───────────── 병합 정렬 ───────────── */

export const MERGE_PSEUDOCODE = [
  "merge_sort(lo, hi):",
  "    if lo >= hi: return               # 한 칸은 이미 정렬됨",
  "    mid = (lo + hi) // 2",
  "    merge_sort(lo, mid); merge_sort(mid + 1, hi)",
  "    왼쪽·오른쪽의 맨 앞끼리 비교해서",
  "    더 작은 쪽(같으면 왼쪽)을 결과에 붙여요",
  "    한쪽이 비면 남은 쪽을 그대로 붙여요",
];

export function validateMerge(input: JsonValue[]): void {
  asBarValues(input[0], 8, 1, 99);
}

export function mergeSort(input: JsonValue[]): VisualizationStep[] {
  const nums = input[0] as number[];
  const rec = new StepRecorder();
  const a: VizItem[] = nums.map((x, i) => ({ id: `b${i}`, value: x }));
  const calls: [number, number][] = [];

  const half = (title: string, items: VizItem[], head: Highlight[] = []): LinearSnapshot => ({
    title,
    items: items.map((item) => ({ ...item })),
    highlights: head,
    pointerLabels: items.length ? [{ itemId: items[0]!.id, label: "맨 앞" }] : [],
  });

  const state = (
    range: [number, number] | null,
    extra: { highlights?: Highlight[]; left?: VizItem[]; right?: VizItem[]; done?: boolean; placed?: string[] } = {},
  ) => ({
    bars: bars(a, {
      // 합치는 중에 자리를 잡은 막대는 "완료"로 (다음 합치기에서 또 움직이니 확정은 아니에요)
      highlights: [
        ...(extra.highlights ?? []),
        ...(extra.placed ?? [])
          .filter((id) => !extra.highlights?.some((h) => h.itemId === id))
          .map((id): Highlight => ({ itemId: id, tone: "visited" })),
      ],
      sorted: extra.done ? a.map((item) => item.id) : [],
      range,
    }),
    ...(extra.left ? { queue: half("왼쪽 절반", extra.left, extra.highlights) } : {}),
    ...(extra.right ? { deque: half("오른쪽 절반", extra.right, extra.highlights) } : {}),
    callStack: calls.map(([lo, hi], depth): CallFrame => ({
      id: `ms-${depth}-${lo}-${hi}`,
      label: `merge_sort(${lo}, ${hi})`,
      locals: {},
      status: depth === calls.length - 1 ? "active" : "waiting",
    })),
  });

  rec.push("init", `병합 정렬 시작: ${list(a)}. 반으로 나누고, 정렬된 두 절반을 합쳐요.`, 1, state(null));

  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    calls.push([lo, hi]);
    const mid = Math.floor((lo + hi) / 2);
    rec.push("split", `${lo}~${hi}번을 반으로 나눠요 → [${lo}..${mid}] · [${mid + 1}..${hi}]`, 3, state([lo, hi]));
    sort(lo, mid);
    sort(mid + 1, hi);

    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    const placed: VizItem[] = [];
    const sync = () => {
      a.splice(lo, hi - lo + 1, ...placed, ...left, ...right);
    };
    rec.push(
      "merge",
      `정렬된 두 절반: ${list(left)} · ${list(right)}. 맨 앞끼리 비교하며 합쳐요.`,
      5,
      state([lo, hi], { left, right, placed: placed.map((p) => p.id) }),
    );
    while (left.length && right.length) {
      const l = left[0]!;
      const r = right[0]!;
      const takeLeft = (l.value as number) <= (r.value as number);
      const taken = takeLeft ? left.shift()! : right.shift()!;
      rec.push(
        "compare",
        takeLeft
          ? `${l.value} ≤ ${r.value} → 왼쪽 맨 앞이 먼저예요`
          : `${l.value} > ${r.value} → 오른쪽 맨 앞이 먼저예요`,
        5,
        state([lo, hi], {
          left: takeLeft ? [taken, ...left] : left,
          right: takeLeft ? right : [taken, ...right],
          highlights: [
            { itemId: l.id, tone: takeLeft ? "current" : "frontier" },
            { itemId: r.id, tone: takeLeft ? "frontier" : "current" },
          ],
          placed: placed.map((p) => p.id),
        }),
      );
      placed.push(taken);
      sync();
      rec.push(
        "place",
        `결과의 ${lo + placed.length - 1}번 자리에 붙이기: ${taken.value}`,
        6,
        state([lo, hi], {
          left,
          right,
          highlights: [{ itemId: taken.id, tone: "result" }],
          placed: placed.map((p) => p.id),
        }),
      );
    }
    const rest = left.length ? left : right;
    if (rest.length) {
      const moved = [...rest];
      placed.push(...rest);
      rest.splice(0);
      sync();
      rec.push(
        "place",
        `한쪽이 비었어요. 남은 ${list(moved)} 그대로 붙이기`,
        7,
        state([lo, hi], { left, right, placed: placed.map((p) => p.id) }),
      );
    }
    rec.push(
      "merge",
      `[${lo}..${hi}] 정렬 완료 → ${list(a.slice(lo, hi + 1))}`,
      7,
      state([lo, hi], { placed: placed.map((p) => p.id) }),
    );
    calls.pop();
  };

  sort(0, a.length - 1);
  rec.push(
    "done",
    `정렬 끝! ${list(a)} — 반씩 나누는 단계가 log N번, 단계마다 N개를 합치니까 O(N log N)이에요.`,
    null,
    state(null, { done: true }),
  );
  return rec.steps;
}

/* ───────────── 계수 정렬 ───────────── */

export const COUNTING_PSEUDOCODE = [
  "count = [0] * 10",
  "for x in nums:",
  "    count[x] += 1",
  "for v in 0 .. 9:",
  "    결과에 v를 count[v]번 붙여요",
];

export function validateCounting(input: JsonValue[]): void {
  asBarValues(input[0], 12, 0, 9);
}

export function countingSort(input: JsonValue[]): VisualizationStep[] {
  const nums = input[0] as number[];
  const rec = new StepRecorder();
  const count = Array.from({ length: 10 }, () => 0);
  const result: VizItem[] = [];

  const state = (index: number | null, done: number, highlights: Highlight[] = []) => ({
    sequence: {
      label: "nums",
      items: nums.map((x, i) => ({ id: `s${i}`, value: x })),
      cursor: index,
      done,
      highlights: index === null ? [] : [{ itemId: `s${index}`, tone: "current" as const }],
    },
    bars: bars(
      count.map((c, v) => ({ id: `c${v}`, value: c })),
      { title: "count (막대 아래 번호 = 값)", highlights },
    ),
    queue: {
      title: "결과",
      items: result.map((item) => ({ ...item })),
      highlights: [],
      pointerLabels: [],
    },
  });

  rec.push("init", "값이 0~9뿐이에요. 값마다 몇 개인지 세는 칸 10개를 준비해요.", 1, state(null, 0));
  nums.forEach((x, i) => {
    count[x]! += 1;
    rec.push("count", `count[${x}] 1 늘리기 → ${count[x]}`, 3, state(i, i + 1, [{ itemId: `c${x}`, tone: "current" }]));
  });
  for (let v = 0; v < 10; v++) {
    const c = count[v]!;
    if (c === 0) continue;
    for (let k = 0; k < c; k++) result.push({ id: `r${result.length}`, value: v });
    rec.push(
      "place",
      `count[${v}] = ${c} → 결과에 ${v} ${c}개 붙이기`,
      5,
      state(null, nums.length, [{ itemId: `c${v}`, tone: "result" }]),
    );
  }
  rec.push(
    "done",
    `정렬 끝! 비교를 한 번도 하지 않았어요. 값의 범위가 작으면 O(N + 범위)로 정렬돼요.`,
    null,
    state(null, nums.length),
  );
  return rec.steps;
}
