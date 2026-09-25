"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { FLOWER_COLORS } from "@/components/mascot/moods";
import { Nodi } from "@/components/mascot/nodi";
import { useCelebrationStore } from "@/stores/celebration-store";

const PARTICLE_COUNT = 14;
const AUTO_DISMISS_MS = 2400;

function CountUp({ to }: { to: number }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);
  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, to, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [to, reduceMotion]);
  return <>{reduceMotion ? to : value}</>;
}

/** 정답·레벨업·배지 획득 시 전역으로 띄우는 축하 레이어 */
export function CelebrationLayer() {
  const current = useCelebrationStore((state) => state.current);
  const dismiss = useCelebrationStore((state) => state.dismiss);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!current) return;
    const timer = window.setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [current, dismiss]);

  const palette = current?.color ? [FLOWER_COLORS[current.color]] : Object.values(FLOWER_COLORS);

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {current ? `${current.title}${current.xp ? ` 경험치 ${current.xp} 획득` : ""}` : ""}
      </div>
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            className="fixed inset-0 z-[60] grid place-items-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismiss}
          >
            <div className="relative grid place-items-center">
              {!reduceMotion &&
                Array.from({ length: PARTICLE_COUNT }, (_, i) => {
                  const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (i % 2) * 0.2;
                  const distance = 120 + (i % 3) * 28;
                  const color = palette[i % palette.length];
                  return (
                    <motion.span
                      key={i}
                      aria-hidden
                      className={i % 3 === 0 ? "absolute size-3 rounded-[4px]" : "absolute size-2.5 rounded-full"}
                      style={{ backgroundColor: color, boxShadow: "0 0 0 1.5px var(--nodi-line)" }}
                      initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
                      animate={{
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        scale: 1,
                        opacity: 0,
                        rotate: 180,
                      }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  );
                })}
              <motion.div
                className="flex min-w-64 flex-col items-center gap-1 rounded-2xl border bg-card px-8 pt-5 pb-6 text-center shadow-float"
                initial={reduceMotion ? { opacity: 0 } : { scale: 0.6, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 16 }}
              >
                <Nodi mood={current.mood} size={112} decorative />
                <p className="text-h2 text-foreground">{current.title}</p>
                {current.message && <p className="text-small text-muted-foreground">{current.message}</p>}
                {current.xp !== undefined && (
                  <p className="mt-2 inline-flex items-center rounded-full bg-warning px-4 py-1 text-h3 text-warning-foreground tabular">
                    +<CountUp to={current.xp} /> XP
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
