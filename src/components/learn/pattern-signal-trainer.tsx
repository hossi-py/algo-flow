"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Highlighter, RotateCcw, Search, X } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";
import { TopicGlyph } from "@/components/common/topic-badges";
import { Nodi } from "@/components/mascot/nodi";
import { SignalCard, resolveSignals } from "@/components/topic/signal-preview";
import { getTopic } from "@/content/topics";
import { useProgress } from "@/hooks/use-progress";
import { toLocalDate } from "@/lib/date";
import { highlightSegments } from "@/lib/highlight";
import { RECOGNITION_QUIZ_XP } from "@/lib/progress/xp";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/stores/progress-store";
import type { RecognitionQuestion, Topic, TopicSlug } from "@/types";
import { useConceptCelebration } from "./use-concept-celebration";

function topicTitle(slug: TopicSlug): string {
  return getTopic(slug)?.title ?? slug;
}

/** 지문. 답을 고른 뒤에는 정답 근거 문구를 형광펜으로 칠한다 */
function Snippet({ question, reveal }: { question: RecognitionQuestion; reveal: boolean }) {
  const segments = reveal
    ? highlightSegments(question.snippet, question.highlightPhrases)
    : [{ text: question.snippet, hit: false }];
  return (
    <blockquote className="rounded-lg border bg-card px-4 py-3 text-body leading-relaxed text-foreground shadow-inset">
      {segments.map((segment, i) =>
        segment.hit ? (
          <mark
            key={i}
            className="rounded-xs bg-warning box-decoration-clone px-0.5 font-bold text-warning-foreground underline decoration-warning-text decoration-2 underline-offset-4"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </blockquote>
  );
}

function ChoiceButton({
  slug,
  picked,
  answer,
  onPick,
}: {
  slug: TopicSlug;
  picked: TopicSlug | null;
  answer: TopicSlug;
  onPick: (slug: TopicSlug) => void;
}) {
  const topic = getTopic(slug);
  const revealed = picked !== null;
  const isAnswer = slug === answer;
  const isPicked = slug === picked;
  const state = !revealed ? "idle" : isAnswer ? "answer" : isPicked ? "wrong" : "dim";

  return (
    <button
      type="button"
      onClick={() => onPick(slug)}
      aria-disabled={revealed}
      aria-pressed={isPicked}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-lg border-2 px-4 py-2.5 text-left text-body font-bold transition-[transform,background-color,border-color] outline-none focus-visible:ring-4 focus-visible:ring-ring/40 motion-reduce:transition-none",
        state === "idle" && "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary-strong",
        state === "answer" && "border-success-text bg-success text-success-foreground",
        state === "wrong" && "border-danger-text bg-danger text-danger-foreground",
        state === "dim" && "border-border bg-card text-muted-foreground opacity-60",
        revealed && "cursor-default",
      )}
    >
      {topic && <TopicGlyph icon={topic.icon} className="size-5 shrink-0" />}
      <span className="flex-1">{topicTitle(slug)}</span>
      {state === "answer" && (
        <span className="flex items-center gap-1 text-caption">
          <Check className="size-4" aria-hidden /> 정답
        </span>
      )}
      {state === "wrong" && (
        <span className="flex items-center gap-1 text-caption">
          <X className="size-4" aria-hidden /> 내 선택
        </span>
      )}
    </button>
  );
}

/** 답을 고른 직후: 맞았는지, 왜 그런지, 어떤 신호가 근거였는지 */
function QuizFeedback({ question, picked }: { question: RecognitionQuestion; picked: TopicSlug }) {
  const correct = picked === question.answer;
  const signals = resolveSignals(question.signalIds);
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg px-4 py-3",
        correct ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground",
      )}
    >
      <Nodi mood={correct ? "happy" : "oops"} size={48} decorative className="shrink-0" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="text-body font-bold">
          {correct ? "정답이에요!" : `아쉬워요. 이건 「${topicTitle(question.answer)}」 문제예요`}
        </p>
        <p className="text-small">{question.explanation}</p>
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
  );
}

