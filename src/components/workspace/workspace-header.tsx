"use client";

import Link from "next/link";
import { ArrowLeft, CircleCheck, Minus, Plus } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LevelBadge } from "@/components/common/topic-badges";
import { cn } from "@/lib/utils";
import { EDITOR_FONT_SIZES } from "@/stores/settings-store";
import { LANGUAGES, LANGUAGE_LABELS, type Language, type Problem } from "@/types";

interface WorkspaceHeaderProps {
  problem: Problem;
  solved: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export function LanguageToggle({
  language,
  onChange,
  className,
}: {
  language: Language;
  onChange: (language: Language) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label="풀이 언어" className={cn("inline-flex h-9 rounded-full bg-muted p-1", className)}>
      {LANGUAGES.map((value) => {
        const active = value === language;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(value)}
            className={cn(
              "rounded-full px-3 text-caption font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
              active ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
          >
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
  fontSize,
  onFontSizeChange,
}: WorkspaceHeaderProps) {
  const sizeIndex = EDITOR_FONT_SIZES.indexOf(fontSize as (typeof EDITOR_FONT_SIZES)[number]);
  const smaller = EDITOR_FONT_SIZES[Math.max(0, (sizeIndex === -1 ? 2 : sizeIndex) - 1)] ?? fontSize;
  const larger =
    EDITOR_FONT_SIZES[Math.min(EDITOR_FONT_SIZES.length - 1, (sizeIndex === -1 ? 2 : sizeIndex) + 1)] ?? fontSize;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-2 sm:px-3">
      <PopButton asChild variant="ghost" size="icon-sm" aria-label="토픽으로 돌아가기">
        <Link href={`/topics/${problem.topic}`}>
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
      <LanguageToggle language={language} onChange={onLanguageChange} />
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
