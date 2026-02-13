// app/products/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-background font-sans pb-24 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-border-light bg-surface-card">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
          <div className="h-4 w-40 bg-border-main rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 md:mt-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-border-main rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-border-main rounded-xl" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="h-6 w-20 bg-border-main rounded-full mb-4" />
              <div className="h-12 w-full bg-border-main rounded-lg mb-4" />
              <div className="h-12 w-3/4 bg-border-main rounded-lg mb-4" />
              <div className="h-4 w-40 bg-border-main rounded mt-2" />
            </div>

            <div className="p-6 bg-surface-bg rounded-2xl border border-border-light space-y-4">
              <div className="h-10 w-32 bg-border-main rounded" />
              <div className="h-4 w-48 bg-border-main rounded" />
              <div className="h-12 w-full bg-border-main rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-surface-bg rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Specs & Description Skeleton */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <div className="h-8 w-40 bg-border-main rounded" />
              <div className="h-40 w-full bg-surface-bg rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="h-8 w-40 bg-border-main rounded" />
              <div className="h-60 w-full bg-surface-bg rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}