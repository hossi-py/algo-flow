"use client";

import { useState } from "react";
import { Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PopButton } from "@/components/common/pop-button";
import { useToday } from "@/hooks/use-today";
import { useCelebrationStore } from "@/stores/celebration-store";
import { useProgressStore } from "@/stores/progress-store";

/**
 * 개발 서버에서만 보이는 검토용 도구. 예시 진도를 불러와 잠금/해제·통계 화면을 확인할 수 있다.
 * 프로덕션 빌드에서는 AppShell이 렌더하지 않는다.
 */
export function DevToolbar() {
  const [open, setOpen] = useState(false);
  const clock = useToday();
  const loadDemo = useProgressStore((state) => state.loadDemo);
  const reset = useProgressStore((state) => state.reset);
  const awardXp = useProgressStore((state) => state.awardXp);
  const celebrate = useCelebrationStore((state) => state.celebrate);

  return (
    <div className="fixed right-3 bottom-24 z-50 flex flex-col items-end md:bottom-4">
      <AnimatePresence>
        {open && clock && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="mb-2 flex w-56 flex-col gap-2 rounded-lg border bg-popover p-3 text-popover-foreground shadow-float"
          >
            <p className="text-caption font-bold text-muted-foreground">개발용 도구 (dev 전용)</p>
            <PopButton size="sm" variant="soft" onClick={() => loadDemo(clock.today, clock.nowIso)}>
              예시 진도 불러오기
            </PopButton>
            <PopButton size="sm" variant="soft" onClick={() => awardXp(10, clock.today, 0)}>
              +10 XP (오늘 활동)
            </PopButton>
            <PopButton
              size="sm"
              variant="soft"
              onClick={() =>
                celebrate({
                  title: "정답이에요!",
                  message: "힌트 없이 풀었어요",
                  xp: 30,
                  mood: "happy",
                  color: "blossom",
                })
              }
            >
              축하 연출 보기
            </PopButton>
            <PopButton size="sm" variant="outline" onClick={reset}>
              진도 초기화
            </PopButton>
          </motion.div>
        )}
      </AnimatePresence>
      <PopButton
        size="icon-sm"
        variant="outline"
        aria-label={open ? "개발용 도구 닫기" : "개발용 도구 열기"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Wrench />}
      </PopButton>
    </div>
  );
}
