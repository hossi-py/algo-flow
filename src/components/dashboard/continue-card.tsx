"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { MascotBubble } from "@/components/mascot/mascot-bubble";
import { PopButton } from "@/components/common/pop-button";
import { SoftCard } from "@/components/common/soft-card";
import { LevelBadge, TopicChip } from "@/components/common/topic-badges";
import { getProblemMeta } from "@/content/problems";
import { getTopic } from "@/content/topics";
import { FEATURES, FEATURE_ETA } from "@/lib/features";
import type { NextStep } from "@/lib/progress/unlock";
import type { ProblemProgress } from "@/types";

interface ContinueCardProps {
  /** 가장 최근에 시도했지만 아직 못 푼 문제 */
  inProgress: ProblemProgress | null;
  nextStep: NextStep | null;
  isFirstVisit: boolean;
}

export function ContinueCard({ inProgress, nextStep, isFirstVisit }: ContinueCardProps) {
  const problemMeta = inProgress ? getProblemMeta(inProgress.problemKey.replace(/^c:/, "")) : undefined;

  if (inProgress && problemMeta) {
    const topic = getTopic(problemMeta.topic);
    return (
      <SoftCard className="flex h-full flex-col gap-4">
        <p className="text-caption font-bold text-muted-foreground">이어서 풀기</p>
        <div className="flex flex-wrap gap-1.5">
          {topic && <TopicChip topic={topic} />}
          <LevelBadge level={problemMeta.level} />
        </div>
        <div>
          <h2 className="text-h2 text-foreground">{problemMeta.title}</h2>
          <p className="mt-1 text-small text-muted-foreground">{problemMeta.summary}</p>
        </div>
        <p className="inline-flex items-center gap-1.5 text-small text-muted-foreground">
          <Lightbulb className="size-4" aria-hidden />
          힌트 {inProgress.maxHintOpened}/4 사용 · {inProgress.attempts}번 도전
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          {FEATURES.workspace ? (
            <PopButton asChild>
              <Link href={`/problems/${problemMeta.slug}`}>
                이어서 풀기 <ArrowRight />
              </Link>
            </PopButton>
          ) : (
            <>
              <PopButton asChild variant="soft">
                <Link href={`/topics/${problemMeta.topic}`}>
                  토픽에서 보기 <ArrowRight />
                </Link>
              </PopButton>
              <span className="text-caption text-muted-foreground">{FEATURE_ETA.workspace}</span>
            </>
          )}
        </div>
      </SoftCard>
    );
  }

  if (nextStep) {
    const topic = getTopic(nextStep.topic);
    const level = topic?.levels[nextStep.level - 1];
    return (
      <SoftCard className="flex h-full flex-col gap-4">
        <p className="text-caption font-bold text-muted-foreground">{isFirstVisit ? "처음 오셨군요!" : "다음 학습"}</p>
        <MascotBubble mood="curious" size={64}>
          {isFirstVisit ? (
            <>
              <strong className="font-bold">{topic?.title}</strong>부터 차근차근 시작해 볼까요?
            </>
          ) : (
            <>
              다음은 <strong className="font-bold">{topic?.title}</strong> Lv{nextStep.level} 차례예요.
            </>
          )}
        </MascotBubble>
        {topic && level && (
          <div className="flex flex-wrap items-center gap-1.5">
            <TopicChip topic={topic} />
            <LevelBadge level={nextStep.level} />
            <span className="text-small font-semibold text-foreground">{level.title}</span>
          </div>
        )}
        <div className="mt-auto">
          <PopButton asChild>
            <Link href={`/topics/${nextStep.topic}`}>
              {isFirstVisit ? "첫 토픽 보러 가기" : "토픽으로 가기"} <ArrowRight />
            </Link>
          </PopButton>
        </div>
      </SoftCard>
    );
  }

  return (
    <SoftCard className="flex h-full flex-col gap-4">
      <p className="text-caption font-bold text-muted-foreground">다음 학습</p>
      <MascotBubble mood="cheer" size={64}>
        지금 열려 있는 레벨을 모두 마쳤어요! 새 문제가 곧 도착해요.
      </MascotBubble>
      <div className="mt-auto">
        <PopButton asChild variant="soft">
          <Link href="/roadmap">
            로드맵 보기 <ArrowRight />
          </Link>
        </PopButton>
      </div>
    </SoftCard>
  );
}
