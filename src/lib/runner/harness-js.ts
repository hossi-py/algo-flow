import { parse } from "acorn";
import type { CodeError, JsonValue } from "@/types";

/** 워커와 Node(테스트·검증 스크립트)가 함께 쓰는 JavaScript 채점 하네스 */

export type HarnessResult =
  | { ok: true; value: JsonValue; stdout: string; timeMs: number }
  | { ok: false; phase: "compile" | "runtime"; error: CodeError; stdout: string; timeMs: number };

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/* ───────────── 줄 번호 보정 ───────────── */

const STACK_LINE = /(?:<anonymous>|> Function|Function):(\d+):(\d+)/;

let cachedOffset: number | null = null;

/** new Function 본문 1번째 줄이 스택에서 몇 번째 줄로 보고되는지 엔진마다 다르므로 한 번 측정한다 */
function lineOffset(): number {
  if (cachedOffset !== null) return cachedOffset;
  try {
    new Function("console", "throw new Error('probe')")();
  } catch (error) {
    const match = error instanceof Error && error.stack ? STACK_LINE.exec(error.stack) : null;
    cachedOffset = match?.[1] ? Number(match[1]) - 1 : 0;
  }
  return cachedOffset ?? 0;
}

function userLine(error: unknown): number | null {
  if (!(error instanceof Error) || !error.stack) return null;
  const match = STACK_LINE.exec(error.stack);
  if (!match?.[1]) return null;
  const line = Number(match[1]) - lineOffset();
  return line >= 1 ? line : null;
}

/* ───────────── 출력 캡처 ───────────── */

function formatForConsole(value: unknown, depth = 0): string {
  if (typeof value === "string") return depth === 0 ? value : JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "function") return `[Function ${value.name || "익명"}]`;
  if (typeof value === "symbol") return value.toString();
  if (depth > 4) return "…";
  if (Array.isArray(value)) return `[${value.map((item) => formatForConsole(item, depth + 1)).join(", ")}]`;
  if (value instanceof Set)
    return `Set(${value.size}) {${[...value].map((v) => formatForConsole(v, depth + 1)).join(", ")}}`;
  if (value instanceof Map) {
    const entries = [...value].map(
      ([k, v]) => `${formatForConsole(k, depth + 1)} => ${formatForConsole(v, depth + 1)}`,
    );
    return `Map(${value.size}) {${entries.join(", ")}}`;
  }
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  const entries = Object.entries(value as Record<string, unknown>).map(
    ([key, item]) => `${key}: ${formatForConsole(item, depth + 1)}`,
  );
  return `{ ${entries.join(", ")} }`;
}

class OutputBuffer {
  private chunks: string[] = [];
  private size = 0;
  private truncated = false;

  constructor(private readonly limit: number) {}

  write(text: string) {
    if (this.size >= this.limit) {
      this.truncated = true;
      return;
    }
    const room = this.limit - this.size;
    const chunk = text.length > room ? text.slice(0, room) : text;
    if (chunk.length < text.length) this.truncated = true;
    this.chunks.push(chunk);
    this.size += chunk.length;
  }

  result(): string {
    const text = this.chunks.join("");
    return this.truncated ? `${text}\n… (출력이 너무 길어서 잘랐어요)` : text;
  }
}

function createConsole(buffer: OutputBuffer) {
  const log = (...args: unknown[]) => buffer.write(`${args.map((arg) => formatForConsole(arg)).join(" ")}\n`);
  return { log, info: log, warn: log, error: log, debug: log, table: log, dir: log };
}

/* ───────────── 반환값 정규화 ───────────── */

class ReturnValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReturnValueError";
  }
}

function canonicalKey(value: JsonValue): string {
  return JSON.stringify(value);
}

