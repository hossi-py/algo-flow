import { Activity, Bot, Send, Sparkles, Trophy, Users } from "lucide-react";
import type { AdminOverview, ErrorGroupRow, WeeklyKey } from "@/lib/admin/queries";
import { AreaChart, type ChartTone } from "./area-chart";
import { ErrorList } from "./error-list";
import { dayLabel, formatNumber } from "./format";
import { KpiCard } from "./kpi-card";

function SectionHeader({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 id={id} className="text-h3 text-foreground">
        {title}
      </h2>
      {description && <p className="text-small text-muted-foreground">{description}</p>}
    </div>
  );
}

/** 운영 현황 화면 (데이터는 페이지가 가져와 넘긴다) */
export function OverviewView({
  overview,
  errors,
  now,
}: {
  overview: AdminOverview;
  errors: ErrorGroupRow[];
  now: number;
}) {
  const { totals, daily, weekly } = overview;
  const week = (key: WeeklyKey, unit: string) => (weekly ? { ...weekly[key], unit } : undefined);
  const thisWeek = (key: WeeklyKey, unit: string) =>
    weekly ? `이번 주 ${formatNumber(weekly[key].current)}${unit}` : undefined;
  const acceptRate = totals.submissions > 0 ? Math.round((totals.accepted / totals.submissions) * 100) : 0;
  const series = (key: "signups" | "activeUsers" | "submissions" | "accepted") =>
    daily.map((d) => ({ day: d.day, value: Number(d[key]) }));
  const charts: {
    title: string;
    unit: string;
    key: Parameters<typeof series>[0];
    tone: ChartTone;
    summary?: "sum" | "average";
  }[] = [
    { title: "가입", unit: "명", key: "signups", tone: "violet" },
    // 같은 회원이 여러 날 활동하므로 합계가 아니라 하루 평균
    { title: "활동 회원", unit: "명", key: "activeUsers", tone: "mint", summary: "average" },
    { title: "제출", unit: "건", key: "submissions", tone: "sky" },
    { title: "정답 제출", unit: "건", key: "accepted", tone: "peach" },
  ];
  const today = daily.at(-1)?.day;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1 text-foreground">운영 현황</h1>
        <p className="text-small text-muted-foreground">
          {today ? `${dayLabel(today)} 기준 · ` : ""}변화 뱃지는 최근 7일을 그 전 7일과 비교해요.
        </p>
      </div>

      <section aria-label="주요 지표" className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="전체 회원"
          value={totals.users}
          icon={Users}
          tone="violet"
          weekly={week("signups", "명")}
          hint={weekly ? `이번 주 가입 ${formatNumber(weekly.signups.current)}명` : undefined}
          href="/admin/users"
        />
        <KpiCard
          label="7일 활동 회원"
          value={totals.activeLast7Days}
          icon={Activity}
          tone="mint"
          weekly={week("activeUsers", "명")}
          hint={weekly ? `지난주 ${formatNumber(weekly.activeUsers.previous)}명` : undefined}
          href="/admin/users?sort=active"
        />
        <KpiCard
          label="전체 제출"
          value={totals.submissions}
          icon={Send}
          tone="sky"
          weekly={week("submissions", "건")}
          hint={`정답률 ${acceptRate}%`}
        />
        <KpiCard
          label="해결한 문제"
          value={totals.solvedProblems}
          icon={Trophy}
          tone="peach"
          weekly={week("solvedProblems", "개")}
          hint={thisWeek("solvedProblems", "개")}
        />
        <KpiCard
          label="AI 맞춤 문제"
          value={totals.generatedProblems}
          icon={Sparkles}
          tone="lemon"
          weekly={week("generatedProblems", "개")}
          hint={thisWeek("generatedProblems", "개")}
        />
        <KpiCard
          label="AI 코치 질문"
          value={totals.coachMessages}
          icon={Bot}
          tone="lilac"
          weekly={week("coachMessages", "번")}
          hint={thisWeek("coachMessages", "번")}
        />
      </section>

      <section aria-labelledby="trend-title" className="flex flex-col gap-4">
        <SectionHeader
          id="trend-title"
          title="최근 14일 추이"
          description="그래프 위에 마우스를 올리거나 ←/→ 키로 날짜별 값을 볼 수 있어요. 게스트 학습은 각자의 브라우저에만 저장돼서 로그인한 회원만 집계해요."
        />
        <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {charts.map((chart) => (
            <AreaChart
              key={chart.key}
              title={chart.title}
              unit={chart.unit}
              tone={chart.tone}
              summary={chart.summary}
              points={series(chart.key)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="errors-title" className="flex flex-col gap-4">
        <SectionHeader
          id="errors-title"
          title="최근 에러"
          description="같은 원인끼리 묶어 마지막으로 난 순서대로 보여 줘요. 줄을 누르면 전체 내용이 펼쳐져요."
        />
        <ErrorList errors={errors} now={now} />
      </section>
    </div>
  );
}
