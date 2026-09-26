import type { HighlightTone, JsonValue, VisualizationStep, VizItem } from "@/types";
import { StepRecorder, asInt, asIntArray, fail } from "./shared";

type Highlight = { itemId: string; tone: HighlightTone };

function asSorted(value: JsonValue | undefined, max: number): number[] {
  const nums = asIntArray(value, "수 목록", 1, max);
  if (nums.some((x) => x < 1 || x > 99)) fail("수 목록의 값은 1~99 사이여야 해요");
  if (nums.some((x, i) => i > 0 && nums[i - 1]! > x)) fail("수 목록은 작은 수부터 정렬돼 있어야 해요");
  return nums;
}

function barsOf(a: number[], lo: number | null, hi: number | null, mid: number | null, highlights: Highlight[] = []) {
  const items: VizItem[] = a.map((x, i) => ({ id: `b${i}`, value: x }));
  const pointers: { index: number; label: string }[] = [];
  const add = (index: number | null, label: string) => {
    if (index === null || index < 0 || index >= a.length) return;
    const existing = pointers.find((p) => p.index === index);
    if (existing) existing.label += `·${label}`;
    else pointers.push({ index, label });
  };
  add(lo, "lo");
  add(mid, "mid");
  add(hi, "hi");
  return {
    title: "a (정렬됨)",
    items,
    highlights,
    sorted: [],
    range: lo === null || hi === null ? null : ([lo, Math.min(hi, a.length - 1)] as [number, number]),
    pointers,
  };
}

/* ───────────── 정확히 찾기 ───────────── */

export const EXACT_PSEUDOCODE = [
  "lo, hi = 0, n - 1",
  "while lo <= hi:",
  "    mid = (lo + hi) // 2",
  "    if a[mid] == target: return mid",
  "    if a[mid] < target: lo = mid + 1     # 왼쪽 절반 버리기",
  "    else: hi = mid - 1                   # 오른쪽 절반 버리기",
  "return -1",
];

export function validateExact(input: JsonValue[]): void {
  asSorted(input[0], 16);
  asInt(input[1], "target", 1, 99);
}

export function exactSearch(input: JsonValue[]): VisualizationStep[] {
  const a = input[0] as number[];
  const target = input[1] as number;
  const rec = new StepRecorder();
  let lo = 0;
  let hi = a.length - 1;
  let checks = 0;
  const vars = (mid?: number) => ({ target, lo, hi, ...(mid === undefined ? {} : { mid }), "확인 횟수": checks });

  rec.push("init", `정렬된 ${a.length}칸에서 target = ${target} 찾기. 처음엔 전체가 후보예요.`, 1, {
    bars: barsOf(a, lo, hi, null),
    variables: vars(),
  });

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = a[mid]!;
    checks += 1;
    rec.push("compare", `가운데 mid = (${lo} + ${hi}) // 2 = ${mid}, a[${mid}] = ${value}`, 3, {
      bars: barsOf(a, lo, hi, mid, [{ itemId: `b${mid}`, tone: "current" }]),
      variables: vars(mid),
    });
    if (value === target) {
      rec.push("found", `찾았어요! a[${mid}] = ${target}. ${checks}번만 확인했어요.`, 4, {
        bars: barsOf(a, lo, hi, mid, [{ itemId: `b${mid}`, tone: "result" }]),
        variables: vars(mid),
      });
      rec.push(
        "done",
        `${a.length}칸을 하나씩 보면 최대 ${a.length}번이지만, 반씩 버리면 ${checks}번이면 돼요.`,
        null,
        {
          bars: barsOf(a, null, null, null, [{ itemId: `b${mid}`, tone: "result" }]),
          variables: vars(mid),
        },
      );
      return rec.steps;
    }
    if (value < target) {
      lo = mid + 1;
      rec.push("narrow", `${value} < ${target} → 답은 오른쪽에 있어요. 왼쪽 절반을 버려요 (lo = ${lo})`, 5, {
        bars: barsOf(a, lo, hi, null),
        variables: vars(mid),
      });
    } else {
      hi = mid - 1;
      rec.push("narrow", `${value} > ${target} → 답은 왼쪽에 있어요. 오른쪽 절반을 버려요 (hi = ${hi})`, 6, {
        bars: barsOf(a, lo, hi, null),
        variables: vars(mid),
      });
    }
  }

  rec.push("not-found", `lo > hi — 후보가 하나도 안 남았어요. 없으니 -1`, 7, {
    bars: barsOf(a, null, null, null),
    variables: vars(),
  });
  rec.push("done", `없다는 것도 ${checks}번 만에 알았어요.`, null, {
    bars: barsOf(a, null, null, null),
    variables: vars(),
  });
  return rec.steps;
}

/* ───────────── 경계 찾기 (lower bound) ───────────── */

export const LOWER_BOUND_PSEUDOCODE = [
  "lo, hi = 0, n              # 답은 lo ~ hi 사이 (n = 끝)",
  "while lo < hi:",
  "    mid = (lo + hi) // 2",
  "    if a[mid] >= target: hi = mid       # mid도 답일 수 있어요",
  "    else: lo = mid + 1",
  "return lo                  # target 이상인 첫 위치",
];

export function validateLowerBound(input: JsonValue[]): void {
  asSorted(input[0], 16);
  asInt(input[1], "target", 1, 99);
}

