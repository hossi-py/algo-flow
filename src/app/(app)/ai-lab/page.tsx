import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";

export const metadata: Metadata = { title: "AI 랩" };

export default function AiLabPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 text-foreground">AI 랩</h1>
      <div className="rounded-xl border border-border/70 bg-card shadow-soft">
        <EmptyState
          mood="loading"
          title="AI 맞춤 문제를 준비하고 있어요"
          description="약한 유형을 분석해서, 정답 코드로 검증까지 마친 문제만 골라 드릴 거예요."
          action={
            <PopButton asChild variant="soft">
              <Link href="/roadmap">로드맵에서 먼저 공부하기</Link>
            </PopButton>
          }
        />
      </div>
    </div>
  );
}
