"use client";

import Link from "next/link";
import { useEffect } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";
import { reportClientError } from "@/lib/monitoring/report-client";

/**
 * error.tsx · global-error.tsx가 함께 쓰는 에러 화면. 뜨는 순간 에러를 한 번 보고한다.
 * 서버 에러는 운영 환경에서 메시지가 가려지고 digest만 오므로, digest를 보여 줘 문의할 때 찾을 수 있게 한다.
 */
export function ErrorScreen({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    reportClientError(error, { source: "boundary", digest: error.digest ?? null });
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <EmptyState
        mood="oops"
        title="앗, 문제가 생겼어요"
        description={
          <>
            노디가 이 화면을 그리다가 넘어졌어요. 다시 시도해도 계속되면 잠시 후에 와 주세요.
            {error.digest && <span className="mt-2 block font-mono text-caption">오류 번호 {error.digest}</span>}
          </>
        }
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <PopButton onClick={() => retry()}>다시 시도</PopButton>
            <PopButton variant="outline" asChild>
              <Link href="/">홈으로 돌아가기</Link>
            </PopButton>
          </div>
        }
      />
    </main>
  );
}
