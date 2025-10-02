import { Skeleton } from "../ui/skeleton";

function DesktopSkeletonComp() {
  return (
    <div className="hidden lg:flex items-center gap-12 px-8 py-5">
      <div className="flex items-center gap-4 shrink-0 w-52">
        <span>
          <Skeleton className="size-12 rounded-xl bg-surface" />
        </span>
        <div className="flex flex-col gap-1 flex-1">
          <span>
            <Skeleton className="w-48 h-5 rounded-xl bg-surface" />
          </span>
          <span>
            <Skeleton className="w-40 h-4 rounded-xl bg-surface" />
          </span>
        </div>
      </div>
      <div className="flex-1 h-full flex items-center gap-12">
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="w-full h-[6px] rounded-xl bg-surface" />
          <div className="w-full flex items-center justify-between px-3">
            <Skeleton className="w-10 h-5 rounded-md bg-surface" />
            <Skeleton className="w-10 h-5 rounded-md bg-surface" />
          </div>
          <div className="w-full flex items-center justify-center gap-4">
            <Skeleton className="size-12 rounded-full bg-surface" />
            <Skeleton className="size-12 rounded-full bg-surface" />
            <Skeleton className="size-12 rounded-full bg-surface" />
            <Skeleton className="size-16 rounded-full bg-surface" />
            <Skeleton className="size-12 rounded-full bg-surface" />
            <Skeleton className="size-12 rounded-full bg-surface" />
            <Skeleton className="size-12 rounded-full bg-surface" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0 w-44">
        <Skeleton className="size-6 rounded-md bg-surface shrink-0" />
        <Skeleton className="w-48 h-[6px] rounded-xl bg-surface" />
      </div>
    </div>
  );
}

export default DesktopSkeletonComp;
