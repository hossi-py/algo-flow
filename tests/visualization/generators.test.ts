import { describe, expect, it } from "vitest";
import { PROBLEMS } from "@/content/problems";
import { TOPIC_VISUALIZATIONS } from "@/content/visualizations";
import { GENERATORS, runGenerator } from "@/lib/visualization/generators";
import type {
  HighlightTone,
  JsonValue,
  LinearSnapshot,
  VisualizationGeneratorKey,
  VisualizationPreset,
  VisualizationStep,
  VizState,
} from "@/types";

/* ───────────── 스냅샷용 한 줄 요약 ─────────────
 * 전체 스텝 JSON은 너무 커서(프리셋 합계 ~260KB) 리뷰할 수 없으므로, 스텝마다
 * "동작 · 의사코드 줄 · 문구"와 레이어별 상태 요약을 한 줄씩 남긴다.
 * grid-dfs는 docs/05 fixture로 전체 상태를 따로 비교한다.
 */

const TONE_MARK: Record<HighlightTone, string> = {
  current: "*",
  frontier: "?",
  visited: "✓",
  blocked: "✗",
  result: "!",
};
const NODE_MARK = { idle: ".", frontier: "?", current: "*", visited: "✓" } as const;
const EDGE_MARK = { idle: "", active: "~", tree: "=", rejected: "x" } as const;

const text = (value: JsonValue) => (typeof value === "string" ? value : JSON.stringify(value));

function marks(highlights: { itemId: string; tone: HighlightTone }[], id: string): string {
  return highlights
    .filter((h) => h.itemId === id)
    .map((h) => TONE_MARK[h.tone])
    .join("");
}

function linear(name: string, s: LinearSnapshot): string {
  return `${s.title ?? name}=[${s.items.map((item) => text(item.value) + marks(s.highlights, item.id)).join(",")}]`;
}

function summarize(state: VizState): string {
  const parts: string[] = [];
  if (state.sequence) {
    const s = state.sequence;
    const items = s.items.map((item) => text(item.value) + marks(s.highlights, item.id)).join(" ");
    parts.push(`${s.label}=<${items}> cur=${s.cursor ?? "-"} done=${s.done}`);
  }
  if (state.stack) parts.push(linear("stack", state.stack));
  if (state.queue) parts.push(linear("queue", state.queue));
  if (state.deque) parts.push(linear("deque", state.deque));
  if (state.graph) {
    const g = state.graph;
    const nodes = g.nodes
      .map((n) => {
        let out = `${n.label}${NODE_MARK[n.status]}`;
        if (n.order !== null) out += `#${n.order}`;
        if (n.distance !== null) out += `d${n.distance}`;
        if (n.caption) out += `(${n.caption})`;
        return out;
      })
      .join(" ");
    const edges = g.edges
      .filter((e) => e.status !== "idle")
      .map((e) => `${e.from}-${e.to}${EDGE_MARK[e.status]}`)
      .join(" ");
    parts.push(`graph{${nodes}}${edges ? ` edges{${edges}}` : ""}${g.current !== null ? ` @${g.current}` : ""}`);
  }
  if (state.grid) {
    const g = state.grid;
    let out = `grid zone=${g.zone.map((row) => row.join("")).join("/")}`;
    if (g.cursor) out += ` cur=${g.cursor.join(",")}`;
    if (g.checking) out += ` chk=${g.checking.join(",")}:${g.checkResult}`;
    if (g.distance)
      out += ` dist=${g.distance.map((row) => row.map((d) => (d === null ? "-" : d)).join(",")).join("/")}`;
    parts.push(out);
  }
  if (state.hash) {
    const h = state.hash;
    const entry = (e: { id: string; key: JsonValue; value: JsonValue }) =>
      text(e.key) +
      (e.value === null ? "" : `:${text(e.value)}`) +
      marks(
        h.highlights.map((x) => ({ itemId: x.entryId, tone: x.tone })),
        e.id,
      );
    let out = h.buckets
      ? `${h.title}{${h.buckets.map((b, i) => `${i}${h.activeBucket === i ? "*" : ""}[${b.map(entry).join(",")}]`).join(" ")}}`
      : `${h.title}{${(h.entries ?? []).map(entry).join(" ")}}`;
    if (h.hashing) out += ` hash(${h.hashing.key})=${h.hashing.bucket}`;
    parts.push(out);
  }
  if (state.callStack) {
    const frames = state.callStack.map(
      (f) => `${f.label}${f.status === "active" ? "*" : ""}${JSON.stringify(f.locals)}`,
    );
    parts.push(`calls[${frames.join(" > ")}]`);
  }
  if (state.variables) parts.push(`vars${JSON.stringify(state.variables)}`);
  return parts.join(" | ");
}

