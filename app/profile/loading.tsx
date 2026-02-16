// app/profile/loading.tsx

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background font-sans pb-20 animate-pulse">

      {/* 1. Navbar Skeleton */}
      <div className="border-b border-border-light bg-surface-card sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="h-4 w-28 bg-skeleton rounded-md" />
          <div className="h-5 w-32 bg-skeleton rounded-md" />
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10">

          {/* 2. Sidebar Skeleton */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-surface-card p-6 rounded-3xl border border-border-light shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-skeleton rounded-full mb-4 shadow-inner" />
              <div className="h-5 w-3/4 bg-skeleton rounded-md mb-2" />
              <div className="h-3 w-1/2 bg-skeleton-light rounded-md mb-6" />
              <div className="h-10 w-full bg-skeleton-light rounded-xl" />
            </div>

            {/* Navigation Menu Skeleton */}
            <div className="space-y-2 px-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-5 h-5 bg-skeleton-light rounded-md" />
                  <div className="h-4 w-24 bg-skeleton-light rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Main Content Skeleton */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-border-light pb-6">
              <div className="h-8 w-48 bg-skeleton rounded-lg" />
              <div className="h-4 w-24 bg-skeleton-light rounded-md" />
            </div>

            {/* List Items Skeleton */}
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface-card border border-border-light rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-skeleton rounded-md" />
                      <div className="h-3 w-24 bg-skeleton-light rounded-md" />
                    </div>
                    <div className="h-7 w-24 bg-skeleton-light rounded-full" />
                  </div>

                  <div className="flex gap-5 pt-2">
                    <div className="w-20 h-20 bg-skeleton-light rounded-2xl flex-shrink-0" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 w-2/3 bg-skeleton-light rounded-md" />
                      <div className="h-3 w-1/3 bg-skeleton-light rounded-md" />
                      <div className="h-5 w-20 bg-skeleton rounded-md mt-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}