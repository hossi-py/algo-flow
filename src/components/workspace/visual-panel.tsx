"use client";

import { Eye } from "lucide-react";
import { Nodi } from "@/components/mascot/nodi";
import { VisualizationExplorer } from "@/components/visualizer/visualization-explorer";
import type { Problem } from "@/types";

/** 문제에 딸린 시각화 프리셋을 한 단계씩 재생한다 */
export function VisualPanel({ problem }: { problem: Problem }) {
  const presets = problem.visualization?.presets ?? [];
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-center gap-2">
        <Eye className="size-5 text-primary-strong" aria-hidden />
        <h2 className="text-h3 text-foreground">시각화</h2>
      </div>
      {presets.length > 0 ? (
        <VisualizationExplorer presets={presets} />
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-card/50 px-4 py-6 text-center">
          <Nodi mood="sleepy" size={72} decorative />
          <p className="text-small font-bold text-foreground">이 문제는 시각화를 준비하고 있어요</p>
        </div>
      )}
    </div>
  );
}
