// app/favorites/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-background font-sans pb-24">

      {/* ================= HEADER SKELETON ================= */}
      <div className="bg-surface-card border-b border-border-light sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 bg-skeleton rounded-full" />
            <div className="h-8 w-48 bg-skeleton rounded" />
          </div>
          <div className="h-5 w-24 bg-skeleton rounded animate-pulse" />
        </div>
      </div>

      {/* ================= CONTENT SKELETON ================= */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Grid Layout Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-card border border-border-light rounded-2xl overflow-hidden h-full flex flex-col animate-pulse shadow-sm"
            >
              {/* Image Skeleton */}
              <div className="aspect-square bg-skeleton" />

              {/* Content Skeleton */}
              <div className="p-5 flex flex-col flex-grow space-y-3">
                <div className="h-3 w-1/3 bg-skeleton-light rounded" />
                <div className="h-5 w-3/4 bg-skeleton rounded" />

                <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                  <div className="h-6 w-24 bg-skeleton rounded" />
                  <div className="h-4 w-16 bg-skeleton-light rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}