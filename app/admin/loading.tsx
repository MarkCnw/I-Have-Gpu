// app/admin/loading.tsx

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-9 w-64 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-48 bg-slate-100 rounded" />
      </div>

      {/* --- Action Cards Skeleton (3 ใบ) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 h-40 flex flex-col justify-between">
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-3" />
              <div className="h-10 w-16 bg-slate-300 rounded" />
            </div>
            <div className="h-6 w-24 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>

      {/* --- Stat Cards Skeleton (3 ใบ) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 (Dark) */}
        <div className="bg-slate-800 p-6 rounded-2xl h-32 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-slate-600 rounded" />
              <div className="h-7 w-32 bg-slate-500 rounded" />
            </div>
            <div className="w-10 h-10 bg-slate-700 rounded-lg" />
          </div>
        </div>

        {/* Card 2 & 3 */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 h-32 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-7 w-16 bg-slate-300 rounded" />
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}