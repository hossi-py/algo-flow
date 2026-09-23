"use client";

import { ChevronLeft, ChevronRight, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { Dispatch } from "react";
import { PopButton } from "@/components/common/pop-button";
import { PLAYBACK_SPEEDS, type PlayerAction, type PlayerState } from "@/lib/visualization/player";
import { cn } from "@/lib/utils";

export function PlayerControls({ state, dispatch }: { state: PlayerState; dispatch: Dispatch<PlayerAction> }) {
  const atStart = state.index === 0;
  const atEnd = state.index >= state.total - 1;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <PopButton variant="ghost" size="icon-sm" aria-label="처음으로" disabled={atStart} onClick={() => dispatch({ type: "first" })}>
          <SkipBack />
        </PopButton>
        <PopButton variant="ghost" size="icon-sm" aria-label="이전 단계" disabled={atStart} onClick={() => dispatch({ type: "prev" })}>
          <ChevronLeft />
        </PopButton>
        <PopButton
          size="icon-sm"
          aria-label={state.playing ? "일시정지" : "재생"}
          onClick={() => dispatch({ type: "toggle" })}
          disabled={state.total <= 1}
        >
          {state.playing ? <Pause /> : <Play />}
        </PopButton>
        <PopButton variant="ghost" size="icon-sm" aria-label="다음 단계" disabled={atEnd} onClick={() => dispatch({ type: "next" })}>
          <ChevronRight />
        </PopButton>
        <PopButton variant="ghost" size="icon-sm" aria-label="마지막으로" disabled={atEnd} onClick={() => dispatch({ type: "last" })}>
          <SkipForward />
        </PopButton>
        <span className="ml-1 text-caption font-bold text-muted-foreground tabular" aria-live="off">
          {state.total === 0 ? 0 : state.index + 1} / {state.total}
        </span>
        <div role="group" aria-label="재생 속도" className="ml-auto inline-flex rounded-full bg-muted p-0.5">
          {PLAYBACK_SPEEDS.map((speed) => (
            <button
              key={speed}
              type="button"
              aria-pressed={state.speed === speed}
              onClick={() => dispatch({ type: "speed", speed })}
              className={cn(
                "rounded-full px-2.5 py-1 text-caption font-bold outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
                state.speed === speed ? "bg-card text-foreground shadow-soft" : "text-muted-foreground",
              )}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={Math.max(0, state.total - 1)}
        step={1}
        value={state.index}
        onChange={(event) => dispatch({ type: "seek", index: Number(event.target.value) })}
        aria-label="단계 이동"
        aria-valuetext={`${state.index + 1}번째 단계 / 전체 ${state.total}단계`}
        className="w-full accent-[var(--primary-strong)]"
      />
    </div>
  );
}
