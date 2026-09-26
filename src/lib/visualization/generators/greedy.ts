import type { HashEntryViz, HighlightTone, JsonValue, LinearSnapshot, VisualizationStep, VizItem } from "@/types";
import { StepRecorder, asInt, asIntArray, asString, fail } from "./shared";

type Mark = { row: number; col: number; tone: HighlightTone };

/* ───────────── 회의 고르기 (끝나는 시각 순) ───────────── */

export const INTERVALS_PSEUDOCODE = [
  "회의들을 끝나는 시각 순으로 정렬",
  "last_end = 0, 고른 수 = 0",
  "for (시작, 끝) in 회의들:",
  "    if 시작 >= last_end:          # 앞 회의와 안 겹치면",
  "        고르기; last_end = 끝",
  "    else: 건너뛰기",
];

function asIntervals(value: JsonValue | undefined): [number, number][] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) fail("회의는 1~8개여야 해요");
  return (value as JsonValue[]).map((item) => {
    if (!Array.isArray(item) || item.length !== 2 || !item.every((v) => Number.isInteger(v))) {
      fail("회의는 [시작, 끝] 모양의 정수 쌍이어야 해요");
    }
    const [s, e] = item as [number, number];
    if (s < 0 || e > 16 || s >= e) fail(`[${s}, ${e}]: 0 ≤ 시작 < 끝 ≤ 16이어야 해요`);
    return [s, e];
  });
}

export function validateIntervals(input: JsonValue[]): void {
  asIntervals(input[0]);
}

export function intervals(input: JsonValue[]): VisualizationStep[] {
  const meetings = asIntervals(input[0])
    .map(([s, e], i) => ({ s, e, i }))
    .sort((a, b) => a.e - b.e || a.s - b.s);
  const end = Math.max(...meetings.map((m) => m.e));
  const rec = new StepRecorder();
  const status: ("wait" | "pick" | "skip")[] = meetings.map(() => "wait");
  let lastEnd = 0;
  let count = 0;

  const view = (current: number | null) => {
    const cells = meetings.map((m) =>
      Array.from({ length: end }, (_, t): JsonValue | null => (t >= m.s && t < m.e ? " " : null)),
    );
    const marks: Mark[] = [];
    meetings.forEach((m, r) => {
      const tone: HighlightTone | null =
        r === current ? "current" : status[r] === "pick" ? "result" : status[r] === "skip" ? "blocked" : null;
      if (tone) for (let t = m.s; t < m.e; t++) marks.push({ row: r, col: t, tone });
    });
    return {
      table: {
        title: "회의 시간표 (끝나는 시각 순)",
        rowLabels: meetings.map((m) => `[${m.s},${m.e}]`),
        colLabels: Array.from({ length: end }, (_, t) => String(t)),
        cells,
        highlights: marks,
      },
      variables: { last_end: lastEnd, "고른 회의": count },
    };
  };

  rec.push("init", "끝나는 시각이 빠른 회의부터 줄 세웠어요. 일찍 끝날수록 뒤에 남는 시간이 넉넉해요.", 1, view(null));
  meetings.forEach((m, r) => {
    rec.push(
      "check",
      `[${m.s}, ${m.e}] 회의: 시작 ${m.s} ${m.s >= lastEnd ? "≥" : "<"} 앞 회의가 끝난 시각 ${lastEnd}`,
      4,
      view(r),
    );
    if (m.s >= lastEnd) {
      status[r] = "pick";
      lastEnd = m.e;
      count += 1;
      rec.push("pick", `안 겹쳐요 → 고르기. 이제 ${m.e}시부터 비어 있어요.`, 5, view(null));
    } else {
      status[r] = "skip";
      rec.push("skip", "앞 회의와 겹쳐요 → 건너뛰기", 6, view(null));
    }
  });
  rec.push("done", `겹치지 않게 고를 수 있는 회의는 최대 ${count}개예요.`, null, view(null));
  return rec.steps;
}

/* ───────────── 동전 거스름돈 (큰 동전부터) ───────────── */

export const COINS_PSEUDOCODE = [
  "동전을 큰 것부터 정렬",
  "for coin in 동전들:",
  "    쓸 개수 = 남은 금액 // coin",
  "    남은 금액 -= coin × 쓸 개수",
  "남은 금액이 0이면 성공",
];

export function validateCoins(input: JsonValue[]): void {
  const coins = asIntArray(input[0], "동전", 1, 6);
  if (coins.some((c) => c < 1 || c > 500)) fail("동전은 1~500 사이여야 해요");
  if (new Set(coins).size !== coins.length) fail("같은 동전을 두 번 쓸 수 없어요");
  asInt(input[1], "금액", 1, 9999);
}

