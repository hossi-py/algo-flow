"use client";

import { useCallback, useSyncExternalStore } from "react";

/** CSS 미디어 쿼리 일치 여부. 서버 렌더에서는 false */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** 데스크톱 3분할 / 사이드 패널 기준 (docs D7) */
export const DESKTOP_QUERY = "(min-width: 1024px)";
