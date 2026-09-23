"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0~1 */
  value: number;
  label: string;
  className?: string;
  indicatorClassName?: string;
}

export function ProgressBar({ value, label, className, indicatorClassName = "bg-primary-strong" }: ProgressBarProps) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div
      className={cn("h-3 w-full overflow-hidden rounded-full bg-muted shadow-inset", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <motion.div
        className={cn("h-full rounded-full", indicatorClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${clamped * 100}%` }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 22 }}
      />
    </div>
  );
}
