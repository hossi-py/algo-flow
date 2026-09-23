import { describe, expect, it } from "vitest";
import { flowerZones } from "@/content/problems/dfs/flower-zones";
import { isAnswerCorrect } from "@/lib/runner/compare";
import { runJsCase } from "@/lib/runner/harness-js";
import { judge, type CaseExecutor, type ExecOutcome } from "@/lib/runner/judge";
import type { JsonValue } from "@/types";

/** 워커 대신 JS 하네스를 바로 쓰는 실행기 */
function jsExecutor(code: string): CaseExecutor {
  return async (args) => {
    const result = runJsCase({ code, functionName: "solution", args, stdoutLimit: 10_000 });
    if (result.ok) return { kind: "ok", value: result.value, stdout: result.stdout, timeMs: result.timeMs };
    return { kind: "error", phase: result.phase, error: result.error, stdout: result.stdout, timeMs: result.timeMs };
  };
}

const CORRECT = `
function solution(garden) {
  const n = garden.length, m = garden[0].length;
  const seen = garden.map((row) => [...row].map(() => false));
  const dfs = (r, c) => {
    seen[r][c] = true;
    let size = 1;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < m && garden[nr][nc] === "1" && !seen[nr][nc]) size += dfs(nr, nc);
    }
    return size;
  };
  const sizes = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < m; c++) if (garden[r][c] === "1" && !seen[r][c]) sizes.push(dfs(r, c));
  return sizes.sort((a, b) => a - b);
}`;

/** 흔한 실수: 대각선까지 연결로 센다 */
const DIAGONAL_BUG = CORRECT.replace(
  "[[-1, 0], [1, 0], [0, -1], [0, 1]]",
  "[[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1], [-1, -1], [1, -1], [-1, 1]]",
);

describe("judge — 꽃밭 구역 나누기", () => {
  it("예제 실행은 예제 2개만 채점하고 모두 공개한다", async () => {
    const result = await judge({ problem: flowerZones, mode: "run", execute: jsExecutor(CORRECT) });
    expect(result.verdict).toBe("accepted");
    expect(result.total).toBe(2);
    expect(result.results.every((r) => r.revealed)).toBe(true);
  });

  it("올바른 코드를 제출하면 12/12 정답", async () => {
    const progress: number[] = [];
    const result = await judge({
      problem: flowerZones,
      mode: "submit",
      execute: jsExecutor(CORRECT),
      onProgress: (done) => progress.push(done),
    });
    expect(result).toMatchObject({ verdict: "accepted", passed: 12, total: 12 });
    expect(progress).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("대각선 버그는 오답이고, 처음 틀린 숨은 케이스만 입력·기대값을 공개한다", async () => {
    const result = await judge({ problem: flowerZones, mode: "submit", execute: jsExecutor(DIAGONAL_BUG) });
    expect(result.verdict).toBe("wrong-answer");
    const failed = result.results.filter((r) => r.verdict === "failed");
    expect(failed.length).toBeGreaterThan(1);
    const revealedHidden = result.results.filter((r) => r.visibility === "hidden" && r.revealed);
    expect(revealedHidden).toHaveLength(1);
    expect(revealedHidden[0]?.testCaseId).toBe("hid-2");
    expect(revealedHidden[0]?.args).toEqual([["10", "01"]]);
    expect(revealedHidden[0]?.actual).toEqual([2]);
    // 공개하지 않은 숨은 케이스는 실제 값도 숨긴다
    expect(failed.filter((r) => !r.revealed).every((r) => r.actual === undefined)).toBe(true);
  });

  it("문법 오류는 첫 케이스에서 멈추고 syntax-error", async () => {
    const result = await judge({
      problem: flowerZones,
      mode: "submit",
      execute: jsExecutor("function solution(g) {\n  return [\n"),
    });
    expect(result.verdict).toBe("syntax-error");
    expect(result.compileError?.line).toBeGreaterThan(0);
    expect(result.results.slice(1).every((r) => r.verdict === "not-run")).toBe(true);
  });

  it("실행 오류는 runtime-error", async () => {
    const result = await judge({
      problem: flowerZones,
      mode: "run",
      execute: jsExecutor("function solution(g) { return g[10].length; }"),
    });
    expect(result.verdict).toBe("runtime-error");
    expect(result.results[0]?.error?.type).toBe("TypeError");
  });

  it("시간 초과가 나면 나머지 케이스는 실행하지 않는다", async () => {
    let calls = 0;
    const execute: CaseExecutor = async (args): Promise<ExecOutcome> => {
      calls += 1;
      return calls === 3 ? { kind: "timeout", timeMs: 2000 } : jsExecutor(CORRECT)(args, flowerZones.testCases[0]!);
    };
    const result = await judge({ problem: flowerZones, mode: "submit", execute });
    expect(result.verdict).toBe("time-limit-exceeded");
    expect(calls).toBe(3);
    expect(result.results[2]?.verdict).toBe("time-limit-exceeded");
    expect(result.results.slice(3).every((r) => r.verdict === "not-run")).toBe(true);
  });

  it("엔진 충돌은 internal-error로 따로 알린다", async () => {
    const result = await judge({
      problem: flowerZones,
      mode: "run",
      execute: async () => ({ kind: "crash", message: "네트워크 오류" }),
    });
    expect(result.verdict).toBe("internal-error");
    expect(result.engineError).toBe("네트워크 오류");
  });
});

describe("isAnswerCorrect", () => {
  const exact = { type: "exact" } as const;
  it("exact: 구조와 값이 같아야 한다 (1과 1.0은 같다)", () => {
    expect(isAnswerCorrect([1, 2], [1, 2], exact)).toBe(true);
    expect(isAnswerCorrect([2, 1], [1, 2], exact)).toBe(false);
    expect(isAnswerCorrect({ a: [1], b: null }, { b: null, a: [1.0] }, exact)).toBe(true);
    expect(isAnswerCorrect([1], [[1]] as JsonValue, exact)).toBe(false);
  });

  it("unordered: 최상위 순서만 무시한다", () => {
    const mode = { type: "unordered" } as const;
    expect(isAnswerCorrect([[1, 2], [3]], [[3], [1, 2]], mode)).toBe(true);
    expect(isAnswerCorrect([[2, 1], [3]], [[3], [1, 2]], mode)).toBe(false);
    expect(isAnswerCorrect([1, 1, 2], [1, 2, 2], mode)).toBe(false);
  });

  it("float: 허용 오차 이내면 같다", () => {
    const mode = { type: "float", tolerance: 1e-6 } as const;
    expect(isAnswerCorrect(0.1 + 0.2, 0.3, mode)).toBe(true);
    expect(isAnswerCorrect(0.31, 0.3, mode)).toBe(false);
  });
});
