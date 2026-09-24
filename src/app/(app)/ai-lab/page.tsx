import type { Metadata } from "next";
import { AiLabView, type AiLabPreset } from "@/components/ai-lab/ai-lab-view";
import { PATTERN_TAGS, type PatternTag } from "@/types";
import { isTopicSlug } from "@/content/topics";
import { isAiConfigured } from "@/lib/ai/client";

export const metadata: Metadata = { title: "AI 랩" };

function list(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** 추천 카드 등에서 ?topic=bfs&level=3&patterns=a,b&signals=sig-x 로 조건을 미리 채워 들어온다 */
export default async function AiLabPage(props: PageProps<"/ai-lab">) {
  const params = await props.searchParams;
  const topic = typeof params.topic === "string" && isTopicSlug(params.topic) ? params.topic : undefined;
  const levelNumber = Number(params.level);
  const level = levelNumber >= 2 && levelNumber <= 5 ? (levelNumber as 2 | 3 | 4 | 5) : undefined;
  const preset: AiLabPreset = {
    ...(topic ? { topic } : {}),
    ...(level ? { level } : {}),
    patterns: list(params.patterns).filter((tag): tag is PatternTag =>
      (PATTERN_TAGS as readonly string[]).includes(tag),
    ),
    signals: list(params.signals).slice(0, 5),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 text-foreground">AI 랩</h1>
      <AiLabView aiEnabled={isAiConfigured()} preset={preset} />
    </div>
  );
}
