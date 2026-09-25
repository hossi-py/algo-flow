import type { Transition } from "motion/react";

/** docs/01-design-system.md §4 모션 토큰 */
export const spring = {
  /** 버튼, 칩, 스택 push/pop */
  bouncy: { type: "spring", stiffness: 520, damping: 24 },
  /** 패널, 카드 등장 */
  gentle: { type: "spring", stiffness: 260, damping: 28 },
  /** 마스코트 점프, 정답 배지 */
  jelly: { type: "spring", stiffness: 380, damping: 12, mass: 0.8 },
} satisfies Record<string, Transition>;

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

/** 목록 아이템이 순서대로 떠오르는 등장 효과 */
export const riseIn = {
  hidden: { opacity: 0, y: 12 },
  show: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring.gentle, delay: index * 0.05 },
  }),
};
