import "server-only";
import { createNodePythonRunner, type PythonRunner } from "@/lib/runner-node/node-runner";
import type { GeneratedProblem } from "@/types";
import { isAiMock } from "./client";
import { draftWithClaude, GenerationRefusedError } from "./generator";
import { mockDraft } from "./mock";
import { runGenerationPipeline } from "./pipeline";
import { getGeneratedStore } from "./store";

/** 진행 중인데 이보다 오래된 생성은 서버가 중간에 멈춘 것으로 본다 */
export const STALE_JOB_MS = 10 * 60 * 1000;
export const IN_PROGRESS: GeneratedProblem["status"][] = ["queued", "generating", "verifying"];

const globalRunners = globalThis as typeof globalThis & {
  __algoFlowRunners?: { primary: PythonRunner; secondary: PythonRunner };
};

/** 서버 프로세스에 하나씩 띄워 두고 재사용한다 (Pyodide 준비 시간 절약) */
function runners() {
  return (globalRunners.__algoFlowRunners ??= {
    primary: createNodePythonRunner({ hashSeed: 0 }),
    secondary: createNodePythonRunner({ hashSeed: 1 }),
  });
}

/** 생성·검증을 끝까지 진행하고 결과를 저장한다. 오류는 던지지 않고 기록한다 */
export async function runGenerationJob(record: GeneratedProblem): Promise<void> {
  const store = getGeneratedStore();
  const { primary, secondary } = runners();
  // 진행 상태 저장은 순서대로 (완료 기록을 늦게 끝난 진행 상태가 덮어쓰지 않도록)
  let writes: Promise<void> = Promise.resolve();
  const enqueue = (write: () => Promise<void>) => {
    writes = writes.then(write, write);
    return writes;
  };
  try {
    const result = await runGenerationPipeline(record.id, record.request, {
      draft: isAiMock() ? mockDraft : draftWithClaude,
      runner: primary,
      secondRunner: secondary,
      onStatus: ({ status, attempts }) => void enqueue(() => store.update(record.id, { status, attempts })),
    });
    await writes;
    if (result.status === "verified") {
      await store.complete(
        record.id,
        { problem: result.problem, attempts: result.attempts, verifiedAt: new Date().toISOString() },
        result.solution,
      );
      console.info(`[generate] ${record.id} verified (시도 ${result.attempts.length}회)`);
    } else {
      await store.update(record.id, { status: "rejected", attempts: result.attempts, error: result.error });
      console.warn(
        `[generate] ${record.id} rejected`,
        result.attempts.map((a) => `${a.stage}: ${a.reason}`),
      );
    }
  } catch (error) {
    const message =
      error instanceof GenerationRefusedError
        ? error.message
        : "문제를 만드는 중에 오류가 났어요. 잠시 뒤 다시 시도해 주세요.";
    console.error(`[generate] ${record.id} failed`, error);
    await writes.catch(() => {});
    await store.update(record.id, { status: "failed", error: message });
  }
}

/** 서버가 재시작돼 멈춘 생성은 실패로 보여 준다 */
export function withStaleCheck(record: GeneratedProblem, now = Date.now()): GeneratedProblem {
  if (IN_PROGRESS.includes(record.status) && now - Date.parse(record.createdAt) > STALE_JOB_MS) {
    return { ...record, status: "failed", error: "생성이 중간에 멈췄어요. 다시 만들어 주세요." };
  }
  return record;
}
