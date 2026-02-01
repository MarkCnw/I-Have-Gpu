// components/ConfirmModal.tsx
'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  loading?: boolean
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "ยืนยันการทำรายการ", 
  message = "คุณแน่ใจหรือไม่ที่จะทำรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
  loading = false
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>

        {/* Body */}
        <p className="text-slate-500 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Footer (Buttons) */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
          >
            ยกเลิก
          </button>
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition flex justify-center items-center gap-2"
          >
            {loading ? 'กำลังลบ...' : 'ยืนยัน'}
          </button>
        </div>
      </div>
    </div>
  )
}