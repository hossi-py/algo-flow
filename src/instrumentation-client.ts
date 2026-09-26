import { reportClientError, setLeaving } from "@/lib/monitoring/report-client";

/**
 * 브라우저 에러 모니터링: 아무도 잡지 않은 에러와 Promise 거부를 /api/errors로 보낸다.
 * (에러 화면이 뜬 렌더링 에러는 error.tsx가 따로 보낸다)
 */
try {
  window.addEventListener("error", (event) => {
    reportClientError(event.error ?? event.message);
  });
  window.addEventListener("unhandledrejection", (event) => {
    reportClientError(event.reason, { context: "unhandledrejection" });
  });
  // 페이지를 떠나는 동안 끊긴 요청 때문에 나는 가짜 에러는 보내지 않는다
  window.addEventListener("beforeunload", () => {
    setLeaving(true);
    // "페이지를 떠나시겠어요?"에서 취소해 남았다면 다시 보고한다 (실제로 떠나면 이 타이머는 돌지 않는다)
    window.setTimeout(() => setLeaving(false), 2000);
  });
  window.addEventListener("pagehide", () => setLeaving(true));
  window.addEventListener("pageshow", () => setLeaving(false));
} catch {
  // 모니터링 설정 실패가 앱을 막지 않게 한다
}
