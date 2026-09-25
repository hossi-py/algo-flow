"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";
import { loginHref } from "@/components/auth/user-menu";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";
import { SectionTitle, SoftCard } from "@/components/common/soft-card";
import { MascotBubble } from "@/components/mascot/mascot-bubble";
import { TOPIC_PATTERNS, topicOfPattern } from "@/content/patterns";
import { SIGNALS } from "@/content/signals";
import { useLearningRecord } from "@/hooks/use-learning-record";
import { useProgress, useTopicViews } from "@/hooks/use-progress";
import { recommendable } from "@/lib/progress/recommend";
import { topWeaknesses } from "@/lib/progress/weakness";
import { createGeneration, getGeneration, GenerateHttpError, listGenerations } from "@/lib/ai/generate-client";
import type { GeneratedProblemSummary, GeneratedProblemView } from "@/lib/ai/views";
import { DAILY_GENERATION_LIMIT } from "@/lib/ai/limits";
import type { GenerationRequest, PatternTag, TopicSlug, TopicView, WeaknessScore } from "@/types";
import { GeneratedProblemList } from "./generated-problem-list";
import { GenerateForm, type GenerateFormInitial } from "./generate-form";
import { GenerationProgress } from "./generation-progress";
import { WeaknessSummary } from "./weakness-summary";

const POLL_MS = 2000;
const IN_PROGRESS = new Set(["queued", "generating", "verifying"]);

export interface AiLabPreset {
  topic?: TopicSlug;
  level?: GenerationRequest["level"];
  patterns: PatternTag[];
  signals: string[];
}

/**
 * URL로 받은 조건이 없으면 약점에서 고른다: 가장 약한 패턴의 토픽(열려 있을 때)과 그 토픽의 약한 패턴들.
 * 약점도 없으면 지금 공부 중인 토픽.
 */
function presetFromWeakness(preset: AiLabPreset, weak: WeaknessScore[], views: TopicView[]): AiLabPreset {
  if (preset.topic || preset.patterns.length > 0) return preset;
  const open = weak.filter((w) => views.find((v) => v.topic === topicOfPattern(w.pattern))?.status !== "locked");
  const first = open[0];
  if (!first) return preset;
  const topic = topicOfPattern(first.pattern);
  const patterns = open.map((w) => w.pattern).filter((p) => topicOfPattern(p) === topic);
  const signals = SIGNALS.filter((s) => s.patterns.some((p) => patterns.includes(p))).map((s) => s.id);
  return { ...preset, topic, patterns, signals: signals.slice(0, 3) };
}

/** 추천·URL로 받은 값이 없으면: 지금 공부 중인 토픽, 아직 못 깬 가장 낮은 레벨(2~5) */
function defaultInitial(views: TopicView[], preset: AiLabPreset): GenerateFormInitial {
  const open = views.filter((v) => v.status !== "locked");
  const current = open.find((v) => v.status === "in-progress") ?? open.at(-1) ?? views[0];
  const topic =
    preset.topic && views.find((v) => v.topic === preset.topic && v.status !== "locked")
      ? preset.topic
      : (current?.topic ?? "stack");
  const view = views.find((v) => v.topic === topic);
  const nextLevel = view?.levels.find((l) => l.level >= 2 && l.status !== "cleared")?.level ?? 2;
  const level = preset.level ?? (Math.min(5, Math.max(2, nextLevel)) as GenerationRequest["level"]);
  const focusPatterns = preset.patterns.filter((tag) => TOPIC_PATTERNS[topic].includes(tag)).slice(0, 3);
  return { topic, level, focusPatterns };
}

