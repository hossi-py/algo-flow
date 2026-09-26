import { HeadingSkeleton, LoadingRegion, Skeleton } from "@/components/common/skeleton";

export default function AdminUserLoading() {
  return (
    <LoadingRegion label="회원 정보를 불러오는 중">
      <HeadingSkeleton />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </LoadingRegion>
  );
}
