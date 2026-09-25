import { reportClientError } from "@/lib/monitoring/report-client";

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
} catch {
  // 모니터링 설정 실패가 앱을 막지 않게 한다
}
