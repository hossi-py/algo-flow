import { describeThrown, type ClientReport } from "./event";

/**
 * 브라우저 에러를 /api/errors로 보낸다.
 * - 같은 에러는 페이지를 새로 열 때까지 한 번만 보낸다
 * - 한 페이지에서 최대 10건까지만 보낸다 (에러가 반복될 때 요청 폭주 방지)
 * - 확장 프로그램·브라우저 내부에서 나는 잡음은 무시한다
 * - 페이지를 떠나는 중에 난 에러는 보내지 않는다: 떠날 때 브라우저가 진행 중인 요청을 끊어
 *   (예: Monaco 워커가 파일을 받는 중) 생기는 가짜 에러이고, 사용자에게는 이미 보이지 않는다
 */
export const ERROR_ENDPOINT = "/api/errors";
const MAX_REPORTS_PER_PAGE = 10;

const sent = new Set<string>();
let count = 0;
let leaving = false;

/** 페이지를 떠나기 시작했는지 (beforeunload·pagehide). 뒤로 가기 캐시로 돌아오면(pageshow) 다시 false */
export function setLeaving(value: boolean) {
  leaving = value;
}

const NOISE = [
  /ResizeObserver loop/i,
  /^Script error\.?$/i, // 다른 출처 스크립트: 내용을 알 수 없다
  /AbortError/i, // 사용자가 요청을 취소함
  /(chrome|moz|safari)-extension:\/\//i,
];

export function isNoise(message: string, stack: string | null): boolean {
  return NOISE.some((pattern) => pattern.test(message) || (stack !== null && pattern.test(stack)));
}

export function reportClientError(
  thrown: unknown,
  options: { source?: ClientReport["source"]; digest?: string | null; context?: string } = {},
): boolean {
  if (typeof window === "undefined" || leaving) return false;
  const described = describeThrown(thrown);
  const message = options.context ? `[${options.context}] ${described.message}` : described.message;
  if (isNoise(message, described.stack)) return false;

  const key = `${options.source ?? "client"}|${message}|${described.stack?.split("\n")[1] ?? ""}`;
  if (sent.has(key) || count >= MAX_REPORTS_PER_PAGE) return false;
  sent.add(key);
  count += 1;

  const report: ClientReport = {
    source: options.source ?? "client",
    message,
    stack: described.stack,
    digest: options.digest ?? described.digest,
    path: window.location.pathname,
    release: process.env.NEXT_PUBLIC_RELEASE ?? null,
  };
  const body = JSON.stringify(report);
  try {
    // 페이지를 떠나는 중에도 전송되도록 sendBeacon을 먼저 쓴다
    const beacon = navigator.sendBeacon?.(ERROR_ENDPOINT, new Blob([body], { type: "application/json" }));
    if (!beacon) {
      void fetch(ERROR_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // 보고 실패는 조용히 넘어간다
  }
  return true;
}

/** 테스트용: 보낸 기록을 지운다 */
export function resetClientReports() {
  sent.clear();
  count = 0;
  leaving = false;
}
