// app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast' // ใช้ toast ตัวเดิมของคุณ
import { Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (res?.error) {
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      } else {
        toast.success('เข้าสู่ระบบสำเร็จ')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        
        {/* Card Container */}
        <div className="w-full max-w-[420px] bg-white p-8 md:p-12 rounded-2xl shadow-xl shadow-neutral-100 border border-neutral-200">

            {/* ✅ Logo Section (ใส่ logo.svg แทนข้อความเดิม) */}
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
                <h1 className="text-xl font-bold mb-2 text-neutral-900">Login</h1>
                <p className="text-neutral-500 text-sm">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider ml-1">Email</label>
                    <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-neutral-400"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Password</label>
                        <Link href="/forgot-password" className="text-xs text-neutral-400 hover:text-black transition-colors font-bold">
                            ลืมรหัสผ่าน?
                        </Link>
                    </div>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-neutral-400"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>เข้าสู่ระบบ <ArrowRight size={18} /></>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col gap-4 text-center">
                <p className="text-sm text-neutral-500">
                    ยังไม่มีบัญชีสมาชิก?{' '}
                    <Link href="/register" className="text-black font-bold hover:underline">
                        สมัครสมาชิก
                    </Link>
                </p>
                <Link href="/" className="text-xs text-neutral-400 hover:text-black transition-colors font-medium">
                    เข้าใช้งานแบบ Guest (ไม่ล็อกอิน)
                </Link>
            </div>
        </div>
        
        {/* Footer Text */}
        <p className="mt-8 text-xs text-neutral-400">
            © 2026 iHAVEGPU Store. All rights reserved.
        </p>
    </div>
  )
}