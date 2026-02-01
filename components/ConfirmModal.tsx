// components/ConfirmModal.tsx
'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  loading?: boolean
  variant?: 'danger' | 'info'
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "ยืนยันการทำรายการ", 
  message = "คุณแน่ใจหรือไม่?",
  confirmText = "ยืนยัน",
  loading = false,
  variant = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
        
        <div className={`flex items-center gap-3 mb-4 ${variant === 'danger' ? 'text-red-600' : 'text-blue-600'}`}>
          <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>

        <p className="text-slate-500 mb-8 leading-relaxed">
          {message}
        </p>

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
            className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold shadow-lg transition flex justify-center items-center gap-2
              ${variant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                : 'bg-black hover:bg-neutral-800 shadow-neutral-200'
              }`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}