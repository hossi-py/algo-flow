"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  /** 0~1 */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** 진행 호의 색 (text-* 클래스, stroke는 currentColor) */
  indicatorClassName?: string;
  trackClassName?: string;
  label: string;
  children?: ReactNode;
  className?: string;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  indicatorClassName = "text-primary-strong",
  trackClassName = "text-muted",
  label,
  children,
  className,
}: ProgressRingProps) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clamped) }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
          className={cn(clamped === 0 && "opacity-0", indicatorClassName)}
        />
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  );
}
