import type {
  HighlightTone,
  JsonValue,
  LinearSnapshot,
  SequenceSnapshot,
  VisualizationStep,
  VizAction,
  VizItem,
} from "@/types";
import { StepRecorder, asString, asStringArray, fail } from "./shared";

/* ───────────── 공통 ───────────── */

function linear(
  items: VizItem[],
  pointers: { itemId: string; label: string }[],
  highlights: { itemId: string; tone: HighlightTone }[] = [],
  title?: string,
): LinearSnapshot {
  return { ...(title ? { title } : {}), items, highlights, pointerLabels: pointers };
}

function opsSequence(ops: string[], cursor: number | null, done: number): SequenceSnapshot {
  return {
    label: "명령",
    items: ops.map((op, i) => ({ id: `op${i}`, value: op })),
    cursor,
    done,
    highlights: cursor === null ? [] : [{ itemId: `op${cursor}`, tone: "current" }],
  };
}

type Op = { kind: string; value: number | null };

function parseOps(value: JsonValue | undefined, allowed: Record<string, boolean>, example: string): Op[] {
  const ops = asStringArray(value, "명령 목록", 1, 16);
  return ops.map((raw) => {
    const [kind = "", arg, extra] = raw.trim().split(/\s+/);
    if (!(kind in allowed) || extra !== undefined) fail(`알 수 없는 명령이에요: "${raw}" (예: ${example})`);
    const needsValue = allowed[kind];
    if (needsValue) {
      if (arg === undefined || !/^-?\d{1,3}$/.test(arg)) fail(`"${raw}": ${kind} 뒤에 -999~999 정수가 필요해요`);
      return { kind, value: Number(arg) };
    }
    if (arg !== undefined) fail(`"${raw}": ${kind}에는 값을 쓰지 않아요`);
    return { kind, value: null };
  });
}

/* ───────────── 스택 기본 ───────────── */

export const STACK_BASIC_PSEUDOCODE = [
  "stack = []                      # 빈 스택",
  "for 명령 in 명령들:",
  "    push x → stack 맨 위에 x 올리기",
  "    pop    → 맨 위 값 꺼내기 (비어 있으면 오류!)",
  "    peek   → 맨 위 값 보기 (꺼내지 않음)",
];

export function validateStackBasic(input: JsonValue[]): void {
  parseOps(input[0], { push: true, pop: false, peek: false }, '"push 3", "pop", "peek"');
}

export function stackBasic(input: JsonValue[]): VisualizationStep[] {
  const raw = input[0] as string[];
  const ops = parseOps(raw, { push: true, pop: false, peek: false }, "");
  const rec = new StepRecorder();
  const items: VizItem[] = [];
  let seq = 0;
  const top = () => items[items.length - 1];
  const pointers = () => (top() ? [{ itemId: top()!.id, label: "top" }] : []);

  rec.push("init", "빈 스택에서 시작해요. 넣고 빼는 곳은 맨 위(top) 한 곳뿐이에요.", 1, {
    stack: linear([], []),
    sequence: opsSequence(raw, null, 0),
    variables: { "크기": 0 },
  });

  ops.forEach((op, i) => {
    if (op.kind === "push") {
      const item = { id: `s${seq++}`, value: op.value };
      items.push(item);
      rec.push("push", `push(${op.value}): 맨 위에 올렸어요. 지금 크기 ${items.length}`, 3, {
        stack: linear([...items], pointers(), [{ itemId: item.id, tone: "current" }]),
        sequence: opsSequence(raw, i, i),
        variables: { "크기": items.length },
      });
    } else if (op.kind === "pop") {
      const removed = items.pop();
      rec.push(
        "pop",
        removed
          ? `pop(): 맨 위 값 ${String(removed.value)} 꺼내기 — 가장 나중에 넣은 값이 먼저 나와요`
          : "pop(): 스택이 비어 있어서 꺼낼 값이 없어요! 꺼내기 전에 비어 있는지 확인해야 해요.",
        4,
        {
          stack: linear([...items], pointers()),
          sequence: opsSequence(raw, i, i),
          variables: removed ? { "크기": items.length, "꺼낸 값": removed.value } : { "크기": 0, "오류": "빈 스택에서 pop" },
        },
      );
    } else {
      const current = top();
      rec.push(
        "peek",
        current ? `peek(): 맨 위 값은 ${String(current.value)} (꺼내지는 않아요)` : "peek(): 비어 있어서 볼 값이 없어요",
        5,
        {
          stack: linear([...items], pointers(), current ? [{ itemId: current.id, tone: "result" }] : []),
          sequence: opsSequence(raw, i, i),
          variables: current ? { "크기": items.length, "맨 위": current.value } : { "크기": 0 },
        },
      );
    }
  });

  rec.push("done", `명령을 모두 처리했어요. 남은 값 (아래 → 위): [${items.map((it) => it.value).join(", ")}]`, null, {
    stack: linear([...items], pointers()),
    sequence: opsSequence(raw, null, raw.length),
    variables: { "크기": items.length },
  });
  return rec.steps;
}

