"use client";

import Link from "next/link";
import { WandSparkles } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import { SoftCard } from "@/components/common/soft-card";
import { Nodi } from "@/components/mascot/nodi";
import { PATTERN_LABELS } from "@/content/patterns";
import { particle } from "@/lib/korean";
import { aiLabHrefForPatterns } from "@/lib/progress/recommend";
import type { WeaknessScore } from "@/types";

/** 가장 약한 패턴 하나 + AI 맞춤 문제 바로가기 (약점이 뚜렷할 때만 대시보드에 놓인다) */
export function RecommendCard({ weakest }: { weakest: WeaknessScore }) {
  const label = PATTERN_LABELS[weakest.pattern];

  return (
    <SoftCard className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Nodi mood="thinking" size={72} decorative className="shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-caption font-bold text-muted-foreground">노디의 추천</p>
        <p className="text-h3 text-foreground">
          「{label}」{particle(label, "이", "가")} 조금 약해요
        </p>
        <p className="text-small text-muted-foreground">{weakest.reasons.slice(0, 2).join(" · ")}</p>
      </div>
      <PopButton asChild className="shrink-0">
        <Link href={aiLabHrefForPatterns([weakest.pattern])}>
          <WandSparkles />
          AI 문제 받아보기
        </Link>
      </PopButton>
    </SoftCard>
  );
}
