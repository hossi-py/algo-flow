"use client";

import type { KeyboardEvent } from "react";
import { Nodi } from "@/components/mascot/nodi";
import { usePlayer } from "@/hooks/use-player";
import { cn } from "@/lib/utils";
import type { MascotMood, VisualizationStep, VizAction, VizState } from "@/types";
import { BarsView } from "./bars-view";
import { GraphView } from "./graph-view";
import { GridView } from "./grid-view";
import { HashView } from "./hash-view";
import { LineView, SequenceView, StackView } from "./linear-views";
import { PlayerControls } from "./player-controls";
import { CallStackView, PseudocodeView, VariablesView } from "./state-views";
import { ACTION_LABEL } from "./tones";

const MOOD_BY_ACTION: Partial<Record<VizAction, MascotMood>> = {
  done: "cheer",
  record: "happy",
  found: "happy",
  "not-found": "thinking",
  merge: "happy",
  "zone-complete": "happy",
  discover: "curious",
  "zone-start": "curious",
  check: "thinking",
  compare: "thinking",
  unchoose: "thinking",
};

/** 스텝에 들어 있는 레이어만 그린다: 큰 그림(그래프·격자·해시 테이블·막대) → 줄 모양 자료구조 → 호출 스택·변수 */
export function Stage({ state, wide }: { state: VizState; wide: boolean }) {
  const main = state.graph ? (
    <GraphView snapshot={state.graph} />
  ) : state.grid ? (
    <GridView snapshot={state.grid} />
  ) : state.hash ? (
    <HashView snapshot={state.hash} />
  ) : state.bars ? (
    <BarsView snapshot={state.bars} />
  ) : null;
  const linear = [
    state.sequence && <SequenceView key="sequence" snapshot={state.sequence} />,
    state.stack && <StackView key="stack" snapshot={state.stack} />,
    state.queue && <LineView key="queue" snapshot={state.queue} fallbackTitle="큐" />,
    state.deque && <LineView key="deque" snapshot={state.deque} fallbackTitle="덱" />,
  ].filter(Boolean);
  const side = [
    state.callStack && <CallStackView key="calls" frames={state.callStack} />,
    state.variables && <VariablesView key="vars" variables={state.variables} />,
  ].filter(Boolean);

  return (
    <div className={cn("grid min-w-0 gap-3", wide && main && "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]")}>
      {main && <div className="min-w-0">{main}</div>}
      <div className="flex min-w-0 flex-col gap-3">
        {linear}
        {side}
      </div>
    </div>
  );
}

interface PlayerProps {
  steps: VisualizationStep[];
  pseudocode: string[];
  /** 스텝 목록이 바뀔 때 재생 위치를 처음으로 돌리기 위한 키 */
  resetKey: string;
  /** 넓은 화면: 그림과 자료구조를 나란히, 의사코드는 옆에 */
  wide?: boolean;
  className?: string;
}

export function Player({ steps, pseudocode, resetKey, wide = false, className }: PlayerProps) {
  const { state, dispatch } = usePlayer(steps.length, resetKey);
  const step = steps[Math.min(state.index, steps.length - 1)];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("textarea, input:not([type=range]), select, [contenteditable=true]")) return;
    if (event.key === " " || event.key === "Spacebar") {
      if (target.closest("button")) return; // 버튼 위에서는 버튼 자체 동작
      event.preventDefault();
      dispatch({ type: "toggle" });
    } else if (event.key === "ArrowRight" && !target.matches("input[type=range]")) {
      event.preventDefault();
      dispatch({ type: "next" });
    } else if (event.key === "ArrowLeft" && !target.matches("input[type=range]")) {
      event.preventDefault();
      dispatch({ type: "prev" });
    }
  };

  if (!step) {
    return <p className="p-4 text-small text-muted-foreground">보여 줄 단계가 없어요.</p>;
  }

  const mood = MOOD_BY_ACTION[step.action] ?? "idle";

  return (
    <div
      role="region"
      aria-label="알고리즘 한 단계씩 보기 (Space 재생·정지, ←/→ 이동)"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        className,
      )}
    >
      <div className={cn("grid min-w-0 gap-3", wide && "xl:grid-cols-[minmax(0,1fr)_20rem]")}>
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-primary-soft px-3 py-2.5" aria-live="polite">
            <Nodi mood={mood} size={40} decorative replayKey={state.index} />
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-card px-2 py-0.5 text-[11px] font-bold text-primary-soft-foreground">
                {ACTION_LABEL[step.action]}
              </span>
              <p className="mt-0.5 text-small font-semibold text-primary-soft-foreground">{step.message}</p>
            </div>
          </div>
          <Stage state={step.state} wide={wide} />
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <PlayerControls state={state} dispatch={dispatch} />
          <PseudocodeView lines={pseudocode} current={step.codeLine} />
        </div>
      </div>
    </div>
  );
}
