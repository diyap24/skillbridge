export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-deep/30 rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full
                      bg-gradient-to-r from-transparent via-royal/20 to-transparent
                      animate-[shimmer_1.5s_ease-in-out_infinite]" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-royal/15 bg-deep/20 p-6 space-y-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-3/4 mt-2" />
      <Skeleton className="h-3 w-1/2 mt-1" />
    </div>
  );
}
