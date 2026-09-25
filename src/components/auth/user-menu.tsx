"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { PopButton } from "@/components/common/pop-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/stores/account-store";

export function loginHref(next: string) {
  return `/auth/login?next=${encodeURIComponent(next)}`;
}

export async function signOut() {
  await getBrowserSupabase()?.auth.signOut();
}

/** 상단 바의 계정 메뉴: 게스트면 로그인 버튼, 로그인했으면 닉네임 메뉴 (Supabase 설정이 없으면 숨김) */
export function UserMenu({ className }: { className?: string }) {
  const pathname = usePathname();
  const status = useAccountStore((s) => s.status);
  const profile = useAccountStore((s) => s.profile);
  const email = useAccountStore((s) => s.email);

  if (status === "disabled") return null;
  if (status === "loading") {
    return <span className={cn("size-9 animate-pulse rounded-full bg-muted", className)} aria-hidden />;
  }
  if (status === "guest") {
    return (
      <PopButton asChild variant="soft" size="sm" className={className}>
        <Link href={loginHref(pathname)}>
          <LogIn />
          <span className="hidden sm:inline">로그인</span>
        </Link>
      </PopButton>
    );
  }

  const name = profile?.nickname ?? "학습자";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${name} 계정 메뉴`}
          className={cn(
            "flex size-9 items-center justify-center rounded-full bg-primary text-small font-bold text-primary-foreground shadow-soft outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
            className,
          )}
        >
          {name.slice(0, 1)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52 rounded-md">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-small font-bold text-foreground">{name}</span>
          {email && <span className="truncate text-caption font-normal text-muted-foreground">{email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/me">
            <UserRound />
            마이페이지
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** 진도 저장 실패 안내 */
export function SyncNotice() {
  const syncError = useAccountStore((s) => s.syncError);
  const set = useAccountStore((s) => s.set);
  if (!syncError) return null;
  return (
    <div
      role="status"
      className="mb-4 flex items-center justify-between gap-3 rounded-md bg-warning px-4 py-2.5 text-small text-warning-foreground"
    >
      <span>{syncError}</span>
      <button type="button" className="shrink-0 font-bold underline" onClick={() => set({ syncError: null })}>
        닫기
      </button>
    </div>
  );
}
