"use client";

import { useState } from "react";
import { Code } from "lucide-react";
import { SectionTitle, SoftCard } from "@/components/common/soft-card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getProblemMeta } from "@/content/problems";
import { cn } from "@/lib/utils";
import { LANGUAGE_LABELS, type SubmissionSummary, type Verdict } from "@/types";

export const VERDICT_LABELS: Record<Verdict, { label: string; className: string }> = {
  accepted: { label: "정답", className: "bg-success text-success-foreground" },
  "wrong-answer": { label: "오답", className: "bg-danger text-danger-foreground" },
  "runtime-error": { label: "실행 오류", className: "bg-danger text-danger-foreground" },
  "time-limit-exceeded": { label: "시간 초과", className: "bg-warning text-warning-foreground" },
  "syntax-error": { label: "문법 오류", className: "bg-warning text-warning-foreground" },
  "internal-error": { label: "엔진 오류", className: "bg-muted text-muted-foreground" },
};

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function problemTitle(submission: SubmissionSummary): string {
  if (submission.source === "generated") return "AI 맞춤 문제";
  return getProblemMeta(submission.problemKey.slice(2))?.title ?? submission.problemKey;
}

export function SubmissionHistory({ submissions }: { submissions: SubmissionSummary[] | null }) {
  const [open, setOpen] = useState<SubmissionSummary | null>(null);

  return (
    <SoftCard className="flex flex-col gap-4">
      <SectionTitle>최근 제출</SectionTitle>
      {submissions === null ? (
        <div className="h-40 animate-pulse rounded-md bg-muted" aria-hidden />
      ) : submissions.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-6 text-center text-small text-muted-foreground">
          아직 제출한 코드가 없어요. 문제를 풀고 [제출]을 눌러 보세요.
        </p>
      ) : (
        <ul className="flex flex-col divide-y">
          {submissions.map((submission) => {
            const verdict = VERDICT_LABELS[submission.verdict];
            return (
              <li key={submission.id}>
                <button
                  type="button"
                  onClick={() => setOpen(submission)}
                  className="flex w-full items-center gap-3 rounded-md px-1 py-2.5 text-left outline-none hover:bg-muted/60 focus-visible:ring-4 focus-visible:ring-ring/40"
                >
                  <span
                    className={cn(
                      "w-16 shrink-0 rounded-full px-2 py-0.5 text-center text-caption font-bold",
                      verdict.className,
                    )}
                  >
                    {verdict.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-small font-bold text-foreground">
                      {problemTitle(submission)}
                    </span>
                    <span className="block text-caption text-muted-foreground tabular">
                      {timeFormatter.format(new Date(submission.createdAt))} · {LANGUAGE_LABELS[submission.language]} ·{" "}
                      {submission.passed}/{submission.total} 통과
                      {submission.hintsOpened > 0 && ` · 힌트 ${submission.hintsOpened}`}
                    </span>
                  </span>
                  <Code className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={open !== null} onOpenChange={(value) => !value && setOpen(null)}>
        <DialogContent className="max-h-[85dvh] overflow-hidden rounded-xl p-6 sm:max-w-2xl">
          {open && (
            <div className="flex min-h-0 flex-col gap-3">
              <DialogTitle className="text-h3">{problemTitle(open)}</DialogTitle>
              <DialogDescription className="text-small text-muted-foreground">
                {VERDICT_LABELS[open.verdict].label} · {LANGUAGE_LABELS[open.language]} ·{" "}
                {timeFormatter.format(new Date(open.createdAt))}
              </DialogDescription>
              {open.code ? (
                <pre className="max-h-[60dvh] overflow-auto rounded-md border bg-muted px-4 py-3 font-mono text-code-sm text-foreground shadow-inset">
                  {open.code}
                </pre>
              ) : (
                <p className="rounded-md bg-muted px-4 py-3 text-small text-muted-foreground">
                  오래된 기록이라 코드는 보관하지 않았어요.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SoftCard>
  );
}
