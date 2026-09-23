"use client";

import { Play, RotateCcw, Send } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { Nodi } from "@/components/mascot/nodi";
import type { JudgeProgress } from "@/hooks/use-runner";
import type { EngineState } from "@/lib/runner/client";
import { cn } from "@/lib/utils";
import { LANGUAGE_LABELS, type Language } from "@/types";

interface RunBarProps {
  language: Language;
  engine: EngineState;
  progress: JudgeProgress | null;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  className?: string;
}

function EngineNote({ language, engine, progress }: Pick<RunBarProps, "language" | "engine" | "progress">) {
  if (progress) {
    return (
      <span className="inline-flex items-center gap-2" aria-live="polite">
        <Nodi mood="loading" size={28} decorative />
        {progress.mode === "run" ? "예제 실행 중" : "채점 중"} {progress.done}/{progress.total}
      </span>
    );
  }
  if (engine.status === "loading") {
    return (
      <span className="inline-flex items-center gap-2" aria-live="polite">
        <Nodi mood="loading" size={28} decorative />
        {language === "python" ? "Python 엔진 준비 중 (처음 한 번은 몇 초 걸려요)" : "엔진 준비 중"}
      </span>
    );
  }
  if (engine.status === "error") {
    return (
      <span className="text-danger-text" title={engine.error ?? undefined}>
        엔진을 불러오지 못했어요{engine.error ? ` (${engine.error})` : ""} · 실행하면 다시 시도해요
      </span>
    );
  }
  if (engine.status === "ready") return <span>{engine.runtime ?? LANGUAGE_LABELS[language]} 준비 완료</span>;
  return null;
}

export function RunBar({ language, engine, progress, onRun, onSubmit, onReset, className }: RunBarProps) {
  const busy = progress !== null;
  return (
    <div className={cn("flex items-center gap-2 border-t bg-card px-3 py-2.5", className)}>
      <PopButton
        variant="ghost"
        size="icon-sm"
        onClick={onReset}
        aria-label="코드를 처음 상태로 되돌리기"
        disabled={busy}
      >
        <RotateCcw />
      </PopButton>
      <div className="hidden min-w-0 flex-1 truncate text-caption text-muted-foreground sm:block">
        <EngineNote language={language} engine={engine} progress={progress} />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <PopButton variant="secondary" size="sm" onClick={onRun} disabled={busy} title="예제 실행 (Ctrl+Enter)">
          <Play /> 예제 실행
        </PopButton>
        <PopButton size="sm" onClick={onSubmit} disabled={busy} title="제출 (Ctrl+Shift+Enter)">
          <Send /> 제출
        </PopButton>
      </div>
    </div>
  );
}

export function EngineStatusLine(props: Pick<RunBarProps, "language" | "engine" | "progress">) {
  return (
    <div className="truncate px-3 py-1.5 text-caption text-muted-foreground sm:hidden">
      <EngineNote {...props} />
    </div>
  );
}
