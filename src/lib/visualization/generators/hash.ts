import type {
  HashEntryViz,
  HashSnapshot,
  HighlightTone,
  JsonValue,
  SequenceSnapshot,
  VisualizationStep,
} from "@/types";
import { StepRecorder, asInt, asIntArray, asStringArray, fail } from "./shared";

type Highlight = { itemId: string; tone: HighlightTone };

const KEY_PATTERN = /^[a-z]{1,8}$/;

function asKeys(value: JsonValue | undefined, name: string, max: number): string[] {
  const keys = asStringArray(value, name, 1, max);
  for (const key of keys) {
    if (!KEY_PATTERN.test(key)) fail(`${name}: "${key}" — 영어 소문자 1~8글자만 쓸 수 있어요`);
  }
  return keys;
}

function sequence(
  label: string,
  values: JsonValue[],
  cursor: number | null,
  done: number,
  highlights: Highlight[] = [],
) {
  return {
    label,
    items: values.map((value, i) => ({ id: `s${i}`, value })),
    cursor,
    done,
    highlights,
  } satisfies SequenceSnapshot;
}

/* ───────────── 해시 테이블 (버킷과 충돌) ───────────── */

export const HASH_BUCKETS_PSEUDOCODE = [
  "table = 빈 칸 m개",
  "hash(key) = (글자 번호를 모두 더한 값) % m",
  "add(key):",
  "    i = hash(key)",
  "    if key가 table[i]에 없으면: table[i] 끝에 key 추가",
  "find(key):",
  "    i = hash(key)",
  "    table[i] 한 칸만 훑어서 key가 있는지 확인",
];

function parseBucketCommands(value: JsonValue | undefined): { op: "add" | "find"; key: string }[] {
  const commands = asStringArray(value, "명령 목록", 1, 12);
  return commands.map((command) => {
    const match = /^(add|find) ([a-z]{1,8})$/.exec(command.trim());
    if (!match) fail(`"${command}": add 단어 / find 단어 형태로 써 주세요 (단어는 영어 소문자 1~8글자)`);
    return { op: match[1] as "add" | "find", key: match[2]! };
  });
}

export function validateHashBuckets(input: JsonValue[]): void {
  parseBucketCommands(input[0]);
  asInt(input[1], "칸 수", 2, 8);
}

/** 글자 번호 합을 칸 수로 나눈 나머지. 공식 문자열도 함께 돌려준다 */
export function simpleHash(key: string, size: number): { bucket: number; formula: string } {
  const codes = [...key].map((ch) => ch.charCodeAt(0));
  const sum = codes.reduce((a, b) => a + b, 0);
  const bucket = sum % size;
  return { bucket, formula: `${codes.join(" + ")} = ${sum} → ${sum} % ${size} = ${bucket}` };
}

