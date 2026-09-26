import type { Metadata } from "next";
import { formatDateTime, formatNumber } from "@/components/admin/format";
import { StatTile } from "@/components/admin/stat-tile";
import { TrendChart } from "@/components/admin/trend-chart";
import { getAdmin, requireAdmin } from "@/lib/admin/auth";
import { getOverview } from "@/lib/admin/queries";

export async function generateMetadata(): Promise<Metadata> {
  return (await getAdmin()) ? { title: "운영 현황" } : {};
}

const SOURCE_LABELS: Record<string, string> = {
  server: "서버",
  client: "브라우저",
  boundary: "에러 화면",
  engine: "채점 엔진",
};

export default async function AdminOverviewPage() {
  await requireAdmin();
  const { overview, errors } = await getOverview(14);
  const { totals, daily } = overview;
  const series = (key: "signups" | "activeUsers" | "submissions" | "accepted") =>
    daily.map((d) => ({ day: d.day, value: Number(d[key]) }));
  const acceptRate = totals.submissions > 0 ? Math.round((totals.accepted / totals.submissions) * 100) : 0;

  return (
    <>
      <h1 className="text-h1 text-foreground">운영 현황</h1>

      <section aria-label="합계" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="전체 회원" value={totals.users} />
        <StatTile label="최근 7일 활동 회원" value={totals.activeLast7Days} />
        <StatTile label="전체 제출" value={totals.submissions} hint={`정답률 ${acceptRate}%`} />
        <StatTile label="해결한 문제 (회원×문제)" value={totals.solvedProblems} />
        <StatTile label="AI 맞춤 문제 생성" value={totals.generatedProblems} />
        <StatTile label="AI 코치 질문" value={totals.coachMessages} />
      </section>

      <section aria-labelledby="trend-title" className="flex flex-col gap-3">
        <h2 id="trend-title" className="text-h3 text-foreground">
          최근 14일 추이
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TrendChart title="가입" unit="명" points={series("signups")} />
          <TrendChart title="활동 회원" unit="명" points={series("activeUsers")} />
          <TrendChart title="제출" unit="건" points={series("submissions")} />
          <TrendChart title="정답 제출" unit="건" points={series("accepted")} />
        </div>
        <p className="text-caption text-muted-foreground">
          로그인한 회원만 집계해요. 게스트의 학습은 각자의 브라우저에만 저장돼서 여기에 나오지 않아요.
        </p>
      </section>

      <section aria-labelledby="errors-title" className="flex flex-col gap-3">
        <h2 id="errors-title" className="text-h3 text-foreground">
          최근 에러
        </h2>
        {errors.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-small text-muted-foreground">
            기록된 에러가 없어요.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/70 bg-card shadow-soft">
            <table className="w-full min-w-[640px] text-small">
              <thead className="border-b text-left text-caption text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-semibold">마지막 발생</th>
                  <th className="px-3 py-2 font-semibold">출처</th>
                  <th className="px-3 py-2 text-right font-semibold">횟수</th>
                  <th className="px-3 py-2 font-semibold">메시지</th>
                  <th className="px-3 py-2 font-semibold">경로 · 버전</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((error) => (
                  <tr key={`${error.fingerprint}-${error.source}`} className="border-b align-top last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap tabular">{formatDateTime(error.lastSeen)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{SOURCE_LABELS[error.source] ?? error.source}</td>
                    <td className="px-3 py-2 text-right tabular">{formatNumber(error.occurrences)}</td>
                    <td className="max-w-md px-3 py-2 break-words text-foreground">{error.message}</td>
                    <td className="px-3 py-2 text-caption text-muted-foreground">
                      {error.path ?? "—"}
                      {error.release && <span className="block font-mono">{error.release}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
