import { Skeleton } from "../ui/skeleton";

function MobileSkeletonComp() {
  return (
    <div className="flex lg:hidden p-2.5 py-5">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 shrink-0 w-52">
          <span>
            <Skeleton className="size-12 rounded-xl bg-surface" />
          </span>
          <div className="flex flex-col gap-1 flex-1">
            <span>
              <Skeleton className="w-28 h-5 rounded-xl bg-surface" />
            </span>
            <span>
              <Skeleton className="w-20 h-4 rounded-xl bg-surface" />
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 bg-surface rounded-full" />
          <Skeleton className="w-12 h-12 bg-surface rounded-full" />
          <Skeleton className="w-10 h-10 bg-surface rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default MobileSkeletonComp;
