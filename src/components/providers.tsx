"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { AccountSync } from "@/components/auth/account-sync";
import { CelebrationLayer } from "@/components/common/celebration";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useProgressStore } from "@/stores/progress-store";

/** 게스트 진도를 localStorage에서 불러온다. 저장소 접근이 막혀 있어도 빈 진도로 계속 진행 */
function ProgressHydrator() {
  useEffect(() => {
    Promise.resolve()
      .then(() => useProgressStore.persist.rehydrate())
      .catch(() => undefined)
      .finally(() => useProgressStore.getState().setHydrated());
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={150}>
          <ProgressHydrator />
          <AccountSync />
          {children}
          <CelebrationLayer />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
