"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, Highlighter, RotateCcw, Shuffle } from "lucide-react";
import { Markdown } from "@/components/common/markdown";
import { PopButton } from "@/components/common/pop-button";
import { SoftCard } from "@/components/common/soft-card";
import { TopicChip } from "@/components/common/topic-badges";
import { ChoiceButton } from "@/components/learn/pattern-signal-trainer";
import { Nodi } from "@/components/mascot/nodi";
import { resolveSignals } from "@/components/topic/signal-preview";
import { PROBLEMS } from "@/content/problems";
import { TOPICS, getTopic } from "@/content/topics";
import { useProgress, useTopicViews } from "@/hooks/use-progress";
import {
  PRACTICE_SIZES,
  buildSession,
  practicePool,
  seededRng,
  type PracticeAnswer,
  type PracticeQuestion,
  type PracticeSize,
} from "@/lib/practice/session";
import { cn } from "@/lib/utils";
import { usePracticeStore } from "@/stores/practice-store";
import type { TopicSlug } from "@/types";

const ALL_TOPICS = TOPICS.map((t) => t.slug);
/** 열린 토픽만 고르려면 적어도 이만큼은 열려 있어야 보기가 의미 있다 */
const MIN_OPEN_TOPICS = 3;

type Scope = "all" | "open";
type Phase =
  | { kind: "setup" }
  | { kind: "question"; questions: PracticeQuestion[]; index: number; answers: PracticeAnswer[] }
  | { kind: "summary"; questions: PracticeQuestion[]; answers: PracticeAnswer[] };

function title(slug: TopicSlug): string {
  return getTopic(slug)?.title ?? slug;
}

