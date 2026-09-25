"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { NodiGrowth } from "@/lib/progress/xp";
import type { MascotMood, TopicColor } from "@/types";
import { MOOD_FACE, MOOD_LABELS } from "./moods";
import { Arms, Eyes, FlowerCrown, Mouth, QuestionMark, Sparkles, Sprout, SweatDrop } from "./nodi-parts";

export interface NodiProps {
  mood?: MascotMood;
  /** px */
  size?: number;
  growth?: NodiGrowth;
  /** 마스터한 토픽 꽃 */
  flowers?: readonly TopicColor[];
  /** 같은 mood를 다시 재생하고 싶을 때 값을 바꾼다 (예: 연속 정답) */
  replayKey?: number;
  /** 장식용이면 스크린 리더에서 숨긴다 */
  decorative?: boolean;
  className?: string;
}

interface MoodMotion {
  animate: TargetAndTransition;
  transition: Transition;
}

/** 애니메이션이 끝났을 때(또는 모션을 줄였을 때)의 정지 자세 */
interface Pose {
  rotate?: number;
  y?: number;
}

const BODY_MOTION: Record<MascotMood, MoodMotion> = {
  idle: { animate: { scaleY: [1, 1.025, 1] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  happy: { animate: { y: [0, -14, 0] }, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
  cheer: { animate: { y: [0, -14, 0, -9, 0] }, transition: { duration: 1.1, ease: "easeOut" } },
  thinking: { animate: { rotate: [-4, 4, -4] }, transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } },
  oops: { animate: { x: [0, -4, 2, 0] }, transition: { duration: 0.4 } },
  sleepy: { animate: { scaleY: [1, 1.035, 1] }, transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } },
  curious: { animate: { rotate: 6, y: -2 }, transition: { type: "spring", stiffness: 300, damping: 16 } },
  loading: { animate: { rotate: [0, 360] }, transition: { duration: 1.4, repeat: Infinity, ease: "linear" } },
};

const SPROUT_MOTION: Record<MascotMood, MoodMotion> = {
  idle: { animate: { rotate: [0, 3, 0, -3, 0] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
  happy: { animate: { rotate: [0, -14, 12, -6, 0] }, transition: { duration: 0.8 } },
  cheer: { animate: { rotate: [0, -14, 12, -14, 12, 0] }, transition: { duration: 1.2 } },
  thinking: { animate: { rotate: 28 }, transition: { type: "spring", stiffness: 200, damping: 12 } },
  oops: { animate: { rotate: 38 }, transition: { type: "spring", stiffness: 200, damping: 14 } },
  sleepy: { animate: { rotate: 22 }, transition: { duration: 1.2, ease: "easeInOut" } },
  curious: { animate: { rotate: -8 }, transition: { type: "spring", stiffness: 260, damping: 12 } },
  loading: { animate: { rotate: 0 }, transition: { duration: 0.2 } },
};

const STILL_POSE: Record<MascotMood, { body: Pose; sprout: Pose }> = {
  idle: { body: {}, sprout: {} },
  happy: { body: {}, sprout: {} },
  cheer: { body: {}, sprout: {} },
  thinking: { body: { rotate: -4 }, sprout: { rotate: 28 } },
  oops: { body: {}, sprout: { rotate: 38 } },
  sleepy: { body: {}, sprout: { rotate: 22 } },
  curious: { body: { rotate: 6, y: -2 }, sprout: { rotate: -8 } },
  loading: { body: {}, sprout: {} },
};

interface PoseGroupProps {
  /** false면 SVG transform 속성으로 정지 자세만 그린다 (SSR·하이드레이션·모션 줄이기) */
  animated: boolean;
  motionKey?: string;
  origin: readonly [number, number];
  still: Pose;
  motion: MoodMotion;
  children: ReactNode;
}

/**
 * Motion은 SVG transform-origin을 서버와 클라이언트에서 다르게 직렬화해 하이드레이션 경고를 낸다.
 * 그래서 첫 렌더는 순수 SVG로 그리고, 마운트 후에만 motion.g로 바꾼다.
 */
function PoseGroup({ animated, motionKey, origin, still, motion: moodMotion, children }: PoseGroupProps) {
  if (!animated) {
    const transform = `translate(0 ${still.y ?? 0}) rotate(${still.rotate ?? 0} ${origin[0]} ${origin[1]})`;
    return <g transform={transform}>{children}</g>;
  }
  return (
    <motion.g
      key={motionKey}
      style={{ transformBox: "view-box", originX: `${origin[0]}px`, originY: `${origin[1]}px` }}
      initial={{ rotate: still.rotate ?? 0, y: still.y ?? 0 }}
      animate={moodMotion.animate}
      transition={moodMotion.transition}
    >
      {children}
    </motion.g>
  );
}

export function Nodi({
  mood = "idle",
  size = 96,
  growth = "sprout",
  flowers = [],
  replayKey = 0,
  decorative = false,
  className,
}: NodiProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion() ?? false;
  const animated = mounted && !reduceMotion;
  const face = MOOD_FACE[mood];
  const still = STILL_POSE[mood];
  const armTransition: Transition = animated ? { type: "spring", stiffness: 380, damping: 18 } : { duration: 0 };

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={cn("shrink-0 overflow-visible select-none", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : MOOD_LABELS[mood]}
    >
      <ellipse cx={60} cy={112} rx={30} ry={4} fill="var(--nodi-line)" opacity={0.12} />
      <PoseGroup
        animated={animated}
        motionKey={`${mood}-${replayKey}`}
        origin={mood === "loading" ? [60, 72] : [60, 108]}
        still={still.body}
        motion={BODY_MOTION[mood]}
      >
        <PoseGroup animated={animated} origin={[60, 37]} still={still.sprout} motion={SPROUT_MOTION[mood]}>
          <Sprout growth={growth} />
        </PoseGroup>
        <Arms pose={face.arms} transition={armTransition} animated={mounted} />
        <ellipse cx={60} cy={72} rx={40} ry={36} fill="var(--nodi-body)" stroke="var(--nodi-line)" strokeWidth={3} />
        <ellipse cx={46} cy={56} rx={10} ry={5} fill="#fff" opacity={0.35} transform="rotate(-20 46 56)" />
        <FlowerCrown flowers={flowers} animated={animated} />
        <Eyes shape={face.eyes} blink={animated && (mood === "idle" || mood === "loading")} />
        <ellipse cx={37} cy={80} rx={6} ry={3.5} fill="var(--nodi-blush)" />
        <ellipse cx={83} cy={80} rx={6} ry={3.5} fill="var(--nodi-blush)" />
        <Mouth shape={face.mouth} />
        {mood === "oops" && <SweatDrop />}
      </PoseGroup>
      {mood === "thinking" && <QuestionMark />}
      {(mood === "curious" || mood === "cheer") && <Sparkles />}
      {mood === "sleepy" && <SleepyZ animated={animated} />}
    </svg>
  );
}

function SleepyZ({ animated }: { animated: boolean }) {
  const letters = [
    { x: 90, y: 40, size: 12, delay: 0 },
    { x: 100, y: 26, size: 9, delay: 0.8 },
  ];
  return (
    <g fill="var(--nodi-line)" fontWeight={800} fontFamily="inherit">
      {letters.map((z) =>
        animated ? (
          <motion.text
            key={z.x}
            x={z.x}
            y={z.y}
            fontSize={z.size}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], y: [z.y, z.y - 8] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: z.delay }}
          >
            z
          </motion.text>
        ) : (
          <text key={z.x} x={z.x} y={z.y} fontSize={z.size} opacity={0.8}>
            z
          </text>
        ),
      )}
    </g>
  );
}
