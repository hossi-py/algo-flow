"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

/** 모바일(~767px) 하단 탭바 */
export function BottomTabBar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-card/90 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur",
        className,
      )}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-md text-caption font-bold outline-none",
                  "focus-visible:ring-4 focus-visible:ring-ring/40",
                  active ? "text-primary-soft-foreground" : "text-muted-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-tab-active"
                    className="absolute inset-x-2 inset-y-0 rounded-md bg-primary-soft"
                    transition={spring.bouncy}
                  />
                )}
                <Icon className="relative size-5" aria-hidden />
                <span className="relative">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
