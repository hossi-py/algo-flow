"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { NAV_ITEMS } from "./nav-items";

/** 태블릿(768~1023)은 아이콘만, 데스크톱(1024~)은 라벨까지 보이는 사이드바 */
export function SideNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 h-dvh w-20 shrink-0 flex-col border-r bg-card/70 px-3 py-5 backdrop-blur lg:w-60 lg:px-4",
        className,
      )}
    >
      <div className="flex justify-center lg:justify-start lg:px-2">
        <Brand compact className="lg:hidden" />
        <Brand className="hidden lg:inline-flex" />
      </div>

      <nav aria-label="주요 메뉴" className="mt-8 flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          const link = (
            <Link
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-12 items-center justify-center gap-3 rounded-md px-3 text-body font-semibold transition-colors outline-none lg:justify-start",
                "focus-visible:ring-4 focus-visible:ring-ring/40",
                active ? "text-primary-soft-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="side-nav-active"
                  className="absolute inset-0 rounded-md bg-primary-soft"
                  transition={spring.bouncy}
                />
              )}
              <Icon className="relative size-5" aria-hidden />
              <span className="relative hidden lg:inline">{item.label}</span>
            </Link>
          );
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="flex justify-center border-t pt-4 lg:justify-start">
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
        <div className="hidden w-full lg:block">
          <ThemeToggle withLabel />
        </div>
      </div>
    </aside>
  );
}