/* ───────────── 괄호 검사 ───────────── */

export const STACK_BRACKET_PSEUDOCODE = [
  "stack = []",
  "for 문자 ch in s:",
  "    if ch가 여는 괄호: stack.push(ch)",
  "    else:                         # 닫는 괄호",
  "        if stack이 비었거나 top이 짝이 아니면: return False",
  "        stack.pop()               # 짝이 맞았으니 꺼내기",
  "return stack이 비었는가",
];

const PAIRS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
const OPENERS = new Set(["(", "[", "{"]);

export function validateStackBracket(input: JsonValue[]): void {
  const s = asString(input[0], "괄호 문자열", 16);
  if (!/^[()[\]{}]+$/.test(s)) fail("괄호 문자열에는 ( ) [ ] { } 만 쓸 수 있어요");
}

export function stackBracket(input: JsonValue[]): VisualizationStep[] {
  const s = input[0] as string;
  const rec = new StepRecorder();
  const items: VizItem[] = [];
  const chars = [...s];
  const seq = (cursor: number | null, done: number, extra: { itemId: string; tone: HighlightTone }[] = []) => ({
    label: "s",
    items: chars.map((ch, i) => ({ id: `c${i}`, value: ch })),
    cursor,
    done,
    highlights: [...(cursor === null ? [] : [{ itemId: `c${cursor}`, tone: "current" as const }]), ...extra],
  });
  const pointers = () => (items.length ? [{ itemId: items[items.length - 1]!.id, label: "top" }] : []);

  rec.push("init", `"${s}"의 괄호를 왼쪽부터 한 글자씩 봐요. 여는 괄호는 스택에 쌓아 둬요.`, 1, {
    stack: linear([], []),
    sequence: seq(null, 0),
    variables: { i: 0 },
  });

  for (const [i, ch] of chars.entries()) {
    if (OPENERS.has(ch)) {
      const item = { id: `b${i}`, value: ch };
      items.push(item);
      rec.push("push", `'${ch}'는 여는 괄호 → push. 짝을 만날 때까지 기다려요.`, 3, {
        stack: linear([...items], pointers(), [{ itemId: item.id, tone: "current" }]),
        sequence: seq(i, i),
        variables: { i, ch },
      });
      continue;
    }
    const top = items[items.length - 1];
    if (!top || top.value !== PAIRS[ch]) {
      rec.push(
        "compare",
        top
          ? `'${ch}'의 짝은 '${PAIRS[ch]}'인데 맨 위는 '${String(top.value)}' → 짝이 안 맞아요!`
          : `'${ch}'를 닫으려는데 스택이 비어 있어요 → 짝이 없어요!`,
        5,
        {
          stack: linear([...items], pointers(), top ? [{ itemId: top.id, tone: "blocked" }] : []),
          sequence: seq(i, i, [{ itemId: `c${i}`, tone: "blocked" }]),
          variables: { i, ch, "결과": false },
        },
      );
      rec.push("done", `"${s}" → 올바르지 않은 괄호예요 (False)`, 5, {
        stack: linear([...items], pointers()),
        sequence: seq(null, i, [{ itemId: `c${i}`, tone: "blocked" }]),
        variables: { "결과": false },
      });
      return rec.steps;
    }
    rec.push("compare", `'${ch}'와 맨 위 '${String(top.value)}'의 짝이 맞아요`, 5, {
      stack: linear([...items], pointers(), [{ itemId: top.id, tone: "result" }]),
      sequence: seq(i, i),
      variables: { i, ch },
    });
    items.pop();
    rec.push("pop", `짝을 찾은 '${String(top.value)}'를 스택에서 꺼내요`, 6, {
      stack: linear([...items], pointers()),
      sequence: seq(i, i + 1),
      variables: { i, ch },
    });
  }

  const ok = items.length === 0;
  rec.push(
    "done",
    ok
      ? `문자열 끝! 스택이 비었으니 모든 괄호의 짝이 맞아요 → True`
      : `문자열 끝! 스택에 닫히지 않은 괄호 ${items.length}개가 남았어요 → False`,
    7,
    {
      stack: linear([...items], pointers(), items.map((it) => ({ itemId: it.id, tone: "blocked" as const }))),
      sequence: seq(null, chars.length),
      variables: { "결과": ok },
    },
  );
  return rec.steps;
}

