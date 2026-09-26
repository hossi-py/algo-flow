/**
 * 모든 큐레이션 문제의 정답 코드(Python·JavaScript·Java)를 브라우저와 같은 하네스로 실행해
 * 모든 테스트케이스의 expected와 일치하는지 검증한다. 하나라도 틀리면 exit code 1.
 * Java는 JDK(JAVA_HOME 또는 ALGOFLOW_JDK)가 있을 때만 검증하고, 없으면 건너뛴다고 알려 준다.
 * (브라우저의 CheerpJ와 속도가 달라서 Java는 정답 여부만 보고 속도는 따지지 않는다)
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
import { hasJdk, runJavaBatch } from "./java-tools";

const ROOT = path.resolve(import.meta.dirname, "..");
/** 정답 코드는 제한 시간의 1/4 안에 끝나야 한다 (사용자 풀이에 여유를 주기 위해) */
const SPEED_RATIO = 0.25;
/**
 * CI 러너는 작성할 때 쓰는 PC보다 느리고 실행마다 속도가 흔들려서, CI에서는 "제한 시간 안"만 실패로 보고
 * 1/4을 넘는 건 경고로만 남긴다 (정답 여부는 똑같이 엄격하게 본다).
 */
const IN_CI = process.env.CI === "true";
const FAIL_RATIO = IN_CI ? 1 : SPEED_RATIO;
/** GitHub Actions에서는 실패·경고를 주석으로 남겨 로그인하지 않아도 PR·실행 화면에서 보이게 한다 */
const annotate = (level: "error" | "warning", message: string) => {
  if (process.env.GITHUB_ACTIONS === "true") {
    console.log(`::${level} title=콘텐츠 검증::${message.replace(/\s+/g, " ")}`);
  }
};
const EXTENSIONS: Record<Language, string> = { python: "py", javascript: "js", java: "java" };

function solutionFile(problem: Problem, language: Language): string {
  const name = problem.slug.startsWith(`${problem.topic}-`)
    ? problem.slug.slice(problem.topic.length + 1)
    : problem.slug;
  return path.join(ROOT, "content-solutions", problem.topic, `${name}.${EXTENSIONS[language]}`);
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
  console.log(`Pyodide ${pyodide.version} 준비 (${Date.now() - started}ms)`);
  const withJava = hasJdk();
  const languages: Language[] = withJava ? ["python", "javascript", "java"] : ["python", "javascript"];
  console.log(
    withJava
      ? "JDK 발견: Java 정답도 검증해요\n"
      : "JDK가 없어서 Java 정답 검증은 건너뛰어요 (JAVA_HOME을 지정하면 함께 검증해요)\n",
  );

  const failures: string[] = [];

  for (const problem of PROBLEMS) {
    for (const language of languages) {
      const file = solutionFile(problem, language);
      const label = `${problem.slug} [${language}]`;
      if (!existsSync(file)) {
        failures.push(`${label}: 정답 파일이 없어요 (${path.relative(ROOT, file)})`);
        continue;
      }
      const code = readFileSync(file, "utf8");
      let slowest = 0;
      // Java는 JVM을 한 번 띄워 모든 케이스를 미리 돌려 둔다
      const javaResults =
        language === "java"
          ? new Map(
              runJavaBatch(
                code,
                problem.testCases.map((t) => t.args),
              ).map((r, i) => [problem.testCases[i]?.id, r]),
            )
          : null;
      const result = await judge({
        problem,
        mode: "submit",
        execute: async (args, testCase) => {
          const raw = javaResults
            ? (javaResults.get(testCase.id) as HarnessResult)
            : language === "python"
              ? (JSON.parse(
                  runPython(code, "solution", JSON.stringify(args), problem.judge.recursionLimit, 64 * 1024),
                ) as HarnessResult)
              : runJsCase({ code, functionName: "solution", args, stdoutLimit: 64 * 1024 });
          slowest = Math.max(slowest, raw.timeMs);
          return toOutcome(raw);
        },
      });

      const limit = language === "java" ? Infinity : problem.judge.timeLimitMs * FAIL_RATIO;
      const target = language === "java" ? Infinity : problem.judge.timeLimitMs * SPEED_RATIO;
      if (result.verdict !== "accepted") {
        const bad = result.results.find((r) => r.verdict !== "passed");
        failures.push(`${label}: ${result.verdict} (${bad?.testCaseId ?? "?"}) ${bad?.error?.message ?? ""}`.trim());
      } else if (slowest > limit) {
        failures.push(`${label}: 가장 느린 케이스 ${slowest.toFixed(1)}ms > 허용 ${limit}ms`);
      } else if (slowest > target) {
        annotate(
          "warning",
          `${label}: 가장 느린 케이스 ${slowest.toFixed(1)}ms (작성 기준 ${target}ms 초과, 제한 ${problem.judge.timeLimitMs}ms 안)`,
        );
      }
      const mark = result.verdict === "accepted" && slowest <= limit ? "✓" : "✗";
      console.log(`${mark} ${label.padEnd(34)} ${result.passed}/${result.total}  최대 ${slowest.toFixed(1)}ms`);
    }
  }

  console.log("");
  if (failures.length > 0) {
    for (const failure of failures) annotate("error", failure);
    console.error(`검증 실패 ${failures.length}건:\n${failures.map((f) => `  - ${f}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`모든 문제(${PROBLEMS.length}개) 검증 통과`);
}

void main();