/** 반환값을 JSON으로 옮길 수 있는 값으로 바꾼다 (Python 하네스의 _normalize와 같은 규칙) */
export function normalizeJsValue(value: unknown, depth = 0, seen: Set<object> = new Set()): JsonValue {
  if (depth > 200) throw new ReturnValueError("반환값이 너무 깊게 중첩되어 있어요");
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new ReturnValueError("반환값에 NaN 또는 Infinity가 들어 있어요");
    if (Number.isInteger(value) && !Number.isSafeInteger(value)) {
      throw new ReturnValueError("반환값의 정수가 너무 커요 (±2^53 이내여야 해요)");
    }
    return Object.is(value, -0) ? 0 : value;
  }
  if (typeof value === "bigint") {
    const asNumber = Number(value);
    if (!Number.isSafeInteger(asNumber)) throw new ReturnValueError("반환값의 BigInt가 너무 커요");
    return asNumber;
  }
  if (typeof value === "function" || typeof value === "symbol") {
    throw new ReturnValueError(`${typeof value} 타입은 반환할 수 없어요`);
  }
  if (typeof value === "object") {
    if (value instanceof Promise) {
      throw new ReturnValueError("solution은 동기 함수여야 해요. async나 Promise를 쓰지 말아 주세요.");
    }
    if (seen.has(value)) throw new ReturnValueError("반환값에 순환 참조가 있어요");
    seen.add(value);
    try {
      if (Array.isArray(value)) return value.map((item) => normalizeJsValue(item, depth + 1, seen));
      if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
        return Array.from(value as unknown as ArrayLike<number>, (item) => normalizeJsValue(item, depth + 1, seen));
      }
      if (value instanceof Set) {
        const items = [...value].map((item) => normalizeJsValue(item, depth + 1, seen));
        const allNumbers = items.every((item) => typeof item === "number");
        return allNumbers
          ? (items as number[]).sort((a, b) => a - b)
          : items.sort((a, b) => canonicalKey(a).localeCompare(canonicalKey(b)));
      }
      if (value instanceof Map) {
        const result: Record<string, JsonValue> = {};
        for (const [key, item] of value) result[String(key)] = normalizeJsValue(item, depth + 1, seen);
        return result;
      }
      const result: Record<string, JsonValue> = {};
      for (const [key, item] of Object.entries(value)) result[key] = normalizeJsValue(item, depth + 1, seen);
      return result;
    } finally {
      seen.delete(value);
    }
  }
  throw new ReturnValueError("반환할 수 없는 값이에요");
}

/* ───────────── 오류 변환 ───────────── */

function toCodeError(error: unknown): CodeError {
  if (error instanceof Error) {
    let message = error.message;
    if (error instanceof RangeError && /call stack/i.test(message)) {
      message = `재귀 호출이 너무 깊어요 (${message})`;
    }
    const line = userLine(error);
    return {
      type: error.name,
      message,
      line,
      traceback: line !== null ? `${error.name}: ${message}\n    at 줄 ${line}` : `${error.name}: ${message}`,
    };
  }
  return { type: "Error", message: String(error), line: null, traceback: `throw ${String(error)}` };
}

/** 실행하지 않고 문법만 검사한다 */
export function checkJsSyntax(code: string): CodeError | null {
  try {
    parse(code, { ecmaVersion: "latest", sourceType: "script", allowReturnOutsideFunction: false });
    return null;
  } catch (error) {
    const loc = (error as { loc?: { line: number } }).loc;
    const raw = error instanceof Error ? error.message : String(error);
    const message = raw.replace(/\s*\(\d+:\d+\)$/, "");
    const line = loc?.line ?? null;
    return {
      type: "SyntaxError",
      message,
      line,
      traceback: line !== null ? `SyntaxError: ${message}\n    at 줄 ${line}` : `SyntaxError: ${message}`,
    };
  }
}

/* ───────────── 실행 ───────────── */

export interface RunJsCaseOptions {
  code: string;
  functionName: string;
  args: JsonValue[];
  stdoutLimit: number;
}

/** 테스트케이스 하나를 실행한다. 매번 새 스코프에서 코드를 평가하므로 케이스끼리 전역 상태가 섞이지 않는다 */
export function runJsCase({ code, functionName, args, stdoutLimit }: RunJsCaseOptions): HarnessResult {
  const syntaxError = checkJsSyntax(code);
  if (syntaxError) return { ok: false, phase: "compile", error: syntaxError, stdout: "", timeMs: 0 };

  const buffer = new OutputBuffer(stdoutLimit);
  const started = now();
  try {
    const factory = new Function(
      "console",
      `${code}\n;return typeof ${functionName} === "function" ? ${functionName} : undefined;`,
    ) as (console: ReturnType<typeof createConsole>) => unknown;
    const solution = factory(createConsole(buffer));
    if (typeof solution !== "function") {
      throw new ReferenceError(
        `${functionName} 함수를 찾을 수 없어요. function ${functionName}(...) { } 로 정의해 주세요.`,
      );
    }
    const result: unknown = (solution as (...a: JsonValue[]) => unknown)(...structuredClone(args));
    const value = normalizeJsValue(result);
    return { ok: true, value, stdout: buffer.result(), timeMs: now() - started };
  } catch (error) {
    return { ok: false, phase: "runtime", error: toCodeError(error), stdout: buffer.result(), timeMs: now() - started };
  }
}
