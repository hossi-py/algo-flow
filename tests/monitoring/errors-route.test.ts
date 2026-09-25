import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const recordError = vi.fn(async (raw: unknown) => raw);
vi.mock("@/lib/monitoring/store", () => ({ recordError }));

const { POST, ERROR_REPORTS_PER_IP_PER_DAY } = await import("@/app/api/errors/route");

let ipSeq = 0;
function post(body: unknown, headers: Record<string, string> = {}): Promise<Response> {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  const request = new Request("http://localhost/api/errors", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${ipSeq}`, ...headers },
    body: text,
  });
  return POST(request as unknown as NextRequest);
}

beforeEach(() => {
  recordError.mockClear();
  ipSeq += 1;
});

describe("POST /api/errors", () => {
  it("브라우저 에러를 받아 User-Agent와 함께 기록한다", async () => {
    const response = await post(
      { source: "client", message: "TypeError: x", path: "/problems/a?b=c" },
      { "user-agent": "Mozilla/5.0" },
    );
    expect(response.status).toBe(204);
    expect(recordError).toHaveBeenCalledWith(
      expect.objectContaining({ source: "client", message: "TypeError: x", userAgent: "Mozilla/5.0" }),
    );
  });

  it("형식이 틀리거나 서버 출처를 사칭하면 거절한다", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ source: "server", message: "가짜 서버 에러" })).status).toBe(400);
    expect((await post({ source: "client" })).status).toBe(400);
    expect(recordError).not.toHaveBeenCalled();
  });

  it("너무 큰 보고는 읽지 않고 거절한다", async () => {
    const huge = { source: "client", message: "x", stack: "y".repeat(40_000) };
    expect((await post(huge)).status).toBe(413);
    expect(recordError).not.toHaveBeenCalled();
  });

  it("같은 IP의 하루 한도를 넘으면 429", async () => {
    const headers = { "x-forwarded-for": "203.0.113.9" };
    for (let i = 0; i < ERROR_REPORTS_PER_IP_PER_DAY; i++) {
      expect((await post({ source: "client", message: `e${i}` }, headers)).status).toBe(204);
    }
    expect((await post({ source: "client", message: "one more" }, headers)).status).toBe(429);
    // 다른 IP는 영향을 받지 않는다
    expect((await post({ source: "client", message: "other" })).status).toBe(204);
  });
});
