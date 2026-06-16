import { CardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-8 w-48 bg-border/20 rounded mb-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
