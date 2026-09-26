import { HeadingSkeleton, LoadingRegion, Skeleton } from "@/components/common/skeleton";

export default function RankingLoading() {
  return (
    <LoadingRegion label="이번 주 랭킹을 불러오는 중" className="gap-8">
      <HeadingSkeleton />
      <div className="grid gap-4 pt-4 sm:grid-cols-3 sm:items-end">
        <Skeleton className="h-56 rounded-xl sm:order-2 sm:h-64" />
        <Skeleton className="h-56 rounded-xl sm:order-1" />
        <Skeleton className="h-56 rounded-xl sm:order-3" />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-14 rounded-2xl" />
        ))}
      </div>
    </LoadingRegion>
  );
}
