import { describe, expect, it } from "vitest";
import { GUARD_FALLBACK_REPLY } from "@/lib/ai/coach-guard";
import { normalizeMeta, runCoach, type CoachModelCall, type CoachModelEvent } from "@/lib/ai/coach";
import type { CoachStreamEvent } from "@/lib/ai/schemas";

/** 시도마다 정해진 이벤트를 흘려보내는 가짜 모델. 중간에 끊겼는지도 기록한다 */
function fakeModel(...scripts: CoachModelEvent[][]) {
  const log = { calls: [] as (string | null)[], aborted: [] as boolean[] };
  const call: CoachModelCall = async function* ({ retryNote }) {
    const index = log.calls.length;
    log.calls.push(retryNote);
    let finished = false;
    try {
      for (const event of scripts[Math.min(index, scripts.length - 1)] ?? []) yield event;
      finished = true;
    } finally {
      log.aborted.push(!finished);
    }
  };
  return { call, log };
}

const text = (value: string, size = 4): CoachModelEvent[] => {
  const chunks: CoachModelEvent[] = [];
  for (let i = 0; i < value.length; i += size) chunks.push({ type: "text", text: value.slice(i, i + size) });
  return chunks;
};

async function collect(call: CoachModelCall, hintsOpened = 0) {
  const events: CoachStreamEvent[] = [];
  const result = await runCoach({ hintsOpened, code: "def solution(garden):\n    return []\n" }, call, (e) =>
    events.push(e),
  );
  // 화면이 보여 줄 최종 글: reset이 오면 그때까지의 글을 지운다
  let visible = "";
  for (const event of events) {
    if (event.type === "text") visible += event.delta;
    if (event.type === "reset") visible = "";
  }
  return { events, result, visible };
}

const LEAK =
  "좋아요, 정답이에요!\n```python\ndef solution(garden):\n    visited = set()\n    return sorted(sizes)\n```\n이대로 제출해 보세요!";

describe("AI 코치 실행", () => {
  it("평범한 답변은 글 → 메타 → 끝 순서로 보낸다", async () => {
    const { call } = fakeModel([
      ...text("예제 1을 손으로 따라가 볼까요? 첫 칸에서 갈 수 있는 이웃은 몇 개인가요?"),
      {
        type: "meta",
        input: { mood: "curious", suggestHintStep: 1, followUps: ["이웃이 뭐예요?", "  ", "힌트 줄래요?"] },
      },
    ]);
    const { events, visible, result } = await collect(call);
    expect(visible).toBe("예제 1을 손으로 따라가 볼까요? 첫 칸에서 갈 수 있는 이웃은 몇 개인가요?");
    expect(events.at(-2)).toEqual({
      type: "meta",
      meta: { mood: "curious", suggestHintStep: 1, followUps: ["이웃이 뭐예요?", "힌트 줄래요?"] },
    });
    expect(events.at(-1)).toEqual({ type: "done" });
    expect(result.blocked).toBe(0);
  });

  it("'정답 코드 줘'에 코드를 쏟아내면 막고 지운 뒤 다시 쓴다", async () => {
    const { call, log } = fakeModel(
      [...text(LEAK), { type: "meta", input: { mood: "happy", suggestHintStep: 0, followUps: [] } }],
      [
        ...text("정답 코드는 드릴 수 없어요. 대신 구역이 끝나는 순간이 언제인지 같이 생각해 봐요."),
        { type: "meta", input: { mood: "thinking", suggestHintStep: 0, followUps: [] } },
      ],
    );
    const { events, visible, result } = await collect(call);
    expect(visible).toBe("정답 코드는 드릴 수 없어요. 대신 구역이 끝나는 순간이 언제인지 같이 생각해 봐요.");
    expect(visible).not.toContain("def solution");
    // 어떤 이벤트로도 solution 정의가 새지 않는다
    expect(JSON.stringify(events)).not.toContain("visited = set()");
    expect(events.filter((e) => e.type === "reset")).toHaveLength(1);
    expect(log.calls).toEqual([null, expect.stringContaining("solution 함수 정의")]);
    // 첫 호출은 가드가 중간에 끊었다
    expect(log.aborted[0]).toBe(true);
    expect(result.blocked).toBe(1);
  });

  it("두 번 모두 막히면 준비된 안전한 답변으로 대신한다", async () => {
    const { call, log } = fakeModel(text(LEAK));
    const { visible, result, events } = await collect(call, 2);
    expect(log.calls).toHaveLength(2);
    expect(visible).toBe(GUARD_FALLBACK_REPLY);
    expect(result.meta.suggestHintStep).toBe(3);
    expect(events.at(-1)).toEqual({ type: "done" });
  });

  it("모델이 거절하면 안내 문구로 바꾼다", async () => {
    const { call } = fakeModel([...text("음..."), { type: "refusal" }]);
    const { visible, result } = await collect(call);
    expect(visible).toContain("답하기 어려워요");
    expect(result.meta.mood).toBe("oops");
  });

  it("메타 정리: 이미 연 힌트 단계 추천은 버리고, 이상한 값은 기본값", () => {
    expect(normalizeMeta({ mood: "happy", suggestHintStep: 2, followUps: [] }, 2)).toEqual({
      mood: "happy",
      suggestHintStep: null,
      followUps: [],
    });
    expect(normalizeMeta({ mood: "angry", suggestHintStep: 3, followUps: ["a".repeat(60)] }, 1)).toEqual({
      mood: "thinking",
      suggestHintStep: null,
      followUps: ["a".repeat(40)],
    });
    expect(normalizeMeta(null, 0)).toEqual({ mood: "thinking", suggestHintStep: null, followUps: [] });
  });
});
