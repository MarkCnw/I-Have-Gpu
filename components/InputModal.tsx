// components/InputModal.tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  loading?: boolean
}

export default function InputModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  placeholder = '',
  defaultValue = '',
  confirmText = 'ตกลง',
  loading = false
}: InputModalProps) {
  const [value, setValue] = useState(defaultValue)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-neutral-400 hover:text-black transition"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold mb-4 text-neutral-900">{title}</h3>
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 border border-neutral-200 rounded-xl mb-4 outline-none focus:border-black transition"
          autoFocus
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 font-bold text-neutral-600 hover:bg-neutral-50 transition disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !value.trim()}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-black hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? 'กำลังดำเนินการ...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}