function percent(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

/* ───────────── 시작 화면 ───────────── */

function Setup({ onStart }: { onStart: (size: PracticeSize, scope: Scope) => void }) {
  const views = useTopicViews();
  const openCount = views.filter((v) => v.status !== "locked").length;
  const canUseOpen = openCount >= MIN_OPEN_TOPICS;
  const [size, setSize] = useState<PracticeSize>(5);
  const [scope, setScope] = useState<Scope>("all");
  const perTopic = usePracticeStore((s) => s.perTopic);
  const sessions = usePracticeStore((s) => s.sessions);
  const total = sessions.reduce((sum, s) => sum + s.total, 0);
  const correct = sessions.reduce((sum, s) => sum + s.correct, 0);
  const confusing = (Object.entries(perTopic) as [TopicSlug, { seen: number; correct: number }][])
    .filter(([, t]) => t.seen >= 2 && t.correct < t.seen)
    .sort((a, b) => a[1].correct / a[1].seen - b[1].correct / b[1].seen)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <SoftCard className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <Nodi mood="curious" size={72} decorative className="shrink-0" />
          <div className="flex flex-col gap-1.5">
            <h2 className="text-h2 text-foreground">토픽 이름 없이, 문제만 보고 맞혀 봐요</h2>
            <p className="text-body text-muted-foreground">
              실제 시험에서는 &ldquo;이건 BFS 문제예요&rdquo;라고 알려 주지 않아요. 여러 토픽의 문제를 섞어서 본문과
              제약 조건만 보여 줄게요. 어떤 알고리즘을 떠올려야 할지 먼저 골라 보세요.
            </p>
          </div>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-small font-bold text-foreground">문제 수</legend>
          <div className="flex gap-2">
            {PRACTICE_SIZES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={size === value}
                onClick={() => setSize(value)}
                className={cn(
                  "rounded-full border-2 px-4 py-1.5 text-small font-bold outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
                  size === value
                    ? "border-primary-strong bg-primary-soft text-primary-soft-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {value}문제
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-small font-bold text-foreground">출제 범위</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", `모든 토픽 (${TOPICS.length}개)`],
                ["open", `열린 토픽만 (${openCount}개)`],
              ] as const
            ).map(([value, label]) => {
              const disabled = value === "open" && !canUseOpen;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={scope === value}
                  disabled={disabled}
                  onClick={() => setScope(value)}
                  className={cn(
                    "rounded-full border-2 px-4 py-1.5 text-small font-bold outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
                    scope === value
                      ? "border-primary-strong bg-primary-soft text-primary-soft-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-caption text-muted-foreground">
            {canUseOpen
              ? "모든 토픽을 고르면 아직 배우지 않은 토픽의 문제도 나와요. 미리 감을 잡기에 좋아요."
              : `토픽이 ${MIN_OPEN_TOPICS}개 이상 열리면 "열린 토픽만"을 고를 수 있어요.`}
          </p>
        </fieldset>

        <PopButton className="self-start" onClick={() => onStart(size, canUseOpen ? scope : "all")}>
          <Shuffle /> 섞어서 시작하기
        </PopButton>
      </SoftCard>

      {total > 0 && (
        <SoftCard className="flex flex-col gap-3">
          <h2 className="text-h3 text-foreground">지난 기록</h2>
          <p className="text-body text-foreground">
            {sessions.length}번 도전해서 {total}문제 중 <strong>{correct}문제</strong>를 맞혔어요 (
            {percent(correct, total)}%).
          </p>
          {confusing.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-small font-bold text-muted-foreground">자주 헷갈린 토픽</p>
              <ul className="flex flex-wrap gap-2">
                {confusing.map(([slug, t]) => {
                  const topic = getTopic(slug);
                  return (
                    topic && (
                      <li key={slug}>
                        <Link
                          href={`/topics/${slug}/learn#signals`}
                          className="inline-flex items-center gap-2 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
                        >
                          <TopicChip topic={topic} />
                          <span className="text-caption text-muted-foreground tabular">
                            {t.correct}/{t.seen}
                          </span>
                        </Link>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          )}
          <p className="text-caption text-muted-foreground">
            기록은 이 브라우저에만 저장돼요. XP와 랭킹에는 들어가지 않아요.
          </p>
        </SoftCard>
      )}
    </div>
  );
}

/* ───────────── 문제 화면 ───────────── */

function Question({
  question,
  index,
  total,
  picked,
  onPick,
  onNext,
}: {
  question: PracticeQuestion;
  index: number;
  total: number;
  picked: TopicSlug | null;
  onPick: (slug: TopicSlug) => void;
  onNext: () => void;
}) {
  const { problem } = question;
  const correct = picked === problem.topic;
  const signals = resolveSignals(problem.signalIds);
  const last = index === total - 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-small font-bold text-muted-foreground tabular">
          {index + 1} / {total}
        </p>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${((index + (picked ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      <SoftCard className="flex flex-col gap-4">
        <h2 className="text-small font-bold text-muted-foreground">문제</h2>
        <Markdown>{problem.statement}</Markdown>
        {problem.constraints.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <h3 className="text-small font-bold text-muted-foreground">제약 조건</h3>
            <ul className="flex flex-col gap-1">
              {problem.constraints.map((c) => (
                <li key={c} className="text-small text-foreground before:mr-1.5 before:content-['·']">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SoftCard>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-h3 text-foreground">어떤 알고리즘을 떠올려야 할까요?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {question.choices.map((slug) => (
            <ChoiceButton
              key={slug}
              slug={slug}
              picked={picked}
              answer={problem.topic}
              onPick={(value) => {
                if (picked === null) onPick(value);
              }}
            />
          ))}
        </div>
      </fieldset>

      {picked && (
        <div className="flex flex-col gap-3" aria-live="polite">
          <div
            className={cn(
              "flex gap-3 rounded-lg px-4 py-3",
              correct ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground",
            )}
          >
            <Nodi mood={correct ? "happy" : "oops"} size={48} decorative className="shrink-0" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="text-body font-bold">
                {correct ? "정답이에요!" : `아쉬워요. 이건 「${title(problem.topic)}」 문제예요`}
              </p>
              <p className="text-small">
                「{problem.title}」 · {problem.summary}
              </p>
              {signals.length > 0 && (
                <p className="flex flex-wrap items-center gap-1.5 text-caption font-semibold">
                  <Highlighter className="size-3.5" aria-hidden />
                  근거 신호:
                  {signals.map((signal) => (
                    <span key={signal.id} className="rounded-full bg-card/70 px-2 py-0.5">
                      “{signal.phrase}”
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
          {signals[0] && <p className="text-small text-muted-foreground">{signals[0].reason}</p>}
          <div className="flex flex-wrap gap-2">
            <PopButton onClick={onNext}>
              {last ? "결과 보기" : "다음 문제"} <ArrowRight />
            </PopButton>
            <PopButton asChild variant="outline">
              <a href={`/problems/${problem.slug}`} target="_blank" rel="noreferrer">
                이 문제 풀어 보기 <ExternalLink />
              </a>
            </PopButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────── 결과 화면 ───────────── */

function Summary({
  questions,
  answers,
  onRetry,
  onHome,
}: {
  questions: PracticeQuestion[];
  answers: PracticeAnswer[];
  onRetry: () => void;
  onHome: () => void;
}) {
  const correct = answers.filter((a) => a.picked === a.topic).length;
  const missedTopics = [...new Set(answers.filter((a) => a.picked !== a.topic).map((a) => a.topic))];
  const rate = percent(correct, answers.length);

  return (
    <div className="flex flex-col gap-6">
      <SoftCard className="flex items-center gap-4">
        <Nodi mood={rate >= 80 ? "cheer" : rate >= 50 ? "happy" : "thinking"} size={80} decorative />
        <div className="flex flex-col gap-1">
          <p className="text-h2 text-foreground tabular">
            {answers.length}문제 중 {correct}문제 맞혔어요
          </p>
          <p className="text-body text-muted-foreground">
            {rate === 100
              ? "토픽 이름 없이도 모두 알아봤어요. 진짜 실력이에요!"
              : rate >= 60
                ? "좋아요! 헷갈린 토픽의 신호만 다시 보면 돼요."
                : "처음엔 어려운 게 당연해요. 헷갈린 토픽의 신호부터 다시 볼까요?"}
          </p>
        </div>
      </SoftCard>

      <ol className="flex flex-col gap-2">
        {questions.map(({ problem }, i) => {
          const answer = answers[i];
          const ok = answer?.picked === problem.topic;
          const topic = getTopic(problem.topic);
          return (
            <li
              key={problem.id}
              className={cn(
                "flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3",
                ok ? "border-border/60 bg-card" : "border-warning-text/40 bg-warning/40",
              )}
            >
              <span className="w-6 text-small font-bold text-muted-foreground tabular">{i + 1}</span>
              <span className="min-w-0 flex-1 font-bold text-foreground">{problem.title}</span>
              {topic && <TopicChip topic={topic} />}
              {!ok && answer && (
                <span className="text-caption text-muted-foreground">내 선택: {title(answer.picked)}</span>
              )}
              <Link
                href={`/problems/${problem.slug}`}
                className="text-caption font-bold text-primary-strong underline-offset-4 hover:underline"
              >
                풀어 보기
              </Link>
            </li>
          );
        })}
      </ol>

      {missedTopics.length > 0 && (
        <SoftCard className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-h3 text-foreground">
            <BookOpen className="size-5 text-info-text" aria-hidden /> 신호 다시 보기
          </h2>
          <ul className="flex flex-wrap gap-2">
            {missedTopics.map((slug) => {
              const topic = getTopic(slug);
              return (
                topic && (
                  <li key={slug}>
                    <Link
                      href={`/topics/${slug}/learn#signals`}
                      className="inline-flex rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
                    >
                      <TopicChip topic={topic} />
                    </Link>
                  </li>
                )
              );
            })}
          </ul>
        </SoftCard>
      )}

      <div className="flex flex-wrap gap-2">
        <PopButton onClick={onRetry}>
          <RotateCcw /> 새 문제로 다시
        </PopButton>
        <PopButton variant="outline" onClick={onHome}>
          처음으로
        </PopButton>
      </div>
    </div>
  );
}

/* ───────────── 전체 ───────────── */

export function PracticeView() {
  const { hydrated } = useProgress();
  const views = useTopicViews();
  const record = usePracticeStore((s) => s.record);
  const [phase, setPhase] = useState<Phase>({ kind: "setup" });
  const [last, setLast] = useState<{ size: PracticeSize; scope: Scope }>({ size: 5, scope: "all" });

  const start = (size: PracticeSize, scope: Scope) => {
    const topics = scope === "open" ? views.filter((v) => v.status !== "locked").map((v) => v.topic) : undefined;
    const pool = practicePool(PROBLEMS, topics);
    const rng = seededRng(Date.now());
    const questions = buildSession(pool, size, ALL_TOPICS, rng);
    setLast({ size, scope });
    setPhase({ kind: "question", questions, index: 0, answers: [] });
  };

  if (!hydrated) {
    return (
      <div className="h-96 animate-pulse rounded-xl bg-muted" aria-busy="true" aria-label="섞어 풀기를 불러오는 중" />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1 text-foreground">섞어 풀기</h1>
        <p className="text-small text-muted-foreground">토픽을 숨긴 문제로 유형을 알아보는 실전 연습이에요.</p>
      </div>

      {phase.kind === "setup" && <Setup onStart={start} />}

      {phase.kind === "question" && phase.questions[phase.index] && (
        <Question
          key={phase.questions[phase.index]!.problem.id}
          question={phase.questions[phase.index]!}
          index={phase.index}
          total={phase.questions.length}
          picked={phase.answers[phase.index]?.picked ?? null}
          onPick={(picked) => {
            const problem = phase.questions[phase.index]!.problem;
            setPhase({
              ...phase,
              answers: [...phase.answers, { problemKey: problem.id, topic: problem.topic, picked }],
            });
          }}
          onNext={() => {
            if (phase.index + 1 < phase.questions.length) {
              setPhase({ ...phase, index: phase.index + 1 });
            } else {
              record(phase.answers, new Date().toISOString());
              setPhase({ kind: "summary", questions: phase.questions, answers: phase.answers });
            }
          }}
        />
      )}

      {phase.kind === "summary" && (
        <Summary
          questions={phase.questions}
          answers={phase.answers}
          onRetry={() => start(last.size, last.scope)}
          onHome={() => setPhase({ kind: "setup" })}
        />
      )}
    </div>
  );
}
