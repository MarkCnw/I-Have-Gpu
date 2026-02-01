// app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react' // ใช้ Client-side sign in
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // เรียกใช้ NextAuth Credentials login
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // เราจะคุม Redirect เอง
      })

      if (result?.error) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      } else {
        router.push('/') // ล็อกอินผ่าน ให้ไปหน้าแรก
        router.refresh() // รีโหลดข้อมูลใหม่
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">🔐 Login to PC Builder</h1>
        
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none transition" 
            />
          </div>

          {/* 🔥 ส่วนที่เพิ่ม: ลิงก์ลืมรหัสผ่าน */}
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm text-slate-400 hover:text-emerald-400 transition hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded font-bold transition disabled:opacity-50 shadow-lg shadow-emerald-900/20"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          ยังไม่มีบัญชี? <Link href="/register" className="text-emerald-400 hover:underline">สมัครสมาชิก</Link> <br/>
          หรือ <Link href="/" className="text-blue-400 hover:underline">เข้าใช้งานแบบ Guest</Link>
        </p>
      </div>
    </div>
  )
}