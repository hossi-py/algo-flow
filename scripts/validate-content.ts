/**
 * 모든 큐레이션 문제의 정답 코드(Python·JavaScript)를 브라우저와 같은 하네스로 실행해
 * 모든 테스트케이스의 expected와 일치하는지 검증한다. 하나라도 틀리면 exit code 1.
 *
 *   pnpm validate:content
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadPyodide } from "pyodide";
import { PROBLEMS } from "@/content/problems";
import { runJsCase, type HarnessResult } from "@/lib/runner/harness-js";
import { PYTHON_HARNESS } from "@/lib/runner/harness-python";
import { judge, type ExecOutcome } from "@/lib/runner/judge";
import type { Language, Problem } from "@/types";

const ROOT = path.resolve(import.meta.dirname, "..");
/** 정답 코드는 제한 시간의 1/4 안에 끝나야 한다 (사용자 풀이에 여유를 주기 위해) */
const SPEED_RATIO = 0.25;

function solutionFile(problem: Problem, language: Language): string {
  const name = problem.slug.startsWith(`${problem.topic}-`)
    ? problem.slug.slice(problem.topic.length + 1)
    : problem.slug;
  return path.join(ROOT, "content-solutions", problem.topic, `${name}.${language === "python" ? "py" : "js"}`);
}

function toOutcome(result: HarnessResult): ExecOutcome {
  return result.ok
    ? { kind: "ok", value: result.value, stdout: result.stdout, timeMs: result.timeMs }
    : { kind: "error", phase: result.phase, error: result.error, stdout: result.stdout, timeMs: result.timeMs };
}

async function main() {
  const started = Date.now();
  const pyodide = await loadPyodide();
  pyodide.runPython(PYTHON_HARNESS);
  const runPython = pyodide.globals.get("run_case") as (
    code: string,
    fn: string,
    argsJson: string,
    recursionLimit: number,
    stdoutLimit: number,
  ) => string;
  console.log(`Pyodide ${pyodide.version} 준비 (${Date.now() - started}ms)\n`);

  const failures: string[] = [];

  for (const problem of PROBLEMS) {
    for (const language of ["python", "javascript"] as const) {
      const file = solutionFile(problem, language);
      const label = `${problem.slug} [${language}]`;
      if (!existsSync(file)) {
        failures.push(`${label}: 정답 파일이 없어요 (${path.relative(ROOT, file)})`);
        continue;
      }
      const code = readFileSync(file, "utf8");
      let slowest = 0;
      const result = await judge({
        problem,
        mode: "submit",
        execute: async (args) => {
          const raw =
            language === "python"
              ? (JSON.parse(
                  runPython(code, "solution", JSON.stringify(args), problem.judge.recursionLimit, 64 * 1024),
                ) as HarnessResult)
              : runJsCase({ code, functionName: "solution", args, stdoutLimit: 64 * 1024 });
          slowest = Math.max(slowest, raw.timeMs);
          return toOutcome(raw);
        },
      });

      const limit = problem.judge.timeLimitMs * SPEED_RATIO;
      if (result.verdict !== "accepted") {
        const bad = result.results.find((r) => r.verdict !== "passed");
        failures.push(`${label}: ${result.verdict} (${bad?.testCaseId ?? "?"}) ${bad?.error?.message ?? ""}`.trim());
      } else if (slowest > limit) {
        failures.push(`${label}: 가장 느린 케이스 ${slowest.toFixed(1)}ms > 허용 ${limit}ms`);
      }
      const mark = result.verdict === "accepted" && slowest <= limit ? "✓" : "✗";
      console.log(`${mark} ${label.padEnd(34)} ${result.passed}/${result.total}  최대 ${slowest.toFixed(1)}ms`);
    }
  }

  console.log("");
  if (failures.length > 0) {
    console.error(`검증 실패 ${failures.length}건:\n${failures.map((f) => `  - ${f}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`모든 문제(${PROBLEMS.length}개) 검증 통과`);
}

void main();
