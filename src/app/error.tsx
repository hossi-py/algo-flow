"use client";

import { ErrorScreen } from "@/components/common/error-screen";

/** 페이지를 그리다 난 에러 화면 (루트 레이아웃은 그대로 두고 이 부분만 바꾼다) */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorScreen error={error} retry={retry} />;
}