/** 지문 일부를 보고 알고리즘을 고르는 퀴즈. 끝까지 풀면 한 번의 시도로 기록한다 */
function RecognitionQuiz({ topic }: { topic: Topic }) {
  const questions = topic.concept.recognitionQuiz;
  const passScore = topic.concept.passScore;
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(TopicSlug | null)[]>(() => questions.map(() => null));
  const [finished, setFinished] = useState(false);
  const { progress } = useProgress();
  const recordQuiz = useProgressStore((s) => s.recordQuiz);
  const celebrateOutcome = useConceptCelebration(topic);

  const concept = progress.concepts[topic.slug];
  const best = concept?.quizBestScore ?? null;
  const passedBefore = best !== null && best >= passScore;
  const correctCount = questions.filter((q, i) => picks[i] === q.answer).length;
  const score = questions.length === 0 ? 0 : correctCount / questions.length;

  const question = questions[index];
  const picked = picks[index] ?? null;

  const pick = (slug: TopicSlug) => {
    if (picked !== null) return;
    setPicks((prev) => prev.map((value, i) => (i === index ? slug : value)));
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    const now = new Date();
    const outcome = recordQuiz(topic, score, toLocalDate(now), now.toISOString());
    setFinished(true);
    if (outcome.quizPassed) {
      celebrateOutcome(outcome, {
        title: "유형 인식 통과!",
        message: `${questions.length}문제 중 ${correctCount}문제 정답. 신호를 잘 찾았어요`,
      });
    }
  };

  const retry = () => {
    setIndex(0);
    setPicks(questions.map(() => null));
    setFinished(false);
  };

  if (finished) {
    const passed = score >= passScore;
    return (
      <div
        className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-soft sm:p-6"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Nodi mood={passed ? "cheer" : "thinking"} size={96} decorative />
          <p className="text-h2 text-foreground">
            {questions.length}문제 중 {correctCount}문제 정답
          </p>
          <p className="text-body text-muted-foreground">
            {passed
              ? "통과했어요! 이제 문제 속 신호가 조금 더 잘 보일 거예요."
              : `${Math.round(passScore * 100)}% 이상 맞히면 통과예요. 틀린 문제의 형광펜 문구를 다시 살펴볼까요?`}
          </p>
        </div>
        <ol className="flex flex-col gap-2">
          {questions.map((q, i) => {
            const ok = picks[i] === q.answer;
            return (
              <li key={q.id} className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-small">
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                    ok ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground",
                  )}
                >
                  {ok ? <Check className="size-3.5" aria-label="맞음" /> : <X className="size-3.5" aria-label="틀림" />}
                </span>
                <span className="min-w-0 flex-1 text-foreground">{q.snippet}</span>
                <span className="shrink-0 font-bold text-muted-foreground">→ {topicTitle(q.answer)}</span>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-wrap justify-center gap-2">
          <PopButton variant={passed ? "outline" : "primary"} onClick={retry}>
            <RotateCcw /> 다시 풀기
          </PopButton>
          {passed && (
            <PopButton asChild>
              <Link href={`/topics/${topic.slug}#levels`}>
                문제 풀러 가기 <ArrowRight />
              </Link>
            </PopButton>
          )}
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card/60 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-small font-bold text-foreground tabular">
          문제 {index + 1} / {questions.length}
        </p>
        <p className="text-caption text-muted-foreground">
          {passedBefore
            ? `통과함 · 최고 ${Math.round((best ?? 0) * 100)}%`
            : `${Math.round(passScore * 100)}% 이상 맞히면 통과 · 처음 통과하면 +${RECOGNITION_QUIZ_XP} XP`}
        </p>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="퀴즈 진행"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={index + (picked ? 1 : 0)}
      >
        <div
          className="h-full rounded-full bg-primary-strong transition-[width] motion-reduce:transition-none"
          style={{ width: `${((index + (picked ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-small font-semibold text-muted-foreground">이 문제는 어떤 알고리즘으로 풀까요?</p>
      <Snippet question={question} reveal={picked !== null} />

      <div role="group" aria-label="보기" className="grid gap-2 sm:grid-cols-3">
        {question.choices.map((slug) => (
          <ChoiceButton key={slug} slug={slug} picked={picked} answer={question.answer} onPick={pick} />
        ))}
      </div>

      {picked && (
        <div className="flex flex-col gap-3" aria-live="polite">
          <QuizFeedback question={question} picked={picked} />
          <PopButton className="self-end" onClick={next}>
            {index < questions.length - 1 ? "다음 문제" : "결과 보기"} <ArrowRight />
          </PopButton>
        </div>
      )}
    </div>
  );
}

/** 3단계: 신호 카드로 "이런 표현 → 이 알고리즘"을 익히고, 퀴즈로 알아보는 연습 */
export function PatternSignalTrainer({ topic }: { topic: Topic }) {
  const signals = resolveSignals(topic.signalIds);
  const hasQuiz = topic.concept.recognitionQuiz.length > 0;
  return (
    <div className="flex flex-col gap-8">
      {signals.length > 0 && (
        <section aria-labelledby="trainer-signals-title" className="flex flex-col gap-3">
          <h2 id="trainer-signals-title" className="flex items-center gap-2 text-h2 text-foreground">
            <Search className="size-5 text-info-text" aria-hidden />
            이런 표현이 보이면 의심해 보세요
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {signals.map((signal) => (
              <li key={signal.id} className="flex">
                <SignalCard signal={signal} className="flex-1" />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="trainer-quiz-title" className="flex flex-col gap-3">
        <h2 id="trainer-quiz-title" className="flex items-center gap-2 text-h2 text-foreground">
          <Highlighter className="size-5 text-warning-text" aria-hidden />
          유형 인식 퀴즈
        </h2>
        {hasQuiz ? (
          <RecognitionQuiz topic={topic} />
        ) : (
          <EmptyState
            mood="sleepy"
            title="퀴즈를 준비하고 있어요"
            description="노디가 이 토픽의 퀴즈를 만들고 있어요. 위의 신호 카드를 먼저 익혀 두세요."
            className="rounded-xl border border-dashed bg-card/50 py-8"
          />
        )}
      </section>
    </div>
  );
}
