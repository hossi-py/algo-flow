/**
 * 실제 Claude API로 AI 문제를 여러 번 생성해 검증 파이프라인을 끝까지 돌려 본다 (docs/06 M5 완료 기준 확인용).
 * 검증을 통과한 문제는 파이프라인 마지막 단계에서 정답 코드로 다시 채점해 AC가 나온 것이다.
 * API 비용이 드니 필요할 때만 실행한다.
 *
 *   pnpm ai:smoke            # 10회
 *   pnpm ai:smoke -- 3       # 3회
 */
import { draftWithClaude } from "@/lib/ai/generator";
import { runGenerationPipeline } from "@/lib/ai/pipeline";
import { createNodePythonRunner } from "@/lib/runner-node/node-runner";
import { TOPIC_PATTERNS } from "@/content/patterns";
import { TOPIC_SLUGS, type GenerationRequest } from "@/types";

async function main() {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.error("ANTHROPIC_API_KEY가 필요해요 (.env.local 또는 환경 변수).");
    process.exit(1);
  }
  const runs = Number(process.argv.at(-1)) > 0 ? Number(process.argv.at(-1)) : 10;
  const runner = createNodePythonRunner({ hashSeed: 0 });
  const secondRunner = createNodePythonRunner({ hashSeed: 1 });
  let verified = 0;

  for (let i = 0; i < runs; i += 1) {
    const topic = TOPIC_SLUGS[i % TOPIC_SLUGS.length]!;
    const request: GenerationRequest = {
      topic,
      level: ((i % 4) + 2) as GenerationRequest["level"],
      focusPatterns: [TOPIC_PATTERNS[topic][i % TOPIC_PATTERNS[topic].length]!],
      weakSignalIds: [],
    };
    const started = Date.now();
    const result = await runGenerationPipeline(crypto.randomUUID(), request, {
      draft: draftWithClaude,
      runner,
      secondRunner,
      onStatus: ({ status, attempt }) =>
        process.stdout.write(`\r[${i + 1}/${runs}] ${topic} Lv${request.level} · ${attempt}번째 시도 ${status}   `),
    });
    const seconds = ((Date.now() - started) / 1000).toFixed(0);
    const failures = result.attempts.filter((a) => !a.ok).map((a) => `${a.stage}: ${a.reason}`);
    if (result.status === "verified") verified += 1;
    const line = `${result.status === "verified" ? "✓" : "✗"} ${topic} Lv${request.level} ${
      result.status === "verified" ? `「${result.problem.title}」` : ""
    } 시도 ${result.attempts.length}회, ${seconds}초${failures.length ? `\n    떨어진 사유: ${failures.join("\n    ")}` : ""}`;
    process.stdout.write("\r");
    console.log(line);
  }

  await runner.dispose();
  await secondRunner.dispose();
  console.log(`\n검증 통과 ${verified}/${runs}`);
}

void main();
