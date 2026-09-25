import type { Instrumentation } from "next";

/**
 * 서버 에러 모니터링: Next.js가 서버에서 잡은 에러(서버 컴포넌트 렌더링, Route Handler, Server Action, Proxy)를 기록한다.
 * 요청 헤더(쿠키 등)는 저장하지 않고, 쿼리를 뺀 경로와 User-Agent만 남긴다.
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const { describeThrown } = await import("@/lib/monitoring/event");
  const { recordError, SERVER_RELEASE } = await import("@/lib/monitoring/store");
  const { message, stack, digest } = describeThrown(error);
  const userAgent = request.headers["user-agent"];
  await recordError({
    source: "server",
    message,
    stack,
    digest,
    path: request.path,
    routePath: context.routePath,
    routeType: context.routeType,
    userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
    release: SERVER_RELEASE,
  });
};
