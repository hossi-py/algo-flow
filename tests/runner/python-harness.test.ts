import { readFileSync } from "node:fs";
import path from "node:path";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";
import { PROBLEMS } from "@/content/problems";
import type { HarnessResult } from "@/lib/runner/harness-js";
import { PYTHON_HARNESS } from "@/lib/runner/harness-python";
import { judge } from "@/lib/runner/judge";
import type { JsonValue } from "@/types";

/** 브라우저 워커와 같은 Pyodide + 하네스를 Node에서 실행한다 */
let runCase: (code: string, fn: string, argsJson: string, recursionLimit: number, stdoutLimit: number) => string;

beforeAll(async () => {
  const pyodide: PyodideInterface = await loadPyodide();
  pyodide.runPython(PYTHON_HARNESS);
  runCase = pyodide.globals.get("run_case");
}, 60_000);

const run = (code: string, args: JsonValue[] = [[]], recursionLimit = 3000): HarnessResult =>
  JSON.parse(runCase(code, "solution", JSON.stringify(args), recursionLimit, 1000)) as HarnessResult;

describe("Python 하네스", () => {
  it("반환값과 print 출력을 돌려준다", () => {
    expect(run("def solution(xs):\n    print('길이', len(xs))\n    return len(xs)\n", [[1, 2, 3]])).toMatchObject({
      ok: true,
      value: 3,
      stdout: "길이 3\n",
    });
  });

  it("tuple·set·dict를 JSON 값으로 바꾼다", () => {
    expect(run("def solution(_):\n    return (1, {3, 2}, {1: (True, None)})\n")).toMatchObject({
      ok: true,
      value: [1, [2, 3], { "1": [true, null] }],
    });
  });

  it("문법 오류는 compile 단계, 줄 번호 포함", () => {
    const result = run("def solution(g):\n    return [\n");
    expect(result).toMatchObject({ ok: false, phase: "compile", error: { type: "SyntaxError", line: 2 } });
  });

  it("실행 오류는 사용자 코드 줄 번호와 print 출력을 함께 돌려준다", () => {
    const result = run("def solution(g):\n    x = []\n    print('before')\n    return x[3]\n");
    expect(result).toMatchObject({
      ok: false,
      phase: "runtime",
      error: { type: "IndexError", line: 4 },
      stdout: "before\n",
    });
  });

  it("input()은 쓸 수 없다고 안내한다", () => {
    const result = run("def solution(g):\n    return input()\n");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain("input()");
  });

  it("케이스마다 모듈 전역이 새로 시작된다", () => {
    const code = "count = 0\ndef solution(_):\n    global count\n    count += 1\n    return count\n";
    expect(run(code)).toMatchObject({ value: 1 });
    expect(run(code)).toMatchObject({ value: 1 });
  });

  it("인자를 복사해서 넘긴다", () => {
    const code = "def solution(xs):\n    xs.append(4)\n    return xs\n";
    expect(run(code, [[1, 2, 3]])).toMatchObject({ value: [1, 2, 3, 4] });
  });

  it("recursionLimit 안의 깊은 재귀는 되고, 넘으면 RecursionError", () => {
    const code = "def solution(n):\n    def f(k):\n        return 0 if k == 0 else 1 + f(k - 1)\n    return f(n)\n";
    expect(run(code, [2000])).toMatchObject({ ok: true, value: 2000 });
    const deep = run(code, [5000]);
    expect(deep).toMatchObject({ ok: false, error: { type: "RecursionError" } });
  });

  it("너무 큰 정수는 반환할 수 없다 (JS와 결과를 맞추기 위해)", () => {
    expect(run("def solution(_):\n    return 2 ** 60\n").ok).toBe(false);
  });
});

describe.each(PROBLEMS.map((p) => [p.slug, p] as const))("Python 정답 코드: %s", (_, problem) => {
  it("모든 테스트케이스를 통과한다", async () => {
    const name = problem.slug.startsWith(`${problem.topic}-`)
      ? problem.slug.slice(problem.topic.length + 1)
      : problem.slug;
    const code = readFileSync(path.resolve(__dirname, "../../content-solutions", problem.topic, `${name}.py`), "utf8");
    const result = await judge({
      problem,
      mode: "submit",
      execute: async (args) => {
        const r = JSON.parse(
          runCase(code, "solution", JSON.stringify(args), problem.judge.recursionLimit, 10_000),
        ) as HarnessResult;
        return r.ok
          ? { kind: "ok", value: r.value, stdout: r.stdout, timeMs: r.timeMs }
          : { kind: "error", phase: r.phase, error: r.error, stdout: r.stdout, timeMs: r.timeMs };
      },
    });
    expect(result.verdict).toBe("accepted");
    expect(result.passed).toBe(result.total);
  });
});
