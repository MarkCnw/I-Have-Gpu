// app/register/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const obj = Object.fromEntries(formData.entries())

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      alert('✅ สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน')
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.error || 'สมัครสมาชิกไม่สำเร็จ')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">📝 Create Account</h1>
        
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Display Name</label>
            <input name="name" type="text" required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input name="email" type="email" required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Password</label>
            <input name="password" type="password" required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold transition disabled:opacity-50">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-slate-400 text-sm text-center mt-6">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-emerald-400 hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  )
}