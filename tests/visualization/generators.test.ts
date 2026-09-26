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
  if (state.bars) {
    const b = state.bars;
    const sorted = new Set(b.sorted);
    const items = b.items
      .map((item) => text(item.value) + marks(b.highlights, item.id) + (sorted.has(item.id) ? "✓" : ""))
      .join(" ");
    const pointers = b.pointers.map((p) => `${p.label}@${p.index}`).join(",");
    parts.push(
      `${b.title}=|${items}|${b.range ? ` range=${b.range.join("..")}` : ""}${pointers ? ` ${pointers}` : ""}`,
    );
  }
  if (state.table) {
    const t = state.table;
    const rows = t.cells.map((row, r) =>
      row
        .map((cell, c) => {
          const tone = t.highlights.find((h) => h.row === r && h.col === c)?.tone;
          return (cell === null ? "." : text(cell)) + (tone ? TONE_MARK[tone] : "");
        })
        .join(" "),
    );
    parts.push(`${t.title}[${rows.join(" / ")}]`);
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

  it("28개 generator가 모두 최소 한 번은 토픽 시각화 예시로 쓰인다", () => {
    const used = new Set(TOPIC_PRESETS.map((preset) => preset.generator));
    expect([...used].sort()).toEqual(Object.keys(GENERATORS).sort());
    expect(used.size).toBe(28);
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
    ["sort-insertion", [[0, 5]]],
    ["sort-insertion", [Array.from({ length: 11 }, () => 1)]],
    ["sort-merge", [Array.from({ length: 9 }, () => 1)]],
    ["sort-merge", [[]]],
    ["sort-counting", [[10]]],
    ["sort-counting", [[-1]]],
    ["bsearch-exact", [[3, 1, 2], 1]],
    ["bsearch-exact", [[1, 2], 100]],
    ["bsearch-lower-bound", [[], 1]],
    ["bsearch-answer", [[0, 5], 2]],
    ["bsearch-answer", [[5], 51]],
    ["dp-stairs", [0]],
    ["dp-stairs", [13]],
    ["dp-grid-paths", [["#..", "..."]]],
    ["dp-grid-paths", [["..", "..."]]],
    ["dp-grid-paths", [["abc"]]],
    ["dp-lcs", ["ABC", "abc"]],
    ["dp-lcs", ["abcdefgh", "a"]],
    ["greedy-intervals", [[[3, 3]]]],
    ["greedy-intervals", [[[0, 17]]]],
    ["greedy-coins", [[5, 5], 10]],
    ["greedy-coins", [[5], 0]],
    ["greedy-digits", ["12a", 1]],
    ["greedy-digits", ["123", 3]],
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

describe("정렬 generator", () => {
  const run = (key: VisualizationGeneratorKey, input: JsonValue[]) => {
    const result = runGenerator(key, input);
    if (!result.ok) throw new Error(result.error);
    return result.steps;
  };
  const values = (steps: VisualizationStep[]) => steps.at(-1)!.state.bars!.items.map((item) => item.value);

  it.each(["sort-insertion", "sort-merge"] as const)("%s: 끝나면 정렬되고 모든 막대가 확정된다", (key) => {
    const steps = run(key, [[5, 2, 9, 2, 7, 1]]);
    expect(values(steps)).toEqual([1, 2, 2, 5, 7, 9]);
    expect(steps.at(-1)!.state.bars!.sorted).toHaveLength(6);
    // 같은 값의 막대는 원래 순서를 지킨다 (안정 정렬)
    const ids = steps.at(-1)!.state.bars!.items.map((item) => item.id);
    expect(ids.indexOf("b1")).toBeLessThan(ids.indexOf("b3"));
  });

  it("병합 정렬은 중간에도 막대가 사라지거나 겹치지 않는다", () => {
    for (const step of run("sort-merge", [[4, 3, 2, 1, 8, 7, 6, 5]])) {
      const ids = step.state.bars!.items.map((item) => item.id);
      expect(new Set(ids).size).toBe(8);
    }
  });

  it("이미 정렬된 배열은 삽입 정렬에서 한 번도 밀지 않는다", () => {
    const steps = run("sort-insertion", [[1, 2, 3, 4]]);
    expect(steps.filter((s) => s.action === "shift")).toHaveLength(0);
  });

  it("계수 정렬은 값별 개수를 세고 결과를 늘어놓는다", () => {
    const steps = run("sort-counting", [[3, 0, 3, 1]]);
    const last = steps.at(-1)!.state;
    expect(last.bars!.items.map((item) => item.value)).toEqual([1, 1, 0, 2, 0, 0, 0, 0, 0, 0]);
    expect(last.queue!.items.map((item) => item.value)).toEqual([0, 1, 3, 3]);
  });
});

describe("이분 탐색 generator", () => {
  const run = (key: VisualizationGeneratorKey, input: JsonValue[]) => {
    const result = runGenerator(key, input);
    if (!result.ok) throw new Error(result.error);
    return result.steps;
  };

  it("정확히 찾기는 log N번 안에 찾고, 없으면 not-found 뒤 done", () => {
    const nums = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
    for (const target of nums) {
      const steps = run("bsearch-exact", [nums, target]);
      expect(steps.filter((s) => s.action === "compare").length).toBeLessThanOrEqual(5);
      expect(steps.some((s) => s.action === "found")).toBe(true);
    }
    const missing = run("bsearch-exact", [nums, 4]);
    expect(missing.map((s) => s.action).slice(-2)).toEqual(["not-found", "done"]);
  });

  it("경계 찾기는 같은 값 중 첫 자리, 없으면 끝을 답한다", () => {
    const answer = (nums: number[], target: number) =>
      run("bsearch-lower-bound", [nums, target]).at(-1)!.state.variables!.답;
    expect(answer([2, 4, 4, 4, 7], 4)).toBe(1);
    expect(answer([2, 4, 4, 4, 7], 5)).toBe(4);
    expect(answer([2, 4], 9)).toBe(2);
    expect(answer([2, 4], 1)).toBe(0);
  });

  it("답을 이분 탐색하면 가능한 가장 큰 길이를 찾는다", () => {
    const answer = (cables: number[], k: number) => run("bsearch-answer", [cables, k]).at(-1)!.state.variables!.answer;
    expect(answer([80, 43, 57, 39], 11)).toBe(19);
    expect(answer([5], 5)).toBe(1);
    expect(answer([3], 4)).toBe(0);
  });
});

describe("DP generator", () => {
  const run = (key: VisualizationGeneratorKey, input: JsonValue[]) => {
    const result = runGenerator(key, input);
    if (!result.ok) throw new Error(result.error);
    return result.steps;
  };
  const cells = (steps: VisualizationStep[]) => steps.at(-1)!.state.table!.cells;

  it("계단 표는 피보나치처럼 채워진다", () => {
    expect(cells(run("dp-stairs", [6]))[0]).toEqual([1, 1, 2, 3, 5, 8, 13]);
    expect(cells(run("dp-stairs", [1]))[0]).toEqual([1, 1]);
  });

  it("격자 길 수는 막힌 칸을 0으로 보고 위·왼쪽을 더한다", () => {
    expect(
      cells(run("dp-grid-paths", [["...", "...", "..."]]))
        .at(-1)!
        .at(-1),
    ).toBe(6);
    const blocked = cells(run("dp-grid-paths", [["....", ".#..", "...."]]));
    expect(blocked[1]![1]).toBe("#");
    expect(blocked.at(-1)!.at(-1)).toBe(4);
    expect(
      cells(run("dp-grid-paths", [[".#", "#."]]))
        .at(-1)!
        .at(-1),
    ).toBe(0);
  });

  it("LCS 표의 오른쪽 아래가 답이고, 거꾸로 따라간 공통 부분 수열을 알려 준다", () => {
    const steps = run("dp-lcs", ["acbde", "abcfe"]);
    expect(cells(steps).at(-1)!.at(-1)).toBe(3);
    expect(steps.at(-1)!.message).toMatch(/공통 부분 수열: (abe|ace)/);
    expect(run("dp-lcs", ["abc", "xyz"]).at(-1)!.message).toContain("(없음)");
  });
});

describe("그리디 generator", () => {
  const run = (key: VisualizationGeneratorKey, input: JsonValue[]) => {
    const result = runGenerator(key, input);
    if (!result.ok) throw new Error(result.error);
    return result.steps;
  };

  it("회의는 끝나는 시각 순으로 고르고, 최대 개수를 알려 준다", () => {
    const steps = run("greedy-intervals", [
      [
        [0, 6],
        [1, 4],
        [5, 7],
        [3, 5],
      ],
    ]);
    expect(steps.at(-1)!.state.table!.rowLabels).toEqual(["[1,4]", "[3,5]", "[0,6]", "[5,7]"]);
    expect(steps.filter((s) => s.action === "pick")).toHaveLength(2);
    expect(steps.at(-1)!.message).toContain("최대 2개");
  });

  it("배수 관계 동전은 최선이라고, 아니면 최선이 아닐 수 있다고 알려 준다", () => {
    expect(run("greedy-coins", [[500, 100, 50, 10], 1260]).at(-1)!.message).toContain("동전 6개");
    expect(run("greedy-coins", [[4, 3, 1], 6]).at(-1)!.message).toContain("최선이 아닐 수 있어요");
    expect(run("greedy-coins", [[4], 6]).at(-1)!.message).toContain("줄 수 없어요");
  });

  it("앞자리부터 크게 만든다", () => {
    const last = (n: string, k: number) => run("greedy-digits", [n, k]).at(-1)!.message;
    expect(last("4177252841", 4)).toContain("775841");
    expect(last("1924", 2)).toContain("94");
    expect(last("4321", 2)).toContain("43");
  });
});
