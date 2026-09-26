import type { BarsSnapshot, HighlightTone, JsonValue, VisualizationStep } from "@/types";
import { StepRecorder, asInt, asIntArray, fail } from "./shared";

type Highlight = { itemId: string; tone: HighlightTone };

function asBars(value: JsonValue | undefined, max: number, low: number, high: number, sorted: boolean): number[] {
  const nums = asIntArray(value, "수 목록", 2, max);
  if (nums.some((x) => x < low || x > high)) fail(`수 목록의 값은 ${low}~${high} 사이여야 해요`);
  if (sorted && nums.some((x, i) => i > 0 && nums[i - 1]! > x)) fail("수 목록은 작은 수부터 정렬돼 있어야 해요");
  return nums;
}

function bars(
  a: number[],
  pointers: { index: number; label: string }[],
  extra: { highlights?: Highlight[]; range?: [number, number] | null; sorted?: string[]; title?: string } = {},
): BarsSnapshot {
  const merged: { index: number; label: string }[] = [];
  for (const p of pointers) {
    if (p.index < 0 || p.index >= a.length) continue;
    const same = merged.find((m) => m.index === p.index);
    if (same) same.label += `·${p.label}`;
    else merged.push({ ...p });
  }
  return {
    title: extra.title ?? "a",
    items: a.map((x, i) => ({ id: `b${i}`, value: x })),
    highlights: extra.highlights ?? [],
    sorted: extra.sorted ?? [],
    range: extra.range ?? null,
    pointers: merged,
  };
}

/* ───────────── 양 끝에서 좁히기: 합이 target인 두 수 ───────────── */

export const PAIR_SUM_PSEUDOCODE = [
  "L, R = 0, n - 1",
  "while L < R:",
  "    s = a[L] + a[R]",
  "    if s == target: 찾았어요",
  "    if s < target: L += 1        # 합을 키워요",
  "    else: R -= 1                 # 합을 줄여요",
  "없어요",
];

export function validatePairSum(input: JsonValue[]): void {
  asBars(input[0], 12, 1, 99, true);
  asInt(input[1], "target", 2, 198);
}

export function pairSum(input: JsonValue[]): VisualizationStep[] {
  const a = input[0] as number[];
  const target = input[1] as number;
  const rec = new StepRecorder();
  let l = 0;
  let r = a.length - 1;
  let checks = 0;
  const view = (highlights: Highlight[] = [], s?: number) => ({
    bars: bars(
      a,
      [
        { index: l, label: "L" },
        { index: r, label: "R" },
      ],
      { highlights, range: l <= r ? [l, r] : null, title: "a (정렬됨)" },
    ),
    variables: { target, L: l, R: r, ...(s === undefined ? {} : { "a[L] + a[R]": s }) },
  });

  rec.push("init", `양 끝에 손가락을 하나씩 둬요. 합 = ${target}인 두 수를 찾아요.`, 1, view());
  while (l < r) {
    const s = a[l]! + a[r]!;
    checks += 1;
    const marks: Highlight[] = [
      { itemId: `b${l}`, tone: "current" },
      { itemId: `b${r}`, tone: "current" },
    ];
    rec.push("compare", `${a[l]} + ${a[r]} = ${s}`, 3, view(marks, s));
    if (s === target) {
      rec.push(
        "found",
        `합이 딱 맞아요! 위치 [${l}, ${r}]`,
        4,
        view(
          [
            { itemId: `b${l}`, tone: "result" },
            { itemId: `b${r}`, tone: "result" },
          ],
          s,
        ),
      );
      rec.push("done", `모든 쌍을 비교하지 않고 ${checks}번만 비교했어요.`, null, view([], s));
      return rec.steps;
    }
    if (s < target) {
      l += 1;
      rec.push("move-left", `합이 작아요 → 왼쪽 손가락을 오른쪽으로 (더 큰 수로)`, 5, view());
    } else {
      r -= 1;
      rec.push("move-right", `합이 커요 → 오른쪽 손가락을 왼쪽으로 (더 작은 수로)`, 6, view());
    }
  }
  rec.push("done", `두 손가락이 만났어요. 합 = ${target}인 쌍은 없어요.`, 7, view());
  return rec.steps;
}

/* ───────────── 늘였다 줄이는 창: 합이 S 이상인 가장 짧은 구간 ───────────── */

export const MIN_WINDOW_PSEUDOCODE = [
  "L = 0, total = 0, best = 무한대",
  "for R in 0 .. n-1:",
  "    total += a[R]                  # 오른쪽 늘리기",
  "    while total >= S:",
  "        best = min(best, R - L + 1)",
  "        total -= a[L]; L += 1      # 왼쪽 줄이기",
  "return best (없으면 0)",
];

