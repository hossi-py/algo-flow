import { HeadingSkeleton, LoadingRegion, Skeleton } from "@/components/common/skeleton";

export default function AdminUsersLoading() {
  return (
    <LoadingRegion label="회원 목록을 불러오는 중">
      <HeadingSkeleton />
      <Skeleton className="h-11 max-w-xl rounded-full" />
      <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-9" />
        ))}
      </div>
    </LoadingRegion>
  );
}
