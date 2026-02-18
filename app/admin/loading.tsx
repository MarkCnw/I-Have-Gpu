// app/admin/loading.tsx

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-9 w-64 bg-skeleton rounded-lg mb-2" />
        <div className="h-4 w-48 bg-skeleton-light rounded" />
      </div>

      {/* Action Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface-card p-6 rounded-2xl border border-border-main h-40 flex flex-col justify-between">
            <div>
              <div className="h-4 w-20 bg-skeleton rounded mb-3" />
              <div className="h-10 w-16 bg-skeleton rounded" />
            </div>
            <div className="h-6 w-24 bg-skeleton-light rounded-full" />
          </div>
        ))}
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-foreground p-6 rounded-2xl h-32 flex flex-col justify-between opacity-80">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/20 rounded" />
              <div className="h-7 w-32 bg-white/30 rounded" />
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-lg" />
          </div>
        </div>

        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-surface-card p-6 rounded-2xl border border-border-main h-32 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-skeleton-light rounded" />
                <div className="h-7 w-16 bg-skeleton rounded" />
              </div>
              <div className="w-10 h-10 bg-skeleton-light rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}