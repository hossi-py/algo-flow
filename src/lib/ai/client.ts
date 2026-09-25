import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic 클라이언트와 모델 설정 (서버 전용).
 * 모델 ID는 환경 변수로 바꿀 수 있고, 기본값은 claude-opus-5.
 */
export const AI_MODELS = {
  coach: process.env.AI_COACH_MODEL || "claude-opus-5",
  generator: process.env.AI_GENERATOR_MODEL || "claude-opus-5",
};

/** 코치는 짧은 대화라 낮은 effort, 문제 생성은 검증을 통과해야 하므로 높은 effort */
export const AI_EFFORT = {
  coach: "low",
  generator: "high",
} as const;

/** 안전 분류기가 요청을 거절하면 서버가 권장 모델로 다시 실행하는 기능 (fallbacks: "default")을 지원하는 모델 */
const DEFAULT_FALLBACK_MODELS = new Set(["claude-opus-5", "claude-opus-5-5", "claude-fable-5", "claude-fable-5-1"]);
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

export function fallbackOptions(model: string): { betas?: [typeof FALLBACK_BETA]; fallbacks?: "default" } {
  return DEFAULT_FALLBACK_MODELS.has(model) ? { betas: [FALLBACK_BETA], fallbacks: "default" } : {};
}

/** 개발용 모의 AI (lib/ai/mock.ts). 프로덕션 빌드에서는 켜지지 않는다 */
export function isAiMock(): boolean {
  return process.env.AI_MOCK === "1" && process.env.NODE_ENV !== "production";
}

/** API 키가 없으면 AI 기능을 끄고 화면에 안내한다 */
export function isAiConfigured(): boolean {
  return isAiMock() || Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  client ??= new Anthropic();
  return client;
}
