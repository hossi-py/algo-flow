import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const insert = vi.fn<(row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>>(
  async () => ({ error: null }),
);
const admin = { configured: true };
vi.mock("@/lib/supabase/admin", () => ({
  isSupabaseAdminConfigured: () => admin.configured,
  getAdminSupabase: () => ({
    from: (table: string) => ({ insert: (row: Record<string, unknown>) => insert({ table, ...row }) }),
  }),
}));

const { recordError, recordServerException } = await import("@/lib/monitoring/store");

let consoleError: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  insert.mockClear();
  admin.configured = true;
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("에러 기록", () => {
  it("정리한 내용을 서버 로그와 error_events에 남긴다", async () => {
    await recordError({ source: "client", message: "nodi@example.com 실패", path: "/me?x=1", routePath: "/me" });
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("[error:client]"));
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "error_events",
        source: "client",
        message: "[email] 실패",
        path: "/me",
        route_path: "/me",
      }),
    );
  });

  it("Supabase가 없으면 서버 로그에만 남긴다", async () => {
    admin.configured = false;
    await recordError({ source: "server", message: "boom" });
    expect(consoleError).toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });

  it("저장이 실패해도 예외를 던지지 않는다", async () => {
    insert.mockResolvedValueOnce({ error: { message: "db down" } });
    await expect(recordError({ source: "server", message: "boom" })).resolves.toMatchObject({ message: "boom" });
    insert.mockRejectedValueOnce(new Error("network"));
    await expect(recordError({ source: "server", message: "boom" })).resolves.toMatchObject({ message: "boom" });
  });

  it("서버 코드에서 잡은 예외는 어디서 났는지 붙여 기록한다", async () => {
    const event = await recordServerException("coach", new Error("모델 응답 없음"), "/api/coach");
    expect(event).toMatchObject({
      source: "server",
      message: "[coach] Error: 모델 응답 없음",
      path: "/api/coach",
      routeType: "route",
    });
  });
});
