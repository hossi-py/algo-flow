"use client";

import { Flame, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function XpPill({ xp, className }: { xp: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-warning px-3 text-small font-bold whitespace-nowrap text-warning-foreground tabular",
        className,
      )}
      aria-label={`경험치 ${xp.toLocaleString("ko-KR")} XP`}
    >
      <Star className="size-4 fill-current" aria-hidden />
      {xp.toLocaleString("ko-KR")}
      <span className="text-caption font-semibold">XP</span>
    </span>
  );
}

export function StreakFlame({ days, className }: { days: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  const active = days > 0;
  return (
    <span
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-small font-bold whitespace-nowrap tabular",
        active ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground",
        className,
      )}
      aria-label={active ? `${days}일 연속 학습 중` : "연속 학습 기록 없음"}
    >
      <motion.span
        className="inline-flex"
        animate={active && !reduceMotion ? { rotate: [-6, 6, -6], scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        <Flame className={cn("size-4", active && "fill-current")} />
      </motion.span>
      {days}
      <span className="text-caption font-semibold">일</span>
    </span>
  );
}
