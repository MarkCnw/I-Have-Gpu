// app/profile/loading.tsx

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20 animate-pulse">
      
      {/* 1. Navbar Skeleton (ละเอียดขึ้น) */}
      <div className="border-b border-neutral-100 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="h-4 w-28 bg-neutral-200 rounded-md" /> {/* Back Button */}
          <div className="h-5 w-32 bg-neutral-200 rounded-md" /> {/* Page Title */}
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          
          {/* 2. Sidebar Skeleton (ด้านซ้าย) */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-neutral-200 rounded-full mb-4 shadow-inner" />
              <div className="h-5 w-3/4 bg-neutral-200 rounded-md mb-2" />
              <div className="h-3 w-1/2 bg-neutral-100 rounded-md mb-6" />
              <div className="h-10 w-full bg-neutral-100 rounded-xl" />
            </div>
            
            {/* Navigation Menu Skeleton */}
            <div className="space-y-2 px-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-5 h-5 bg-neutral-100 rounded-md" />
                  <div className="h-4 w-24 bg-neutral-100 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Main Content Skeleton (ด้านขวา) */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
               <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
               <div className="h-4 w-24 bg-neutral-100 rounded-md" />
            </div>

            {/* List Items Skeleton (เช่น ประวัติการสั่งซื้อ) */}
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-neutral-200 rounded-md" />
                      <div className="h-3 w-24 bg-neutral-100 rounded-md" />
                    </div>
                    <div className="h-7 w-24 bg-neutral-100 rounded-full" />
                  </div>
                  
                  <div className="flex gap-5 pt-2">
                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex-shrink-0" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 w-2/3 bg-neutral-100 rounded-md" />
                      <div className="h-3 w-1/3 bg-neutral-50 rounded-md" />
                      <div className="h-5 w-20 bg-neutral-200 rounded-md mt-auto" />
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