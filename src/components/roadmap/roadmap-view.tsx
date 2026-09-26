"use client";

import { useState } from "react";
import Link from "next/link";
import { Shuffle, Sprout } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { Nodi } from "@/components/mascot/nodi";
import { ProgressBar } from "@/components/common/progress-bar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TOPICS, UPCOMING_TOPICS } from "@/content/topics";
import { DESKTOP_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import { useLearnerSummary, useProgress, useTopicViews } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";
import type { TopicSlug, TopicView } from "@/types";
import { TopicDetailPanel } from "./topic-detail-panel";
import { TopicNode } from "./topic-node";

/** 한 토픽이 차지하는 세로 길이(px)와 지그재그 가로 위치(%) */
const ROW_HEIGHT = 184;
const NODE_CENTER_OFFSET = 62;
const X_PATTERN = [50, 72, 50, 28] as const;

function nodeX(index: number): number {
  return X_PATTERN[index % X_PATTERN.length] ?? 50;
}

function nodeY(index: number): number {
  return index * ROW_HEIGHT + NODE_CENTER_OFFSET;
}

/** 노디가 서 있을 토픽: 열려 있고 아직 마스터하지 않은 가장 먼 토픽(학습 최전선), 없으면 마지막으로 마스터한 토픽 */
function currentTopicIndex(views: TopicView[]): number {
  const active = views.map((v) => v.status === "in-progress" || v.status === "available").lastIndexOf(true);
  if (active >= 0) return active;
  const mastered = views.map((v) => v.status).lastIndexOf("mastered");
  return Math.max(0, mastered);
}

export function RoadmapView() {
  const { hydrated } = useProgress();
  const views = useTopicViews();
  const learner = useLearnerSummary();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const currentIndex = currentTopicIndex(views);
  const [selected, setSelected] = useState<TopicSlug | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedSlug = selected ?? TOPICS[currentIndex]?.slug ?? "stack";
  const selectedTopic = TOPICS.find((t) => t.slug === selectedSlug);
  const selectedView = views.find((v) => v.topic === selectedSlug);

  const mastered = views.filter((v) => v.status === "mastered").length;
  const overall = views.reduce((sum, v) => sum + v.progress, 0) / Math.max(1, views.length);
  const height = TOPICS.length * ROW_HEIGHT;

  const handleSelect = (slug: TopicSlug) => {
    setSelected(slug);
    if (!isDesktop) setSheetOpen(true);
  };

  if (!hydrated) {
    return (
      <div className="h-[70dvh] animate-pulse rounded-xl bg-muted" aria-busy="true" aria-label="로드맵을 불러오는 중" />
    );
  }

  const nodiX = nodeX(currentIndex) > 50 ? nodeX(currentIndex) - 27 : nodeX(currentIndex) + 27;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-h1 text-foreground">알고리즘 숲 로드맵</h1>
          <PopButton asChild variant="soft" size="sm">
            <Link href="/practice">
              <Shuffle /> 섞어 풀기
            </Link>
          </PopButton>
        </div>
        <p className="text-body text-muted-foreground">
          쉬운 토픽부터 순서대로 열려요. 이전 토픽의 Lv3을 클리어하면 다음 토픽으로 갈 수 있어요.
        </p>
        <div className="flex max-w-md flex-col gap-1.5">
          <div className="flex justify-between text-small font-semibold">
            <span className="text-foreground">전체 진행률 {Math.round(overall * 100)}%</span>
            <span className="text-muted-foreground">
              {TOPICS.length}개 중 {mastered}개 마스터
            </span>
          </div>
          <ProgressBar value={overall} label="로드맵 전체 진행률" />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label="토픽 길" className="flex flex-col gap-6">
          <div className="relative w-full" style={{ height }}>
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 100 ${height}`}
              preserveAspectRatio="none"
            >
              {TOPICS.slice(1).map((topic, i) => {
                const index = i + 1;
                const x0 = nodeX(index - 1);
                const y0 = nodeY(index - 1);
                const x1 = nodeX(index);
                const y1 = nodeY(index);
                const d = `M ${x0} ${y0} C ${x0} ${y0 + ROW_HEIGHT / 2}, ${x1} ${y1 - ROW_HEIGHT / 2}, ${x1} ${y1}`;
                const open = views[index]?.status !== "locked";
                return (
                  <path
                    key={topic.slug}
                    d={d}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeWidth={open ? 8 : 5}
                    strokeDasharray={open ? undefined : "2 12"}
                    className={open ? "stroke-primary" : "stroke-border"}
                  />
                );
              })}
            </svg>

            {TOPICS.map((topic, index) => {
              const view = views[index];
              if (!view) return null;
              return (
                <div
                  key={topic.slug}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${nodeX(index)}%`, top: nodeY(index) - 50 }}
                >
                  <TopicNode
                    topic={topic}
                    view={view}
                    selected={isDesktop && selectedSlug === topic.slug}
                    onSelect={() => handleSelect(topic.slug)}
                  />
                </div>
              );
            })}

            <div
              className="pointer-events-none absolute -translate-x-1/2"
              style={{ left: `${nodiX}%`, top: nodeY(currentIndex) - 78 }}
            >
              <Nodi mood="curious" size={64} growth={learner.growth} flowers={learner.flowers} decorative />
              <span className="sr-only">지금 여기에서 학습 중이에요</span>
            </div>
          </div>

          {UPCOMING_TOPICS.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-h3 text-foreground">
                <Sprout className="size-5 text-success-text" aria-hidden />곧 열리는 토픽
              </h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {UPCOMING_TOPICS.map((topic) => (
                  <li
                    key={topic.slug}
                    className="rounded-lg border-2 border-dashed border-border bg-card/50 px-4 py-5 text-center"
                  >
                    <p className="text-small font-bold text-muted-foreground">{topic.title}</p>
                    <p className="text-caption text-muted-foreground">준비 중</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {isDesktop && selectedTopic && selectedView && (
          <aside aria-label="선택한 토픽" className="sticky top-20 self-start">
            <div className="rounded-xl border border-border/70 bg-card p-5 shadow-soft">
              <TopicDetailPanel topic={selectedTopic} view={selectedView} />
            </div>
          </aside>
        )}
      </div>

      {!isDesktop && selectedTopic && selectedView && (
        <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
          <DialogContent className={cn("max-h-[85dvh] overflow-y-auto rounded-xl p-5 sm:max-w-md")}>
            <DialogTitle className="sr-only">{selectedTopic.title} 레벨 보기</DialogTitle>
            <DialogDescription className="sr-only">{selectedTopic.tagline}</DialogDescription>
            <TopicDetailPanel topic={selectedTopic} view={selectedView} className="pt-6" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
