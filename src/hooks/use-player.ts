"use client";

import { useEffect, useReducer } from "react";
import { createPlayerState, playerReducer, stepDelayMs } from "@/lib/visualization/player";

/** 스텝 목록이 바뀌면(key가 바뀌면) 처음으로 되돌리고, 재생 중이면 속도에 맞춰 한 칸씩 넘긴다 */
export function usePlayer(total: number, resetKey: string) {
  const [state, dispatch] = useReducer(playerReducer, total, (t) => createPlayerState(t));

  useEffect(() => {
    dispatch({ type: "load", total });
  }, [total, resetKey]);

  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setTimeout(() => dispatch({ type: "tick" }), stepDelayMs(state.speed));
    return () => window.clearTimeout(timer);
  }, [state.playing, state.index, state.speed]);

  return { state, dispatch };
}
