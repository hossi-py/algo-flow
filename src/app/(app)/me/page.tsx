import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";

export const metadata: Metadata = { title: "마이페이지" };

export default function MePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 text-foreground">마이페이지</h1>
      <div className="rounded-xl border border-border/70 bg-card shadow-soft">
        <EmptyState
          mood="sleepy"
          title="마이페이지는 곧 열려요"
          description="지금은 로그인 없이 이 브라우저에 진도가 저장돼요. 계정을 만들면 기기를 바꿔도 이어서 학습할 수 있게 될 거예요."
          action={
            <PopButton asChild variant="soft">
              <Link href="/">홈으로</Link>
            </PopButton>
          }
        />
      </div>
    </div>
  );
}
