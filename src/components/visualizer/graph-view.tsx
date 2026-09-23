"use client";

import { motion, useReducedMotion } from "motion/react";
import type { GraphEdgeStatus, GraphNodeStatus, GraphSnapshot } from "@/types";

const NODE_STYLE: Record<GraphNodeStatus, { fill: string; stroke: string; text: string; dash?: string; label: string }> = {
  idle: { fill: "var(--muted)", stroke: "var(--border)", text: "var(--muted-foreground)", label: "아직" },
  frontier: {
    fill: "var(--info)",
    stroke: "var(--info-text)",
    text: "var(--info-foreground)",
    dash: "1.4 1",
    label: "대기 중",
  },
  current: { fill: "var(--primary)", stroke: "var(--primary-strong)", text: "var(--primary-foreground)", label: "지금" },
  visited: { fill: "var(--success)", stroke: "var(--success-text)", text: "var(--success-foreground)", label: "완료" },
};

const EDGE_STYLE: Record<GraphEdgeStatus, { stroke: string; width: number; dash?: string; opacity: number }> = {
  idle: { stroke: "var(--border)", width: 0.9, opacity: 1 },
  active: { stroke: "var(--primary-strong)", width: 1.3, dash: "2 1.2", opacity: 1 },
  tree: { stroke: "var(--success-text)", width: 1.5, opacity: 1 },
  rejected: { stroke: "var(--danger-text)", width: 0.8, dash: "1 1.4", opacity: 0.6 },
};

export function GraphView({ snapshot }: { snapshot: GraphSnapshot }) {
  const reduceMotion = useReducedMotion();
  const count = snapshot.nodes.length;
  const r = count > 12 ? 3.6 : count > 8 ? 4.6 : 5.6;
  const font = r * 0.78;
  const byId = new Map(snapshot.nodes.map((node) => [node.id, node]));
  const visitedLabels = snapshot.nodes.filter((n) => n.status === "visited").map((n) => n.label);

  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/70 bg-card/70 p-3">
      <svg
        viewBox="-4 -4 108 110"
        className="mx-auto aspect-[108/110] w-full max-w-[26rem]"
        role="img"
        aria-label={`그래프: 노드 ${count}개${visitedLabels.length ? `, 완료 ${visitedLabels.join(", ")}` : ""}`}
      >
        {snapshot.edges.map((edge) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;
          const style = EDGE_STYLE[edge.status];
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={style.stroke}
              strokeWidth={style.width}
              strokeDasharray={style.dash}
              strokeLinecap="round"
              opacity={style.opacity}
            />
          );
        })}
        {snapshot.nodes.map((node) => {
          const style = NODE_STYLE[node.status];
          const isCurrent = node.status === "current";
          return (
            <g key={node.id}>
              {isCurrent && !reduceMotion && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill="none"
                  stroke="var(--primary-strong)"
                  strokeWidth={0.8}
                  initial={{ r, opacity: 0.8 }}
                  animate={{ r: r + 3, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={isCurrent ? r * 1.12 : r}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={isCurrent ? 1.1 : 0.8}
                strokeDasharray={style.dash}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={node.label.length > 2 ? font * 0.72 : font}
                fontWeight={700}
                fill={style.text}
                fontFamily="inherit"
              >
                {node.label}
              </text>
              {node.order !== null && (
                <g>
                  <circle cx={node.x + r * 0.9} cy={node.y - r * 0.9} r={r * 0.46} fill="var(--warning)" stroke="var(--warning-text)" strokeWidth={0.4} />
                  <text
                    x={node.x + r * 0.9}
                    y={node.y - r * 0.9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={r * 0.5}
                    fontWeight={800}
                    fill="var(--warning-foreground)"
                    fontFamily="inherit"
                  >
                    {node.order}
                  </text>
                </g>
              )}
              {(node.caption || node.distance !== null) && (
                <text
                  x={node.x}
                  y={node.y + r + font * 0.95}
                  textAnchor="middle"
                  fontSize={font * 0.66}
                  fontWeight={600}
                  fill="var(--muted-foreground)"
                  fontFamily="inherit"
                >
                  {node.caption ?? `거리 ${node.distance}`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-caption text-muted-foreground" aria-label="범례">
        {(["current", "frontier", "visited"] as const).map((status) => (
          <li key={status} className="inline-flex items-center gap-1">
            <span
              className="inline-block size-3 rounded-full border"
              style={{
                background: NODE_STYLE[status].fill,
                borderColor: NODE_STYLE[status].stroke,
                borderStyle: NODE_STYLE[status].dash ? "dashed" : "solid",
              }}
              aria-hidden
            />
            {NODE_STYLE[status].label}
          </li>
        ))}
        <li className="inline-flex items-center gap-1">
          <span className="inline-grid size-3 place-items-center rounded-full bg-warning text-[8px] font-bold text-warning-foreground" aria-hidden>
            1
          </span>
          방문 순서
        </li>
      </ul>
    </section>
  );
}
