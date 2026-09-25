"use client";

import { useState } from "react";
import { Lightbulb, Lock } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Markdown } from "@/components/common/markdown";
import { PopButton } from "@/components/common/pop-button";
import { Nodi } from "@/components/mascot/nodi";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { spring } from "@/lib/motion";
import { problemXp } from "@/lib/progress/xp";
import { cn } from "@/lib/utils";
import type { Hint, HintKind, HintStep, HintsOpened, Language, Problem } from "@/types";

const KIND_LABEL: Record<HintKind, string> = {
  pattern: "유형과 판단 근거",
  approach: "접근 아이디어",
  pseudocode: "의사코드",
  "key-code": "핵심 부분 코드",
};

interface HintStackProps {
  problem: Problem;
  language: Language;
  opened: HintsOpened;
  solved: boolean;
  onOpen: (step: HintStep) => void;
}

export function HintStack({ problem, language, opened, solved, onOpen }: HintStackProps) {
  const [confirming, setConfirming] = useState<HintStep | null>(null);
  const confirmingHint = confirming ? problem.hints[confirming - 1] : null;
  const xpNow = problemXp(problem.xp, opened, problem.hints);
  const xpAfter = confirming ? problemXp(problem.xp, confirming, problem.hints) : xpNow;

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3 rounded-lg bg-primary-soft p-4">
        <Nodi mood="thinking" size={52} decorative />
        <div className="text-small text-primary-soft-foreground">
          <p className="font-bold">막혔을 때만 하나씩 열어 보세요.</p>
          <p>
            {solved
              ? "이미 푼 문제라 힌트를 열어도 XP가 줄지 않아요."
              : `지금 풀면 ${xpNow} XP · 힌트는 1단계부터 순서대로 열려요.`}
          </p>
        </div>
      </div>

      <ol className="flex flex-col gap-3">
        {problem.hints.map((hint) => (
          <li key={hint.step}>
            <HintCard
              hint={hint}
              language={language}
              state={hint.step <= opened ? "open" : hint.step === opened + 1 ? "next" : "locked"}
              xpNote={
                solved
                  ? "이미 푼 문제라 XP는 그대로예요"
                  : `열면 받을 XP ${xpNow} → ${problemXp(problem.xp, hint.step, problem.hints)}`
              }
              onRequestOpen={() => (solved ? onOpen(hint.step) : setConfirming(hint.step))}
            />
          </li>
        ))}
      </ol>

      <Dialog open={confirming !== null} onOpenChange={(open) => !open && setConfirming(null)}>
        <DialogContent className="rounded-xl p-6 sm:max-w-sm">
          <DialogTitle className="text-h3">{confirming}번 힌트를 열까요?</DialogTitle>
          <DialogDescription className="text-small text-muted-foreground">
            {confirmingHint ? `${KIND_LABEL[confirmingHint.kind]}를 알려 줘요. ` : ""}이 문제를 맞히면 받을 XP가{" "}
            <strong className="text-foreground">{xpNow}</strong> →{" "}
            <strong className="text-foreground">{xpAfter}</strong>로 바뀌어요.
          </DialogDescription>
          <DialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 rounded-none border-0 bg-transparent p-0">
            <PopButton variant="ghost" size="sm" onClick={() => setConfirming(null)}>
              조금 더 생각할게요
            </PopButton>
            <PopButton
              size="sm"
              onClick={() => {
                if (confirming) onOpen(confirming);
                setConfirming(null);
              }}
            >
              열기
            </PopButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HintCard({
  hint,
  language,
  state,
  xpNote,
  onRequestOpen,
}: {
  hint: Hint;
  language: Language;
  state: "open" | "next" | "locked";
  xpNote: string;
  onRequestOpen: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const open = state === "open";
  const code = hint.code?.code[language];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border",
        open ? "border-border/70 bg-card shadow-soft" : "border-dashed bg-card/50",
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-small font-bold",
            open ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          {open ? <Lightbulb className="size-4" /> : state === "locked" ? <Lock className="size-4" /> : hint.step}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-small font-bold text-foreground">
            힌트 {hint.step} · {open ? hint.title : KIND_LABEL[hint.kind]}
          </p>
          {!open && (
            <p className="text-caption text-muted-foreground">
              {state === "next" ? xpNote : `${hint.step - 1}번 힌트를 먼저 열어요`}
            </p>
          )}
        </div>
        {state === "next" && (
          <PopButton size="sm" variant="soft" onClick={onRequestOpen}>
            열기
          </PopButton>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            transition={reduceMotion ? { duration: 0.15 } : spring.gentle}
          >
            <div className="flex flex-col gap-3 border-t px-4 pt-3 pb-4">
              <Markdown className="text-small">{hint.body}</Markdown>
              {code && (
                <div className="flex flex-col gap-1.5">
                  <pre className="overflow-x-auto rounded-md border bg-muted px-4 py-3 font-mono text-code-sm text-foreground shadow-inset">
                    {code}
                  </pre>
                  {hint.code?.caption && <p className="text-caption text-muted-foreground">{hint.code.caption}</p>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
