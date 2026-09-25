import "server-only";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { AI_EFFORT, AI_MODELS, fallbackOptions, getAnthropic } from "./client";
import { DraftFormatError, type DraftRequest } from "./pipeline";
import { buildGeneratorRequest, GENERATOR_SYSTEM } from "./prompts/generator";
import { problemDraftSchema } from "./schemas";

/** 문제 한 개 초안이 충분히 들어가는 출력 한도 (스트리밍이라 타임아웃 걱정 없음) */
const MAX_OUTPUT_TOKENS = 32_000;

export class GenerationRefusedError extends Error {}

/** Claude에게 구조화 출력으로 문제 초안을 받는다. 형식 검증은 파이프라인의 스키마 단계가 한다 */
export async function draftWithClaude({ request, previousFailure }: DraftRequest): Promise<unknown> {
  const model = AI_MODELS.generator;
  const stream = getAnthropic().beta.messages.stream({
    model,
    max_tokens: MAX_OUTPUT_TOKENS,
    thinking: { type: "adaptive" },
    output_config: { effort: AI_EFFORT.generator, format: betaZodOutputFormat(problemDraftSchema) },
    system: [{ type: "text", text: GENERATOR_SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: buildGeneratorRequest(request, previousFailure) }],
    ...fallbackOptions(model),
  });
  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new GenerationRefusedError("AI가 이 조건으로는 문제를 만들 수 없다고 했어요. 테마나 패턴을 바꿔 보세요.");
  }
  if (message.stop_reason === "max_tokens") {
    throw new DraftFormatError("출력이 너무 길어서 잘렸어요. 테스트 입력의 크기를 줄여 주세요");
  }
  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new DraftFormatError("응답이 올바른 JSON이 아니에요");
  }
}