export function validateMinWindow(input: JsonValue[]): void {
  asBars(input[0], 12, 1, 30, false);
  asInt(input[1], "S", 1, 300);
}

export function minWindow(input: JsonValue[]): VisualizationStep[] {
  const a = input[0] as number[];
  const target = input[1] as number;
  const rec = new StepRecorder();
  let l = 0;
  let total = 0;
  let best = Infinity;
  let bestRange: [number, number] | null = null;
  const view = (r: number | null, highlights: Highlight[] = []) => ({
    bars: bars(a, [{ index: l, label: "L" }, ...(r === null ? [] : [{ index: r, label: "R" }])], {
      highlights,
      range: r === null || l > r ? null : [l, r],
    }),
    variables: { S: target, "창의 합": total, 가장짧은길이: best === Infinity ? "(아직 없음)" : best },
  });

  rec.push("init", `합 ≥ ${target}인 연속 구간 중 가장 짧은 것을 찾아요. 창을 오른쪽으로 늘려요.`, 1, view(null));
  for (let r = 0; r < a.length; r++) {
    total += a[r]!;
    rec.push(
      "move-right",
      `오른쪽을 늘려 ${a[r]} 넣기 → 창의 합 ${total}`,
      3,
      view(r, [{ itemId: `b${r}`, tone: "current" }]),
    );
    while (total >= target) {
      if (r - l + 1 < best) {
        best = r - l + 1;
        bestRange = [l, r];
      }
      rec.push(
        "record",
        `합 ${total} ≥ ${target} → 길이 ${r - l + 1}${best === r - l + 1 ? " (지금까지 가장 짧아요)" : ""}`,
        5,
        view(
          r,
          Array.from({ length: r - l + 1 }, (_, k) => ({ itemId: `b${l + k}`, tone: "result" as const })),
        ),
      );
      total -= a[l]!;
      l += 1;
      rec.push("move-left", `더 짧게 만들어 봐요 → 왼쪽의 ${a[l - 1]} 빼기 → 창의 합 ${total}`, 6, view(r));
    }
  }
  rec.push(
    "done",
    bestRange
      ? `가장 짧은 구간: [${bestRange[0]}..${bestRange[1]}], 길이 ${best}. 칸마다 한 번 넣고 한 번 뺐을 뿐이에요.`
      : `합 ≥ ${target}인 구간이 없어요. 답은 0이에요.`,
    7,
    {
      bars: bars(a, [], {
        highlights: bestRange
          ? Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, k) => ({
              itemId: `b${bestRange![0] + k}`,
              tone: "result" as const,
            }))
          : [],
      }),
      variables: { S: target, 가장짧은길이: best === Infinity ? 0 : best },
    },
  );
  return rec.steps;
}

/* ───────────── 같은 방향 두 포인터: 중복 없애기 ───────────── */

export const DEDUPE_PSEUDOCODE = [
  "w = 1                          # 앞의 w칸이 중복 없는 결과",
  "for r in 1 .. n-1:",
  "    if a[r] != a[w-1]:",
  "        a[w] = a[r]; w += 1      # 새 값이면 쓰기",
  "    else: 건너뛰기",
  "return a[:w]",
];

export function validateDedupe(input: JsonValue[]): void {
  asBars(input[0], 12, 1, 99, true);
}

export function dedupe(input: JsonValue[]): VisualizationStep[] {
  const a = [...(input[0] as number[])];
  const rec = new StepRecorder();
  let w = 1;
  const kept = () => Array.from({ length: w }, (_, i) => `b${i}`);
  const view = (r: number | null, highlights: Highlight[] = []) => ({
    bars: bars(a, [{ index: w, label: "쓰기" }, ...(r === null ? [] : [{ index: r, label: "읽기" }])], {
      highlights,
      sorted: kept(),
      title: "a (앞쪽 초록 = 중복 없는 결과)",
    }),
    variables: { "결과 길이 w": w, 결과: a.slice(0, w).join(", ") },
  });

  rec.push("init", "첫 칸은 그대로 두고, 읽는 손가락으로 훑으며 새 값만 앞쪽에 써요.", 1, view(null));
  for (let r = 1; r < a.length; r++) {
    const value = a[r]!;
    if (value !== a[w - 1]) {
      a[w] = value;
      w += 1;
      rec.push("pick", `새 값 ${value} → ${w - 1}번 칸에 쓰기`, 4, view(r, [{ itemId: `b${w - 1}`, tone: "current" }]));
    } else {
      rec.push("skip", `같은 값(${value}) → 건너뛰기`, 5, view(r, [{ itemId: `b${r}`, tone: "blocked" }]));
    }
  }
  rec.push(
    "done",
    `중복 없는 결과: [${a.slice(0, w).join(", ")}] — 새 배열 없이 한 번 훑어서 끝냈어요.`,
    6,
    view(null),
  );
  return rec.steps;
}
