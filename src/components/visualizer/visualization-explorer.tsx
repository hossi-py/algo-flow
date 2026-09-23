"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Wand2 } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { EmptyState } from "@/components/common/empty-state";
import { GENERATORS, runGenerator } from "@/lib/visualization/generators";
import { cn } from "@/lib/utils";
import type { JsonValue, VisualizationPreset } from "@/types";
import { Player } from "./player";

interface VisualizationExplorerProps {
  presets: VisualizationPreset[];
  /** 넓은 레이아웃 (개념 학습 화면) */
  wide?: boolean;
  className?: string;
}

const NO_INPUT: JsonValue[] = [];

function stringify(input: JsonValue[]): string {
  return JSON.stringify(input);
}

export function VisualizationExplorer({ presets, wide = false, className }: VisualizationExplorerProps) {
  const [presetId, setPresetId] = useState(presets[0]?.id ?? "");
  const preset = presets.find((p) => p.id === presetId) ?? presets[0];
  const [customInput, setCustomInput] = useState<Record<string, JsonValue[]>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [inputError, setInputError] = useState<string | null>(null);

  const input = preset ? (customInput[preset.id] ?? preset.input) : NO_INPUT;
  const result = useMemo(() => (preset ? runGenerator(preset.generator, input) : null), [preset, input]);

  if (!preset || !result) {
    return <EmptyState mood="sleepy" title="시각화를 준비하고 있어요" className="py-6" />;
  }

  const definition = GENERATORS[preset.generator];
  const draftText = draft[preset.id] ?? stringify(input);

  const apply = () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(draftText);
    } catch {
      setInputError("JSON 형식이 올바르지 않아요. 따옴표와 괄호를 확인해 보세요.");
      return;
    }
    if (!Array.isArray(parsed)) {
      setInputError("입력은 [ ... ] 로 감싼 배열이어야 해요.");
      return;
    }
    const check = runGenerator(preset.generator, parsed as JsonValue[]);
    if (!check.ok) {
      setInputError(check.error);
      return;
    }
    setInputError(null);
    setCustomInput((prev) => ({ ...prev, [preset.id]: parsed as JsonValue[] }));
  };

  const reset = () => {
    setInputError(null);
    setCustomInput((prev) => {
      const next = { ...prev };
      delete next[preset.id];
      return next;
    });
    setDraft((prev) => {
      const next = { ...prev };
      delete next[preset.id];
      return next;
    });
  };

  return (
    <div className={cn("flex min-w-0 flex-col gap-4", className)}>
      {presets.length > 1 && (
        <div role="group" aria-label="시각화 예시 고르기" className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === preset.id}
              onClick={() => {
                setPresetId(p.id);
                setInputError(null);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-caption font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
                p.id === preset.id
                  ? "border-primary-strong bg-primary-soft text-primary-soft-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}
      <p className="text-small text-muted-foreground">{preset.description}</p>

      {preset.editableInput && (
        <details
          className="group rounded-lg border bg-card/60 px-4 py-3"
          open={customInput[preset.id] !== undefined || undefined}
        >
          <summary className="flex cursor-pointer items-center gap-2 text-small font-bold text-foreground">
            <Wand2 className="size-4 text-primary-strong" aria-hidden />
            입력을 바꿔서 직접 실험해 보기
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-caption text-muted-foreground">{definition.inputHint}</p>
            <label className="sr-only" htmlFor={`viz-input-${preset.id}`}>
              시각화 입력 (JSON)
            </label>
            <textarea
              id={`viz-input-${preset.id}`}
              value={draftText}
              onChange={(event) => {
                setDraft((prev) => ({ ...prev, [preset.id]: event.target.value }));
                setInputError(null);
              }}
              rows={3}
              spellCheck={false}
              aria-invalid={inputError !== null}
              aria-describedby={inputError ? `viz-error-${preset.id}` : undefined}
              className="w-full rounded-md border bg-muted px-3 py-2 font-mono text-code-sm text-foreground shadow-inset outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
            />
            {inputError && (
              <p id={`viz-error-${preset.id}`} role="alert" className="text-caption font-semibold text-danger-text">
                {inputError}
              </p>
            )}
            <div className="flex gap-2">
              <PopButton size="sm" onClick={apply}>
                이 입력으로 보기
              </PopButton>
              <PopButton size="sm" variant="ghost" onClick={reset}>
                <RotateCcw /> 처음 예시로
              </PopButton>
            </div>
          </div>
        </details>
      )}

      {result.ok ? (
        <Player
          steps={result.steps}
          pseudocode={preset.pseudocode}
          resetKey={`${preset.id}:${stringify(input)}`}
          wide={wide}
        />
      ) : (
        <p role="alert" className="rounded-md bg-danger px-3 py-2 text-small text-danger-foreground">
          예시 입력에 문제가 있어요: {result.error}
        </p>
      )}
    </div>
  );
}
