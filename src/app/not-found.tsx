import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PopButton } from "@/components/common/pop-button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <EmptyState
        mood="oops"
        title="길을 잃었어요"
        description="찾는 페이지가 알고리즘 숲 어디에도 없어요."
        action={
          <PopButton asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </PopButton>
        }
      />
    </main>
  );
}
