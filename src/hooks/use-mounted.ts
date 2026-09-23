"use client";

import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

/** 서버 렌더와 하이드레이션 중에는 false, 그 이후에는 true */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}
