"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Lightbulb, RotateCcw, Square } from "lucide-react";
import { Markdown } from "@/components/common/markdown";
import { PopButton } from "@/components/common/pop-button";
import { Nodi } from "@/components/mascot/nodi";
import { CoachHttpError, streamCoach, summarizeResult } from "@/lib/ai/coach-client";
import { COACH_HISTORY_TURNS, COACH_MESSAGE_MAX, type CoachRequest } from "@/lib/ai/schemas";
import { cn } from "@/lib/utils";
import { metaPatch, useCoachStore, type CoachThreadMessage } from "@/stores/coach-store";
import type { HintsOpened, JudgeResult, Language, MascotMood, Problem } from "@/types";

const EMPTY: CoachThreadMessage[] = [];

const STARTER_QUESTIONS = [
  "어디서부터 시작하면 좋을까요?",
  "제 코드 어디가 틀렸을까요?",
  "예제 1을 어떻게 따라가 보면 돼요?",
];

interface CoachPanelProps {
  problem: Problem;
  language: Language;
  hintsOpened: HintsOpened;
  /** 지금 에디터의 코드 */
  getCode: () => string;
  lastResult: JudgeResult | null;
  /** 서버에 AI 키가 설정돼 있는지 */
  enabled: boolean;
  /** 코치가 추천한 힌트를 보러 가기 */
  onShowHints: () => void;
}

export function CoachPanel({
  problem,
  language,
  hintsOpened,
  getCode,
  lastResult,
  enabled,
  onShowHints,
}: CoachPanelProps) {
  const messages = useCoachStore((s) => s.threads[problem.id]) ?? EMPTY;
  const append = useCoachStore((s) => s.append);
  const patch = useCoachStore((s) => s.patch);
  const remove = useCoachStore((s) => s.remove);
  const clear = useCoachStore((s) => s.clear);
  const [draft, setDraft] = useState("");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && !m.failed);
  const headerMood: MascotMood = streamingId ? "loading" : (lastAssistant?.mood ?? "idle");

  // 새 글이 오면 맨 아래로
  const lastContent = messages.at(-1)?.content;
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length, lastContent]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || streamingId) return;
    setNotice(null);
    setDraft("");

    const now = new Date().toISOString();
    const history = messages
      .filter((m) => !m.failed && m.content.trim())
      .slice(-COACH_HISTORY_TURNS * 2)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    const userMessage: CoachThreadMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      hintLevel: hintsOpened,
      createdAt: now,
    };
    const replyId = crypto.randomUUID();
    append(problem.id, userMessage);
    append(problem.id, { id: replyId, role: "assistant", content: "", hintLevel: hintsOpened, createdAt: now });
    setStreamingId(replyId);

    const body: CoachRequest = {
      problemKey: problem.id,
      hintsOpened,
      language,
      code: getCode().slice(0, 20_000),
      lastResult: summarizeResult(lastResult, problem),
      messages: [...history, { role: "user", content: text }],
    };

    const controller = new AbortController();
    abortRef.current = controller;
    let content = "";
    try {
      await streamCoach(
        body,
        (event) => {
          if (event.type === "text") {
            content += event.delta;
            patch(problem.id, replyId, { content });
          } else if (event.type === "reset") {
            content = "";
            patch(problem.id, replyId, { content });
            setNotice(`${event.reason}…`);
          } else if (event.type === "meta") {
            patch(problem.id, replyId, metaPatch(event.meta));
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        },
        controller.signal,
      );
      setNotice(null);
      if (!content.trim()) remove(problem.id, replyId);
    } catch (error) {
      if (controller.signal.aborted) {
        if (!content.trim()) remove(problem.id, replyId);
        return;
      }
      const message =
        error instanceof CoachHttpError || error instanceof Error ? error.message : "노디가 대답하지 못했어요.";
      patch(problem.id, replyId, { content: message, failed: true, mood: "oops" });
      setNotice(null);
    } finally {
      abortRef.current = null;
      setStreamingId(null);
    }
  }

  if (!enabled) {
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <Nodi mood="sleepy" size={88} decorative />
        <p className="text-h3 text-foreground">AI 코치가 쉬는 중이에요</p>
        <p className="max-w-xs text-small text-muted-foreground">
          서버에 AI 설정(ANTHROPIC_API_KEY)이 없어서 지금은 코치를 부를 수 없어요. 힌트 탭은 그대로 쓸 수 있어요.
        </p>
      </div>
    );
  }

  const followUps = !streamingId && lastAssistant === messages.at(-1) ? (lastAssistant?.followUps ?? []) : [];
  const suggestStep =
    !streamingId && lastAssistant?.suggestHintStep && lastAssistant.suggestHintStep > hintsOpened
      ? lastAssistant.suggestHintStep
      : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Nodi mood={headerMood} size={44} decorative />
        <div className="min-w-0 flex-1">
          <p className="text-small font-bold text-foreground">노디 코치</p>
          <p className="truncate text-caption text-muted-foreground">정답 대신 질문으로 길을 찾아 줘요</p>
        </div>
        {messages.length > 0 && (
          <PopButton
            variant="ghost"
            size="sm"
            onClick={() => {
              abortRef.current?.abort();
              clear(problem.id);
            }}
            disabled={Boolean(streamingId)}
          >
            <RotateCcw />새 대화
          </PopButton>
        )}
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Nodi mood="curious" size={72} decorative />
            <div className="flex flex-col gap-1">
              <p className="text-body font-bold text-foreground">막힌 곳을 물어보세요</p>
              <p className="text-small text-muted-foreground">
                지금 코드와 열어 본 힌트를 보고, 스스로 풀 수 있게 질문으로 도와줄게요.
              </p>
            </div>
            <SuggestionChips items={STARTER_QUESTIONS} onPick={(q) => void ask(q)} />
          </div>
        ) : (
          <ol className="flex flex-col gap-3">
            {messages.map((message) => (
              <li key={message.id}>
                <CoachBubble message={message} streaming={message.id === streamingId} />
              </li>
            ))}
          </ol>
        )}
        {notice && <p className="mt-2 text-center text-caption text-muted-foreground">{notice}</p>}
        {(followUps.length > 0 || suggestStep) && (
          <div className="mt-3 flex flex-col gap-2">
            {suggestStep && (
              <PopButton variant="soft" size="sm" className="self-start" onClick={onShowHints}>
                <Lightbulb />
                힌트 {suggestStep} 열어 보기
              </PopButton>
            )}
            {followUps.length > 0 && <SuggestionChips items={followUps} onPick={(q) => void ask(q)} align="start" />}
          </div>
        )}
      </div>

      <form
        className="shrink-0 border-t p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(draft);
        }}
      >
        <div className="flex items-end gap-2 rounded-lg border bg-background px-3 py-2 focus-within:ring-4 focus-within:ring-ring/30">
          <label htmlFor="coach-input" className="sr-only">
            노디에게 질문하기
          </label>
          <textarea
            id="coach-input"
            value={draft}
            maxLength={COACH_MESSAGE_MAX}
            rows={1}
            placeholder="예: 방문 표시는 언제 해야 해요?"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                void ask(draft);
              }
            }}
            className="[field-sizing:content] max-h-28 min-h-6 flex-1 resize-none bg-transparent text-small text-foreground outline-none placeholder:text-muted-foreground"
          />
          {streamingId ? (
            <PopButton
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="답변 멈추기"
              onClick={() => abortRef.current?.abort()}
            >
              <Square />
            </PopButton>
          ) : (
            <PopButton type="submit" size="icon-sm" aria-label="보내기" disabled={!draft.trim()}>
              <ArrowUp />
            </PopButton>
          )}
        </div>
        <p className="mt-1.5 px-1 text-caption text-muted-foreground">Enter 보내기 · Shift+Enter 줄바꿈</p>
      </form>
    </div>
  );
}

