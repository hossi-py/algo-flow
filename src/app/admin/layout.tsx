import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Brand } from "@/components/layout/brand";
import { getAdmin, requireAdmin } from "@/lib/admin/auth";

/**
 * 관리자가 아니면 메타데이터를 하나도 붙이지 않는다. 제목·robots 태그가 다르면 일반 404와 구별돼
 * 관리자 화면이 있다는 게 드러나기 때문이다 (관리자가 아닌 크롤러는 어차피 404만 받는다).
 */
export async function generateMetadata(): Promise<Metadata> {
  if (!(await getAdmin())) return {};
  return {
    title: { default: "관리자", template: "%s · 관리자 · algo-flow" },
    robots: { index: false, follow: false },
  };
}

/**
 * 관리자 화면 틀. 관리자가 아니면 404.
 * (레이아웃은 화면 이동 때 다시 실행되지 않을 수 있어서, 페이지와 데이터 조회 함수에서도 따로 확인한다)
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Brand compact />
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-caption font-bold text-secondary-foreground">
            관리자
          </span>
          <AdminNav />
          <div className="ml-auto flex items-center gap-2 text-caption text-muted-foreground">
            <span className="hidden sm:inline">{admin.email}</span>
            <Link href="/" className="rounded-full px-3 py-1.5 font-bold hover:bg-muted hover:text-foreground">
              학습 화면으로
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">{children}</main>
    </div>
  );
}
