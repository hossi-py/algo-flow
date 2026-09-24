/**
 * Node에서 진짜 JDK로 Java 채점 하네스(public/java/algoflow-runner.jar)를 돌리는 도구.
 * JAVA_HOME 또는 ALGOFLOW_JDK에 JDK 11 이상이 있어야 한다 (없으면 Java 검증을 건너뛴다).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { HarnessResult } from "@/lib/runner/harness-js";
import type { JsonValue } from "@/types";

const ROOT = path.resolve(import.meta.dirname, "..");
const JARS = ["algoflow-runner.jar", "ecj.jar"].map((name) => path.join(ROOT, "public", "java", name));

export function javaHome(): string {
  const home = process.env.ALGOFLOW_JDK ?? process.env.JAVA_HOME;
  if (!home || !existsSync(path.join(home, "bin"))) {
    throw new Error("JDK를 찾을 수 없어요. JAVA_HOME(또는 ALGOFLOW_JDK)에 JDK 11 이상 경로를 지정해 주세요.");
  }
  return home;
}

export function javaTool(name: string): string {
  return path.join(javaHome(), "bin", process.platform === "win32" ? `${name}.exe` : name);
}

export function hasJdk(): boolean {
  try {
    javaHome();
    return true;
  } catch {
    return false;
  }
}

/**
 * Java 코드를 한 번 컴파일하고 인자 목록마다 실행한다 (브라우저와 같은 Runner.compile / Runner.run).
 * 컴파일 오류면 모든 케이스에 같은 compile 오류를 돌려준다.
 */
export function runJavaBatch(code: string, argsList: JsonValue[][], stdoutLimit = 64 * 1024): HarnessResult[] {
  const dir = mkdtempSync(path.join(tmpdir(), "algoflow-java-"));
  try {
    const source = path.join(dir, "Solution.java");
    const cases = path.join(dir, "cases.json");
    writeFileSync(source, code);
    writeFileSync(cases, JSON.stringify(argsList));
    const out = execFileSync(
      javaTool("java"),
      [
        "-Xss16m",
        "-Dfile.encoding=UTF-8",
        "-cp",
        JARS.join(path.delimiter),
        "algoflow.Runner",
        path.join(dir, "run"),
        source,
        cases,
        String(stdoutLimit),
      ],
      { encoding: "utf8", maxBuffer: 1024 * 1024 * 1024 },
    );
    const [compiled, ...results] = out
      .trim()
      .split(/\r?\n/)
      .map((line) => JSON.parse(line) as HarnessResult | { ok: true; timeMs: number });
    if (!compiled || !compiled.ok) return argsList.map(() => compiled as HarnessResult);
    return results as HarnessResult[];
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
