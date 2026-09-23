import { Eye, MessageCircleHeart } from "lucide-react";
import { Nodi } from "@/components/mascot/nodi";
import type { Problem } from "@/types";

/** Step 4 시각화 엔진 전까지: 의사코드와 준비 중 안내 */
export function VisualPanel({ problem }: { problem: Problem }) {
  const preset = problem.visualization?.presets[0];
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <div className="flex items-center gap-2">
        <Eye className="size-5 text-primary-strong" aria-hidden />
        <h2 className="text-h3 text-foreground">시각화</h2>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-card/50 px-4 py-6 text-center">
        <Nodi mood="sleepy" size={72} decorative />
        <p className="text-small font-bold text-foreground">한 단계씩 보기는 곧 열려요</p>
        <p className="text-caption text-muted-foreground">
          {preset
            ? `「${preset.title}」에서 알고리즘이 칸을 방문하는 순서를 재생할 거예요.`
            : "알고리즘 동작을 한 단계씩 재생할 거예요."}
        </p>
      </div>
      {preset && (
        <div className="flex flex-col gap-2">
          <p className="text-small font-bold text-muted-foreground">흐름 미리 보기 (의사코드)</p>
          <ol className="overflow-x-auto rounded-md border bg-muted py-2 font-mono text-code-sm text-foreground shadow-inset">
            {preset.pseudocode.map((line, i) => (
              <li key={i} className="flex gap-3 px-3 whitespace-pre">
                <span className="w-5 shrink-0 text-right text-muted-foreground select-none">{i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/** Step 5 AI 코치 전까지 */
export function CoachPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <Nodi mood="thinking" size={88} decorative />
      <p className="flex items-center gap-1.5 text-h3 text-foreground">
        <MessageCircleHeart className="size-5 text-primary-strong" aria-hidden />
        AI 코치는 곧 열려요
      </p>
      <p className="max-w-xs text-small text-muted-foreground">
        정답을 알려 주는 대신, 지금 코드와 열어 본 힌트를 보고 질문으로 길을 찾아 줄 거예요. 지금은 힌트 탭을 이용해
        주세요.
      </p>
    </div>
  );
}
