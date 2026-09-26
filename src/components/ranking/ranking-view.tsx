import { Crown, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { dayLabel, formatNumber } from "@/components/admin/format";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";
import { Nodi } from "@/components/mascot/nodi";
import type { RankingEntry, WeeklyRanking } from "@/lib/ranking/queries";
import { cn } from "@/lib/utils";

/** 1~3위 메달 (색만이 아니라 순위 숫자와 글자로도 구분) */
const MEDALS: Record<number, { label: string; className: string; ring: string }> = {
  1: { label: "금메달", className: "bg-warning text-warning-foreground", ring: "ring-warning" },
  2: { label: "은메달", className: "bg-primary-soft text-primary-soft-foreground", ring: "ring-primary-soft" },
  3: { label: "동메달", className: "bg-secondary text-secondary-foreground", ring: "ring-secondary" },
};

function MeBadge() {
  return <span className="rounded-full bg-primary px-2 py-0.5 text-caption font-bold text-primary-foreground">나</span>;
}

function PodiumCard({ entry, tall, className }: { entry: RankingEntry; tall: boolean; className?: string }) {
  const medal = MEDALS[entry.rank] ?? MEDALS[3]!;
  return (
    <li
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-5 text-center shadow-soft",
        tall && "sm:-translate-y-4 sm:shadow-float",
        className,
        entry.isMe && "ring-4 ring-primary/40",
      )}
    >
      <div className="relative">
        <Nodi mood={entry.rank === 1 ? "cheer" : "happy"} size={tall ? 88 : 72} decorative />
        {entry.rank === 1 && (
          <Crown className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 text-warning-text" aria-hidden />
        )}
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-small font-extrabold tabular",
          medal.className,
        )}
      >
        {entry.rank}위 <span className="sr-only">{medal.label}</span>
      </span>
      <span className="flex max-w-full items-center gap-1.5 truncate text-h3 text-foreground">
        <span className="truncate">{entry.nickname}</span>
        {entry.isMe && <MeBadge />}
      </span>
      <span className="text-2xl font-extrabold tracking-tight text-foreground tabular">
        {formatNumber(entry.xp)}
        <span className="ml-1 text-small font-semibold text-muted-foreground">XP</span>
      </span>
      <span className="text-caption text-muted-foreground">이번 주 {formatNumber(entry.solved)}문제</span>
    </li>
  );
}

function RankRow({ entry }: { entry: RankingEntry }) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-soft",
        entry.isMe && "border-primary bg-primary-soft",
      )}
    >
      <span className="w-10 shrink-0 text-center text-small font-extrabold text-muted-foreground tabular">
        {entry.rank}위
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className="truncate font-bold text-foreground">{entry.nickname}</span>
        {entry.isMe && <MeBadge />}
      </span>
      <span className="hidden text-caption text-muted-foreground sm:inline">{formatNumber(entry.solved)}문제</span>
      <span className="w-20 shrink-0 text-right font-extrabold text-foreground tabular">
        {formatNumber(entry.xp)} <span className="text-caption font-semibold text-muted-foreground">XP</span>
      </span>
    </li>
  );
}

export function RankingView({ ranking }: { ranking: WeeklyRanking }) {
  const reset = ranking.resetIn;
  const { entries, me } = ranking;
  // 시상대는 앞의 세 명 (동점이면 2위가 둘일 수도 있다). 넓은 화면에서는 두 번째 · 첫 번째 · 세 번째 자리로 놓는다
  const top = entries.slice(0, 3).filter((e) => e.rank <= 3);
  const rest = entries.slice(top.length);
  /** 넓은 화면에서의 자리: 첫 번째 사람은 가운데 (좁은 화면에서는 순위대로 위에서 아래로) */
  const podiumPlace = (index: number) =>
    top.length === 1 ? "" : index === 0 ? "sm:order-2" : index === 1 ? "sm:order-1" : "sm:order-3";
  const meOutside = me && !entries.some((e) => e.isMe);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1 text-foreground">이번 주 랭킹</h1>
        <p className="text-small text-muted-foreground">
          {dayLabel(ranking.weekStart)} ~ {dayLabel(ranking.weekEnd)} · 새 주까지{" "}
          {reset.days > 0 ? `${reset.days}일 ` : ""}
          {reset.hours}시간
          {ranking.participants > 0 && ` · ${formatNumber(ranking.participants)}명 참여`}
        </p>
      </div>

      {!ranking.available ? (
        <EmptyState
          mood="sleepy"
          title="랭킹은 곧 열려요"
          description="로그인 기능이 켜지면 이번 주에 얻은 XP로 순위를 겨룰 수 있어요."
        />
      ) : entries.length === 0 ? (
        <EmptyState
          mood="curious"
          title="이번 주 첫 번째 주인공이 되어 보세요!"
          description="아직 이번 주 기록이 없어요. 문제를 하나 풀면 바로 랭킹에 올라가요."
          action={
            <PopButton asChild>
              <Link href="/roadmap">문제 풀러 가기</Link>
            </PopButton>
          }
        />
      ) : (
        <>
          <ol aria-label="1위부터 3위" className="grid gap-4 pt-4 sm:grid-cols-3 sm:items-end">
            {top.map((entry, index) => (
              <PodiumCard
                key={`${entry.rank}-${entry.nickname}`}
                entry={entry}
                tall={index === 0}
                className={podiumPlace(index)}
              />
            ))}
          </ol>
          {rest.length > 0 && (
            <ol aria-label="4위부터" className="flex flex-col gap-2">
              {rest.map((entry) => (
                <RankRow key={`${entry.rank}-${entry.nickname}`} entry={entry} />
              ))}
            </ol>
          )}
        </>
      )}

      {ranking.available && meOutside && me && (
        <section aria-label="내 순위" className="flex flex-col gap-2">
          <h2 className="text-small font-bold text-muted-foreground">내 순위</h2>
          <ol>
            <RankRow entry={me} />
          </ol>
        </section>
      )}

      {ranking.available && !ranking.signedIn && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/60 p-6 text-center sm:flex-row sm:text-left">
          <Nodi mood="curious" size={64} decorative />
          <p className="flex-1 text-small text-muted-foreground">
            <strong className="block text-foreground">로그인하면 랭킹에 참여할 수 있어요</strong>
            게스트 학습은 이 브라우저에만 저장돼서 순위에 들어가지 않아요. 로그인하면 지금까지의 기록도 옮겨져요.
          </p>
          <PopButton asChild>
            <Link href="/auth/login?next=/ranking">
              <LogIn /> 로그인
            </Link>
          </PopButton>
        </div>
      )}

      {ranking.hidden && (
        <p className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-small text-muted-foreground">
          <EyeOff className="size-4 shrink-0" aria-hidden />
          랭킹에서 내 닉네임을 숨겨 두었어요. 마이페이지 설정에서 바꿀 수 있어요.
        </p>
      )}

      <p className="text-caption text-muted-foreground">
        이번 주(월~일)에 문제를 풀고 개념을 익혀 얻은 XP로 순위를 매기고, 매주 월요일 0시에 새로 시작해요. 닉네임만
        보이고, 기록이 비정상적인 계정은 랭킹에서 빠져요.
      </p>
    </div>
  );
}
