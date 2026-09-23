"use client";

import { motion, useReducedMotion } from "motion/react";
import { Nodi } from "@/components/mascot/nodi";
import { cn } from "@/lib/utils";
import type { JudgeResult, MascotMood } from "@/types";

interface BannerCopy {
  title: string;
  message: string;
  mood: MascotMood;
  tone: string;
}

function copyFor(result: JudgeResult): BannerCopy {
  const failedCount = result.total - result.passed;
  const run = result.mode === "run";
  switch (result.verdict) {
    case "accepted":
      return run
        ? {
            title: "예제를 모두 통과했어요!",
            message: "이제 숨은 테스트까지 채점해 볼까요? [제출]을 눌러 보세요.",
            mood: "happy",
            tone: "bg-success text-success-foreground",
          }
        : {
            title: "정답이에요!",
            message: `${result.total}개 테스트를 모두 통과했어요.`,
            mood: "cheer",
            tone: "bg-success text-success-foreground",
          };
    case "wrong-answer":
      return {
        title: `거의 다 왔어요! ${failedCount}개 케이스가 달랐어요`,
        message: "틀린 케이스의 입력과 기대값을 비교해 볼까요? 경계 상황(빈 입력, 한 줄짜리 격자 등)을 놓치기 쉬워요.",
        mood: "oops",
        tone: "bg-danger text-danger-foreground",
      };
    case "runtime-error":
      return {
        title: "실행 중에 오류가 났어요",
        message: "오류가 난 줄이 에디터에 빨간 밑줄로 표시돼요. 인덱스 범위나 빈 값을 확인해 보세요.",
        mood: "oops",
        tone: "bg-danger text-danger-foreground",
      };
    case "time-limit-exceeded":
      return {
        title: "시간이 너무 오래 걸렸어요",
        message: "무한 반복이 없는지, 같은 곳을 여러 번 방문하고 있진 않은지 살펴볼까요?",
        mood: "sleepy",
        tone: "bg-warning text-warning-foreground",
      };
    case "syntax-error":
      return {
        title: "문법 오류가 있어요",
        message: "괄호 짝, 콜론(:), 들여쓰기를 확인해 보세요. 오류 위치를 에디터에 표시했어요.",
        mood: "thinking",
        tone: "bg-warning text-warning-foreground",
      };
    case "internal-error":
      return {
        title: "실행 엔진에 문제가 생겼어요",
        message: result.engineError ?? "잠시 후 다시 시도해 주세요.",
        mood: "sleepy",
        tone: "bg-muted text-foreground",
      };
  }
}

export function VerdictBanner({ result }: { result: JudgeResult }) {
  const reduceMotion = useReducedMotion();
  const copy = copyFor(result);
  const shake = !reduceMotion && (result.verdict === "wrong-answer" || result.verdict === "runtime-error");

  return (
    <motion.div
      key={`${result.mode}-${result.verdict}-${result.passed}-${result.totalTimeMs}`}
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-3 rounded-lg px-4 py-3", copy.tone)}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      animate={shake ? { opacity: 1, y: 0, x: [0, -6, 6, -6, 6, 0] } : { opacity: 1, y: 0 }}
      transition={{ duration: shake ? 0.35 : 0.2 }}
    >
      <Nodi mood={copy.mood} size={48} decorative />
      <div className="min-w-0 flex-1">
        <p className="text-small font-bold">
          {copy.title}
          <span className="ml-2 font-semibold tabular opacity-80">
            {result.passed}/{result.total}
          </span>
        </p>
        <p className="text-caption">{copy.message}</p>
      </div>
    </motion.div>
  );
}
