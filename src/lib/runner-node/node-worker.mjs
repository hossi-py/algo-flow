// 서버 전용 Python 실행 워커 (worker_threads).
// AI가 만든 정답 코드를 브라우저와 같은 하네스(src/lib/runner/harness-python.ts)로 실행한다.
// 번들하지 않고 node-runner.ts가 파일 경로로 띄운다. 무한 루프는 부모가 worker.terminate()로 끊는다.
//
// 부모 → 워커: { type: "run", id, code, argsJson, recursionLimit, stdoutLimit } | { type: "check", id, code }
// 워커 → 부모: { type: "ready", version } | { type: "init-error", message } | { type: "result", id, raw }
import { parentPort, workerData } from "node:worker_threads";
import { loadPyodide } from "pyodide";

const { harness, checker, hashSeed } = workerData;

let runCase = null;
let checkCode = null;

try {
  const pyodide = await loadPyodide({
    env: { PYTHONHASHSEED: String(hashSeed) },
    stdout: () => {},
    stderr: () => {},
  });
  pyodide.runPython(harness);
  pyodide.runPython(checker);
  runCase = pyodide.globals.get("run_case");
  checkCode = pyodide.globals.get("check_code");
  // 실행할 코드가 JS 세계(process, 파일 시스템 등)에 닿지 못하도록 브리지 모듈을 막는다
  pyodide.runPython(
    [
      "import sys",
      "for _name in ('js', 'pyodide', 'pyodide_js', '_pyodide', 'pyodide.ffi'):",
      "    sys.modules[_name] = None",
    ].join("\n"),
  );
  parentPort.postMessage({ type: "ready", version: pyodide.version });
} catch (error) {
  parentPort.postMessage({ type: "init-error", message: error instanceof Error ? error.message : String(error) });
}

parentPort.on("message", (message) => {
  if (message.type === "run") {
    const raw = runCase(message.code, "solution", message.argsJson, message.recursionLimit, message.stdoutLimit);
    parentPort.postMessage({ type: "result", id: message.id, raw });
  } else if (message.type === "check") {
    parentPort.postMessage({ type: "result", id: message.id, raw: checkCode(message.code) });
  }
});