export function AiLabView({ aiEnabled, preset }: { aiEnabled: boolean; preset: AiLabPreset }) {
  const { progress, hydrated } = useProgress();
  const views = useTopicViews();
  const [list, setList] = useState<GeneratedProblemSummary[] | null>(null);
  const [remaining, setRemaining] = useState(DAILY_GENERATION_LIMIT);
  const [job, setJob] = useState<GeneratedProblemView | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [loginRequired, setLoginRequired] = useState(false);
  const record = useLearningRecord(100);
  const weaknesses = useMemo(
    () => (record.patternStats ? recommendable(topWeaknesses(record.patternStats)) : null),
    [record.patternStats],
  );

  const refresh = useCallback(async () => {
    try {
      const data = await listGenerations();
      setList(data.problems);
      setRemaining(data.remainingToday);
    } catch {
      // 목록 새로 고침 실패는 조용히 넘어간다 (다음 새로 고침 때 다시 시도)
    }
  }, []);

  // 처음 들어오면 목록을 불러오고, 만들고 있던 문제가 있으면 이어서 보여 준다
  useEffect(() => {
    let cancelled = false;
    listGenerations()
      .then((data) => {
        if (cancelled) return;
        setList(data.problems);
        setRemaining(data.remainingToday);
        setLoginRequired(data.loginRequired);
        const running = data.problems.find((p) => IN_PROGRESS.has(p.status));
        if (running) setJobId(running.id);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : "목록을 불러오지 못했어요.");
        setList([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 진행 중인 생성 상태를 주기적으로 확인
  useEffect(() => {
    if (!jobId) return;
    let stopped = false;
    let timer: number | undefined;
    const tick = async () => {
      try {
        const { problem } = await getGeneration(jobId);
        if (stopped) return;
        setJob(problem);
        if (IN_PROGRESS.has(problem.status)) {
          timer = window.setTimeout(tick, POLL_MS);
        } else {
          void refresh();
        }
      } catch {
        if (!stopped) timer = window.setTimeout(tick, POLL_MS * 2);
      }
    };
    void tick();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [jobId, refresh]);

  const effectivePreset = useMemo(
    () => presetFromWeakness(preset, weaknesses ?? [], views),
    [preset, weaknesses, views],
  );
  const initial = useMemo(() => defaultInitial(views, effectivePreset), [views, effectivePreset]);
  const busy = submitting || (job !== null && IN_PROGRESS.has(job.status));

  async function submit(request: GenerationRequest) {
    setError(null);
    setSubmitting(true);
    try {
      const created = await createGeneration(request);
      setRemaining(created.remainingToday);
      setJob(null);
      setJobId(created.id);
      void refresh();
    } catch (cause) {
      setError(cause instanceof GenerateHttpError || cause instanceof Error ? cause.message : "요청하지 못했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!aiEnabled) {
    return (
      <div className="rounded-xl border border-border/70 bg-card shadow-soft">
        <EmptyState
          mood="sleepy"
          title="AI 랩이 쉬는 중이에요"
          description="서버에 AI 설정(ANTHROPIC_API_KEY)이 없어서 지금은 맞춤 문제를 만들 수 없어요."
        />
      </div>
    );
  }

  const disabledReason =
    remaining <= 0
      ? `오늘은 ${DAILY_GENERATION_LIMIT}개를 모두 만들었어요. 내일 다시 만나요!`
      : busy
        ? "지금 만들고 있는 문제가 끝나면 다음 문제를 만들 수 있어요."
        : null;

  return (
    <div className="flex flex-col gap-6">
      <MascotBubble mood="curious" size={72}>
        <p className="font-bold text-foreground">내 약점에 맞춘 문제를 만들어 드릴게요</p>
        <p className="text-muted-foreground">정답 코드로 모든 테스트를 직접 검증한 문제만 보여 드려요.</p>
      </MascotBubble>

      <WeaknessSummary weaknesses={weaknesses} />

      {job && (
        <GenerationProgress
          job={job}
          onRetry={() => {
            setJob(null);
            setJobId(null);
            setFormKey((key) => key + 1);
          }}
        />
      )}

      <SoftCard className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary-strong" aria-hidden />새 문제 만들기
          </SectionTitle>
          <span className="rounded-full bg-muted px-3 py-1 text-caption font-bold text-muted-foreground tabular">
            오늘 {remaining}/{DAILY_GENERATION_LIMIT}개 남음
          </span>
        </div>
        {loginRequired ? (
          <div className="flex flex-col items-start gap-3 rounded-md bg-primary-soft px-4 py-4">
            <p className="text-small font-bold text-primary-soft-foreground">
              로그인하면 약점에 맞춘 문제를 하루 10개까지 만들 수 있어요.
            </p>
            <PopButton asChild size="sm">
              <Link href={loginHref("/ai-lab")}>
                <LogIn />
                로그인하기
              </Link>
            </PopButton>
          </div>
        ) : hydrated ? (
          <GenerateForm
            key={`${formKey}:${initial.topic}:${initial.focusPatterns.join(",")}`}
            views={views}
            initial={initial}
            weakSignalIds={effectivePreset.signals}
            busy={busy}
            disabledReason={disabledReason}
            onSubmit={(request) => void submit(request)}
          />
        ) : (
          <div className="h-72 animate-pulse rounded-md bg-muted" aria-hidden />
        )}
        {error && (
          <p role="alert" className="rounded-md bg-danger px-3 py-2 text-small text-danger-foreground">
            {error}
          </p>
        )}
      </SoftCard>

      <section className="flex flex-col gap-3">
        <SectionTitle>내가 만든 문제</SectionTitle>
        {list === null ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted" aria-hidden />
        ) : list.length === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-6 text-center text-small text-muted-foreground">
            아직 만든 문제가 없어요. 위에서 첫 문제를 만들어 보세요!
          </p>
        ) : (
          <GeneratedProblemList problems={list} progress={progress.problems} />
        )}
      </section>
    </div>
  );
}
