// components/CommunityShowcase.tsx
'use client'

import { useState, useEffect } from 'react'
import { Sparkles as LucideSparkles } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { Float, Sphere, Stars, Sparkles, Box, Torus } from '@react-three/drei'
import { useLanguageStore } from '@/app/store/useLanguageStore'

// 🎬 ใส่ "รหัสวิดีโอ" YouTube
const MY_YOUTUBE_VIDEOS = [
  "mwQpOPkGnCE", 
  "cxkBI2B2LnU", 
  "PbS1fqf-Yb8", 
  "kSB4NvjDIMk", 
]

// 🌐 ข้อมูลคำแปล (รองรับ 3 ภาษาแบบสมบูรณ์)
const TRANSLATIONS: Record<string, any> = {
  th: {
    
    title: "สุดยอด",
    highlight: "ประสบการณ์",
    desc: "ปลดล็อกทุกจินตนาการ ด้วยประสิทธิภาพที่ลื่นไหล", // ทำให้สั้นลง
  },
  en: {
    badge: "BEYOND LIMITS",
    title: "ULTIMATE",
    highlight: "EXPERIENCE",
    desc: "Unlock your imagination with flawless gaming performance.", // ทำให้สั้นลง
  },
  ja: {
    badge: "限界を超えて",
    title: "究極の",
    highlight: "体験",
    desc: "完璧なゲームパフォーマンスで、想像力を解き放とう。", // ทำให้สั้นลง
  }
}

// 🌌 คอมโพเนนต์ 3D พื้นหลัง Hologram Room
function HologramRoom3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 dark:opacity-80">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#0ea5e9" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#8b5cf6" />

        <Stars radius={50} depth={50} count={3000} factor={3} saturation={0} fade speed={1.5} />
        <Sparkles count={150} scale={18} size={2} speed={0.5} opacity={0.4} color="#38bdf8" />

        {/* 🟩 ตารางโฮโลแกรมพื้น */}
        <mesh position={[0, -5, -5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100, 40, 40]} />
          <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.15} />
        </mesh>

        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1}>
          <Sphere args={[2.5, 32, 32]} position={[-6, 2, -6]}>
            <meshStandardMaterial color="#0ea5e9" wireframe transparent opacity={0.3} />
          </Sphere>
        </Float>

        <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
          <Box args={[1.8, 1.8, 1.8]} position={[6, -2, -5]}>
            <meshStandardMaterial color="#8b5cf6" wireframe transparent opacity={0.4} />
          </Box>
        </Float>

        <Float speed={3} rotationIntensity={3} floatIntensity={1}>
          <group position={[5, 4, -7]}>
            <Torus args={[1.5, 0.1, 16, 64]} rotation={[1, 0, 0]}>
              <meshBasicMaterial color="#f472b6" wireframe transparent opacity={0.3} />
            </Torus>
          </group>
        </Float>

        <Float speed={1} rotationIntensity={1.2} floatIntensity={2}>
          <mesh position={[-5, -4, -4]}>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial color="#2dd4bf" wireframe transparent opacity={0.25} />
          </mesh>
        </Float>

      </Canvas>
    </div>
  )
}

export default function CommunityShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  const { locale } = useLanguageStore()
  
  let currentLang = 'th' 
  if (locale) {
    const lowerLocale = locale.toLowerCase()
    if (lowerLocale.includes('ja') || lowerLocale.includes('jp')) {
      currentLang = 'ja'
    } else if (lowerLocale.includes('en')) {
      currentLang = 'en'
    }
  }

  const tText = TRANSLATIONS[currentLang]

  useEffect(() => {
    setCurrentIndex(0) 
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MY_YOUTUBE_VIDEOS.length)
    }, 15000)
    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) return null

  return (
    // ⬇️ ปรับลด Padding จาก py-24 เป็น py-10 และกำหนด max-h เพื่อให้กระชับ
    <div className="relative py-10 md:py-12 overflow-hidden rounded-[2.5rem] my-4 transition-colors duration-300 bg-surface-bg border border-border-main shadow-inner flex flex-col justify-center max-h-[90vh] min-h-[600px]">
      
      <HologramRoom3D />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* ================= TYPOGRAPHY ================= */}
        {/* ⬇️ ย้าย Typography มาอยู่ฝั่งซ้าย (LG) เพื่อประหยัดพื้นที่แนวตั้ง */}
        <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start justify-center">
          
         
          
          {/* ⬇️ ลดขนาด Font ลงนิดนึง */}
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tighter uppercase text-foreground drop-shadow-xl leading-tight mb-2">
            {tText.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 animate-gradient-x">
              {tText.highlight}
            </span>
          </h2>
          
          <p className="text-xs md:text-sm text-txt-muted mt-2 max-w-sm font-medium tracking-wide leading-relaxed">
            {tText.desc}
          </p>

          {/* ================= DOTS NAVIGATION ================= */}
          {/* ⬇️ ย้ายปุ่ม Dots มาไว้ใต้ Text (เมื่ออยู่บน PC) เพื่อประหยัดที่ด้านล่าง */}
          <div className="flex justify-center lg:justify-start items-center gap-3 mt-8">
            {MY_YOUTUBE_VIDEOS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-500 ease-out rounded-full ${
                  idx === currentIndex 
                    ? 'w-10 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] scale-110' 
                    : 'w-2 h-1.5 bg-border-main hover:bg-txt-muted' 
                }`}
                aria-label={`Show video ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* ================= VIDEO FRAME ================= */}
        {/* ⬇️ วิดีโอไปอยู่ฝั่งขวา (LG) ทำให้ไม่กินพื้นที่แนวตั้ง */}
        <div className="lg:col-span-7 relative group w-full max-w-3xl mx-auto mt-4 lg:mt-0">
          
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 animate-pulse transition duration-1000 -z-10"></div>

          {/* ⬇️ ลดความโค้ง (rounded) เพื่อให้ดูเหมือนจอภาพมากขึ้น */}
          <div className="relative rounded-2xl overflow-hidden bg-black border-[2px] border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] aspect-video flex items-center justify-center pointer-events-none">
            
            <iframe
              key={MY_YOUTUBE_VIDEOS[currentIndex]}
              src={`https://www.youtube.com/embed/${MY_YOUTUBE_VIDEOS[currentIndex]}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&loop=1&playlist=${MY_YOUTUBE_VIDEOS[currentIndex]}`}
              allow="autoplay; encrypted-media"
              className="absolute w-[112%] h-[112%] object-cover scale-[1.12] transition-transform duration-1000 z-0 animate-in fade-in"
            ></iframe>

            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] z-10"></div>
            
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-20 mix-blend-overlay opacity-50"></div>
          </div>
        </div>

      </div>
    </div>
  )
}