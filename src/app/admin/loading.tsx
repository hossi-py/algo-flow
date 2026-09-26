import { HeadingSkeleton, LoadingRegion, Skeleton } from "@/components/common/skeleton";

export default function AdminOverviewLoading() {
  return (
    <LoadingRegion label="운영 현황을 불러오는 중">
      <HeadingSkeleton />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-xl" />
    </LoadingRegion>
  );
}