export function coins(input: JsonValue[]): VisualizationStep[] {
  const list = [...(input[0] as number[])].sort((a, b) => b - a);
  const amount = input[1] as number;
  const rec = new StepRecorder();
  const entries: HashEntryViz[] = [];
  let remain = amount;

  const view = (current: number | null) => ({
    sequence: {
      label: "동전 (큰 것부터)",
      items: list.map((c, i) => ({ id: `c${i}`, value: c })),
      cursor: current,
      done: current ?? (remain === amount ? 0 : list.length),
      highlights: current === null ? [] : [{ itemId: `c${current}`, tone: "current" as const }],
    },
    hash: { title: "쓴 동전 (동전 → 개수)", entries: entries.map((e) => ({ ...e })), highlights: [] },
    variables: { 금액: amount, "남은 금액": remain, "동전 수": entries.reduce((s, e) => s + (e.value as number), 0) },
  });

  rec.push("init", `${amount}원을 가장 적은 동전으로 줘요. 큰 동전부터 쓸 수 있는 만큼 써요.`, 1, view(null));
  list.forEach((coin, i) => {
    const use = Math.floor(remain / coin);
    if (use > 0) {
      remain -= coin * use;
      entries.push({ id: `e${i}`, key: coin, value: use });
      rec.push("pick", `${coin}원짜리 ${use}개 → 남은 금액 ${remain}원`, 4, view(i));
    } else {
      rec.push("skip", `${coin}원은 남은 금액보다 커요 → 건너뛰기`, 3, view(i));
    }
  });
  const divides = list.every((c, i) => i === list.length - 1 || c % list[i + 1]! === 0);
  rec.push(
    "done",
    remain === 0
      ? `동전 ${entries.reduce((s, e) => s + (e.value as number), 0)}개로 줬어요. ${divides ? "큰 동전이 작은 동전의 배수라 이 방법이 항상 최선이에요." : "동전끼리 배수가 아니면 이 방법이 최선이 아닐 수 있어요 (DP로 확인)."}`
      : `${remain}원이 남아 줄 수 없어요. 큰 동전부터 쓰는 방법이 늘 통하지는 않아요.`,
    5,
    view(null),
  );
  return rec.steps;
}

/* ───────────── 큰 수 만들기 (앞자리부터 크게) ───────────── */

export const DIGITS_PSEUDOCODE = [
  "stack = []",
  "for d in 숫자들:",
  "    while k > 0 and stack이 있고 stack 맨 위 < d:",
  "        stack.pop(); k -= 1        # 작은 앞자리를 지워요",
  "    stack.push(d)",
  "남은 k만큼 뒤에서 지우기",
];

export function validateDigits(input: JsonValue[]): void {
  const number = asString(input[0], "수", 12);
  if (!/^[0-9]{2,12}$/.test(number)) fail("수는 2~12자리 숫자여야 해요");
  asInt(input[1], "k", 1, number.length - 1);
}

export function digits(input: JsonValue[]): VisualizationStep[] {
  const number = input[0] as string;
  let k = input[1] as number;
  const rec = new StepRecorder();
  const stack: VizItem[] = [];

  const view = (
    index: number | null,
    highlight?: { itemId: string; tone: HighlightTone },
  ): {
    sequence: {
      label: string;
      items: VizItem[];
      cursor: number | null;
      done: number;
      highlights: { itemId: string; tone: HighlightTone }[];
    };
    stack: LinearSnapshot;
    variables: Record<string, JsonValue>;
  } => ({
    sequence: {
      label: "수",
      items: [...number].map((d, i) => ({ id: `d${i}`, value: d })),
      cursor: index,
      done: index ?? number.length,
      highlights: index === null ? [] : [{ itemId: `d${index}`, tone: "current" }],
    },
    stack: {
      title: "만드는 수 (아래가 앞자리)",
      items: stack.map((item) => ({ ...item })),
      highlights: highlight ? [highlight] : [],
      pointerLabels: stack.length ? [{ itemId: stack[stack.length - 1]!.id, label: "맨 뒷자리" }] : [],
    },
    variables: { "지울 수 있는 개수 k": k, 지금까지: stack.map((s) => s.value).join("") || "(없음)" },
  });

  rec.push("init", `${number}에서 숫자 ${k}개를 지워 가장 큰 수를 만들어요. 앞자리가 클수록 큰 수예요.`, 1, view(null));
  [...number].forEach((d, i) => {
    while (k > 0 && stack.length && (stack[stack.length - 1]!.value as string) < d) {
      const removed = stack.pop()!;
      k -= 1;
      rec.push(
        "skip",
        `뒤에 더 큰 숫자(${d})가 와요 → 앞의 작은 숫자(${removed.value})를 지우면 앞자리가 커져요 (남은 k = ${k})`,
        4,
        view(i),
      );
    }
    const item = { id: `s${i}`, value: d };
    stack.push(item);
    rec.push("pick", `숫자 ${d} 뒤에 붙이기`, 5, view(i, { itemId: item.id, tone: "current" }));
  });
  while (k > 0) {
    const removed = stack.pop()!;
    k -= 1;
    rec.push("skip", `아직 ${k + 1}개를 더 지워야 해요 → 맨 뒤 숫자(${removed.value}) 지우기`, 6, view(null));
  }
  rec.push("done", `가장 큰 수: ${stack.map((s) => s.value).join("")}`, null, view(null));
  return rec.steps;
}