/* ───────────── 큐 ───────────── */

export const QUEUE_BASIC_PSEUDOCODE = [
  "queue = deque()                 # 빈 큐",
  "for 명령 in 명령들:",
  "    enqueue x → 맨 뒤(rear)에 x 넣기",
  "    dequeue   → 맨 앞(front) 값 꺼내기",
  "    peek      → 맨 앞 값 보기 (꺼내지 않음)",
];

function frontRear(items: VizItem[]) {
  if (items.length === 0) return [];
  if (items.length === 1) return [{ itemId: items[0]!.id, label: "front · rear" }];
  return [
    { itemId: items[0]!.id, label: "front" },
    { itemId: items[items.length - 1]!.id, label: "rear" },
  ];
}

export function validateQueueBasic(input: JsonValue[]): void {
  parseOps(input[0], { enqueue: true, dequeue: false, peek: false }, '"enqueue 3", "dequeue", "peek"');
}

export function queueBasic(input: JsonValue[]): VisualizationStep[] {
  const raw = input[0] as string[];
  const ops = parseOps(raw, { enqueue: true, dequeue: false, peek: false }, "");
  const rec = new StepRecorder();
  const items: VizItem[] = [];
  let seq = 0;

  rec.push("init", "빈 큐에서 시작해요. 들어가는 곳(rear)과 나가는 곳(front)이 달라요.", 1, {
    queue: linear([], []),
    sequence: opsSequence(raw, null, 0),
    variables: { "크기": 0 },
  });

  ops.forEach((op, i) => {
    if (op.kind === "enqueue") {
      const item = { id: `q${seq++}`, value: op.value };
      items.push(item);
      rec.push("enqueue", `enqueue(${op.value}): 줄의 맨 뒤에 섰어요. 지금 ${items.length}명 대기 중`, 3, {
        queue: linear([...items], frontRear(items), [{ itemId: item.id, tone: "current" }]),
        sequence: opsSequence(raw, i, i),
        variables: { "크기": items.length },
      });
    } else if (op.kind === "dequeue") {
      const removed = items.shift();
      rec.push(
        "dequeue",
        removed
          ? `dequeue(): 맨 앞 값 ${String(removed.value)} 꺼내기 — 먼저 온 값이 먼저 나가요`
          : "dequeue(): 큐가 비어 있어서 꺼낼 값이 없어요!",
        4,
        {
          queue: linear([...items], frontRear(items)),
          sequence: opsSequence(raw, i, i),
          variables: removed ? { "크기": items.length, "꺼낸 값": removed.value } : { "크기": 0, "오류": "빈 큐에서 dequeue" },
        },
      );
    } else {
      const front = items[0];
      rec.push("peek", front ? `peek(): 맨 앞 값은 ${String(front.value)}` : "peek(): 비어 있어서 볼 값이 없어요", 5, {
        queue: linear([...items], frontRear(items), front ? [{ itemId: front.id, tone: "result" }] : []),
        sequence: opsSequence(raw, i, i),
        variables: front ? { "크기": items.length, "맨 앞": front.value } : { "크기": 0 },
      });
    }
  });

  rec.push("done", `명령을 모두 처리했어요. 남은 줄 (앞 → 뒤): [${items.map((it) => it.value).join(", ")}]`, null, {
    queue: linear([...items], frontRear(items)),
    sequence: opsSequence(raw, null, raw.length),
    variables: { "크기": items.length },
  });
  return rec.steps;
}

