"use client";

import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { TopicGlyph } from "@/components/common/topic-badges";
import { PATTERN_LABELS, TOPIC_PATTERNS } from "@/content/patterns";
import { TOPIC_COLOR_CLASSES } from "@/content/topic-style";
import { TOPICS } from "@/content/topics";
import { THEME_MAX } from "@/lib/ai/schemas";
import { cn } from "@/lib/utils";
import {
  LEVEL_STAGE_LABELS,
  LEVEL_STAGES,
  type GenerationRequest,
  type PatternTag,
  type TopicSlug,
  type TopicView,
} from "@/types";

type GenLevel = GenerationRequest["level"];
const LEVELS: GenLevel[] = [2, 3, 4, 5];
const MAX_FOCUS = 3;

export interface GenerateFormInitial {
  topic: TopicSlug;
  level: GenLevel;
  focusPatterns: PatternTag[];
}

interface GenerateFormProps {
  views: TopicView[];
  initial: GenerateFormInitial;
  /** 추천 근거가 된 약한 신호 (요청에 함께 보낸다) */
  weakSignalIds: string[];
  busy: boolean;
  disabledReason: string | null;
  onSubmit: (request: GenerationRequest) => void;
}

const CHIP =
  "rounded-full border px-3 py-1.5 text-caption font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50";

export function GenerateForm({ views, initial, weakSignalIds, busy, disabledReason, onSubmit }: GenerateFormProps) {
  const [topic, setTopic] = useState<TopicSlug>(initial.topic);
  const [level, setLevel] = useState<GenLevel>(initial.level);
  const [focus, setFocus] = useState<PatternTag[]>(initial.focusPatterns);
  const [theme, setTheme] = useState("");

  const choosePatterns = TOPIC_PATTERNS[topic];
  const selectTopic = (next: TopicSlug) => {
    setTopic(next);
    setFocus((current) => current.filter((tag) => TOPIC_PATTERNS[next].includes(tag)));
  };
  const togglePattern = (tag: PatternTag) =>
    setFocus((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : current.length < MAX_FOCUS
          ? [...current, tag]
          : current,
    );

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          topic,
          level,
          focusPatterns: focus,
          weakSignalIds,
          ...(theme.trim() ? { theme: theme.trim() } : {}),
        });
      }}
    >
      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-small font-bold text-foreground">토픽</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((item) => {
            const view = views.find((v) => v.topic === item.slug);
            const locked = view?.status === "locked";
            const active = item.slug === topic;
            const color = TOPIC_COLOR_CLASSES[item.color];
            return (
              <button
                key={item.slug}
                type="button"
                aria-pressed={active}
                disabled={locked}
                title={locked ? (view?.lockedReason ?? "잠겨 있어요") : undefined}
                onClick={() => selectTopic(item.slug)}
                className={cn(
                  CHIP,
                  "inline-flex items-center gap-1.5",
                  active
                    ? cn(color.surface, color.text, "border-transparent shadow-soft")
                    : "bg-card text-foreground hover:bg-muted",
                )}
              >
                {locked ? (
                  <Lock className="size-3.5" aria-hidden />
                ) : (
                  <TopicGlyph icon={item.icon} className="size-3.5" />
                )}
                {item.title}
              </button>
            );
          })}
        </div>
        <p className="text-caption text-muted-foreground">잠긴 토픽은 로드맵에서 먼저 열어 주세요.</p>
      </fieldset>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-small font-bold text-foreground">레벨</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEVELS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === level}
              onClick={() => setLevel(value)}
              className={cn(
                "flex flex-col items-start rounded-md border px-3 py-2 text-left transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
                value === level
                  ? "border-primary bg-primary-soft text-primary-soft-foreground"
                  : "bg-card hover:bg-muted",
              )}
            >
              <span className="text-small font-bold">Lv{value}</span>
              <span className="text-caption text-muted-foreground">{LEVEL_STAGE_LABELS[LEVEL_STAGES[value]]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-small font-bold text-foreground">
          집중 패턴 <span className="font-semibold text-muted-foreground">(선택, 최대 {MAX_FOCUS}개)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {choosePatterns.map((tag) => {
            const active = focus.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                disabled={!active && focus.length >= MAX_FOCUS}
                onClick={() => togglePattern(tag)}
                className={cn(
                  CHIP,
                  active
                    ? "border-primary bg-primary-soft text-primary-soft-foreground"
                    : "bg-card text-foreground hover:bg-muted",
                )}
              >
                {PATTERN_LABELS[tag]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="ai-lab-theme" className="text-small font-bold text-foreground">
          스토리 테마 <span className="font-semibold text-muted-foreground">(선택)</span>
        </label>
        <input
          id="ai-lab-theme"
          value={theme}
          maxLength={THEME_MAX}
          onChange={(event) => setTheme(event.target.value.replace(/[^\p{L}\p{N} ]/gu, ""))}
          placeholder="예: 우주, 카페, 도서관"
          className="h-11 rounded-md border bg-background px-3 text-small text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-ring/30"
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        <PopButton type="submit" size="lg" disabled={busy || disabledReason !== null}>
          <Sparkles />
          문제 만들기
        </PopButton>
        {disabledReason && <p className="text-caption text-muted-foreground">{disabledReason}</p>}
      </div>
    </form>
  );
}
