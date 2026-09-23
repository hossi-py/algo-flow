// Python 실행 워커 (ES module 워커).
// Turbopack은 워커를 classic 워커로 띄우는데 Pyodide 314+는 module 워커에서만 동작하므로,
// 이 파일은 번들하지 않고 public/에서 그대로 제공한다.
// 채점 하네스(Python 코드)는 src/lib/runner/harness-python.ts에서 init 메시지로 전달받는다.
// 메시지 형식은 src/types/judge.ts의 WorkerRequest / WorkerResponse와 같다.

let runCase = null;

async function init(indexURL, harness) {
  const { loadPyodide } = await import(`${indexURL}pyodide.mjs`);
  const pyodide = await loadPyodide({ indexURL, stdout: () => {}, stderr: () => {} });
  pyodide.runPython(harness);
  runCase = pyodide.globals.get("run_case");
  self.postMessage({ type: "ready", runtime: `Python (Pyodide ${pyodide.version})` });
}

self.onmessage = async (event) => {
  const message = event.data;

  if (message.type === "init") {
    try {
      if (!message.indexURL || !message.harness) throw new Error("indexURL과 harness가 필요해요");
      await init(message.indexURL, message.harness);
    } catch (error) {
      self.postMessage({ type: "init-error", message: error instanceof Error ? error.message : String(error) });
    }
    return;
  }

  if (!runCase) {
    self.postMessage({
      type: "case-result",
      runId: message.runId,
      ok: false,
      phase: "runtime",
      error: { type: "EngineError", message: "Python 엔진이 아직 준비되지 않았어요", line: null, traceback: "" },
      stdout: "",
      timeMs: 0,
    });
    return;
  }

  const raw = runCase(
    message.code,
    message.functionName,
    JSON.stringify(message.args),
    message.recursionLimit,
    message.stdoutLimitBytes,
  );
  self.postMessage({ type: "case-result", runId: message.runId, ...JSON.parse(raw) });
};
