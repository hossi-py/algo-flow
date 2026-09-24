import type { NextRequest } from "next/server";
import { isAiConfigured, isAiMock } from "@/lib/ai/client";
import { runCoach } from "@/lib/ai/coach";
import { claudeCoachCall } from "@/lib/ai/coach-claude";
import { COACH_DAILY_LIMIT, COACH_DAILY_LIMIT_PER_IP } from "@/lib/ai/limits";
import { mockCoachCall } from "@/lib/ai/mock";
import { loadProblem } from "@/lib/ai/problem-source";
import { coachRequestSchema, type CoachRequest, type CoachStreamEvent } from "@/lib/ai/schemas";
import { consumeDaily } from "@/lib/server/rate-limit";
import { getRequester } from "@/lib/server/requester";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 120;

const error = (status: number, message: string) => Response.json({ error: message }, { status });

/**
 * AI 코치. 응답은 NDJSON 스트림 (한 줄에 CoachStreamEvent 하나):
 *   text* → (reset → text*)? → meta → done
 */
export async function POST(request: NextRequest) {
  if (!isAiConfigured()) return error(503, "AI 코치가 아직 설정되지 않았어요 (ANTHROPIC_API_KEY).");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error(400, "요청 형식이 올바르지 않아요.");
  }
  const parsed = coachRequestSchema.safeParse(body);
  if (!parsed.success) return error(400, parsed.error.issues[0]?.message ?? "요청 내용을 확인해 주세요.");
  const coachRequest = parsed.data;

  const requester = await getRequester();
  const problem = await loadProblem(coachRequest.problemKey, requester.id);
  if (!problem) return error(404, "문제를 찾을 수 없어요.");

  const limit = COACH_DAILY_LIMIT[requester.kind];
  if (requester.kind === "guest" && !consumeDaily(`coach-ip:${requester.ip}`, COACH_DAILY_LIMIT_PER_IP).ok) {
    return error(429, "오늘 AI 코치와 충분히 이야기했어요. 내일 또 만나요!");
  }
  if (!consumeDaily(`coach:${requester.id}`, limit).ok) {
    return error(429, `AI 코치는 하루 ${limit}번까지 물어볼 수 있어요. 내일 또 만나요!`);
  }

  const encoder = new TextEncoder();
  const upstream = new AbortController();
  request.signal.addEventListener("abort", () => upstream.abort());

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: CoachStreamEvent) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // 사용자가 이미 떠남
        }
      };
      try {
        const call = isAiMock() ? mockCoachCall(coachRequest) : claudeCoachCall(problem, coachRequest, upstream.signal);
        const result = await runCoach(coachRequest, call, send);
        if (result.blocked > 0) console.warn(`[coach] ${coachRequest.problemKey} 가드 차단 ${result.blocked}회`);
        if (requester.kind === "user") await saveThread(coachRequest, result.reply, result.meta.mood, requester.id);
      } catch (cause) {
        if (!upstream.signal.aborted) {
          console.error("[coach] 실패", cause);
          send({ type: "error", message: "노디가 잠깐 대답하지 못했어요. 다시 물어봐 주세요." });
        }
      } finally {
        try {
          controller.close();
        } catch {
          // 이미 닫힘
        }
      }
    },
    cancel() {
      upstream.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

/** 로그인 사용자의 대화는 서버에도 남긴다 (사용자 세션 → RLS가 본인 이름으로만 허용) */
async function saveThread(request: CoachRequest, reply: string, mood: string, userId: string) {
  const supabase = await createServerSupabase();
  const question = request.messages.at(-1)?.content;
  if (!supabase || !question || !reply) return;
  const base = { user_id: userId, problem_key: request.problemKey, hint_level: request.hintsOpened };
  const { error } = await supabase.from("coach_messages").insert([
    { ...base, role: "user", content: question.slice(0, 8000) },
    { ...base, role: "assistant", content: reply.slice(0, 8000), mood },
  ]);
  if (error) console.warn("[coach] 대화 저장 실패", error.message);
}
