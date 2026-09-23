import type { JsonValue } from "./common";
import type { TestCaseVisibility } from "./content";

export type Verdict =
  "accepted" | "wrong-answer" | "runtime-error" | "time-limit-exceeded" | "syntax-error" | "internal-error";

export type CaseVerdict = "passed" | "failed" | "runtime-error" | "time-limit-exceeded" | "not-run";

export interface CodeError {
  /** 예: "IndexError", "TypeError" */
  type: string;
  message: string;
  /** 사용자 코드 기준 줄 번호 */
  line: number | null;
  traceback: string;
}

export interface TestCaseResult {
  testCaseId: string;
  visibility: TestCaseVisibility;
  verdict: CaseVerdict;
  timeMs: number | null;
  stdout: string;
  /** 입력·기대값·실제값을 사용자에게 공개하는지 (예제 or 처음 틀린 숨은 케이스) */
  revealed: boolean;
  args?: JsonValue[];
  expected?: JsonValue;
  actual?: JsonValue;
  error?: CodeError;
}

export type JudgeMode = "run" | "submit";

export interface JudgeResult {
  mode: JudgeMode;
  verdict: Verdict;
  passed: number;
  total: number;
  results: TestCaseResult[];
  totalTimeMs: number;
  /** syntax-error일 때 */
  compileError?: CodeError;
  /** internal-error일 때: 실행 엔진 로딩 실패·워커 충돌 등 */
  engineError?: string;
}

/** 메인 스레드 → 워커 (Python: public/workers/pyodide.worker.mjs, JS: src/workers/js.worker.ts — 같은 프로토콜) */
export type WorkerRequest =
  /** Python 워커는 Pyodide 위치와 채점 하네스 코드를 함께 받는다 */
  | { type: "init"; indexURL?: string; harness?: string }
  | {
      type: "run-case";
      runId: string;
      code: string;
      functionName: string;
      args: JsonValue[];
      recursionLimit: number;
      stdoutLimitBytes: number;
    };

/** 워커 → 메인 스레드 */
export type WorkerResponse =
  | { type: "ready"; runtime: string }
  | { type: "init-error"; message: string }
  | { type: "case-result"; runId: string; ok: true; value: JsonValue; stdout: string; timeMs: number }
  | {
      type: "case-result";
      runId: string;
      ok: false;
      /** compile: 문법 오류(모든 케이스 공통) · runtime: 실행 중 예외 */
      phase: "compile" | "runtime";
      error: CodeError;
      stdout: string;
      timeMs: number;
    };
