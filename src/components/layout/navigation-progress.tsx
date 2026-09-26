"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** 이만큼 안에 끝나는 이동은 막대를 아예 보여 주지 않는다 (빠른 화면에서 깜빡이지 않게) */
const SHOW_AFTER_MS = 150;
/** 이동이 끝나지 않아도 이 시간이 지나면 막대를 거둔다 */
const GIVE_UP_MS = 10_000;

/**
 * 화면 맨 위의 얇은 진행 막대. 앱 안 링크를 누르고 이동이 조금 걸릴 때만 나타난다.
 * 주소(경로 + 쿼리)가 바뀌면 이동이 끝난 것으로 보고 바로 사라진다.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = search ? `${pathname}?${search}` : pathname;
  const [pending, setPending] = useState<string | null>(null);
  const [seen, setSeen] = useState(current);

  // 주소가 바뀌면(도착했거나 다른 곳으로 넘어갔으면) 막대를 거둔다
  if (seen !== current) {
    setSeen(current);
    setPending(null);
  }

  useEffect(() => {
    let showTimer: number | undefined;
    let giveUpTimer: number | undefined;
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const target = url.pathname + url.search;
      if (target === window.location.pathname + window.location.search) return;
      window.clearTimeout(showTimer);
      window.clearTimeout(giveUpTimer);
      showTimer = window.setTimeout(() => setPending(target), SHOW_AFTER_MS);
      giveUpTimer = window.setTimeout(() => setPending(null), GIVE_UP_MS);
    };
    // Next.js Link가 기본 동작을 막기 전에 보도록 capture 단계에서 듣는다
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(showTimer);
      window.clearTimeout(giveUpTimer);
    };
  }, []);

  const loading = pending !== null && pending !== current;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      {loading && <div className="nav-progress h-full origin-left rounded-r-full bg-primary" />}
    </div>
  );
}