function trace(steps: VisualizationStep[]): string {
  return steps
    .map(
      (step) => `#${step.index} ${step.action} L${step.codeLine ?? "-"} ${step.message}\n    ${summarize(step.state)}`,
    )
    .join("\n");
}

/* ───────────── 대상 프리셋: 토픽 시각화 + 문제 시각화 ───────────── */

const TOPIC_PRESETS: VisualizationPreset[] = Object.values(TOPIC_VISUALIZATIONS).flat();
const PROBLEM_PRESETS: VisualizationPreset[] = PROBLEMS.flatMap((problem) => problem.visualization?.presets ?? []);
const ALL_PRESETS = [...TOPIC_PRESETS, ...PROBLEM_PRESETS];

function steps(preset: VisualizationPreset): VisualizationStep[] {
  const result = runGenerator(preset.generator, preset.input);
  if (!result.ok) throw new Error(`${preset.id}: ${result.error}`);
  return result.steps;
}

describe("generator 등록", () => {
  it("모든 generator가 등록 키와 같은 key를 갖고 의사코드가 있다", () => {
    for (const [key, definition] of Object.entries(GENERATORS)) {
      expect(definition.key).toBe(key);
      expect(definition.pseudocode.length, key).toBeGreaterThan(0);
      expect(definition.inputHint.length, key).toBeGreaterThan(0);
    }
  });

  it("16개 generator가 모두 최소 한 번은 토픽 시각화 예시로 쓰인다", () => {
    const used = new Set(TOPIC_PRESETS.map((preset) => preset.generator));
    expect([...used].sort()).toEqual(Object.keys(GENERATORS).sort());
    expect(used.size).toBe(16);
  });

  it("프리셋 id가 겹치지 않는다", () => {
    const ids = TOPIC_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe.each(ALL_PRESETS.map((preset) => [preset.id, preset] as const))("프리셋 %s", (_, preset) => {
  const result = steps(preset);
  const lines = GENERATORS[preset.generator].pseudocode.length;

  it("스텝이 0부터 순서대로 번호가 붙고, 마지막은 done", () => {
    expect(result.length).toBeGreaterThanOrEqual(2);
    result.forEach((step, i) => expect(step.index).toBe(i));
    expect(result.at(-1)?.action).toBe("done");
  });

  it("모든 스텝에 문구와 그릴 레이어가 있고, 줄 번호는 의사코드 안에 있다", () => {
    expect(preset.pseudocode).toHaveLength(lines);
    for (const step of result) {
      expect(step.message.trim().length, `#${step.index}`).toBeGreaterThan(0);
      expect(Object.keys(step.state).length, `#${step.index}`).toBeGreaterThan(0);
      if (step.codeLine !== null) {
        expect(step.codeLine, `#${step.index}`).toBeGreaterThanOrEqual(1);
        expect(step.codeLine, `#${step.index}`).toBeLessThanOrEqual(lines);
      }
    }
  });

  it("같은 입력이면 항상 같은 스텝을 만든다 (JSON으로 그대로 옮길 수 있음)", () => {
    const again = steps(preset);
    expect(again).toEqual(result);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it("스텝 흐름 스냅샷", () => {
    expect(trace(result)).toMatchSnapshot();
  });
});

describe("입력 검증", () => {
  const BAD_INPUTS: [VisualizationGeneratorKey, JsonValue[]][] = [
    ["stack-basic", ["push 3"]],
    ["stack-basic", [["fly 3"]]],
    ["stack-basic", [["push"]]],
    ["stack-basic", [["pop 3"]]],
    ["stack-basic", [[]]],
    ["stack-bracket", ["(a)"]],
    ["stack-bracket", [""]],
    ["stack-bracket", ["()".repeat(9)]],
    ["queue-basic", [["push 1"]]],
    ["deque-basic", [["enqueue 1"]]],
    ["recursion-factorial", [0]],
    ["recursion-factorial", [9]],
    ["recursion-factorial", ["4"]],
    ["recursion-fibonacci", [6]],
    ["recursion-fibonacci", [2.5]],
    ["graph-adjacency", [1, []]],
    ["graph-adjacency", [3, [[0, 3]]]],
    ["graph-adjacency", [3, [[1, 1]]]],
    [
      "graph-adjacency",
      [
        3,
        [
          [0, 1],
          [1, 0],
        ],
      ],
    ],
    ["graph-dfs", [3, [[0, 1]], 3]],
    ["graph-bfs", [3, [[0, 1]]]],
    ["grid-dfs", [["12"]]],
    ["grid-dfs", [["110", "01"]]],
    ["grid-dfs", [Array.from({ length: 9 }, () => "1")]],
    ["grid-bfs", [["S..", "..."]]],
    ["grid-bfs", [["SS.", "..E"]]],
    ["backtracking-permutation", [[1, 1]]],
    ["backtracking-permutation", [[1, 2, 3, 4, 5]]],
    ["backtracking-permutation", [[]]],
    ["backtracking-subset", [[1, 2, 3, 4]]],
    ["hash-buckets", [["add Cat"], 5]],
    ["hash-buckets", [["put cat"], 5]],
    ["hash-buckets", [["add cat"], 9]],
    ["hash-buckets", [[], 5]],
    ["hash-count", [["apple", "banana-split"]]],
    ["hash-count", [Array.from({ length: 13 }, () => "a")]],
    ["hash-two-sum", [[1], 2]],
    ["hash-two-sum", [[1, 2], 1.5]],
  ];

  it.each(BAD_INPUTS)("%s %j → 예외 대신 한국어 오류 메시지", (key, input) => {
    const result = runGenerator(key, input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/[가-힣]/);
  });

  it("입력 한도 끝값은 받아들인다", () => {
    expect(runGenerator("recursion-factorial", [8]).ok).toBe(true);
    expect(runGenerator("recursion-fibonacci", [0]).ok).toBe(true);
    expect(runGenerator("backtracking-permutation", [[1, 2, 3, 4]]).ok).toBe(true);
    expect(runGenerator("grid-dfs", [Array.from({ length: 8 }, () => "10101010")]).ok).toBe(true);
    expect(runGenerator("stack-bracket", ["()".repeat(8)]).ok).toBe(true);
  });
});

describe("해시 generator", () => {
  const run = (key: VisualizationGeneratorKey, input: JsonValue[]) => {
    const result = runGenerator(key, input);
    if (!result.ok) throw new Error(result.error);
    return result.steps;
  };

  it("글자가 같은 키는 같은 칸에 들어가 충돌하고, 찾을 때는 그 칸만 본다", () => {
    const result = run("hash-buckets", [["add cat", "add act", "find act", "find tac"], 5]);
    const last = result.at(-1)!.state.hash!;
    expect(last.buckets![2]!.map((e) => e.key)).toEqual(["cat", "act"]);
    expect(result.some((s) => s.action === "insert" && s.message.includes("충돌"))).toBe(true);
    expect(result.filter((s) => s.action === "found")).toHaveLength(1);
    expect(result.filter((s) => s.action === "not-found")).toHaveLength(1);
  });

  it("같은 키를 두 번 넣지 않는다", () => {
    const result = run("hash-buckets", [["add cat", "add cat"], 3]);
    const buckets = result.at(-1)!.state.hash!.buckets!;
    expect(buckets.flat()).toHaveLength(1);
  });

  it("개수를 세고 가장 많이 나온 단어를 알려 준다", () => {
    const result = run("hash-count", [["b", "a", "b"]]);
    const entries = result.at(-1)!.state.hash!.entries!;
    expect(entries.map((e) => [e.key, e.value])).toEqual([
      ["b", 2],
      ["a", 1],
    ]);
    expect(result.at(-1)!.message).toContain("b (2번)");
  });

  it("짝을 찾으면 멈추고, 없으면 빈 리스트로 끝난다", () => {
    const found = run("hash-two-sum", [[3, 3], 6]);
    expect(found.find((s) => s.action === "found")?.message).toContain("[0, 1]");
    const none = run("hash-two-sum", [[1, 2, 4], 100]);
    expect(none.at(-1)!.action).toBe("done");
    expect(none.at(-1)!.state.hash!.entries).toHaveLength(3);
  });
});
