import { LoadingRegion, Skeleton } from "@/components/common/skeleton";

/** MeView가 진도를 읽는 동안 보여 주는 모양과 같다 */
export default function MeLoading() {
  return (
    <LoadingRegion label="마이페이지를 불러오는 중">
      <Skeleton className="h-9 w-40" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-28" />
        <Skeleton className="h-56" />
      </div>
    </LoadingRegion>
  );
}
