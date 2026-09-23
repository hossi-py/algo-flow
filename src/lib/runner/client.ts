"use client";

import type { JsonValue, JudgeConfig, Language, WorkerRequest, WorkerResponse } from "@/types";
import { ENGINE_INIT_TIMEOUT_MS, PYODIDE_INDEX_URL, STDOUT_LIMIT } from "./config";
import { PYTHON_HARNESS } from "./harness-python";
import type { ExecOutcome } from "./judge";

export type EngineStatus = "idle" | "loading" | "ready" | "error";

export interface EngineState {
  status: EngineStatus;
  /** 준비된 엔진 이름. 예: "Python (Pyodide 314.0.7)" */
  runtime: string | null;
  error: string | null;
}

type CaseResult = Extract<WorkerResponse, { type: "case-result" }>;

interface WorkerHandle {
  worker: Worker;
  ready: Promise<void>;
  pending: Map<string, (result: CaseResult | { crashed: string }) => void>;
}

function createWorker(language: Language): Worker {
  if (language === "python") {
    // Pyodide 314+는 module 워커가 필요한데 Turbopack은 워커를 classic으로 띄우므로, 번들하지 않은 정적 파일을 쓴다
    return new Worker("/workers/pyodide.worker.mjs", { type: "module", name: "pyodide" });
  }
  // new URL(..., import.meta.url) 형태여야 번들러가 워커를 별도 번들로 만든다
  return new Worker(new URL("../../workers/js.worker.ts", import.meta.url), { name: "js-runner" });
}

let runSeq = 0;

/**
 * 언어별 실행 엔진. 워커 하나를 유지하고, 시간 초과·충돌 시 워커를 종료한 뒤 곧바로 새 워커를 띄워 둔다.
 * (Pyodide 워커는 수십 MB라 여분 워커를 상시 띄우지 않고, 교체가 필요할 때 즉시 재생성한다)
 */
export class LanguageRunner {
  private handle: WorkerHandle | null = null;
  private state: EngineState = { status: "idle", runtime: null, error: null };
  private listeners = new Set<(state: EngineState) => void>();

  constructor(private readonly language: Language) {}

  getState(): EngineState {
    return this.state;
  }

  subscribe(listener: (state: EngineState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(next: EngineState) {
    this.state = next;
    for (const listener of this.listeners) listener(next);
  }

  /** 엔진을 미리 준비한다 (Python은 첫 로딩에 몇 초 걸린다) */
  warmUp(): Promise<void> {
    return this.ensureHandle().ready.catch(() => undefined);
  }

  private ensureHandle(): WorkerHandle {
    if (this.handle) return this.handle;

    const worker = createWorker(this.language);
    const pending: WorkerHandle["pending"] = new Map();
    this.setState({ status: "loading", runtime: null, error: null });

    const ready = new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error("실행 엔진을 준비하는 데 너무 오래 걸려요. 네트워크를 확인해 주세요."));
      }, ENGINE_INIT_TIMEOUT_MS);

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        if (message.type === "ready") {
          window.clearTimeout(timer);
          this.setState({ status: "ready", runtime: message.runtime, error: null });
          resolve();
        } else if (message.type === "init-error") {
          window.clearTimeout(timer);
          reject(new Error(message.message));
        } else {
          const callback = pending.get(message.runId);
          pending.delete(message.runId);
          callback?.(message);
        }
      };

      worker.onerror = (event) => {
        window.clearTimeout(timer);
        const reason = event.message || "실행 엔진이 멈췄어요";
        for (const callback of pending.values()) callback({ crashed: reason });
        pending.clear();
        // 준비가 끝난 뒤 죽은 워커는 버리고, 다음 실행 때 새로 만든다
        if (this.handle?.worker === worker) {
          this.handle = null;
          worker.terminate();
          this.setState({ status: "idle", runtime: null, error: null });
        }
        reject(new Error(reason));
      };
    });

    ready.catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      this.setState({ status: "error", runtime: null, error: message });
      if (this.handle?.worker === worker) this.handle = null;
      worker.terminate();
    });

    const initMessage: WorkerRequest =
      this.language === "python"
        ? { type: "init", indexURL: PYODIDE_INDEX_URL, harness: PYTHON_HARNESS }
        : { type: "init" };
    worker.postMessage(initMessage);

    this.handle = { worker, ready, pending };
    return this.handle;
  }

  /** 현재 워커를 버리고 새 워커를 준비한다 (무한 루프를 멈추는 유일하게 확실한 방법) */
  private replaceWorker(handle: WorkerHandle) {
    handle.worker.terminate();
    for (const callback of handle.pending.values()) callback({ crashed: "실행이 중단됐어요" });
    handle.pending.clear();
    if (this.handle === handle) {
      this.handle = null;
      void this.warmUp();
    }
  }

  async runCase(
    code: string,
    args: JsonValue[],
    judge: Pick<JudgeConfig, "timeLimitMs" | "recursionLimit">,
  ): Promise<ExecOutcome> {
    const handle = this.ensureHandle();
    try {
      await handle.ready; // 엔진 준비 시간은 제한 시간에 포함하지 않는다
    } catch (error) {
      return { kind: "crash", message: error instanceof Error ? error.message : String(error) };
    }

    return new Promise<ExecOutcome>((resolve) => {
      const runId = `run-${++runSeq}`;
      const started = performance.now();
      const timer = window.setTimeout(() => {
        handle.pending.delete(runId);
        resolve({ kind: "timeout", timeMs: judge.timeLimitMs });
        this.replaceWorker(handle);
      }, judge.timeLimitMs);

      handle.pending.set(runId, (result) => {
        window.clearTimeout(timer);
        if ("crashed" in result) {
          resolve({ kind: "crash", message: result.crashed });
          return;
        }
        if (result.ok) {
          resolve({ kind: "ok", value: result.value, stdout: result.stdout, timeMs: result.timeMs });
        } else {
          resolve({
            kind: "error",
            phase: result.phase,
            error: result.error,
            stdout: result.stdout,
            timeMs: result.timeMs || performance.now() - started,
          });
        }
      });

      const request: WorkerRequest = {
        type: "run-case",
        runId,
        code,
        functionName: "solution",
        args,
        recursionLimit: judge.recursionLimit,
        stdoutLimitBytes: STDOUT_LIMIT,
      };
      handle.worker.postMessage(request);
    });
  }
}

const runners = new Map<Language, LanguageRunner>();

/** 언어별 실행 엔진 (브라우저 탭당 하나) */
export function getRunner(language: Language): LanguageRunner {
  let runner = runners.get(language);
  if (!runner) {
    runner = new LanguageRunner(language);
    runners.set(language, runner);
  }
  return runner;
}
