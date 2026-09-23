import { describe, expect, it } from "vitest";
import {
  BASE_STEP_MS,
  createPlayerState,
  playerReducer,
  stepDelayMs,
  type PlayerAction,
  type PlayerState,
} from "@/lib/visualization/player";

function run(state: PlayerState, ...actions: PlayerAction[]): PlayerState {
  return actions.reduce(playerReducer, state);
}

describe("playerReducer", () => {
  const start = createPlayerState(5);

  it("처음 상태: 0번 스텝, 정지, 1배속", () => {
    expect(start).toEqual({ index: 0, total: 5, playing: false, speed: 1 });
    expect(createPlayerState(-3).total).toBe(0);
  });

  it("이전/다음은 양 끝을 넘지 않는다", () => {
    expect(run(start, { type: "prev" }).index).toBe(0);
    expect(run(start, { type: "next" }, { type: "next" }).index).toBe(2);
    expect(run(start, { type: "last" }, { type: "next" }).index).toBe(4);
    expect(run(start, { type: "last" }, { type: "first" }).index).toBe(0);
  });

  it("탐색(스크럽)은 범위 안으로 맞추고 정수로 반올림한다", () => {
    expect(run(start, { type: "seek", index: 99 }).index).toBe(4);
    expect(run(start, { type: "seek", index: -2 }).index).toBe(0);
    expect(run(start, { type: "seek", index: 2.6 }).index).toBe(3);
  });

  it("직접 이동하면 재생이 멈춘다", () => {
    const playing = run(start, { type: "play" });
    expect(playing.playing).toBe(true);
    for (const action of [
      { type: "next" },
      { type: "prev" },
      { type: "first" },
      { type: "last" },
      { type: "seek", index: 2 },
    ] as PlayerAction[]) {
      expect(run(playing, action).playing, action.type).toBe(false);
    }
  });

  it("자동 재생은 한 칸씩 가다가 마지막 스텝에서 멈춘다", () => {
    let state = run(start, { type: "play" });
    const seen: number[] = [];
    for (let i = 0; i < 10; i += 1) {
      state = playerReducer(state, { type: "tick" });
      seen.push(state.index);
    }
    expect(seen.slice(0, 4)).toEqual([1, 2, 3, 4]);
    expect(state).toMatchObject({ index: 4, playing: false });
  });

  it("정지 상태의 tick은 아무것도 바꾸지 않는다", () => {
    expect(playerReducer(start, { type: "tick" })).toBe(start);
  });

  it("끝에서 재생하면 처음부터 다시 재생한다", () => {
    expect(run(start, { type: "last" }, { type: "play" })).toMatchObject({ index: 0, playing: true });
  });

  it("스텝이 1개 이하면 재생되지 않는다", () => {
    expect(run(createPlayerState(1), { type: "play" }).playing).toBe(false);
    expect(run(createPlayerState(0), { type: "toggle" }).playing).toBe(false);
  });

  it("toggle은 재생과 정지를 오간다", () => {
    const once = run(start, { type: "toggle" });
    expect(once.playing).toBe(true);
    expect(run(once, { type: "toggle" }).playing).toBe(false);
  });

  it("새 스텝 목록을 불러오면 처음으로 돌아가고 속도는 유지한다", () => {
    const state = run(start, { type: "speed", speed: 2 }, { type: "seek", index: 3 }, { type: "play" });
    expect(run(state, { type: "load", total: 8 })).toEqual({ index: 0, total: 8, playing: false, speed: 2 });
  });

  it("속도 0.5·1·2배에 따라 스텝 간격이 바뀐다", () => {
    expect(stepDelayMs(1)).toBe(BASE_STEP_MS);
    expect(stepDelayMs(2)).toBe(BASE_STEP_MS / 2);
    expect(stepDelayMs(0.5)).toBe(BASE_STEP_MS * 2);
  });
});
