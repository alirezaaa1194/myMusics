import { Skeleton } from "../ui/skeleton";

function SkeletonListComp() {
  return (
    <ul className="flex flex-col gap-2">
      <Skeleton className="h-[58px] w-full rounded-lg bg-surface" />
      <Skeleton className="h-[58px] w-full rounded-lg bg-surface" />
      <Skeleton className="h-[58px] w-full rounded-lg bg-surface" />
      <Skeleton className="h-[58px] w-full rounded-lg bg-surface" />
      <Skeleton className="h-[58px] w-full rounded-lg bg-surface" />
    </ul>
  );
}

export default SkeletonListComp;
