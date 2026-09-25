"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { loginHref } from "@/components/auth/user-menu";
import { PopButton } from "@/components/common/pop-button";
import { ProgressBar } from "@/components/common/progress-bar";
import { SoftCard } from "@/components/common/soft-card";
import { Nodi } from "@/components/mascot/nodi";
import type { LearnerSummary } from "@/hooks/use-progress";
import type { AccountProfile } from "@/lib/progress/account";
import { NODI_GROWTH_LABELS } from "@/lib/progress/xp";
import type { AccountStatus } from "@/stores/account-store";

const joinedFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function ProfileCard({
  learner,
  status,
  profile,
}: {
  learner: LearnerSummary;
  status: AccountStatus;
  profile: AccountProfile | null;
}) {
  const { level, growth, flowers } = learner;
  const name = profile?.nickname ?? "게스트 학습자";

  return (
    <SoftCard className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <Nodi mood="happy" size={112} growth={growth} flowers={flowers} decorative className="shrink-0" />
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-h2 text-foreground">{name}</h2>
          <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-caption font-bold text-primary-soft-foreground">
            Lv{level.level} · {NODI_GROWTH_LABELS[growth]}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <ProgressBar value={level.ratio} label={`다음 레벨까지 ${level.needed - level.current}XP`} />
          <p className="text-caption text-muted-foreground tabular">
            다음 레벨까지 {(level.needed - level.current).toLocaleString("ko-KR")} XP
          </p>
        </div>
        {status === "user" && profile ? (
          <p className="text-caption text-muted-foreground">
            {joinedFormatter.format(new Date(profile.createdAt))}에 함께하기 시작했어요
          </p>
        ) : status === "guest" ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-small text-muted-foreground">지금은 이 브라우저에만 저장돼요.</p>
            <PopButton asChild size="sm" variant="soft">
              <Link href={loginHref("/me")}>
                <LogIn />
                로그인하고 진도 지키기
              </Link>
            </PopButton>
          </div>
        ) : (
          <p className="text-small text-muted-foreground">진도는 이 브라우저에 저장돼요.</p>
        )}
      </div>
    </SoftCard>
  );
}
