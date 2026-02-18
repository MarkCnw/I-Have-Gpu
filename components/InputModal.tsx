// components/InputModal.tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

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
  confirmText = 'OK',
  loading = false
}: InputModalProps) {
  const { locale } = useLanguageStore()
  const [value, setValue] = useState(defaultValue)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-card rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 border border-border-main">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-txt-muted hover:text-foreground transition"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold mb-4 text-foreground">{title}</h3>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 border border-border-main rounded-xl mb-4 outline-none focus:border-foreground transition bg-surface-bg text-foreground placeholder:text-txt-muted"
          autoFocus
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-border-main font-bold text-txt-muted hover:bg-surface-bg transition disabled:opacity-50"
          >
            {t('common.cancel', locale)}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !value.trim()}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-surface-card bg-foreground hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}