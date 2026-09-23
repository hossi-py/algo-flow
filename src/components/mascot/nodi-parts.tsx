"use client";

import { motion, type Transition } from "motion/react";
import type { NodiGrowth } from "@/lib/progress/xp";
import type { TopicColor } from "@/types";
import { FLOWER_COLORS, type ArmPose, type EyeShape, type MouthShape } from "./moods";

const INK = "var(--nodi-ink)";
const LINE = "var(--nodi-line)";

/* ───────────── 눈 ───────────── */

const EYE_X = [48, 72] as const;

export function Eyes({ shape, blink }: { shape: EyeShape; blink: boolean }) {
  if (shape === "arc") {
    return (
      <g stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round">
        {EYE_X.map((x) => (
          <path key={x} d={`M${x - 5} 69 Q${x} 62 ${x + 5} 69`} />
        ))}
      </g>
    );
  }
  if (shape === "chevron") {
    return (
      <g stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 64 L51 68 L44 72" />
        <path d="M76 64 L69 68 L76 72" />
      </g>
    );
  }
  if (shape === "closed") {
    return (
      <g stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round">
        {EYE_X.map((x) => (
          <path key={x} d={`M${x - 5} 68 Q${x} 72 ${x + 5} 68`} />
        ))}
      </g>
    );
  }

  const big = shape === "sparkle";
  const offsetX = shape === "lookUp" ? 1.5 : 0;
  const offsetY = shape === "lookUp" ? -2 : 0;

  const pupils = EYE_X.map((x) => (
    <g key={x}>
      <ellipse cx={x + offsetX} cy={68 + offsetY} rx={big ? 4.6 : 4} ry={big ? 7 : 6} fill={INK} />
      <circle cx={x + offsetX + 1.5} cy={65.5 + offsetY} r={big ? 2 : 1.6} fill="#fff" />
      {big && <circle cx={x + offsetX - 1.4} cy={71 + offsetY} r={1} fill="#fff" />}
    </g>
  ));

  if (!blink) return <g>{pupils}</g>;
  return (
    <motion.g
      style={{ transformBox: "fill-box" }}
      initial={{ scaleY: 1 }}
      animate={{ scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 4, times: [0, 0.9, 0.95, 1], repeat: Infinity, ease: "easeInOut" }}
    >
      {pupils}
    </motion.g>
  );
}

/* ───────────── 입 ───────────── */

export function Mouth({ shape }: { shape: MouthShape }) {
  switch (shape) {
    case "open":
      return <path d="M52 78 Q60 90 68 78 Z" fill={INK} />;
    case "flat":
      return <path d="M55 81 L65 80" stroke={INK} strokeWidth={2.5} strokeLinecap="round" fill="none" />;
    case "wavy":
      return (
        <path
          d="M53 82 Q56.5 78 60 82 Q63.5 86 67 82"
          stroke={INK}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
      );
    case "small-o":
      return <ellipse cx={60} cy={81} rx={2.4} ry={2.8} fill={INK} />;
    case "smile":
      return <path d="M55 79 Q60 85 65 79" stroke={INK} strokeWidth={2.5} strokeLinecap="round" fill="none" />;
  }
}

/* ───────────── 팔 (간선 + 이웃 노드 모양의 손) ───────────── */

const ARM_POSES: Record<ArmPose, { left: [number, number, number, number]; right: [number, number, number, number] }> =
  {
    rest: { left: [22, 74, 11, 66], right: [98, 74, 109, 66] },
    up: { left: [23, 62, 12, 46], right: [97, 62, 108, 46] },
    down: { left: [22, 78, 12, 84], right: [98, 78, 108, 84] },
    chin: { left: [22, 74, 11, 66], right: [96, 80, 80, 90] },
  };

