"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Nodi, type NodiProps } from "./nodi";

interface MascotBubbleProps extends Pick<NodiProps, "mood" | "growth" | "flowers" | "replayKey"> {
  children: ReactNode;
  size?: number;
  /** 말풍선 위치 */
  side?: "right" | "bottom";
  className?: string;
}

/** 노디 + 말풍선. 노디가 한 말은 스크린 리더가 읽고, 노디 그림은 장식으로 처리한다 */
export function MascotBubble({ children, size = 72, side = "right", className, ...nodi }: MascotBubbleProps) {
  return (
    <div className={cn("flex items-center gap-3", side === "bottom" && "flex-col", className)}>
      <Nodi {...nodi} size={size} decorative />
      <div
        className={cn(
          "relative rounded-2xl border bg-card px-4 py-3 text-small text-card-foreground shadow-soft",
          side === "right" &&
            "before:absolute before:top-1/2 before:-left-[7px] before:size-3 before:-translate-y-1/2 before:rotate-45 before:border-b before:border-l before:bg-card",
          side === "bottom" &&
            "before:absolute before:-top-[7px] before:left-1/2 before:size-3 before:-translate-x-1/2 before:rotate-45 before:border-t before:border-l before:bg-card",
        )}
      >
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
