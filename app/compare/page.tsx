'use client'

import { useCompareStore } from '@/app/store/useCompareStore'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompareStore()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  if (compareList.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 bg-slate-50/50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
          <AlertCircle size={48} className="text-slate-300" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">ยังไม่มีสินค้าเปรียบเทียบ</h1>
        <p className="text-slate-500 mb-8 max-w-md">เลือกสินค้าที่คุณสนใจแล้วกดปุ่ม <span className="font-semibold text-slate-700">"+ เปรียบเทียบ"</span> เพื่อดูความแตกต่างแบบชัดเจน</p>
        <Link href="/" className="px-8 py-3.5 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          ไปเลือกสินค้า
        </Link>
      </div>
    )
  }

  // 1. ดึง Keys ทั้งหมดของ Specs
  const allSpecKeys = Array.from(new Set(
    compareList.flatMap(p => p.specs ? Object.keys(p.specs) : [])
  ))

  // 2. Logic การ Highlight
  const getBestValue = (key: string) => {
    const values = compareList.map(p => {
      const valStr = p.specs?.[key] || ''
      const num = parseFloat(valStr.match(/[\d.]+/)?.[0] || '0')
      return { id: p.id, val: num, original: valStr }
    })

    if (values.every(v => v.val === 0)) return null

    const maxVal = Math.max(...values.map(v => v.val))
    return values.filter(v => v.val === maxVal).map(v => v.id)
  }

  return (
    <div className="bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-32">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="p-3 hover:bg-white rounded-full text-slate-500 hover:text-slate-900 transition shadow-sm border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">เปรียบเทียบสินค้า</h1>
            <p className="text-slate-500 text-sm mt-1">เปรียบเทียบสเปคและราคาเพื่อความคุ้มค่าที่สุด</p>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr>
                <th className="w-[250px] p-6 text-left bg-white sticky left-0 z-20 border-b border-slate-100 align-bottom shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">คุณสมบัติ</span>
                  <span className="text-xl font-bold text-slate-800">รายละเอียด</span>
                </th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-6 w-[350px] border-b border-slate-100 align-top bg-white z-10">
                    <div className="relative group">
                      <button 
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-3 -right-3 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 p-2 rounded-full transition shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 z-10"
                      >
                        <X size={18} />
                      </button>
                      
                      <div className="aspect-square relative bg-slate-50 rounded-2xl mb-5 border border-slate-100 overflow-hidden group-hover:shadow-md transition-all duration-300">
                        <Image 
                          src={product.image || '/placeholder.png'} 
                          alt={product.name} 
                          fill 
                          className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg leading-snug text-slate-900 line-clamp-2 h-14" title={product.name}>
                          {product.name}
                        </h3>
                        <p className="text-3xl font-bold text-black tracking-tight">
                          ฿{Number(product.price).toLocaleString()}
                        </p>
                        <Link href={`/products/${product.id}`} className="inline-block text-sm font-medium text-slate-500 hover:text-black hover:underline underline-offset-4 decoration-slate-300">
                          ดูรายละเอียดสินค้า
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="text-sm">
              {/* Highlight Row: Best Price */}
              <tr className="border-b border-slate-50 bg-slate-50/50">
                  <td className="p-6 font-bold text-slate-600 bg-slate-50 sticky left-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    ความคุ้มค่า
                  </td>
                  {compareList.map(p => (
                      <td key={p.id} className="p-6 text-center align-middle">
                          {Number(p.price) === Math.min(...compareList.map(i => Number(i.price))) ? (
                              <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 px-4 py-2 rounded-full font-bold text-xs ring-1 ring-emerald-200/50">
                                  <CheckCircle2 size={14} className="fill-emerald-600 text-white" />
                                  ราคาดีที่สุด
                              </div>
                          ) : (
                              <span className="text-slate-400 font-medium">-</span>
                          )}
                      </td>
                  ))}
              </tr>

              {/* Specs Rows */}
              {allSpecKeys.map((key, index) => {
                const bestProductIds = getBestValue(key)

                return (
                  <tr key={key} className={`border-b border-slate-50 hover:bg-slate-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                    <td className="p-6 font-semibold text-slate-500 sticky left-0 z-10 capitalize bg-inherit shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                      {key.replace(/_/g, ' ')}
                    </td>
                    {compareList.map((product) => {
                      const isBest = bestProductIds?.includes(product.id)
                      return (
                        <td key={product.id} className={`p-6 text-center relative align-middle ${isBest ? 'bg-emerald-50/20' : ''}`}>
                          <span className={`text-base ${isBest ? 'text-emerald-700 font-bold' : 'text-slate-700 font-medium'}`}>
                            {product.specs?.[key] || '-'}
                          </span>
                          
                          {isBest && (
                             <div className="absolute top-1/2 right-6 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)] hidden lg:block"></div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}