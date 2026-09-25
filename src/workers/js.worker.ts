import { runJsCase } from "@/lib/runner/harness-js";
import type { WorkerRequest, WorkerResponse } from "@/types";

/** DOM 타입과 충돌하지 않도록 워커 전역에서 쓰는 부분만 선언 */
interface WorkerScope {
  postMessage(message: WorkerResponse): void;
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
}

const scope = self as unknown as WorkerScope;

function reply(message: WorkerResponse) {
  scope.postMessage(message);
}

scope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (message.type === "init") {
    reply({ type: "ready", runtime: "JavaScript" });
    return;
  }
  const result = runJsCase({
    code: message.code,
    functionName: message.functionName,
    args: message.args,
    stdoutLimit: message.stdoutLimitBytes,
  });
  reply({ type: "case-result", runId: message.runId, ...result });
};
