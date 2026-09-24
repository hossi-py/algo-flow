// Java 실행 워커 (classic 워커, 번들하지 않고 public/에서 그대로 제공).
// CheerpJ(WebAssembly JVM)로 ECJ 컴파일러와 채점 하네스(public/java/algoflow-runner.jar)를 불러,
// 사용자 코드를 한 번 컴파일하고 케이스마다 실행한다. 하네스 소스는 java-runtime/src/algoflow/Runner.java.
// 메시지 형식은 src/types/judge.ts의 WorkerRequest / WorkerResponse와 같다.

let Runner = null;
/** 마지막으로 컴파일한 코드와 그 결과 (같은 코드면 다시 컴파일하지 않는다) */
let lastCode = null;
let lastDir = null;
let lastCompile = null;
let compileSeq = 0;

async function init(loaderUrl, version) {
  importScripts(loaderUrl);
  await cheerpjInit({ version, status: "none" });
  // cheerpjRunLibrary는 페이지(워커)당 한 번만 부를 수 있어서, 필요한 jar를 한 클래스패스로 묶는다
  const lib = await cheerpjRunLibrary("/app/java/algoflow-runner.jar:/app/java/ecj.jar");
  Runner = await lib.algoflow.Runner;
  const javaVersion = await Runner.prepareBrowserSystem("/files/jdk");
  // 컴파일러를 한 번 데워 둔다 (첫 컴파일은 클래스 로딩 때문에 느리다)
  await Runner.compile("class Solution { int solution() { return 0; } }", "/files/warmup");
  self.postMessage({ type: "ready", runtime: `Java ${String(javaVersion).split(".")[0]} (CheerpJ)` });
}

function engineError(runId, message) {
  self.postMessage({
    type: "case-result",
    runId,
    ok: false,
    phase: "runtime",
    error: { type: "EngineError", message, line: null, traceback: "" },
    stdout: "",
    timeMs: 0,
  });
}

self.onmessage = async (event) => {
  const message = event.data;

  if (message.type === "init") {
    try {
      if (!message.indexURL) throw new Error("CheerpJ 로더 주소가 필요해요");
      await init(message.indexURL, message.javaVersion ?? 11);
    } catch (error) {
      self.postMessage({ type: "init-error", message: error instanceof Error ? error.message : String(error) });
    }
    return;
  }

  if (!Runner) {
    engineError(message.runId, "Java 엔진이 아직 준비되지 않았어요");
    return;
  }

  try {
    if (message.code !== lastCode) {
      const dir = `/files/run${++compileSeq}`;
      lastCompile = JSON.parse(await Runner.compile(message.code, dir));
      lastCode = message.code;
      lastDir = dir;
    }
    if (!lastCompile.ok) {
      self.postMessage({ type: "case-result", runId: message.runId, ...lastCompile });
      return;
    }
    const raw = await Runner.run(lastDir, JSON.stringify(message.args), message.stdoutLimitBytes);
    self.postMessage({ type: "case-result", runId: message.runId, ...JSON.parse(raw) });
  } catch (error) {
    engineError(message.runId, error instanceof Error ? error.message : String(error));
  }
};
