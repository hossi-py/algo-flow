"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Eye, Lock, Search, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";
import { TopicGlyph } from "@/components/common/topic-badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisualizationExplorer } from "@/components/visualizer/visualization-explorer";
import { TOPIC_COLOR_CLASSES } from "@/content/topic-style";
import { getTopic } from "@/content/topics";
import { useProgress, useTopicViews } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";
import type { TopicSlug } from "@/types";
import { ConceptCardDeck } from "./concept-card-deck";
import { PatternSignalTrainer } from "./pattern-signal-trainer";

type LearnStep = "cards" | "visualize" | "signals";

const STEPS: { value: LearnStep; hash: string; label: string; description: string; icon: LucideIcon }[] = [
  { value: "cards", hash: "", label: "개념 카드", description: "비유와 그림으로 이해해요", icon: BookOpen },
  { value: "visualize", hash: "#visualize", label: "시각화 탐색", description: "한 단계씩 동작을 봐요", icon: Eye },
  { value: "signals", hash: "#signals", label: "유형 인식 훈련", description: "문제 속 신호를 찾아요", icon: Search },
];

function stepFromHash(hash: string): LearnStep {
  return STEPS.find((step) => step.hash !== "" && step.hash === hash)?.value ?? "cards";
}

// 주제 홈의 학습 흐름 링크(learn#visualize 등)로 바로 해당 단계를 연다. 주소의 해시가 단계의 원본
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function useLearnStep(): [LearnStep, (step: LearnStep) => void] {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => "",
  );
  const select = (step: LearnStep) => {
    const target = STEPS.find((s) => s.value === step)?.hash ?? "";
    if (target === window.location.hash) return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${target}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  return [stepFromHash(hash), select];
}

export function LearnView({ slug }: { slug: TopicSlug }) {
  const topic = getTopic(slug);
  const { progress, hydrated } = useProgress();
  const views = useTopicViews();
  const [step, selectStep] = useLearnStep();
  const tabsRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  if (!topic) return null;

  const color = TOPIC_COLOR_CLASSES[topic.color];
  const view = views.find((v) => v.topic === slug);
  const concept = progress.concepts[slug];
  const { cards, visualizations, recognitionQuiz, passScore } = topic.concept;

  const done: Record<LearnStep, boolean> = {
    cards: cards.length > 0 && concept?.completedAt != null,
    visualize: false,
    signals: recognitionQuiz.length > 0 && (concept?.quizBestScore ?? 0) >= passScore,
  };
  const note: Record<LearnStep, string> = {
    cards:
      cards.length === 0
        ? "준비 중"
        : `${Math.min(concept?.completedCardIds.length ?? 0, cards.length)} / ${cards.length}장 읽음`,
    visualize: `예시 ${visualizations.length}개`,
    signals:
      recognitionQuiz.length === 0
        ? "퀴즈 준비 중"
        : concept?.quizBestScore != null
          ? `최고 ${Math.round(concept.quizBestScore * 100)}%`
          : `${recognitionQuiz.length}문항`,
  };

  /** 단계 끝의 "다음" 버튼: 다음 단계로 넘기고 단계 탭이 보이게 올린다 */
  const goTo = (next: LearnStep) => {
    selectStep(next);
    tabsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/topics/${slug}`}
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-small font-bold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/40"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {topic.title} 홈으로
      </Link>

      <header className={cn("flex items-center gap-4 rounded-xl p-5 shadow-soft sm:p-6", color.surface, color.text)}>
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-card/70">
          <TopicGlyph icon={topic.icon} className="size-7" />
        </span>
        <div className="min-w-0">
          <p className="text-small font-bold opacity-90">토픽 {topic.order} · 개념 학습</p>
          <h1 className="text-h1">{topic.title}</h1>
          <p className="mt-0.5 text-body">{topic.tagline}</p>
        </div>
      </header>

      {hydrated && view?.lockedReason && (
        <p className="flex items-center gap-2 rounded-lg border border-dashed bg-card px-4 py-3 text-body text-foreground">
          <Lock className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          아직 잠겨 있어요. {view.lockedReason}. 개념은 미리 공부해 둘 수 있어요.
        </p>
      )}

      <Tabs value={step} onValueChange={(value) => selectStep(value as LearnStep)} className="gap-5">
        <div ref={tabsRef} className="scroll-mt-20">
          <TabsList className="grid w-full grid-cols-3 items-stretch gap-2 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              const complete = hydrated && done[s.value];
              return (
                <TabsTrigger
                  key={s.value}
                  value={s.value}
                  className={cn(
                    "h-auto flex-col items-start justify-start gap-1 rounded-lg border-2 border-border/70 bg-card p-3 text-left whitespace-normal shadow-soft sm:flex-row sm:items-center sm:gap-3",
                    "data-[state=active]:border-primary-strong data-[state=active]:bg-primary-soft data-[state=active]:shadow-soft",
                    "dark:data-[state=active]:border-primary-strong dark:data-[state=active]:bg-primary-soft",
                    "after:hidden",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-small font-bold sm:size-9",
                      complete ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground",
                    )}
                    aria-hidden
                  >
                    {complete ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-small font-bold text-foreground">
                      {index + 1}. {s.label}
                    </span>
                    <span className="hidden text-caption font-medium text-muted-foreground sm:block">
                      {s.description}
                    </span>
                    <span className="text-caption font-semibold text-muted-foreground tabular">
                      {hydrated ? note[s.value] : " "}
                      {complete && <span className="sr-only"> (완료)</span>}
                    </span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="cards" className="text-body">
          {cards.length > 0 ? (
            <ConceptCardDeck topic={topic} onFinish={() => goTo("visualize")} />
          ) : (
            <EmptyState
              mood="sleepy"
              title="개념 카드를 준비하고 있어요"
              description="노디가 비유와 그림을 그리고 있어요. 그동안 시각화로 동작부터 살펴볼까요?"
              action={
                <PopButton onClick={() => goTo("visualize")}>
                  시각화 보기 <ArrowRight />
                </PopButton>
              }
              className="rounded-xl border border-dashed bg-card/50"
            />
          )}
        </TabsContent>

        <TabsContent value="visualize" className="flex flex-col gap-4 text-body">
          <div className="rounded-xl border border-border/70 bg-card p-4 shadow-soft sm:p-6">
            <VisualizationExplorer presets={visualizations} wide />
          </div>
          <PopButton className="self-end" onClick={() => goTo("signals")}>
            유형 인식 훈련하기 <ArrowRight />
          </PopButton>
        </TabsContent>

        <TabsContent value="signals" className="text-body">
          <PatternSignalTrainer topic={topic} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
