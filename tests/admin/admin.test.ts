import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

class NotFound extends Error {}
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new NotFound("NEXT_NOT_FOUND");
  },
}));

const state = {
  configured: true,
  user: { id: "u-1", email: "nodi@example.com" } as { id: string; email: string } | null,
  adminRow: { user_id: "u-1" } as { user_id: string } | null,
  adminError: null as { message: string } | null,
  rpcRows: [] as Record<string, unknown>[],
};
const rpc = vi.fn<(name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: null }>>(
  async () => ({ data: state.rpcRows, error: null }),
);

vi.mock("@/lib/supabase/server", () => ({ getAuthUser: async () => state.user }));
vi.mock("@/lib/supabase/admin", () => ({
  isSupabaseAdminConfigured: () => state.configured,
  getAdminSupabase: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: state.adminRow, error: state.adminError }) }),
      }),
    }),
    rpc,
  }),
}));

const { getAdmin, requireAdmin } = await import("@/lib/admin/auth");
const { listUsers, problemLabel, USERS_PAGE_SIZE } = await import("@/lib/admin/queries");

beforeEach(() => {
  state.configured = true;
  state.user = { id: "u-1", email: "nodi@example.com" };
  state.adminRow = { user_id: "u-1" };
  state.adminError = null;
  state.rpcRows = [];
  rpc.mockClear();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("관리자 확인", () => {
  it("admins에 있는 로그인 사용자만 관리자다", async () => {
    await expect(getAdmin()).resolves.toMatchObject({ id: "u-1" });
    await expect(requireAdmin()).resolves.toMatchObject({ id: "u-1" });
  });

  it("관리자가 아니면 404 (로그인 안 함 · admins에 없음 · Supabase 미설정 · 조회 실패)", async () => {
    const cases: (() => void)[] = [
      () => (state.user = null),
      () => (state.adminRow = null),
      () => (state.configured = false),
      () => {
        state.adminRow = null;
        state.adminError = { message: "db down" };
      },
    ];
    for (const arrange of cases) {
      state.configured = true;
      state.user = { id: "u-1", email: "nodi@example.com" };
      state.adminRow = { user_id: "u-1" };
      state.adminError = null;
      arrange();
      await expect(getAdmin()).resolves.toBeNull();
      await expect(requireAdmin()).rejects.toBeInstanceOf(NotFound);
    }
  });
});

describe("관리자 조회", () => {
  it("관리자가 아니면 회원 목록을 조회하지 않는다", async () => {
    state.adminRow = null;
    await expect(listUsers({ search: "", sort: "joined", page: 1 })).rejects.toBeInstanceOf(NotFound);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("회원 목록: 검색어·정렬·페이지를 넘기고, 전체 수로 페이지 수를 계산한다", async () => {
    state.rpcRows = [
      {
        id: "a",
        email: "a@x.com",
        nickname: "에이",
        joined_at: "2026-09-20T00:00:00Z",
        last_sign_in_at: null,
        last_active_date: "2026-09-25",
        xp: 120,
        current_streak: 3,
        solved_count: 4,
        submission_count: 9,
        total_count: USERS_PAGE_SIZE + 1,
      },
    ];
    const result = await listUsers({ search: "에이", sort: "xp", page: 2 });
    expect(rpc).toHaveBeenCalledWith("admin_list_users", {
      p_search: "에이",
      p_sort: "xp",
      p_limit: USERS_PAGE_SIZE,
      p_offset: USERS_PAGE_SIZE,
    });
    expect(result).toMatchObject({ total: USERS_PAGE_SIZE + 1, page: 2, pageCount: 2 });
    expect(result.users[0]).toMatchObject({ nickname: "에이", xp: 120, solvedCount: 4, lastSignInAt: null });
  });

  it("문제 키를 사람이 읽는 이름으로 바꾼다", () => {
    expect(problemLabel("c:stack-plate-tower")).toBe("접시 탑 쌓기");
    expect(problemLabel("g:0f3a")).toBe("AI 맞춤 문제");
    expect(problemLabel("c:no-such-problem")).toBe("no-such-problem");
  });
});
