"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Markdown } from "@/components/common/markdown";
import { PopButton } from "@/components/common/pop-button";
import { TOPIC_COLOR_CLASSES } from "@/content/topic-style";
import { useMounted } from "@/hooks/use-mounted";
import { useProgress } from "@/hooks/use-progress";
import { toLocalDate } from "@/lib/date";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";
import { LANGUAGES, LANGUAGE_LABELS, type CodeSnippet, type Topic } from "@/types";
import { ConceptIllustration } from "./concept-illustration";
import { useConceptCelebration } from "./use-concept-celebration";

/** 이만큼 가로로 밀면 카드를 넘긴다 (터치) */
const SWIPE_PX = 48;
/** 카드가 이만큼 화면에 머물러야 읽음으로 친다 (스쳐 지나간 카드·잠깐 마운트된 탭 제외) */
const READ_DWELL_MS = 600;

const slide = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -40 }),
};

function CodeSnippetView({ snippet }: { snippet: CodeSnippet }) {
  const mounted = useMounted();
  const stored = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  // 저장된 언어는 localStorage에 있으므로 하이드레이션이 끝난 뒤에 반영한다
  const language = mounted ? stored : "python";

  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-label="코드 언어" className="inline-flex w-fit rounded-full bg-muted p-0.5">
        {LANGUAGES.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={language === value}
            onClick={() => setLanguage(value)}
            className={cn(
              "rounded-full px-3 py-1 text-caption font-bold outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
              language === value ? "bg-card text-foreground shadow-soft" : "text-muted-foreground",
            )}
          >
            {LANGUAGE_LABELS[value]}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-md border bg-muted px-4 py-3 font-mono text-code-sm text-foreground shadow-inset">
        {snippet.code[language]}
      </pre>
      {snippet.caption && <p className="text-caption text-muted-foreground">{snippet.caption}</p>}
    </div>
  );
}

/** 비유 + 그림 + 설명 + 핵심 포인트 + (선택) 코드 카드를 한 장씩 넘겨 본다. 화면에 나온 카드는 읽음으로 기록 */
export function ConceptCardDeck({ topic, onFinish }: { topic: Topic; onFinish: () => void }) {
  const cards = topic.concept.cards;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { progress, hydrated } = useProgress();
  const readConceptCard = useProgressStore((s) => s.readConceptCard);
  const celebrateOutcome = useConceptCelebration(topic);
  const reduceMotion = useReducedMotion();
  const swipeFrom = useRef<number | null>(null);

  const card = cards[index];
  const readIds = progress.concepts[topic.slug]?.completedCardIds ?? [];

  // 저장된 진도를 불러오기 전에 기록하면 불러오면서 덮어쓰므로 hydrated 이후에만
  useEffect(() => {
    if (!hydrated || !card) return;
    const timer = window.setTimeout(() => {
      const now = new Date();
      const outcome = readConceptCard(topic, card.id, toLocalDate(now), now.toISOString());
      if (outcome.cardsCompleted) {
        celebrateOutcome(outcome, { title: "개념 카드 완주!", message: `${topic.title}의 핵심을 모두 읽었어요` });
      }
    }, READ_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [card, celebrateOutcome, hydrated, readConceptCard, topic]);

  if (!card) return null;

  const color = TOPIC_COLOR_CLASSES[topic.color];
  const isLast = index === cards.length - 1;

  const go = (next: number) => {
    if (next < 0 || next >= cards.length || next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("input, textarea, [role=radiogroup]")) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    swipeFrom.current = event.pointerType === "mouse" ? null : event.clientX;
  };
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (swipeFrom.current === null) return;
    const dx = event.clientX - swipeFrom.current;
    swipeFrom.current = null;
    if (Math.abs(dx) >= SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="개념 카드 (←/→ 로 넘기기)"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="flex min-w-0 flex-col gap-4 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
    >
      {/* popLayout: 다음 카드를 바로 그리고 이전 카드는 위에 떠서 사라진다 (애니메이션이 멈춰도 내용은 바뀐다) */}
      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false} custom={reduceMotion ? 0 : direction}>
          <motion.article
            key={card.id}
            custom={reduceMotion ? 0 : direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : spring.gentle}
            aria-roledescription="slide"
            aria-label={`${cards.length}장 중 ${index + 1}번째: ${card.title}`}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipeFrom.current = null;
            }}
            className="grid touch-pan-y gap-5 rounded-xl border border-border/70 bg-card p-4 shadow-soft sm:p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-lg p-4 sm:p-5",
                color.surface,
                color.text,
              )}
            >
              <ConceptIllustration illustration={card.illustration} className="max-w-72" />
              <p className="text-center text-small font-semibold">“{card.analogy}”</p>
            </div>
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-caption font-bold text-muted-foreground tabular">
                  카드 {index + 1} / {cards.length}
                </p>
                <h2 className="text-h2 text-foreground">{card.title}</h2>
              </div>
              <Markdown>{card.body}</Markdown>
              <div className="flex flex-col gap-2 rounded-lg bg-primary-soft px-4 py-3">
                <p className="flex items-center gap-1.5 text-small font-bold text-primary-soft-foreground">
                  <Sparkles className="size-4" aria-hidden />
                  핵심 포인트
                </p>
                <ul className="flex flex-col gap-1">
                  {card.keyPoints.map((point) => (
                    <li key={point} className="flex gap-2 text-small text-primary-soft-foreground">
                      <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {card.code && <CodeSnippetView snippet={card.code} />}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <PopButton
          variant="outline"
          size="icon-sm"
          aria-label="이전 카드"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          <ChevronLeft />
        </PopButton>
        <ol className="flex flex-1 flex-wrap items-center justify-center gap-1.5" aria-label="카드 목록">
          {cards.map((c, i) => {
            const read = readIds.includes(c.id);
            const current = i === index;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1}번째 카드: ${c.title}${read ? " (읽음)" : ""}`}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "grid h-7 place-items-center rounded-full px-2 text-[11px] font-bold transition-[width,background-color] outline-none focus-visible:ring-4 focus-visible:ring-ring/40 motion-reduce:transition-none",
                    current
                      ? "min-w-12 bg-primary text-primary-foreground"
                      : read
                        ? "min-w-7 bg-success text-success-foreground"
                        : "min-w-7 bg-muted text-muted-foreground",
                  )}
                >
                  {read && !current ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </button>
              </li>
            );
          })}
        </ol>
        {isLast ? (
          <PopButton size="sm" onClick={onFinish}>
            시각화 보기 <ArrowRight />
          </PopButton>
        ) : (
          <PopButton variant="outline" size="icon-sm" aria-label="다음 카드" onClick={() => go(index + 1)}>
            <ChevronRight />
          </PopButton>
        )}
      </div>
    </section>
  );
}
