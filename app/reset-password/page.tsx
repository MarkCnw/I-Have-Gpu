// app/reset-password/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="text-center text-red-500">
        Invalid Link. Please request a new one.
        <Link href="/forgot-password" className="block mt-4 underline text-foreground">Try again</Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 3000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center bg-green-50 p-8 rounded-xl animate-in fade-in">
        <h3 className="text-2xl font-bold text-green-700 mb-2">Password Reset!</h3>
        <p className="text-green-600 mb-4">Your password has been updated successfully.</p>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
        <Link href="/login" className="block mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
          Login Now
        </Link>
      </div>
    )
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">{error}</div>}

      <div className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-txt-muted" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            className="w-full pl-10 pr-10 p-3 border border-border-main rounded-lg focus:ring-2 focus:ring-foreground outline-none bg-surface-card text-foreground"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-txt-muted hover:text-foreground">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-txt-muted" size={20} />
          <input
            type="password"
            required
            className="w-full pl-10 p-3 border border-border-main rounded-lg focus:ring-2 focus:ring-foreground outline-none bg-surface-card text-foreground"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-surface-card bg-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Resetting...' : 'Set New Password'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Reset Password</h2>
          <p className="mt-2 text-sm text-txt-secondary">Create a new strong password for your account.</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}