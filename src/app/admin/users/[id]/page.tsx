import { Bot, Flame, Sparkles, Star } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LANGUAGE_LABELS, VERDICT_LABELS, formatDate, formatDateTime, formatNumber } from "@/components/admin/format";
import { KpiCard } from "@/components/admin/kpi-card";
import { getAdmin, requireAdmin } from "@/lib/admin/auth";
import { getUserDetail } from "@/lib/admin/queries";

export async function generateMetadata(): Promise<Metadata> {
  return (await getAdmin()) ? { title: "회원 상세" } : {};
}

const GENERATION_LABELS: Record<string, string> = {
  queued: "대기",
  generating: "생성 중",
  verifying: "검증 중",
  verified: "완성",
  rejected: "검증 실패",
  failed: "오류",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 shadow-soft">
      <h2 className="text-h3 text-foreground">{title}</h2>
      {children}
    </section>
  );
}

const Empty = ({ children }: { children: ReactNode }) => <p className="text-small text-muted-foreground">{children}</p>;

export default async function AdminUserDetailPage(props: PageProps<"/admin/users/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const user = await getUserDetail(id);
  if (!user) notFound();

  return (
    <>
      <div className="flex flex-col gap-1">
        <Link href="/admin/users" className="text-caption font-bold text-muted-foreground hover:text-foreground">
          ← 회원 목록
        </Link>
        <h1 className="flex flex-wrap items-center gap-2 text-h1 text-foreground">
          {user.nickname}
          {user.isAdmin && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-caption font-bold text-secondary-foreground">
              관리자
            </span>
          )}
        </h1>
        <p className="text-small text-muted-foreground">
          {user.email} · 가입 {formatDate(user.joinedAt)} · 마지막 로그인 {formatDateTime(user.lastSignInAt)} · 주력
          언어 {LANGUAGE_LABELS[user.preferredLanguage] ?? user.preferredLanguage}
        </p>
      </div>

      <section aria-label="학습 통계" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="XP" value={user.stats.xp} icon={Star} tone="lemon" />
        <KpiCard
          label="연속 학습"
          value={user.stats.currentStreak}
          icon={Flame}
          tone="peach"
          hint={`최장 ${user.stats.longestStreak}일`}
        />
        <KpiCard label="AI 코치 질문" value={user.ai.coachQuestions} icon={Bot} tone="lilac" />
        <KpiCard
          label="AI 맞춤 문제"
          icon={Sparkles}
          tone="violet"
          value={Object.values(user.ai.generated).reduce((a, b) => a + b, 0)}
          hint={
            Object.entries(user.ai.generated)
              .map(([status, count]) => `${GENERATION_LABELS[status] ?? status} ${count}`)
              .join(" · ") || undefined
          }
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="토픽별 진도">
          {user.topics.length === 0 ? (
            <Empty>아직 시작한 토픽이 없어요.</Empty>
          ) : (
            <table className="w-full text-small">
              <thead className="text-left text-caption text-muted-foreground">
                <tr>
                  <th className="py-1 font-semibold">토픽</th>
                  <th className="py-1 font-semibold">개념</th>
                  <th className="py-1 text-right font-semibold">클리어 레벨</th>
                  <th className="py-1 text-right font-semibold">푼 문제</th>
                </tr>
              </thead>
              <tbody>
                {user.topics.map((topic) => (
                  <tr key={topic.slug} className="border-t">
                    <td className="py-1.5 text-foreground">{topic.title}</td>
                    <td className="py-1.5">{topic.conceptDone ? "완료" : "—"}</td>
                    <td className="py-1.5 text-right tabular">
                      {topic.highestLevel > 0 ? `Lv${topic.highestLevel}` : "—"}
                    </td>
                    <td className="py-1.5 text-right tabular">{topic.solved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="최근 30일 학습">
          {user.activity.length === 0 ? (
            <Empty>학습 기록이 없어요.</Empty>
          ) : (
            <table className="w-full text-small">
              <thead className="text-left text-caption text-muted-foreground">
                <tr>
                  <th className="py-1 font-semibold">날짜</th>
                  <th className="py-1 text-right font-semibold">얻은 XP</th>
                  <th className="py-1 text-right font-semibold">푼 문제</th>
                </tr>
              </thead>
              <tbody>
                {user.activity.map((day) => (
                  <tr key={day.day} className="border-t">
                    <td className="py-1.5 tabular">{formatDate(day.day)}</td>
                    <td className="py-1.5 text-right tabular">{formatNumber(day.xp)}</td>
                    <td className="py-1.5 text-right tabular">{day.solved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>
      </div>

      <Section title="최근 제출 20건">
        {user.recentSubmissions.length === 0 ? (
          <Empty>제출 기록이 없어요.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-small">
              <thead className="text-left text-caption text-muted-foreground">
                <tr>
                  <th className="py-1 font-semibold">시각</th>
                  <th className="py-1 font-semibold">문제</th>
                  <th className="py-1 font-semibold">언어</th>
                  <th className="py-1 font-semibold">결과</th>
                  <th className="py-1 text-right font-semibold">통과</th>
                  <th className="py-1 text-right font-semibold">힌트</th>
                </tr>
              </thead>
              <tbody>
                {user.recentSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-t">
                    <td className="py-1.5 whitespace-nowrap tabular">{formatDateTime(submission.createdAt)}</td>
                    <td className="py-1.5 text-foreground">
                      {submission.problem}
                      <span className="block text-caption text-muted-foreground">
                        {submission.topic} Lv{submission.level}
                      </span>
                    </td>
                    <td className="py-1.5">{LANGUAGE_LABELS[submission.language] ?? submission.language}</td>
                    <td className="py-1.5">{VERDICT_LABELS[submission.verdict] ?? submission.verdict}</td>
                    <td className="py-1.5 text-right tabular">
                      {submission.passed}/{submission.total}
                    </td>
                    <td className="py-1.5 text-right tabular">{submission.hintsOpened}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-caption text-muted-foreground">
          회원이 쓴 코드와 AI 코치 대화 내용은 관리자 화면에서 보여 주지 않아요.
        </p>
      </Section>

      <Section title="배지">
        {user.badges.length === 0 ? (
          <Empty>아직 받은 배지가 없어요.</Empty>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {user.badges.map((badge) => (
              <li key={badge.name} className="rounded-full bg-muted px-3 py-1 text-small text-foreground">
                {badge.name} <span className="text-caption text-muted-foreground">{formatDate(badge.earnedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
