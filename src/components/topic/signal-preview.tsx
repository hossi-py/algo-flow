import { Search, TriangleAlert } from "lucide-react";
import { getSignal } from "@/content/signals";
import { cn } from "@/lib/utils";
import type { PatternSignal, SignalStrength } from "@/types";

const STRENGTH_LABEL: Record<SignalStrength, { label: string; className: string }> = {
  strong: { label: "강한 신호", className: "bg-success text-success-foreground" },
  medium: { label: "보통 신호", className: "bg-info text-info-foreground" },
  weak: { label: "약한 신호", className: "bg-muted text-muted-foreground" },
};

/** "이런 표현이 나오면 이 토픽을 의심하세요" 카드 목록 */
export function SignalPreview({ signalIds }: { signalIds: string[] }) {
  const signals = signalIds.map(getSignal).filter((s): s is PatternSignal => s !== undefined);
  if (signals.length === 0) return null;

  return (
    <section aria-labelledby="signals-title" className="flex flex-col gap-3">
      <h2 id="signals-title" className="flex items-center gap-2 text-h2 text-foreground">
        <Search className="size-5 text-info-text" aria-hidden />
        이런 표현이 나오면 의심하세요
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {signals.map((signal) => {
          const strength = STRENGTH_LABEL[signal.strength];
          return (
            <li
              key={signal.id}
              className="flex flex-col gap-2 rounded-lg border border-border/70 bg-card p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-h3 text-foreground">“{signal.phrase}”</p>
                <span className={cn("rounded-full px-2 py-0.5 text-caption font-bold", strength.className)}>
                  {strength.label}
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {signal.examples.map((example) => (
                  <li key={example} className="text-small text-muted-foreground before:mr-1.5 before:content-['·']">
                    {example}
                  </li>
                ))}
              </ul>
              <p className="text-small text-foreground">{signal.reason}</p>
              {signal.caution && (
                <p className="flex gap-2 rounded-md bg-warning px-3 py-2 text-small text-warning-foreground">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {signal.caution}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
