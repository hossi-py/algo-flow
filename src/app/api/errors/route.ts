import type { NextRequest } from "next/server";
import { clientReportSchema } from "@/lib/monitoring/event";
import { recordError } from "@/lib/monitoring/store";
import { consumeDaily } from "@/lib/server/rate-limit";

/** 요청 본문 최대 크기 (스택이 긴 에러도 들어오게 넉넉히) */
const MAX_BODY_BYTES = 32 * 1024;
/** 같은 IP가 하루에 보낼 수 있는 에러 보고 수 */
export const ERROR_REPORTS_PER_IP_PER_DAY = 300;

const reply = (status: number, message?: string) =>
  message ? Response.json({ error: message }, { status }) : new Response(null, { status });

/**
 * 브라우저 에러 보고 (instrumentation-client · 에러 화면 · 채점 엔진).
 * 로그인하지 않아도 받지만, IP마다 하루 한도를 두고 쿠키는 만들지 않는다.
 */
export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) return reply(413, "보고 내용이 너무 커요.");

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!consumeDaily(`errors-ip:${ip}`, ERROR_REPORTS_PER_IP_PER_DAY).ok) return reply(429, "오늘은 더 받을 수 없어요.");

  let text: string;
  try {
    text = await request.text();
  } catch {
    return reply(400, "요청을 읽지 못했어요.");
  }
  if (text.length > MAX_BODY_BYTES) return reply(413, "보고 내용이 너무 커요.");

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return reply(400, "요청 형식이 올바르지 않아요.");
  }
  const parsed = clientReportSchema.safeParse(body);
  if (!parsed.success) return reply(400, parsed.error.issues[0]?.message ?? "보고 내용을 확인해 주세요.");

  await recordError({ ...parsed.data, userAgent: request.headers.get("user-agent") });
  return reply(204);
}