export function hashBuckets(input: JsonValue[]): VisualizationStep[] {
  const commands = parseBucketCommands(input[0]);
  const size = input[1] as number;
  const rec = new StepRecorder();
  const table: HashEntryViz[][] = Array.from({ length: size }, () => []);
  const results: string[] = [];
  let seq = 0;

  const state = (
    index: number | null,
    extra: Partial<Pick<HashSnapshot, "activeBucket" | "hashing">> & {
      highlights?: { entryId: string; tone: HighlightTone }[];
    } = {},
  ) => ({
    hash: {
      title: `table (칸 ${size}개)`,
      buckets: table.map((bucket) => bucket.map((entry) => ({ ...entry }))),
      activeBucket: extra.activeBucket ?? null,
      highlights: extra.highlights ?? [],
      hashing: extra.hashing ?? null,
    },
    sequence: sequence(
      "명령",
      commands.map((c) => `${c.op} ${c.key}`),
      index,
      index === null ? 0 : index,
      index === null ? [] : [{ itemId: `s${index}`, tone: "current" }],
    ),
    variables: { "find 결과": results.length ? results : "(아직 없음)" },
  });

  rec.push("init", `칸이 ${size}개인 해시 테이블을 준비해요. 키를 넣을 칸은 해시 함수가 정해 줘요.`, 1, state(null));

  commands.forEach(({ op, key }, index) => {
    const { bucket, formula } = simpleHash(key, size);
    const hashing = { key, formula, bucket };
    const chain = table[bucket]!;
    rec.push(
      "hash",
      `${key}의 글자 번호를 더해 칸 수로 나눈 나머지는 ${bucket} → ${bucket}번 칸만 보면 돼요.`,
      op === "add" ? 4 : 7,
      state(index, { activeBucket: bucket, hashing }),
    );

    if (op === "add") {
      const existing = chain.find((entry) => entry.key === key);
      if (existing) {
        rec.push(
          "found",
          `${bucket}번 칸에 이미 ${key} 있음. 같은 키는 두 번 넣지 않아요.`,
          5,
          state(index, { activeBucket: bucket, hashing, highlights: [{ entryId: existing.id, tone: "result" }] }),
        );
        return;
      }
      const entry = { id: `h${seq++}`, key, value: null };
      const others = chain.map((e) => e.key);
      chain.push(entry);
      rec.push(
        "insert",
        others.length
          ? `${bucket}번 칸이 이미 차 있어요 (${others.join(", ")}) → 충돌! 같은 칸 줄 끝에 ${key} 이어 붙이기`
          : `비어 있는 ${bucket}번 칸에 ${key} 넣기`,
        5,
        state(index, { activeBucket: bucket, hashing, highlights: [{ entryId: entry.id, tone: "current" }] }),
      );
      return;
    }

    for (const entry of chain) {
      if (entry.key === key) {
        results.push(`${key}: 있음`);
        rec.push(
          "found",
          `${bucket}번 칸에서 찾았어요: ${key}. 다른 칸은 하나도 보지 않았어요!`,
          8,
          state(index, { activeBucket: bucket, hashing, highlights: [{ entryId: entry.id, tone: "result" }] }),
        );
        return;
      }
      rec.push(
        "compare",
        `${bucket}번 칸에서 ${entry.key} 확인 → 찾는 키가 아니에요. 같은 칸의 다음 항목을 봐요.`,
        8,
        state(index, { activeBucket: bucket, hashing, highlights: [{ entryId: entry.id, tone: "blocked" }] }),
      );
    }
    results.push(`${key}: 없음`);
    rec.push(
      "not-found",
      chain.length
        ? `${bucket}번 칸을 끝까지 봤지만 찾는 키가 없어요. 다른 칸에 있을 수는 없으니 여기서 끝!`
        : `${bucket}번 칸이 비어 있어요 → 테이블에 없는 키예요.`,
      8,
      state(index, { activeBucket: bucket, hashing }),
    );
  });

  const longest = Math.max(...table.map((bucket) => bucket.length));
  rec.push(
    "done",
    `명령을 모두 처리했어요. 가장 긴 칸에 ${longest}개가 들어 있어요. 칸이 고르게 나뉠수록 찾기가 빨라요.`,
    null,
    state(null),
  );
  return rec.steps;
}

/* ───────────── 개수 세기 ───────────── */

export const HASH_COUNT_PSEUDOCODE = [
  "count = {}",
  "for x in items:",
  "    if x in count:",
  "        count[x] += 1",
  "    else:",
  "        count[x] = 1",
  "가장 큰 count[x]를 찾아요",
];

export function validateHashCount(input: JsonValue[]): void {
  asKeys(input[0], "단어 목록", 12);
}

export function hashCount(input: JsonValue[]): VisualizationStep[] {
  const items = input[0] as string[];
  const rec = new StepRecorder();
  const entries: HashEntryViz[] = [];

  const state = (index: number | null, done: number, highlight?: { entryId: string; tone: HighlightTone }) => ({
    hash: { title: "count", entries: entries.map((e) => ({ ...e })), highlights: highlight ? [highlight] : [] },
    sequence: sequence("items", items, index, done, index === null ? [] : [{ itemId: `s${index}`, tone: "current" }]),
  });

  rec.push("init", "빈 dict count를 만들어요. 키는 단어, 값은 지금까지 나온 횟수예요.", 1, state(null, 0));

  items.forEach((x, index) => {
    const entry = entries.find((e) => e.key === x);
    rec.push(
      "check",
      entry ? `count에 ${x} 있나요? → 있어요 (지금 ${entry.value as number}번)` : `count에 ${x} 있나요? → 처음 봐요`,
      3,
      state(index, index, entry ? { entryId: entry.id, tone: "current" } : undefined),
    );
    if (entry) {
      entry.value = (entry.value as number) + 1;
      rec.push(
        "count",
        `count[${x}] 1 늘리기 → ${entry.value as number}번`,
        4,
        state(index, index + 1, { entryId: entry.id, tone: "current" }),
      );
    } else {
      const added = { id: `k${entries.length}`, key: x, value: 1 };
      entries.push(added);
      rec.push(
        "insert",
        `count[${x}] = 1 로 새 키 만들기`,
        6,
        state(index, index + 1, { entryId: added.id, tone: "current" }),
      );
    }
  });

  const best = entries.reduce((a, b) => ((b.value as number) > (a.value as number) ? b : a));
  rec.push(
    "done",
    `한 번 훑었을 뿐인데 모든 개수가 나왔어요. 가장 많이 나온 단어는 ${best.key as string} (${best.value as number}번)이에요.`,
    7,
    state(null, items.length, { entryId: best.id, tone: "result" }),
  );
  return rec.steps;
}