export function lowerBound(input: JsonValue[]): VisualizationStep[] {
  const a = input[0] as number[];
  const target = input[1] as number;
  const n = a.length;
  const rec = new StepRecorder();
  let lo = 0;
  let hi = n;
  // hi가 n이면 막대 밖이라 범위만 끝까지 칠해요
  const view = (mid: number | null, highlights: Highlight[] = []) => ({
    bars: barsOf(a, lo, lo < hi ? hi - 1 : lo, mid, highlights),
    variables: { target, lo, hi: hi === n ? `${hi} (끝)` : hi, ...(mid === null ? {} : { mid }) },
  });

  rec.push("init", `${target} 이상인 첫 위치를 찾아요. 없으면 끝(${n})이 답이에요.`, 1, view(null));

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = a[mid]!;
    const ok = value >= target;
    rec.push(
      "compare",
      `mid = ${mid}, a[${mid}] = ${value} → ${ok ? `${target} 이상이에요` : `${target}보다 작아요`}`,
      3,
      view(mid, [{ itemId: `b${mid}`, tone: ok ? "result" : "blocked" }]),
    );
    if (ok) {
      hi = mid;
      rec.push("narrow", `${mid}번도 답일 수 있으니 남기고, 그 뒤는 버려요 (hi = ${mid})`, 4, view(null));
    } else {
      lo = mid + 1;
      rec.push("narrow", `${mid}번까지는 모두 작아요. 버려요 (lo = ${lo})`, 5, view(null));
    }
  }

  const found = lo < n;
  rec.push(
    "done",
    found
      ? `lo = hi = ${lo}. ${target} 이상인 첫 위치는 ${lo}번(${a[lo]})이에요. 그 앞에는 ${target}보다 작은 수가 ${lo}개 있어요.`
      : `lo = hi = ${n}. ${target} 이상인 수가 없어서 끝(${n})이에요.`,
    6,
    {
      bars: barsOf(a, null, null, null, found ? [{ itemId: `b${lo}`, tone: "result" }] : []),
      variables: { target, 답: lo },
    },
  );
  return rec.steps;
}

/* ───────────── 답을 이분 탐색 (랜선 자르기) ───────────── */

export const ANSWER_PSEUDOCODE = [
  "lo, hi = 1, max(cables)",
  "while lo <= hi:",
  "    mid = (lo + hi) // 2",
  "    pieces = sum(c // mid for c in cables)",
  "    if pieces >= k: answer = mid; lo = mid + 1   # 되니까 더 길게",
  "    else: hi = mid - 1                          # 안 되니까 더 짧게",
  "return answer",
];

export function validateAnswer(input: JsonValue[]): void {
  const cables = asIntArray(input[0], "줄 길이", 1, 8);
  if (cables.some((x) => x < 1 || x > 99)) fail("줄 길이는 1~99 사이여야 해요");
  asInt(input[1], "k", 1, 50);
}

export function answerSearch(input: JsonValue[]): VisualizationStep[] {
  const cables = input[0] as number[];
  const k = input[1] as number;
  const rec = new StepRecorder();
  let lo = 1;
  let hi = Math.max(...cables);
  let answer = 0;
  const tried: VizItem[] = [];

  const view = (mid: number | null, extra: Record<string, JsonValue> = {}, highlights: Highlight[] = []) => ({
    bars: {
      title: "cables (줄 길이)",
      items: cables.map((c, i) => ({ id: `c${i}`, value: c })),
      highlights,
      sorted: [],
      range: null,
      pointers: [],
    },
    sequence: {
      label: "확인한 길이",
      items: tried.map((t) => ({ ...t })),
      cursor: tried.length ? tried.length - 1 : null,
      done: 0,
      highlights: tried.map((t) => ({
        itemId: t.id,
        tone: String(t.value).endsWith("O") ? ("visited" as const) : ("blocked" as const),
      })),
    },
    variables: { k, lo, hi, ...(mid === null ? {} : { mid }), answer, ...extra },
  });

  rec.push(
    "init",
    `줄을 같은 길이로 잘라 ${k}도막 이상 만들 때, 가장 긴 길이를 찾아요. 답은 1 ~ ${hi} 사이예요.`,
    1,
    view(null),
  );

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const each = cables.map((c) => Math.floor(c / mid));
    const pieces = each.reduce((s, x) => s + x, 0);
    const ok = pieces >= k;
    tried.push({ id: `t${tried.length}`, value: `${mid}:${ok ? "O" : "X"}` });
    rec.push(
      "check",
      `길이 ${mid}씩 자르면 ${cables.map((c, i) => `${c}÷${mid}=${each[i]}`).join(", ")} → ${pieces}도막 (${ok ? `${k}개 이상, 가능!` : `${k}개보다 적어요`})`,
      4,
      view(
        mid,
        { pieces },
        cables.map((_, i) => ({ itemId: `c${i}`, tone: each[i]! > 0 ? "current" : "blocked" })),
      ),
    );
    if (ok) {
      answer = mid;
      lo = mid + 1;
      rec.push(
        "narrow",
        `길이 ${mid} 가능! answer = ${mid} 적어 두고, 더 긴 길이를 찾아봐요 (lo = ${lo})`,
        5,
        view(null),
      );
    } else {
      hi = mid - 1;
      rec.push("narrow", `길이 ${mid}: 너무 길어요. 더 짧은 길이만 남겨요 (hi = ${hi})`, 6, view(null));
    }
  }

  rec.push(
    "done",
    answer
      ? `가장 긴 길이: ${answer}. 길이를 하나씩 다 해 보지 않고 ${tried.length}번만 확인했어요.`
      : `길이 1로 잘라도 ${k}도막이 안 돼요. 답은 0이에요.`,
    7,
    view(null),
  );
  return rec.steps;
}
