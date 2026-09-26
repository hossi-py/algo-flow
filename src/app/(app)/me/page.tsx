import type { Metadata } from "next";
import Link from "next/link";
import { MeView } from "@/components/me/me-view";
import { getAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "마이페이지" };

export default async function MePage() {
  // 관리자에게만 관리자 화면 링크를 보여 준다 (다른 사람에게는 존재도 드러내지 않는다)
  const admin = await getAdmin();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h1 text-foreground">마이페이지</h1>
        {admin && (
          <Link
            href="/admin"
            className="rounded-full bg-secondary px-4 py-1.5 text-small font-bold text-secondary-foreground outline-none hover:opacity-90 focus-visible:ring-4 focus-visible:ring-ring/40"
          >
            관리자 화면
          </Link>
        )}
      </div>
      <MeView />
    </div>
  );
}
