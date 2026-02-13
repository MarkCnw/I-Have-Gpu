// app/warranty/page.tsx
import {
  ShieldCheck, Clock, RotateCcw, CheckCircle2, XCircle, FileText,
  Cpu, CircuitBoard, Gamepad2, MemoryStick, HardDrive, Zap,
  Monitor, Mouse, Keyboard, Headphones, Box, Fan, Star
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Warranty Policy | iHAVEGPU',
  description: 'เงื่อนไขการรับประกันสินค้าและการเคลมสินค้า',
}

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-24">

      {/* ================= HEADER SECTION ================= */}
      <div className="bg-surface-card border-b border-border-main">
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-16 md:pb-24 text-center">

          {/* ✅ Breadcrumb Navigation ใช้เครื่องหมาย > */}
          <div className="flex items-center gap-2 text-sm text-txt-muted mb-8 justify-center md:justify-start">
            <Link href="/" className="hover:text-foreground transition-colors">หน้าแรก</Link>
            <span className="text-txt-muted text-xs font-bold">{'>'}</span>
            <span className="text-foreground font-medium">การรับประกัน</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-bg rounded-full text-xs font-bold uppercase tracking-wider text-txt-secondary mb-6">
            <ShieldCheck size={16} /> Official Policy
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
            Warranty & Support
          </h1>
          <p className="text-lg text-txt-muted max-w-2xl mx-auto leading-relaxed">
            มาตรฐานการรับประกันที่คุณมั่นใจ สินค้าทุกชิ้นรับประกันศูนย์ไทย <br className="hidden md:block" />
            พร้อมดูแลตลอดอายุการใช้งานด้วยทีมงานมืออาชีพ
          </p>
        </div>
      </div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-20">

        {/* 1. 7-Day Guarantee Banner */}
        <section className="bg-neutral-900 text-white rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <div className="flex-shrink-0 bg-white/10 p-5 rounded-xl border border-white/10">
            <RotateCcw size={32} className="text-white" />
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-2">รับประกันเปลี่ยนสินค้าใหม่ภายใน 30 วัน (DOA)</h2>
            <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed">
              หากพบปัญหาจากการผลิตหรือความเสียหายจากการขนส่ง ยินดีเปลี่ยนตัวใหม่ทันที <br className="hidden lg:block" />
              เพียงมีคลิปวิดีโอขณะแกะกล่องเพื่อยืนยันสิทธิ์
            </p>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-block px-6 py-3 border border-white/20 rounded-lg text-sm font-medium hover:bg-white hover:text-black transition-colors cursor-default">
              30 Days Replacement
            </span>
          </div>
        </section>

        {/* 2. Warranty Coverage Grid */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-border-main pb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                ระยะเวลารับประกันสินค้า
              </h2>
              <p className="text-sm text-txt-muted mt-1">ครอบคลุมสินค้าทุกหมวดหมู่ด้วยมาตรฐานสูงสุด</p>
            </div>
            <span className="hidden md:block text-xs font-bold bg-black text-white px-3 py-1 rounded-full">
              PREMIUM CARE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WARRANTY_PERIODS.map((item, index) => (
              <div key={index} className="bg-surface-card border border-border-main p-6 rounded-xl hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-surface-bg rounded-lg text-txt-secondary group-hover:bg-foreground group-hover:text-surface-card transition-colors">
                    <item.icon size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-foreground bg-surface-bg px-3 py-1 rounded-md">
                    {item.period}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-txt-secondary">{item.category}</h3>
                <p className="text-xs text-txt-muted mt-1">Full Coverage Warranty</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Warranty Conditions (Table Layout) */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface-card p-8 rounded-2xl border border-border-main shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-700">
              <CheckCircle2 size={20} /> สิ่งที่อยู่ในเงื่อนไขการรับประกัน
            </h3>
            <ul className="space-y-4">
              {COVERED_LIST.map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-txt-secondary">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-card p-8 rounded-2xl border border-border-main shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-600">
              <XCircle size={20} /> สิ่งที่ไม่อยู่ในเงื่อนไข
            </h3>
            <ul className="space-y-4">
              {NOT_COVERED_LIST.map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-txt-secondary">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Claim Process (Step Timeline) */}
        <section>
          <h2 className="text-2xl font-bold mb-10 text-center">ขั้นตอนการส่งเคลมสินค้า</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border-main -z-10 -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: "01", title: "แจ้งปัญหา (Report)", desc: "ติดต่อเจ้าหน้าที่พร้อมแจ้งเลขคำสั่งซื้อและอาการเสีย" },
                { id: "02", title: "ส่งตรวจสอบ (Inspect)", desc: "ส่งสินค้ากลับมายังบริษัทเพื่อตรวจสอบความเสียหาย" },
                { id: "03", title: "รับสินค้าคืน (Return)", desc: "รอรับสินค้าใหม่หรือสินค้าที่ซ่อมเสร็จภายใน 1 วันเท่านั้น" }
              ].map((step, i) => (
                <div key={i} className="bg-surface-card border border-border-main p-6 rounded-xl flex flex-col items-center text-center shadow-sm">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm mb-4 ring-4 ring-white">
                    {step.id}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-sm text-txt-muted">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="text-center text-xs text-txt-muted pb-8">
          <p>© 2024 iHAVEGPU All rights reserved. เงื่อนไขเป็นไปตามที่บริษัทกำหนด</p>
        </div>

      </div>
    </div>
  )
}

// --- DATA ---
const WARRANTY_PERIODS = [
  { category: "Processors (CPU)", period: "10 Years", icon: Cpu },
  { category: "Motherboards", period: "10 Years", icon: CircuitBoard },
  { category: "Graphics Cards", period: "10 Years", icon: Gamepad2 },
  { category: "Memory (RAM)", period: "10 Years", icon: MemoryStick },
  { category: "Storage (SSD/HDD)", period: "10 Years", icon: HardDrive },
  { category: "Power Supply", period: "10 Years", icon: Zap },
  { category: "Computer Case", period: "10 Years", icon: Box },
  { category: "Cooling System", period: "10 Years", icon: Fan },
  { category: "Monitors", period: "10 Years", icon: Monitor },
  { category: "Gaming Mouse", period: "10 Years", icon: Mouse },
  { category: "Gaming Keyboard", period: "10 Years", icon: Keyboard },
  { category: "Headphones", period: "10 Years", icon: Headphones },
]

const COVERED_LIST = [
  "ความผิดปกติของฮาร์ดแวร์ที่เกิดจากการผลิต (Manufacturing Defects)",
  "อาการเปิดไม่ติด, ภาพล้ม, หรือการทำงานผิดปกติโดยไม่มีสาเหตุภายนอก",
  "พัดลมระบายความร้อนไม่ทำงาน หรือมีเสียงดังผิดปกติ",
  "ปัญหาความร้อนสะสมผิดปกติ (Overheating) จากการประกอบ"
]

const NOT_COVERED_LIST = [
  "ความเสียหายทางกายภาพ (Physical Damage) เช่น แตก, หัก, บิ่น, งอ",
  "ความเสียหายจากของเหลว, สนิม, คราบออกไซด์ (Liquid Damage)",
  "รอยไหม้ หรือความเสียหายจากระบบไฟฟ้าลัดวงจร (Burnt Marks)",
  "การดัดแปลงสภาพ, แกะ, หรือซ่อมแซมโดยไม่ได้รับอนุญาต"
]