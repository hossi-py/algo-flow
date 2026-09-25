import path from "node:path";
import { Worker } from "node:worker_threads";
import { PYTHON_STATIC_CHECK } from "@/lib/ai/static-check";
import type { ExecOutcome } from "@/lib/runner/judge";
import type { HarnessResult } from "@/lib/runner/harness-js";
import { PYTHON_HARNESS } from "@/lib/runner/harness-python";
import { STDOUT_LIMIT } from "@/lib/runner/config";
import type { JsonValue } from "@/types";

/**
 * 서버에서 Python 코드를 실행한다 (AI 생성 문제의 정답 코드 검증용).
 * Pyodide를 worker_threads 워커에서 돌리고, 시간 초과면 워커를 종료한 뒤 다음 실행 때 새로 띄운다.
 */
export interface PythonRunner {
  /** AST 정적 검사. 문제점 목록 (빈 배열이면 통과) */
  check(code: string): Promise<string[]>;
  run(code: string, args: JsonValue[], options: { recursionLimit: number; timeoutMs: number }): Promise<ExecOutcome>;
  dispose(): Promise<void>;
}

const WORKER_FILE = path.join(process.cwd(), "src", "lib", "runner-node", "node-worker.mjs");
const INIT_TIMEOUT_MS = 60_000;
/** 워커 힙 상한 (정답 코드가 메모리를 과하게 쓰면 워커만 죽는다) */
const WORKER_HEAP_MB = 512;

type WorkerMessage =
  | { type: "ready"; version: string }
  | { type: "init-error"; message: string }
  | { type: "result"; id: number; raw: string };

interface Pending {
  resolve: (raw: string) => void;
  reject: (error: Error) => void;
}

class WorkerHandle {
  readonly worker: Worker;
  readonly ready: Promise<void>;
  private pending = new Map<number, Pending>();
  private nextId = 1;
  private dead = false;

  constructor(hashSeed: number) {
    this.worker = new Worker(WORKER_FILE, {
      workerData: { harness: PYTHON_HARNESS, checker: PYTHON_STATIC_CHECK, hashSeed },
      // 실행되는 코드가 서버 비밀값(API 키 등)을 볼 수 없도록 환경 변수를 비운다
      env: {},
      resourceLimits: { maxOldGenerationSizeMb: WORKER_HEAP_MB },
    });
    this.ready = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Python 엔진 준비 시간이 초과됐어요")), INIT_TIMEOUT_MS);
      this.worker.on("message", (message: WorkerMessage) => {
        if (message.type === "ready") {
          clearTimeout(timer);
          resolve();
        } else if (message.type === "init-error") {
          clearTimeout(timer);
          reject(new Error(`Python 엔진을 시작하지 못했어요: ${message.message}`));
        } else if (message.type === "result") {
          const entry = this.pending.get(message.id);
          this.pending.delete(message.id);
          entry?.resolve(message.raw);
        }
      });
      const fail = (error: Error) => {
        clearTimeout(timer);
        this.dead = true;
        reject(error);
        for (const entry of this.pending.values()) entry.reject(error);
        this.pending.clear();
      };
      this.worker.on("error", fail);
      this.worker.on("exit", (code) => fail(new Error(`Python 워커가 종료됐어요 (code ${code})`)));
    });
    // 준비 실패는 호출하는 쪽(ready를 기다리는 곳)에서 처리한다
    this.ready.catch(() => {});
  }

  get alive() {
    return !this.dead;
  }

  send(message: Record<string, unknown>): Promise<string> {
    const id = this.nextId++;
    return new Promise<string>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ ...message, id });
    });
  }

  async terminate() {
    this.dead = true;
    await this.worker.terminate();
  }
}

export function createNodePythonRunner({ hashSeed = 0 }: { hashSeed?: number } = {}): PythonRunner {
  let handle: WorkerHandle | null = null;
  // 한 번에 하나씩 실행한다 (시간 초과로 워커를 끊을 때 다른 실행이 함께 죽지 않도록)
  let queue: Promise<unknown> = Promise.resolve();
  const serial = <T>(task: () => Promise<T>): Promise<T> => {
    const result = queue.then(task, task);
    queue = result.catch(() => {});
    return result;
  };

  async function getHandle(): Promise<WorkerHandle> {
    if (!handle || !handle.alive) handle = new WorkerHandle(hashSeed);
    await handle.ready;
    return handle;
  }

  return {
    check(code) {
      return serial(async () => {
        const current = await getHandle();
        return JSON.parse(await current.send({ type: "check", code })) as string[];
      });
    },

    run(code, args, options) {
      return serial(() => runOnce(code, args, options));
    },

    async dispose() {
      await queue;
      if (handle) await handle.terminate();
      handle = null;
    },
  };

  async function runOnce(
    code: string,
    args: JsonValue[],
    { recursionLimit, timeoutMs }: { recursionLimit: number; timeoutMs: number },
  ): Promise<ExecOutcome> {
    let current: WorkerHandle;
    try {
      current = await getHandle();
    } catch (error) {
      return { kind: "crash", message: error instanceof Error ? error.message : String(error) };
    }
    const started = performance.now();
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<"timeout">((resolve) => {
      timer = setTimeout(() => resolve("timeout"), timeoutMs);
    });
    try {
      const raw = await Promise.race([
        current.send({ type: "run", code, argsJson: JSON.stringify(args), recursionLimit, stdoutLimit: STDOUT_LIMIT }),
        timeout,
      ]);
      if (raw === "timeout") {
        await current.terminate();
        if (handle === current) handle = null;
        return { kind: "timeout", timeMs: performance.now() - started };
      }
      const result = JSON.parse(raw) as HarnessResult;
      return result.ok
        ? { kind: "ok", value: result.value, stdout: result.stdout, timeMs: result.timeMs }
        : { kind: "error", phase: result.phase, error: result.error, stdout: result.stdout, timeMs: result.timeMs };
    } catch (error) {
      return { kind: "crash", message: error instanceof Error ? error.message : String(error) };
    } finally {
      clearTimeout(timer);
    }
  }
}
