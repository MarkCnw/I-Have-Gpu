// app/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      // ไม่ว่าจะเจอ email หรือไม่ ก็จะแจ้งว่าส่งแล้ว (Security)
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Forgot Password?</h2>
          <p className="mt-2 text-sm text-txt-secondary">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center animate-in fade-in">
            <p className="font-bold mb-2">Check your email!</p>
            <p className="text-sm">We have sent a password reset link to <strong>{email}</strong>.</p>
            <Link href="/login" className="block mt-4 text-green-800 underline font-bold">
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-txt-muted" size={20} />
              <input
                type="email"
                required
                className="w-full pl-10 p-3 border border-border-main rounded-lg focus:ring-2 focus:ring-foreground focus:border-foreground outline-none transition bg-surface-card text-foreground"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-surface-card bg-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link href="/login" className="text-sm font-medium text-txt-secondary hover:text-foreground flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}