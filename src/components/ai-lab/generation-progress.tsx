"use client";

import Link from "next/link";
import { Check, CircleAlert, RotateCcw } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { SoftCard } from "@/components/common/soft-card";
import { Nodi } from "@/components/mascot/nodi";
import type { GeneratedProblemView } from "@/lib/ai/views";
import { cn } from "@/lib/utils";
import type { MascotMood, VerificationStage } from "@/types";

/** 파이프라인 재시도 횟수와 같다 (lib/ai/pipeline.ts MAX_ATTEMPTS) */
const MAX_ATTEMPTS = 3;

const STAGE_LABELS: Record<VerificationStage, string> = {
  schema: "문제 형식",
  "static-check": "정답 코드 안전 검사",
  execution: "정답 코드 실행",
  determinism: "결과 일관성",
  quality: "문제 품질",
};

const STEPS = [
  { key: "generating", label: "문제 쓰는 중" },
  { key: "verifying", label: "정답 코드로 검증 중" },
  { key: "verified", label: "완성!" },
] as const;

function stepIndex(status: GeneratedProblemView["status"]): number {
  if (status === "verified") return 2;
  if (status === "verifying") return 1;
  return 0;
}

export function GenerationProgress({ job, onRetry }: { job: GeneratedProblemView; onRetry: () => void }) {
  const failures = job.attempts.filter((a) => !a.ok);
  const inProgress = job.status === "queued" || job.status === "generating" || job.status === "verifying";
  const attempt = Math.min(MAX_ATTEMPTS, failures.length + 1);
  const lastFailure = failures.at(-1);

  let mood: MascotMood = "loading";
  let title = "노디가 문제를 만들고 있어요";
  let description = "정답 코드를 실제로 돌려서 모든 테스트가 맞는지 확인한 문제만 보여 드려요. 1~3분쯤 걸려요.";
  if (job.status === "verified") {
    mood = "happy";
    title = "검증까지 마친 문제가 준비됐어요!";
    description = job.problem ? `「${job.problem.title}」 — ${job.problem.summary}` : "";
  } else if (job.status === "rejected") {
    mood = "oops";
    title = `${MAX_ATTEMPTS}번 만들었지만 검증을 통과하지 못했어요`;
    description = "검증에서 떨어진 문제는 보여 드리지 않아요. 조건을 조금 바꿔서 다시 만들어 볼까요?";
  } else if (job.status === "failed") {
    mood = "oops";
    title = "문제를 만들지 못했어요";
    description = job.error ?? "잠시 뒤 다시 시도해 주세요.";
  } else if (failures.length > 0) {
    mood = "thinking";
    title = `검증에서 떨어져서 다시 만들고 있어요 (${attempt}/${MAX_ATTEMPTS})`;
  }

  const current = stepIndex(job.status);

  return (
    <SoftCard className="flex flex-col gap-5" aria-live="polite">
      <div className="flex items-center gap-4">
        <Nodi mood={mood} size={72} decorative className="shrink-0" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-h3 text-foreground">{title}</p>
          {description && <p className="text-small text-muted-foreground">{description}</p>}
        </div>
      </div>

      {(inProgress || job.status === "verified") && (
        <ol className="grid gap-2 sm:grid-cols-3">
          {STEPS.map((step, index) => {
            const done = index < current || job.status === "verified";
            const active = index === current && inProgress;
            return (
              <li
                key={step.key}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-small font-bold",
                  done && "border-transparent bg-success text-success-foreground",
                  active && "border-primary bg-primary-soft text-primary-soft-foreground",
                  !done && !active && "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-caption",
                    done ? "bg-card/60" : "bg-muted",
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
                </span>
                {step.label}
                {active && <span className="sr-only">(진행 중)</span>}
              </li>
            );
          })}
        </ol>
      )}

      {lastFailure && job.status !== "verified" && (
        <details className="rounded-md bg-muted px-3 py-2 text-caption text-muted-foreground">
          <summary className="cursor-pointer font-bold text-foreground">
            <CircleAlert className="mr-1 inline size-3.5 align-[-2px]" aria-hidden />
            지난 시도는 「{STAGE_LABELS[lastFailure.stage]}」 단계에서 떨어졌어요
          </summary>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
            {failures.map((failure) => (
              <li key={failure.attempt}>
                {failure.attempt}번째 시도 · {STAGE_LABELS[failure.stage]}: {failure.reason}
              </li>
            ))}
          </ul>
        </details>
      )}

      {job.status === "verified" && (
        <PopButton asChild className="self-start">
          <Link href={`/ai-lab/problems/${job.id}`}>풀러 가기</Link>
        </PopButton>
      )}
      {(job.status === "rejected" || job.status === "failed") && (
        <PopButton variant="soft" className="self-start" onClick={onRetry}>
          <RotateCcw />
          조건 바꿔서 다시 만들기
        </PopButton>
      )}
    </SoftCard>
  );
}