function SuggestionChips({
  items,
  onPick,
  align = "center",
}: {
  items: string[];
  onPick: (question: string) => void;
  align?: "center" | "start";
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", align === "center" ? "justify-center" : "justify-start")}>
      {items.map((item) => (
        <li key={item}>
          <button
            type="button"
            onClick={() => onPick(item)}
            className="rounded-full border bg-card px-3 py-1.5 text-caption font-bold text-foreground shadow-soft transition-colors outline-none hover:bg-muted focus-visible:ring-4 focus-visible:ring-ring/40"
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}

function CoachBubble({ message, streaming }: { message: CoachThreadMessage; streaming: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary-soft px-3.5 py-2 text-small whitespace-pre-wrap text-primary-soft-foreground">
          {message.content}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <Nodi mood={streaming ? "loading" : (message.mood ?? "idle")} size={32} decorative className="mt-1 shrink-0" />
      <div
        className={cn(
          "max-w-[88%] min-w-0 rounded-2xl rounded-tl-sm border px-3.5 py-2.5 text-small text-card-foreground shadow-soft",
          message.failed ? "border-dashed bg-muted" : "bg-card",
        )}
      >
        {message.content ? (
          <div className="flex flex-col gap-2 [&_pre]:text-[12px]">
            <Markdown>{message.content}</Markdown>
          </div>
        ) : (
          <span className="inline-flex gap-1 py-1" aria-label="노디가 생각하는 중">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