/* ───────────── 두 수의 합 (짝 찾기) ───────────── */

export const HASH_TWO_SUM_PSEUDOCODE = [
  "seen = {}                  # 값 → 위치",
  "for i, x in enumerate(nums):",
  "    need = target - x",
  "    if need in seen:",
  "        return [seen[need], i]",
  "    seen[x] = i",
  "return []                  # 짝이 없어요",
];

export function validateHashTwoSum(input: JsonValue[]): void {
  asIntArray(input[0], "수 목록", 2, 10);
  asInt(input[1], "target", -1998, 1998);
}

export function hashTwoSum(input: JsonValue[]): VisualizationStep[] {
  const nums = input[0] as number[];
  const target = input[1] as number;
  const rec = new StepRecorder();
  const entries: HashEntryViz[] = [];

  const state = (
    index: number | null,
    extra: { need?: number; highlight?: { entryId: string; tone: HighlightTone }; pair?: [number, number] } = {},
  ) => ({
    hash: {
      title: "seen (값 → 위치)",
      entries: entries.map((e) => ({ ...e })),
      highlights: extra.highlight ? [extra.highlight] : [],
    },
    sequence: sequence(
      "nums",
      nums,
      index,
      index ?? 0,
      extra.pair
        ? extra.pair.map((i) => ({ itemId: `s${i}`, tone: "result" as const }))
        : index === null
          ? []
          : [{ itemId: `s${index}`, tone: "current" }],
    ),
    variables: { target, ...(extra.need === undefined ? {} : { need: extra.need }) },
  });

  rec.push("init", `합이 ${target}인 두 수를 찾아요. 지금까지 본 수를 seen에 적어 둘 거예요.`, 1, state(null));

  for (const [i, x] of nums.entries()) {
    const need = target - x;
    const partner = entries.find((e) => e.key === need);
    rec.push(
      "check",
      `${x}의 짝은 ${target} - ${x} = ${need}. seen에 ${need} 있나요? → ${partner ? "있어요!" : "없어요"}`,
      4,
      state(i, { need, highlight: partner ? { entryId: partner.id, tone: "current" } : undefined }),
    );
    if (partner) {
      const pair: [number, number] = [partner.value as number, i];
      rec.push(
        "found",
        `짝 ${need}: ${pair[0]}번 자리에 있었어요. ${need} + ${x} = ${target} → 답은 [${pair[0]}, ${i}]`,
        5,
        state(i, { need, highlight: { entryId: partner.id, tone: "result" }, pair }),
      );
      rec.push("done", "모든 쌍을 비교하지 않고, 한 번 훑으면서 짝을 찾았어요.", null, state(null, { pair }));
      return rec.steps;
    }
    if (!entries.some((e) => e.key === x)) {
      const added = { id: `k${i}`, key: x, value: i };
      entries.push(added);
      rec.push(
        "insert",
        `seen[${x}] = ${i}. 뒤에 오는 수가 짝으로 찾을 수 있게 적어 둬요.`,
        6,
        state(i, { need, highlight: { entryId: added.id, tone: "current" } }),
      );
    } else {
      rec.push("insert", `seen에 이미 ${x} 있음. 먼저 나온 위치를 그대로 둬요.`, 6, state(i, { need }));
    }
  }

  rec.push("done", `끝까지 봤지만 합이 ${target}인 두 수가 없어요. 빈 리스트를 돌려줘요.`, 7, state(null));
  return rec.steps;
}
