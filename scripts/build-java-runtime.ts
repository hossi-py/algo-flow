// Java 채점 하네스(java-runtime/src)를 public/java/algoflow-runner.jar로 빌드한다.
// JDK가 필요하다: JAVA_HOME(또는 ALGOFLOW_JDK)에 JDK 11 이상을 지정하고 `pnpm build:java`.
// 결과 jar는 저장소에 커밋한다 (브라우저의 CheerpJ가 그대로 불러 쓴다).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { javaTool } from "./java-tools";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "java-runtime", "src");
const ECJ = path.join(ROOT, "public", "java", "ecj.jar");
const OUT = path.join(ROOT, "public", "java", "algoflow-runner.jar");

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? sources(full) : name.endsWith(".java") ? [full] : [];
  });
}

const classes = mkdtempSync(path.join(tmpdir(), "algoflow-java-"));
try {
  execFileSync(
    javaTool("javac"),
    ["--release", "11", "-encoding", "UTF-8", "-cp", ECJ, "-d", classes, ...sources(SRC)],
    {
      stdio: "inherit",
    },
  );
  execFileSync(javaTool("jar"), ["--create", "--file", OUT, "-C", classes, "."], { stdio: "inherit" });
  console.log(`✓ ${path.relative(ROOT, OUT)}`);
} finally {
  rmSync(classes, { recursive: true, force: true });
}
