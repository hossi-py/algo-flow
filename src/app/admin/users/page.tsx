import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, formatDateTime, formatNumber } from "@/components/admin/format";
import { PopButton } from "@/components/common/pop-button";
import { getAdmin, requireAdmin } from "@/lib/admin/auth";
import { USER_SORTS, listUsers, type UserSort } from "@/lib/admin/queries";

export async function generateMetadata(): Promise<Metadata> {
  return (await getAdmin()) ? { title: "회원" } : {};
}

const SORT_LABELS: Record<UserSort, string> = {
  joined: "최근 가입",
  active: "최근 활동",
  xp: "XP 높은 순",
  solved: "많이 푼 순",
  email: "이메일",
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AdminUsersPage(props: PageProps<"/admin/users">) {
  await requireAdmin();
  const params = await props.searchParams;
  const search = first(params.q).trim();
  const sortParam = first(params.sort);
  const sort: UserSort = (USER_SORTS as readonly string[]).includes(sortParam) ? (sortParam as UserSort) : "joined";
  const page = Math.max(1, Number.parseInt(first(params.page), 10) || 1);
  const { users, total, pageCount } = await listUsers({ search, sort, page });

  const pageHref = (target: number) => {
    const query = new URLSearchParams();
    if (search) query.set("q", search);
    if (sort !== "joined") query.set("sort", sort);
    if (target > 1) query.set("page", String(target));
    const text = query.toString();
    return text ? `/admin/users?${text}` : "/admin/users";
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-h1 text-foreground">회원</h1>
        <p className="text-small text-muted-foreground">
          {search ? `“${search}” 검색 결과 ` : "전체 "}
          <strong className="text-foreground tabular">{formatNumber(total)}</strong>명
        </p>
      </div>

      <form role="search" className="flex flex-wrap items-center gap-2" action="/admin/users">
        <label className="sr-only" htmlFor="admin-user-search">
          이메일 또는 닉네임
        </label>
        <input
          id="admin-user-search"
          name="q"
          defaultValue={search}
          placeholder="이메일 또는 닉네임"
          className="h-10 min-w-0 flex-1 rounded-full border bg-card px-4 text-small outline-none focus-visible:ring-4 focus-visible:ring-ring/40 sm:max-w-sm"
        />
        <label className="sr-only" htmlFor="admin-user-sort">
          정렬
        </label>
        <select
          id="admin-user-sort"
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-full border bg-card px-3 text-small outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
        >
          {USER_SORTS.map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>
        <PopButton type="submit" size="sm">
          찾기
        </PopButton>
      </form>

      {users.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-small text-muted-foreground">
          {search ? "검색 결과가 없어요." : "아직 가입한 회원이 없어요."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/70 bg-card shadow-soft">
          <table className="w-full min-w-[760px] text-small">
            <thead className="border-b text-left text-caption text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">회원</th>
                <th className="px-3 py-2 font-semibold">가입</th>
                <th className="px-3 py-2 font-semibold">마지막 로그인</th>
                <th className="px-3 py-2 font-semibold">마지막 학습</th>
                <th className="px-3 py-2 text-right font-semibold">XP</th>
                <th className="px-3 py-2 text-right font-semibold">연속</th>
                <th className="px-3 py-2 text-right font-semibold">푼 문제</th>
                <th className="px-3 py-2 text-right font-semibold">제출</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-bold text-foreground underline-offset-2 outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/40"
                    >
                      {user.nickname}
                    </Link>
                    <span className="block text-caption text-muted-foreground">{user.email}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap tabular">{formatDate(user.joinedAt)}</td>
                  <td className="px-3 py-2 whitespace-nowrap tabular">{formatDateTime(user.lastSignInAt)}</td>
                  <td className="px-3 py-2 whitespace-nowrap tabular">{formatDate(user.lastActiveDate)}</td>
                  <td className="px-3 py-2 text-right tabular">{formatNumber(user.xp)}</td>
                  <td className="px-3 py-2 text-right tabular">{user.currentStreak}일</td>
                  <td className="px-3 py-2 text-right tabular">{formatNumber(user.solvedCount)}</td>
                  <td className="px-3 py-2 text-right tabular">{formatNumber(user.submissionCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="페이지" className="flex items-center justify-center gap-3 text-small">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="font-bold text-foreground hover:underline">
              ← 이전
            </Link>
          ) : (
            <span className="text-muted-foreground">← 이전</span>
          )}
          <span className="text-muted-foreground tabular">
            {page} / {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={pageHref(page + 1)} className="font-bold text-foreground hover:underline">
              다음 →
            </Link>
          ) : (
            <span className="text-muted-foreground">다음 →</span>
          )}
        </nav>
      )}
    </>
  );
}