/* ───────────── 덱 ───────────── */

export const DEQUE_BASIC_PSEUDOCODE = [
  "dq = deque()",
  "for 명령 in 명령들:",
  "    push_front x / push_back x → 앞 / 뒤에 넣기",
  "    pop_front / pop_back       → 앞 / 뒤에서 꺼내기",
];

const DEQUE_OPS = { push_front: true, push_back: true, pop_front: false, pop_back: false };
const DEQUE_ACTION = {
  push_front: "push-front",
  push_back: "push-back",
  pop_front: "pop-front",
  pop_back: "pop-back",
} as const satisfies Record<keyof typeof DEQUE_OPS, VizAction>;

export function validateDequeBasic(input: JsonValue[]): void {
  parseOps(input[0], DEQUE_OPS, '"push_back 3", "push_front 1", "pop_front", "pop_back"');
}

export function dequeBasic(input: JsonValue[]): VisualizationStep[] {
  const raw = input[0] as string[];
  const ops = parseOps(raw, DEQUE_OPS, "");
  const rec = new StepRecorder();
  const items: VizItem[] = [];
  let seq = 0;

  rec.push("init", "빈 덱에서 시작해요. 앞과 뒤 양쪽에서 모두 넣고 뺄 수 있어요.", 1, {
    deque: linear([], []),
    sequence: opsSequence(raw, null, 0),
    variables: { "크기": 0 },
  });

  ops.forEach((op, i) => {
    const base = { sequence: opsSequence(raw, i, i) };
    if (op.kind === "push_front" || op.kind === "push_back") {
      const item = { id: `d${seq++}`, value: op.value };
      if (op.kind === "push_front") items.unshift(item);
      else items.push(item);
      rec.push(
        DEQUE_ACTION[op.kind],
        `${op.kind}(${op.value}): ${op.kind === "push_front" ? "맨 앞" : "맨 뒤"}에 넣었어요`,
        3,
        {
          ...base,
          deque: linear([...items], frontRear(items), [{ itemId: item.id, tone: "current" }]),
          variables: { "크기": items.length },
        },
      );
    } else {
      const removed = op.kind === "pop_front" ? items.shift() : items.pop();
      rec.push(
        DEQUE_ACTION[op.kind as keyof typeof DEQUE_ACTION],
        removed
          ? `${op.kind}(): ${op.kind === "pop_front" ? "맨 앞" : "맨 뒤"} 값 ${String(removed.value)} 꺼내기`
          : `${op.kind}(): 덱이 비어 있어서 꺼낼 값이 없어요!`,
        4,
        {
          ...base,
          deque: linear([...items], frontRear(items)),
          variables: removed ? { "크기": items.length, "꺼낸 값": removed.value } : { "크기": 0, "오류": `빈 덱에서 ${op.kind}` },
        },
      );
    }
  });

  rec.push("done", `명령을 모두 처리했어요. 남은 값 (앞 → 뒤): [${items.map((it) => it.value).join(", ")}]`, null, {
    deque: linear([...items], frontRear(items)),
    sequence: opsSequence(raw, null, raw.length),
    variables: { "크기": items.length },
  });
  return rec.steps;
}
