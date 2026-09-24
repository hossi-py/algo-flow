import type { HintsOpened } from "@/types";
import { CoachStreamGuard, GUARD_FALLBACK_REPLY, type GuardViolation } from "./coach-guard";
import { coachMetaSchema, type CoachMeta, type CoachRequest, type CoachStreamEvent } from "./schemas";

/** 모델 호출 한 번이 흘려보내는 것 */
export type CoachModelEvent = { type: "text"; text: string } | { type: "meta"; input: unknown } | { type: "refusal" };

/** 모델 호출. retryNote가 있으면 가드에 막혀 다시 쓰는 중이다. 제너레이터를 중간에 멈추면 요청도 끊어야 한다 */
export type CoachModelCall = (options: { retryNote: string | null }) => AsyncGenerator<CoachModelEvent>;

export const MAX_COACH_ATTEMPTS = 2;

const DEFAULT_META: CoachMeta = { mood: "thinking", suggestHintStep: null, followUps: [] };

/** 모델이 준 메타를 화면에 쓸 수 있게 다듬는다 (없거나 이상하면 기본값) */
export function normalizeMeta(input: unknown, hintsOpened: HintsOpened): CoachMeta {
  if (!input || typeof input !== "object") return DEFAULT_META;
  const raw = input as { mood?: unknown; suggestHintStep?: unknown; followUps?: unknown };
  const step =
    typeof raw.suggestHintStep === "number" && raw.suggestHintStep > hintsOpened ? raw.suggestHintStep : null;
  const followUps = Array.isArray(raw.followUps)
    ? raw.followUps
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .map((item) => item.trim().slice(0, 40))
        .slice(0, 3)
    : [];
  const parsed = coachMetaSchema.safeParse({ mood: raw.mood, suggestHintStep: step, followUps });
  return parsed.success ? parsed.data : { ...DEFAULT_META, followUps };
}

export interface CoachRunResult {
  /** 사용자에게 최종으로 보인 답변 */
  reply: string;
  meta: CoachMeta;
  /** 가드에 막힌 횟수 */
  blocked: number;
}

/**
 * 코치 답변을 가드에 통과시키며 흘려보낸다. 막히면 지금까지 보낸 글을 지우게 하고(reset) 한 번 더 쓴다.
 * 두 번 모두 막히면 준비된 안전한 답변으로 대신한다.
 */
export async function runCoach(
  request: Pick<CoachRequest, "hintsOpened" | "code">,
  call: CoachModelCall,
  send: (event: CoachStreamEvent) => void,
): Promise<CoachRunResult> {
  const hintsOpened = request.hintsOpened as HintsOpened;
  let retryNote: string | null = null;
  let blocked = 0;

  for (let attempt = 1; attempt <= MAX_COACH_ATTEMPTS; attempt += 1) {
    const guard = new CoachStreamGuard({ hintsOpened, userCode: request.code });
    let shown = "";
    let metaInput: unknown = null;
    let refused = false;
    let violation: GuardViolation | null = null;

    for await (const event of call({ retryNote })) {
      if (event.type === "text") {
        const step = guard.push(event.text);
        if (step.emit) {
          shown += step.emit;
          send({ type: "text", delta: step.emit });
        }
        if (step.violation) {
          violation = step.violation;
          break; // 제너레이터가 닫히면서 모델 요청도 끊긴다
        }
      } else if (event.type === "meta") {
        metaInput = event.input;
      } else {
        refused = true;
      }
    }

    if (!violation) {
      const end = guard.finish();
      if (end.emit) {
        shown += end.emit;
        send({ type: "text", delta: end.emit });
      }
      violation = end.violation;
    }

    if (violation) {
      blocked += 1;
      send({ type: "reset", reason: "답을 너무 많이 알려 줄 뻔해서 다시 쓰고 있어요" });
      retryNote = violation.detail;
      continue;
    }

    if (refused) {
      if (shown) send({ type: "reset", reason: "답할 수 없는 질문이었어요" });
      const reply = "이 질문에는 답하기 어려워요. 문제 풀이와 관련된 질문을 해 주세요!";
      send({ type: "text", delta: reply });
      const meta: CoachMeta = { mood: "oops", suggestHintStep: null, followUps: [] };
      send({ type: "meta", meta });
      send({ type: "done" });
      return { reply, meta, blocked };
    }

    const meta = normalizeMeta(metaInput, hintsOpened);
    send({ type: "meta", meta });
    send({ type: "done" });
    return { reply: shown, meta, blocked };
  }

  send({ type: "text", delta: GUARD_FALLBACK_REPLY });
  const meta: CoachMeta = {
    mood: "thinking",
    suggestHintStep: hintsOpened < 4 ? hintsOpened + 1 : null,
    followUps: [],
  };
  send({ type: "meta", meta });
  send({ type: "done" });
  return { reply: GUARD_FALLBACK_REPLY, meta, blocked };
}
