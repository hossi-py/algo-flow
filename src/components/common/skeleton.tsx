import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 불러오는 동안 자리를 잡아 두는 회색 블록 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-muted motion-reduce:animate-none", className)} />;
}

/** 화면 읽기 도구에 "불러오는 중"을 알리는 틀 */
export function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={cn("flex flex-col gap-6", className)}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** 페이지 제목 + 설명 한 줄 자리 */
export function HeadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  );
}
