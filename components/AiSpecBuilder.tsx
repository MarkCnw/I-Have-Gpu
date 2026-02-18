'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Send, Loader2, ShoppingCart } from 'lucide-react'
import { toast } from 'react-hot-toast'
// ✅ ตรวจสอบ Path ให้ถูก (ถ้า useCartStore อยู่ใน app/store)
import { useCartStore } from '@/app/store/useCartStore'

export default function AiSpecBuilder() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  // ✅ เรียกใช้ฟังก์ชัน addMultipleToCart จาก Store (ต้องมีฟังก์ชันนี้ใน Store ตามที่แก้ไปรอบก่อน)
  const { addMultipleToCart } = useCartStore()
  const router = useRouter()

  const handleAskAi = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/ai/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด')

      setResult(data)
      toast.success('AI จัดสเปกให้เรียบร้อย!')

    } catch (error) {
      toast.error('AI กำลังทำงานหนัก กรุณาลองใหม่')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyBuild = () => {
    // เช็คว่ามีข้อมูลสินค้าไหม
    if (result && result.products && result.products.length > 0) {
      try {
        // ✅ สั่งเพิ่มสินค้าทั้งหมดลงตะกร้า
        addMultipleToCart(result.products)
        
        toast.success(`เพิ่มสินค้า ${result.products.length} ชิ้นลงตะกร้าแล้ว!`)
        
        // 👉 พาไปหน้าตะกร้า (เปลี่ยน path ได้ถ้าหน้าตะกร้าคุณอยู่ที่อื่น)
        router.push('/cart') 
      } catch (error) {
        console.error("Cart Error:", error)
        toast.error("เกิดข้อผิดพลาดในการลงตะกร้า (เช็คไฟล์ useCartStore.ts)")
      }
    } else {
       toast.error('ไม่พบสินค้าที่จะเพิ่ม')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-blue-100 my-8">
      {/* ส่วนหัวข้อ */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">AI ช่วยจัดสเปกคอม</h2>
      </div>

      {/* ช่องพิมพ์ข้อความ */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="เช่น งบ 30,000 เล่นเกม Valorant ปรับสุด..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
          onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
        />
        <button
          onClick={handleAskAi}
          disabled={loading || !input}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
          ถาม
        </button>
      </div>

      {/* ส่วนแสดงผลลัพธ์จาก AI */}
      {result && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2 mt-4">
          <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-full shadow-sm">
                <Sparkles size={18} className="text-blue-500" />
             </div>
             <div>
                <h3 className="font-bold text-blue-900 mb-1">คำแนะนำจาก AI:</h3>
                <p className="text-slate-700 text-sm mb-3 leading-relaxed">{result.reason}</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4 pl-11">
            {result.products.map((p: any) => (
              <span key={p.id} className="text-xs bg-white border border-blue-200 px-3 py-1.5 rounded-full text-slate-600 shadow-sm">
                {p.name}
              </span>
            ))}
          </div>

          {/* 🔥 ปุ่มกดเพิ่มลงตะกร้า */}
          <button
            onClick={handleApplyBuild}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            เพิ่มลงตะกร้าทั้งหมด ({result.products.length} ชิ้น)
          </button>
        </div>
      )}
    </div>
  )
}