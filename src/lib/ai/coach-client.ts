import { formatArgs, formatValue } from "@/lib/runner/format";
import type { JudgeResult, Problem } from "@/types";
import type { CoachRequest, CoachStreamEvent } from "./schemas";

export class CoachHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** /api/coach에 질문을 보내고 NDJSON 이벤트를 하나씩 넘긴다 */
export async function streamCoach(
  body: CoachRequest,
  onEvent: (event: CoachStreamEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok || !response.body) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new CoachHttpError(response.status, data?.error ?? "노디와 연결하지 못했어요. 잠시 뒤 다시 시도해 주세요.");
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let newline = buffer.indexOf("\n");
    while (newline !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) onEvent(JSON.parse(line) as CoachStreamEvent);
      newline = buffer.indexOf("\n");
    }
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer) as CoachStreamEvent);
}

/**
 * 최근 채점 결과를 코치에게 알려 줄 요약. 사용자 화면에 이미 공개된 정보(예제, 처음 틀린 공개 케이스, 오류)만 담는다.
 */
export function summarizeResult(result: JudgeResult | null, problem: Problem): CoachRequest["lastResult"] {
  if (!result) return null;
  const lines: string[] = [];
  if (result.compileError) {
    lines.push(
      `문법 오류 ${result.compileError.line ? `(${result.compileError.line}번째 줄)` : ""}: ${result.compileError.message}`,
    );
  }
  const bad = result.results.find((r) => r.verdict !== "passed" && r.verdict !== "not-run");
  if (bad) {
    if (bad.revealed && bad.args) {
      lines.push(`처음 틀린 케이스 (${bad.visibility === "example" ? "예제" : "숨은 케이스"})`);
      lines.push(formatArgs(bad.args, problem.signature.params, 400));
      if (bad.expected !== undefined) lines.push(`기대값: ${formatValue(bad.expected, 200)}`);
      if (bad.actual !== undefined) lines.push(`실제값: ${formatValue(bad.actual, 200)}`);
    } else {
      lines.push("숨은 케이스에서 틀렸어요 (내용은 비공개)");
    }
    if (bad.error)
      lines.push(`오류: ${bad.error.type}: ${bad.error.message}${bad.error.line ? ` (${bad.error.line}번째 줄)` : ""}`);
  }
  return {
    mode: result.mode,
    verdict: result.verdict,
    passed: result.passed,
    total: result.total,
    detail: lines.length > 0 ? lines.join("\n").slice(0, 2000) : null,
  };
}
