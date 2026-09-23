/** 시각화 재생 상태 머신 (순수 함수). 스냅샷 방식이라 이동은 인덱스만 바꾼다 */

export const PLAYBACK_SPEEDS = [0.5, 1, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

/** 1배속에서 한 스텝이 머무는 시간 */
export const BASE_STEP_MS = 900;

export interface PlayerState {
  index: number;
  total: number;
  playing: boolean;
  speed: PlaybackSpeed;
}

export type PlayerAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "first" }
  | { type: "last" }
  | { type: "seek"; index: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "toggle" }
  /** 자동 재생 타이머 한 번 */
  | { type: "tick" }
  | { type: "speed"; speed: PlaybackSpeed }
  /** 새 스텝 목록으로 교체 (입력·프리셋 변경) */
  | { type: "load"; total: number };

export function createPlayerState(total: number, speed: PlaybackSpeed = 1): PlayerState {
  return { index: 0, total: Math.max(0, total), playing: false, speed };
}

const lastIndex = (state: PlayerState) => Math.max(0, state.total - 1);
const clamp = (state: PlayerState, index: number) => Math.min(lastIndex(state), Math.max(0, Math.round(index)));

/**
 * - 사용자가 직접 이동(이전/다음/처음/끝/탐색)하면 재생을 멈춘다
 * - 끝에서 재생을 누르면 처음부터 다시 재생한다
 * - 자동 재생이 마지막 스텝에 닿으면 멈춘다
 */
export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "next":
      return { ...state, index: clamp(state, state.index + 1), playing: false };
    case "prev":
      return { ...state, index: clamp(state, state.index - 1), playing: false };
    case "first":
      return { ...state, index: 0, playing: false };
    case "last":
      return { ...state, index: lastIndex(state), playing: false };
    case "seek":
      return { ...state, index: clamp(state, action.index), playing: false };
    case "play": {
      if (state.total <= 1) return { ...state, playing: false };
      const atEnd = state.index >= lastIndex(state);
      return { ...state, index: atEnd ? 0 : state.index, playing: true };
    }
    case "pause":
      return { ...state, playing: false };
    case "toggle":
      return playerReducer(state, { type: state.playing ? "pause" : "play" });
    case "tick": {
      if (!state.playing) return state;
      const index = clamp(state, state.index + 1);
      return { ...state, index, playing: index < lastIndex(state) };
    }
    case "speed":
      return { ...state, speed: action.speed };
    case "load":
      return createPlayerState(action.total, state.speed);
  }
}

export function stepDelayMs(speed: PlaybackSpeed): number {
  return Math.round(BASE_STEP_MS / speed);
}
