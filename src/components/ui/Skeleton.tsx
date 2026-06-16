interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-card bg-border/30 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-card bg-surface border border-border shadow-level2 p-lg space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-24 w-full rounded-md" />
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="rounded-card bg-surface border border-border p-lg space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
