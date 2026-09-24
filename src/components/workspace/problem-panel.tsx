import { Clock, Lock, Sparkles, Star } from "lucide-react";
import { Markdown } from "@/components/common/markdown";
import { LevelBadge, TopicChip } from "@/components/common/topic-badges";
import { getTopic } from "@/content/topics";
import { formatArgs, formatValue, signatureText } from "@/lib/runner/format";
import type { Language, Problem } from "@/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-small font-bold text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function ProblemPanel({
  problem,
  language,
  lockedReason,
}: {
  problem: Problem;
  language: Language;
  /** 아직 잠긴 레벨의 문제면 그 이유 */
  lockedReason: string | null;
}) {
  const topic = getTopic(problem.topic);
  const examples = problem.testCases.filter((t) => t.visibility === "example");

  return (
    <article className="flex flex-col gap-6 p-5">
      {lockedReason && (
        <p className="flex gap-2 rounded-md border border-dashed bg-muted px-3 py-2 text-small text-foreground">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span>
            아직 잠긴 레벨이에요 ({lockedReason}). 미리 풀어 볼 수 있고 XP도 받지만, 레벨 클리어로는 인정되지 않아요.
          </span>
        </p>
      )}
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {topic && <TopicChip topic={topic} />}
          <LevelBadge level={problem.level} />
          {problem.source === "generated" && (
            <span
              className="inline-flex h-7 items-center gap-1 rounded-full bg-info px-2.5 text-caption font-bold text-info-foreground"
              title="정답 코드로 모든 테스트를 검증한 AI 맞춤 문제예요. 풀면 XP를 받지만 레벨 클리어에는 들어가지 않아요."
            >
              <Sparkles className="size-3.5" aria-hidden />
              AI 맞춤 문제
            </span>
          )}
        </div>
        <h1 className="text-h2 text-foreground">{problem.title}</h1>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />약 {problem.estimatedMinutes}분
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" aria-hidden />
            {problem.xp} XP
          </span>
        </p>
      </header>

      <Markdown>{problem.statement}</Markdown>

      <Section title="함수">
        <pre className="overflow-x-auto rounded-md border bg-muted px-4 py-3 font-mono text-code-sm text-foreground shadow-inset">
          {signatureText(problem.signature.params, problem.signature.returns, language)}
        </pre>
      </Section>

      <Section title="입력">
        <Markdown className="text-small">{problem.inputFormat}</Markdown>
      </Section>

      <Section title="출력">
        <Markdown className="text-small">{problem.outputFormat}</Markdown>
      </Section>

      <Section title="제약 조건">
        <ul className="flex list-disc flex-col gap-1 pl-5 text-small text-foreground marker:text-primary-strong">
          {problem.constraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
      </Section>

      <Section title="예제">
        <div className="flex flex-col gap-3">
          {examples.map((example, index) => (
            <div key={example.id} className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-soft">
              <p className="text-small font-bold text-foreground">예제 {index + 1}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="mb-1 text-caption font-semibold text-muted-foreground">입력</p>
                  <pre className="overflow-x-auto rounded-sm bg-muted px-3 py-2 font-mono text-code-sm text-foreground">
                    {formatArgs(example.args, problem.signature.params)}
                  </pre>
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-caption font-semibold text-muted-foreground">반환값</p>
                  <pre className="overflow-x-auto rounded-sm bg-muted px-3 py-2 font-mono text-code-sm text-foreground">
                    {formatValue(example.expected)}
                  </pre>
                </div>
              </div>
              {example.explanation && <p className="text-small text-muted-foreground">{example.explanation}</p>}
            </div>
          ))}
        </div>
      </Section>
    </article>
  );
}
