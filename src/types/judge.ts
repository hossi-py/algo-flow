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
}

/** 메인 스레드 → 워커 (Python: pyodide.worker.ts, JS: js.worker.ts — 같은 프로토콜) */
export type WorkerRequest =
  | { type: "init"; indexURL?: string }
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
  | { type: "case-result"; runId: string; ok: false; error: CodeError; stdout: string; timeMs: number };
