"use client";

import { ErrorScreen } from "@/components/common/error-screen";
import "./globals.css";

/** 루트 레이아웃까지 실패했을 때의 에러 화면. 레이아웃을 대신하므로 html·body를 직접 그린다 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-background text-foreground">
        <title>문제가 생겼어요 · algo-flow</title>
        <ErrorScreen error={error} retry={retry} />
      </body>
    </html>
  );
}
