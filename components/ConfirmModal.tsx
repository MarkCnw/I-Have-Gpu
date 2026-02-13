// components/ConfirmModal.tsx
'use client'

import { X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  variant = 'info'
}: ConfirmModalProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-foreground hover:opacity-90'
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

        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-txt-muted mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-border-main font-bold text-txt-muted hover:bg-surface-bg transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition disabled:opacity-50 ${variantStyles[variant]}`}
          >
            {loading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}