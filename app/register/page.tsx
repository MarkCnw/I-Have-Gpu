// app/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image' // Import Image
import { Loader2, ArrowRight } from 'lucide-react' // Import icons for styling

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
      // ใช้ alert ตามเดิมและ redirect
      alert('✅ สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน')
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.error || 'สมัครสมาชิกไม่สำเร็จ')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
      
      {/* Card Container */}
      <div className="w-full max-w-[420px] bg-white p-8 md:p-12 rounded-2xl shadow-xl shadow-neutral-100 border border-neutral-200">
        
        {/* ✅ Logo Section */}
        <div className="flex justify-center mb-10">
            <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                    src="/logo.svg"
                    alt="iHAVEGPU Logo"
                    width={180}
                    height={60}
                    className="h-12 w-auto object-contain"
                    priority
                />
            </Link>
        </div>

        <div className="mb-8 text-center">
            <h1 className="text-xl font-bold mb-2 text-neutral-900">Create Account</h1>
            <p className="text-neutral-500 text-sm">สมัครสมาชิกเพื่อเริ่มต้นใช้งาน</p>
        </div>
        
        {/* Error Message */}
        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-xs text-center border border-red-100 font-medium">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider ml-1">Display Name</label>
            <input 
                name="name" 
                type="text" 
                required 
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-neutral-400" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider ml-1">Email</label>
            <input 
                name="email" 
                type="email" 
                required 
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-neutral-400" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider ml-1">Password</label>
            <input 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-neutral-400" 
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {loading ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <>Register <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col gap-4 text-center">
            <p className="text-sm text-neutral-500">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/login" className="text-black font-bold hover:underline">
                    เข้าสู่ระบบ
                </Link>
            </p>
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-xs text-neutral-400">
          © 2026 iHAVEGPU Store. All rights reserved.
      </p>
    </div>
  )
}