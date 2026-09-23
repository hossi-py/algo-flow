"use client";

import { useState } from "react";
import { ChevronDown, CircleCheck, CircleDashed, CircleX, Hourglass, TriangleAlert } from "lucide-react";
import { formatArgs, formatValue } from "@/lib/runner/format";
import { cn } from "@/lib/utils";
import type { CaseVerdict, CodeError, JudgeResult, Problem, TestCaseResult } from "@/types";

const VERDICT_STYLE: Record<CaseVerdict, { label: string; icon: typeof CircleCheck; className: string }> = {
  passed: { label: "통과", icon: CircleCheck, className: "bg-success text-success-foreground" },
  failed: { label: "틀림", icon: CircleX, className: "bg-danger text-danger-foreground" },
  "runtime-error": { label: "오류", icon: TriangleAlert, className: "bg-danger text-danger-foreground" },
  "time-limit-exceeded": { label: "시간 초과", icon: Hourglass, className: "bg-warning text-warning-foreground" },
  "not-run": { label: "미실행", icon: CircleDashed, className: "bg-muted text-muted-foreground" },
};

function Block({ label, children, tone }: { label: string; children: string; tone?: "danger" | "success" }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-caption font-semibold text-muted-foreground">{label}</p>
      <pre
        className={cn(
          "max-h-60 overflow-auto rounded-sm px-3 py-2 font-mono text-code-sm",
          tone === "danger" && "bg-danger/40 text-foreground",
          tone === "success" && "bg-success/40 text-foreground",
          !tone && "bg-muted text-foreground",
        )}
      >
        {children}
      </pre>
    </div>
  );
}

function ErrorLine({ error, onJump }: { error: CodeError; onJump: (line: number) => void }) {
  return (
    <div className="rounded-sm bg-danger/40 px-3 py-2 text-small text-foreground">
      <p className="font-mono text-code-sm font-bold">
        {error.type}: {error.message}
      </p>
      {error.line !== null && (
        <button
          type="button"
          onClick={() => error.line !== null && onJump(error.line)}
          className="mt-1 text-caption font-bold text-danger-text underline underline-offset-2"
        >
          {error.line}번째 줄로 이동
        </button>
      )}
    </div>
  );
}

function ResultRow({
  result,
  index,
  problem,
  defaultOpen,
  onJump,
}: {
  result: TestCaseResult;
  index: number;
  problem: Problem;
  defaultOpen: boolean;
  onJump: (line: number) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const style = VERDICT_STYLE[result.verdict];
  const Icon = style.icon;
  const testCase = problem.testCases.find((t) => t.id === result.testCaseId);
  const label = result.visibility === "example" ? `예제 ${index + 1}` : `숨은 테스트 ${index + 1}`;
  const expandable = result.revealed || result.error !== undefined || result.stdout.length > 0;
  const showNote = result.verdict !== "passed" && result.verdict !== "not-run" && testCase?.failureNote;

  return (
    <li className="overflow-hidden rounded-md border bg-card">
      <button
        type="button"
        onClick={() => expandable && setOpen((v) => !v)}
        aria-expanded={expandable ? open : undefined}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
          expandable && "hover:bg-muted/60",
        )}
      >
        <span
          className={cn(
            "inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-caption font-bold",
            style.className,
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {style.label}
        </span>
        <span className="min-w-0 flex-1 text-small font-semibold text-foreground">{label}</span>
        {result.timeMs !== null && result.verdict !== "time-limit-exceeded" && (
          <span className="text-caption text-muted-foreground tabular">{Math.max(1, Math.round(result.timeMs))}ms</span>
        )}
        {expandable && (
          <ChevronDown
            className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
            aria-hidden
          />
        )}
      </button>
      {expandable && open && (
        <div className="flex flex-col gap-3 border-t px-3 pt-3 pb-3">
          {showNote && (
            <p className="rounded-sm bg-info px-3 py-2 text-small text-info-foreground">💡 {testCase?.failureNote}</p>
          )}
          {result.revealed && result.args && (
            <Block label="입력">{formatArgs(result.args, problem.signature.params)}</Block>
          )}
          {result.revealed && result.expected !== undefined && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Block label="기대값" tone="success">
                {formatValue(result.expected)}
              </Block>
              {result.actual !== undefined ? (
                <Block label="내 코드의 반환값" tone={result.verdict === "passed" ? "success" : "danger"}>
                  {formatValue(result.actual)}
                </Block>
              ) : (
                <Block label="내 코드의 반환값">
                  {result.verdict === "time-limit-exceeded"
                    ? "(시간 안에 끝나지 않았어요)"
                    : "(반환하기 전에 멈췄어요)"}
                </Block>
              )}
            </div>
          )}
          {result.error && <ErrorLine error={result.error} onJump={onJump} />}
          {result.stdout && <Block label="출력 (print / console.log)">{result.stdout}</Block>}
        </div>
      )}
    </li>
  );
}

export function TestResultList({
  result,
  problem,
  onJump,
}: {
  result: JudgeResult;
  problem: Problem;
  onJump: (line: number) => void;
}) {
  let exampleIndex = 0;
  let hiddenIndex = 0;
  const firstFailure = result.results.findIndex((r) => r.verdict !== "passed" && r.verdict !== "not-run");

  return (
    <ol className="flex flex-col gap-2" aria-label="테스트 결과">
      {result.results.map((item, i) => {
        const index = item.visibility === "example" ? exampleIndex++ : hiddenIndex++;
        return (
          <ResultRow
            key={`${result.totalTimeMs}-${item.testCaseId}`}
            result={item}
            index={index}
            problem={problem}
            defaultOpen={i === firstFailure || (result.mode === "run" && firstFailure === -1 && i === 0)}
            onJump={onJump}
          />
        );
      })}
    </ol>
  );
}
