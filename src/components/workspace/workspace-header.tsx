"use client";

import Link from "next/link";
import { ArrowLeft, CircleCheck, Minus, Plus, Star } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LevelBadge } from "@/components/common/topic-badges";
import { cn } from "@/lib/utils";
import { EDITOR_FONT_SIZES } from "@/stores/settings-store";
import { LANGUAGES, LANGUAGE_LABELS, type Language, type Problem } from "@/types";

/** 언어 이름 뒤 목적격 조사 (파이썬을 · 자바스크립트를 · 자바를) */
const OBJECT_PARTICLE: Record<Language, string> = { python: "을", javascript: "를", java: "를" };

interface WorkspaceHeaderProps {
  problem: Problem;
  solved: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
  /** 이 문제에서 고를 수 있는 언어 */
  languages: readonly Language[];
  /** 주력 언어 (문제를 열면 이 언어로 시작) */
  preferred: Language;
  onMakePreferred: (language: Language) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export function LanguageToggle({
  language,
  onChange,
  languages = LANGUAGES,
  preferred,
  label = "풀이 언어",
  className,
}: {
  language: Language;
  onChange: (language: Language) => void;
  languages?: readonly Language[];
  /** 주어지면 그 언어에 별 표시 */
  preferred?: Language;
  label?: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex h-9 rounded-full bg-muted p-1", className)}>
      {languages.map((value) => {
        const active = value === language;
        const isPreferred = value === preferred;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={isPreferred ? `${LANGUAGE_LABELS[value]} (주력 언어)` : undefined}
            onClick={() => onChange(value)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 text-caption font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
              active ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isPreferred && <Star className="text-streak size-3 fill-current" aria-hidden />}
            {LANGUAGE_LABELS[value]}
          </button>
        );
      })}
    </div>
  );
}

export function WorkspaceHeader({
  problem,
  solved,
  language,
  onLanguageChange,
  languages,
  preferred,
  onMakePreferred,
  fontSize,
  onFontSizeChange,
}: WorkspaceHeaderProps) {
  const sizeIndex = EDITOR_FONT_SIZES.indexOf(fontSize as (typeof EDITOR_FONT_SIZES)[number]);
  const smaller = EDITOR_FONT_SIZES[Math.max(0, (sizeIndex === -1 ? 2 : sizeIndex) - 1)] ?? fontSize;
  const larger =
    EDITOR_FONT_SIZES[Math.min(EDITOR_FONT_SIZES.length - 1, (sizeIndex === -1 ? 2 : sizeIndex) + 1)] ?? fontSize;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-2 sm:px-3">
      <PopButton
        asChild
        variant="ghost"
        size="icon-sm"
        aria-label={problem.source === "generated" ? "AI 랩으로 돌아가기" : "토픽으로 돌아가기"}
      >
        <Link href={problem.source === "generated" ? "/ai-lab" : `/topics/${problem.topic}`}>
          <ArrowLeft />
        </Link>
      </PopButton>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h1 className="truncate text-body font-bold text-foreground">{problem.title}</h1>
        <LevelBadge level={problem.level} showStage={false} className="hidden shrink-0 sm:inline-flex" />
        {solved && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success px-2 py-0.5 text-caption font-bold text-success-foreground">
            <CircleCheck className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">해결</span>
          </span>
        )}
      </div>
      {language !== preferred && (
        <PopButton
          variant="ghost"
          size="sm"
          className="hidden lg:inline-flex"
          onClick={() => onMakePreferred(language)}
          title="다음부터 문제를 열면 이 언어로 시작해요"
        >
          <Star />
          {LANGUAGE_LABELS[language]}
          {OBJECT_PARTICLE[language]} 주력 언어로
        </PopButton>
      )}
      <LanguageToggle
        language={language}
        onChange={onLanguageChange}
        languages={languages}
        preferred={preferred}
        label="풀이 언어"
      />
      <div className="hidden items-center md:flex" role="group" aria-label="에디터 글자 크기">
        <PopButton variant="ghost" size="icon-sm" aria-label="글자 작게" onClick={() => onFontSizeChange(smaller)}>
          <Minus />
        </PopButton>
        <span className="w-8 text-center text-caption font-bold text-muted-foreground tabular">{fontSize}</span>
        <PopButton variant="ghost" size="icon-sm" aria-label="글자 크게" onClick={() => onFontSizeChange(larger)}>
          <Plus />
        </PopButton>
      </div>
      <ThemeToggle />
    </header>
  );
}
