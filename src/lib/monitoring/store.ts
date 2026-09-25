import "server-only";
import { getAdminSupabase, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { describeThrown, toErrorEvent, type ErrorEvent, type RawError } from "./event";

/**
 * 에러 기록. 항상 서버 로그에 한 줄(JSON)로 남기고, Supabase가 설정돼 있으면 error_events에도 저장한다.
 * 기록하다 실패해도 원래 요청에는 영향을 주지 않는다.
 */
export async function recordError(raw: RawError): Promise<ErrorEvent> {
  const event = toErrorEvent(raw);
  console.error(`[error:${event.source}] ${JSON.stringify(event)}`);
  if (!isSupabaseAdminConfigured()) return event;
  try {
    const { error } = await getAdminSupabase().from("error_events").insert({
      source: event.source,
      fingerprint: event.fingerprint,
      message: event.message,
      stack: event.stack,
      digest: event.digest,
      path: event.path,
      route_path: event.routePath,
      route_type: event.routeType,
      user_agent: event.userAgent,
      release: event.release,
    });
    if (error) console.warn("[error] error_events 저장 실패", error.message);
  } catch (cause) {
    console.warn("[error] error_events 저장 실패", cause instanceof Error ? cause.message : cause);
  }
  return event;
}

/** 서버 코드에서 잡은 예외를 기록한다 (API 라우트의 catch 등) */
export function recordServerException(where: string, thrown: unknown, path?: string): Promise<ErrorEvent> {
  const { message, stack, digest } = describeThrown(thrown);
  return recordError({
    source: "server",
    message: `[${where}] ${message}`,
    stack,
    digest,
    path: path ?? null,
    routeType: "route",
    release: SERVER_RELEASE,
  });
}

/** 배포 버전 (배포 파이프라인에서 커밋 해시 등을 넣는다) */
export const SERVER_RELEASE = process.env.NEXT_PUBLIC_RELEASE ?? null;
