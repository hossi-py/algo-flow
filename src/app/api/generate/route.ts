import { after, type NextRequest } from "next/server";
import { AI_MODELS, isAiConfigured } from "@/lib/ai/client";
import { DAILY_GENERATION_LIMIT } from "@/lib/ai/limits";
import { IN_PROGRESS, runGenerationJob, withStaleCheck } from "@/lib/ai/jobs";
import { generationRequestSchema } from "@/lib/ai/schemas";
import { getGeneratedStore } from "@/lib/ai/store";
import { toSummary } from "@/lib/ai/views";
import { startOfLocalDay } from "@/lib/server/rate-limit";
import { getRequester } from "@/lib/server/requester";
import type { GeneratedProblem, GenerationRequest } from "@/types";

/** 생성·검증은 응답 뒤(after)에서 계속된다. 재시도까지 여유 있게 */
export const maxDuration = 300;

const error = (status: number, message: string) => Response.json({ error: message }, { status });

/** 새 문제 생성 요청 → 202 { id }. 진행 상태는 GET /api/generate/[id]로 조회 */
export async function POST(request: NextRequest) {
  if (!isAiConfigured()) return error(503, "AI 기능이 아직 설정되지 않았어요 (ANTHROPIC_API_KEY).");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error(400, "요청 형식이 올바르지 않아요.");
  }
  const parsed = generationRequestSchema.safeParse(body);
  if (!parsed.success) return error(400, parsed.error.issues[0]?.message ?? "요청 내용을 확인해 주세요.");

  const requester = await getRequester();
  const store = getGeneratedStore();

  const used = await store.countSince(requester.id, startOfLocalDay());
  if (used >= DAILY_GENERATION_LIMIT) {
    return error(429, `오늘은 문제를 ${DAILY_GENERATION_LIMIT}개까지 만들 수 있어요. 내일 다시 만나요!`);
  }
  const recent = await store.listByOwner(requester.id, 5);
  if (recent.map((record) => withStaleCheck(record)).some((record) => IN_PROGRESS.includes(record.status))) {
    return error(409, "이미 만들고 있는 문제가 있어요. 끝나면 다음 문제를 만들어 주세요.");
  }

  const input = parsed.data;
  const generationRequest: GenerationRequest = {
    topic: input.topic,
    level: input.level,
    focusPatterns: input.focusPatterns,
    weakSignalIds: input.weakSignalIds,
    ...(input.theme ? { theme: input.theme } : {}),
  };
  const record: GeneratedProblem = {
    id: crypto.randomUUID(),
    ownerId: requester.id,
    status: "queued",
    request: generationRequest,
    problem: null,
    attempts: [],
    model: AI_MODELS.generator,
    error: null,
    createdAt: new Date().toISOString(),
    verifiedAt: null,
  };
  await store.create(record);
  after(() => runGenerationJob(record));

  return Response.json({ id: record.id, remainingToday: DAILY_GENERATION_LIMIT - used - 1 }, { status: 202 });
}

/** 내가 만든 문제 목록 (최근 30개) */
export async function GET() {
  const requester = await getRequester();
  const records = await getGeneratedStore().listByOwner(requester.id, 30);
  const used = await getGeneratedStore().countSince(requester.id, startOfLocalDay());
  return Response.json({
    problems: records.map((record) => toSummary(withStaleCheck(record))),
    remainingToday: Math.max(0, DAILY_GENERATION_LIMIT - used),
    aiEnabled: isAiConfigured(),
  });
}
