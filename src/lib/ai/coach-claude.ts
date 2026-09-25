import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import type { Problem } from "@/types";
import { AI_EFFORT, AI_MODELS, fallbackOptions, getAnthropic } from "./client";
import type { CoachModelCall } from "./coach";
import { buildCoachContext, COACH_META_TOOL, COACH_SYSTEM, retryInstruction } from "./prompts/coach";
import type { CoachRequest } from "./schemas";

/** 짧은 대화지만 생각 토큰도 포함되므로 여유 있게 */
const MAX_OUTPUT_TOKENS = 8000;

/** 대화 기록 + 이번 질문(현재 상황을 앞에 붙여서)을 API 메시지로 */
function toMessages(problem: Problem, request: CoachRequest): Anthropic.Beta.BetaMessageParam[] {
  const history = [...request.messages];
  // API 대화는 user로 시작해야 한다 (노디의 첫인사 등은 버린다)
  while (history[0]?.role === "assistant") history.shift();
  const last = history.pop();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  messages.push({
    role: "user",
    content: [
      { type: "text", text: `[현재 상황 — 학습자에게는 보이지 않아요]\n${buildCoachContext(problem, request)}` },
      { type: "text", text: `[학습자의 질문]\n${last?.content ?? ""}` },
    ],
  });
  return messages;
}

export function claudeCoachCall(problem: Problem, request: CoachRequest, signal: AbortSignal): CoachModelCall {
  const model = AI_MODELS.coach;
  const messages = toMessages(problem, request);

  return async function* ({ retryNote }) {
    const system: Anthropic.Beta.BetaTextBlockParam[] = [
      { type: "text", text: COACH_SYSTEM, cache_control: { type: "ephemeral" } },
    ];
    if (retryNote) system.push({ type: "text", text: retryInstruction(retryNote) });

    const stream = getAnthropic().beta.messages.stream(
      {
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        thinking: { type: "adaptive" },
        output_config: { effort: AI_EFFORT.coach },
        system,
        messages,
        tools: [COACH_META_TOOL],
        tool_choice: { type: "auto" },
        ...fallbackOptions(model),
      },
      { signal },
    );
    let finished = false;
    try {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield { type: "text", text: event.delta.text };
        }
      }
      const final = await stream.finalMessage();
      finished = true;
      if (final.stop_reason === "refusal") yield { type: "refusal" };
      const meta = final.content.find((block) => block.type === "tool_use" && block.name === COACH_META_TOOL.name);
      if (meta && meta.type === "tool_use") yield { type: "meta", input: meta.input };
    } finally {
      // 가드가 중간에 멈추거나 사용자가 떠나면 모델 요청도 끊는다
      if (!finished) stream.abort();
    }
  };
}
