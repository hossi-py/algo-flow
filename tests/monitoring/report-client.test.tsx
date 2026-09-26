// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorScreen } from "@/components/common/error-screen";
import { ERROR_ENDPOINT, isNoise, reportClientError, resetClientReports } from "@/lib/monitoring/report-client";

const beacon = vi.fn<(url: string, body: Blob) => boolean>(() => true);

async function sentBodies(): Promise<Record<string, unknown>[]> {
  return Promise.all(
    beacon.mock.calls.map(async ([, body]) => JSON.parse(await body.text()) as Record<string, unknown>),
  );
}

beforeEach(() => {
  resetClientReports();
  beacon.mockClear();
  Object.defineProperty(navigator, "sendBeacon", { value: beacon, configurable: true });
  window.history.replaceState(null, "", "/problems/stack-plate-tower?lang=java");
});
afterEach(cleanup);

describe("브라우저 에러 보고", () => {
  it("경로와 함께 /api/errors로 보낸다", async () => {
    expect(reportClientError(new TypeError("undefined is not a function"))).toBe(true);
    expect(beacon).toHaveBeenCalledWith(ERROR_ENDPOINT, expect.any(Blob));
    const [body] = await sentBodies();
    expect(body).toMatchObject({
      source: "client",
      message: "TypeError: undefined is not a function",
      path: "/problems/stack-plate-tower",
    });
  });

  it("같은 에러는 한 번만, 한 페이지에서 최대 10건만 보낸다", () => {
    const error = new Error("반복");
    expect(reportClientError(error)).toBe(true);
    expect(reportClientError(error)).toBe(false);
    for (let i = 0; i < 20; i++) reportClientError(new Error(`다른 에러 ${i}`));
    expect(beacon).toHaveBeenCalledTimes(10);
  });

  it("확장 프로그램·ResizeObserver·취소 같은 잡음은 보내지 않는다", () => {
    expect(isNoise("ResizeObserver loop completed with undelivered notifications.", null)).toBe(true);
    expect(isNoise("Script error.", null)).toBe(true);
    expect(isNoise("boom", "at x (chrome-extension://abc/content.js:1:1)")).toBe(true);
    expect(reportClientError(new DOMException("aborted", "AbortError"))).toBe(false);
    expect(beacon).not.toHaveBeenCalled();
  });

  it("sendBeacon이 실패하면 fetch(keepalive)로 보낸다", () => {
    beacon.mockReturnValueOnce(false);
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    reportClientError(new Error("beacon 실패"));
    expect(fetchMock).toHaveBeenCalledWith(
      ERROR_ENDPOINT,
      expect.objectContaining({ method: "POST", keepalive: true }),
    );
    vi.unstubAllGlobals();
  });
});

describe("에러 화면", () => {
  it("에러를 boundary로 보고하고, 오류 번호와 다시 시도 버튼을 보여 준다", async () => {
    const retry = vi.fn();
    const error = Object.assign(new Error("렌더링 실패"), { digest: "4242" });
    render(<ErrorScreen error={error} retry={retry} />);

    expect(screen.getByText("앗, 문제가 생겼어요")).toBeTruthy();
    expect(screen.getByText("오류 번호 4242")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "홈으로 돌아가기" }).getAttribute("href")).toBe("/");

    const [body] = await sentBodies();
    expect(body).toMatchObject({ source: "boundary", digest: "4242", message: "Error: 렌더링 실패" });
  });
});

describe("페이지를 떠나는 중", () => {
  it("떠나기 시작한 뒤의 에러는 보내지 않고, 뒤로 가기 캐시로 돌아오면 다시 보낸다", async () => {
    const { setLeaving } = await import("@/lib/monitoring/report-client");
    setLeaving(true);
    expect(reportClientError(new Error("NetworkError: importScripts failed"))).toBe(false);
    expect(beacon).not.toHaveBeenCalled();
    setLeaving(false);
    expect(reportClientError(new Error("NetworkError: importScripts failed"))).toBe(true);
  });
});