export function Arms({ pose, transition, animated }: { pose: ArmPose; transition: Transition; animated: boolean }) {
  const { left, right } = ARM_POSES[pose];
  if (!animated) {
    return (
      <g strokeLinecap="round">
        <line x1={left[0]} y1={left[1]} x2={left[2]} y2={left[3]} stroke={LINE} strokeWidth={3} />
        <circle cx={left[2]} cy={left[3]} r={5} fill="#ffd3bf" stroke={LINE} strokeWidth={2.5} />
        <line x1={right[0]} y1={right[1]} x2={right[2]} y2={right[3]} stroke={LINE} strokeWidth={3} />
        <circle cx={right[2]} cy={right[3]} r={5} fill="#bfe3ff" stroke={LINE} strokeWidth={2.5} />
      </g>
    );
  }
  return (
    <g strokeLinecap="round">
      <motion.line
        initial={false}
        animate={{ x1: left[0], y1: left[1], x2: left[2], y2: left[3] }}
        transition={transition}
        stroke={LINE}
        strokeWidth={3}
      />
      <motion.circle
        initial={false}
        animate={{ cx: left[2], cy: left[3] }}
        transition={transition}
        r={5}
        fill="#ffd3bf"
        stroke={LINE}
        strokeWidth={2.5}
      />
      <motion.line
        initial={false}
        animate={{ x1: right[0], y1: right[1], x2: right[2], y2: right[3] }}
        transition={transition}
        stroke={LINE}
        strokeWidth={3}
      />
      <motion.circle
        initial={false}
        animate={{ cx: right[2], cy: right[3] }}
        transition={transition}
        r={5}
        fill="#bfe3ff"
        stroke={LINE}
        strokeWidth={2.5}
      />
    </g>
  );
}

/* ───────────── 새싹 ───────────── */

function Flower({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={angle}
            cx={cx + Math.sin(rad) * r}
            cy={cy - Math.cos(rad) * r}
            r={r * 0.8}
            fill={color}
            stroke={LINE}
            strokeWidth={1.2}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.6} fill="#fff3b0" stroke={LINE} strokeWidth={1.2} />
    </g>
  );
}

export function Sprout({ growth }: { growth: NodiGrowth }) {
  return (
    <g>
      <path d="M60 37 C60 31 60 27 61 21" stroke="var(--nodi-stem)" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path
        d="M61 23 C52 13 42 17 44 23 C48 27 56 26 61 23Z"
        fill="var(--nodi-leaf)"
        stroke="#2f6b45"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M61 23 C68 11 80 14 78 21 C74 26 66 26 61 23Z"
        fill="var(--nodi-leaf-2)"
        stroke="#2f6b45"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {growth === "leaves" && (
        <path
          d="M61 21 C58 13 62 7 66 9 C68 13 65 18 61 21Z"
          fill="var(--nodi-leaf)"
          stroke="#2f6b45"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      )}
      {growth === "bud" && <ellipse cx={61.5} cy={15} rx={4.5} ry={6} fill="#ffb3cf" stroke={LINE} strokeWidth={1.6} />}
      {growth === "bloom" && <Flower cx={61.5} cy={14} r={4.2} color="#ffa8c9" />}
    </g>
  );
}

/** 머리 둘레에 달리는 마스터 토픽 꽃 (최대 7송이) */
const CROWN_ANGLES = [-160, -140, -120, -60, -40, -20, -100] as const;

export function FlowerCrown({ flowers, animated }: { flowers: readonly TopicColor[]; animated: boolean }) {
  return (
    <g>
      {flowers.slice(0, CROWN_ANGLES.length).map((color, index) => {
        const angle = CROWN_ANGLES[index] ?? -100;
        const rad = (angle * Math.PI) / 180;
        const cx = 60 + 38 * Math.cos(rad);
        const cy = 72 + 34 * Math.sin(rad);
        if (!animated) return <Flower key={`${color}-${index}`} cx={cx} cy={cy} r={2.8} color={FLOWER_COLORS[color]} />;
        return (
          <motion.g
            key={`${color}-${index}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 14, delay: index * 0.06 }}
            style={{ transformBox: "fill-box" }}
          >
            <Flower cx={cx} cy={cy} r={2.8} color={FLOWER_COLORS[color]} />
          </motion.g>
        );
      })}
    </g>
  );
}

/* ───────────── 표정 소품 ───────────── */

export function SweatDrop() {
  return <path d="M89 46 C85 52 85 56 89 57 C93 56 93 52 89 46Z" fill="#bfe3ff" stroke="#1f5f99" strokeWidth={1.5} />;
}

export function QuestionMark() {
  return (
    <text x={92} y={34} fontSize={16} fontWeight={800} fill={LINE} fontFamily="inherit">
      ?
    </text>
  );
}

export function Sparkles() {
  return (
    <g fill="#ffe07a" stroke={LINE} strokeWidth={1.2} strokeLinejoin="round">
      <path d="M96 30 L98 36 L104 38 L98 40 L96 46 L94 40 L88 38 L94 36 Z" />
      <path d="M20 34 L21.2 37.8 L25 39 L21.2 40.2 L20 44 L18.8 40.2 L15 39 L18.8 37.8 Z" />
    </g>
  );
}
