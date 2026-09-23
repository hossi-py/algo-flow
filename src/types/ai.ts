import type { IsoDateTime, ProblemKey } from "./common";
import type { LevelNumber, PatternTag, Problem, TopicSlug } from "./content";
import type { HintsOpened } from "./progress";

export type MascotMood = "idle" | "happy" | "cheer" | "thinking" | "oops" | "sleepy" | "curious" | "loading";

export interface CoachMessage {
  id: string;
  problemKey: ProblemKey;
  role: "user" | "assistant";
  content: string;
  /** 이 메시지 시점에 열려 있던 힌트 단계 */
  hintLevel: HintsOpened;
  mood?: MascotMood;
  createdAt: IsoDateTime;
}

export type GenerationStatus = "queued" | "generating" | "verifying" | "verified" | "rejected" | "failed";

export interface GenerationRequest {
  topic: TopicSlug;
  level: Exclude<LevelNumber, 1>;
  focusPatterns: PatternTag[];
  weakSignalIds: string[];
  /** 선택: 문제 스토리 테마. 예: "우주", "카페" */
  theme?: string;
}

export type VerificationStage = "schema" | "static-check" | "execution" | "determinism" | "quality";

export interface VerificationAttempt {
  attempt: number;
  stage: VerificationStage;
  ok: boolean;
  /** 실패 사유 (재생성 프롬프트에 그대로 전달) */
  reason: string | null;
  durationMs: number;
  at: IsoDateTime;
}

export interface GeneratedProblem {
  id: string;
  ownerId: string;
  status: GenerationStatus;
  request: GenerationRequest;
  /** status === "verified"일 때만 존재. source는 "generated", id는 "g:<uuid>" */
  problem: Problem | null;
  attempts: VerificationAttempt[];
  model: string;
  error: string | null;
  createdAt: IsoDateTime;
  verifiedAt: IsoDateTime | null;
}
