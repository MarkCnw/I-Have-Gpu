'use client'

import { useCompareStore } from '@/app/store/useCompareStore'
import Image from 'next/image'
import Link from 'next/link'
import { X, ArrowRight, Layers, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // ✅ Import

export default function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore()

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }} // เริ่มต้น: อยู่ข้างล่าง มองไม่เห็น
          animate={{ y: 0, opacity: 1 }}   // จบ: เลื่อนขึ้นมาที่เดิม
          exit={{ y: 100, opacity: 0 }}    // ออก: เลื่อนกลับลงไป
          transition={{ type: "spring", stiffness: 300, damping: 30 }} // เด้งดึ๋ง
          className="fixed bottom-0 left-0 right-0 bg-surface-card/95 backdrop-blur-md border-t border-border-main shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-4 px-4 sm:px-6 z-50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* ... (เนื้อหาข้างในเหมือนเดิม) ... */}
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-surface-bg text-txt-secondary p-2.5 rounded-xl">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm leading-tight">รายการเปรียบเทียบ</h3>
                  <p className="text-xs text-txt-muted font-medium mt-0.5">เลือกได้สูงสุด 3 รายการ</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence mode='popLayout'>
                  {compareList.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative group w-14 h-14 bg-surface-card border border-border-main rounded-xl overflow-hidden shadow-sm transition-all hover:border-foreground/20 hover:shadow-md"
                    >
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-contain p-2 mix-blend-multiply"
                      />
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[1px]"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty Slots */}
                {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-14 h-14 bg-surface-bg/50 border border-dashed border-border-main rounded-xl flex items-center justify-center text-txt-muted group cursor-default">
                    <span className="text-[10px] font-medium uppercase tracking-wider group-hover:text-txt-secondary transition-colors">ว่าง</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={clearCompare}
                className="hidden sm:flex items-center gap-2 text-txt-muted hover:text-red-600 text-sm font-medium transition-colors group px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                <span className="underline decoration-border-main hover:decoration-red-200 underline-offset-4">ล้างทั้งหมด</span>
              </button>

              <Link
                href="/compare"
                className="bg-foreground text-surface-card pl-6 pr-5 py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 ring-4 ring-transparent hover:ring-foreground/5"
              >
                เปรียบเทียบ <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-mono">{compareList.length}</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}