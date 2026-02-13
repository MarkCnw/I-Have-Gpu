// app/about/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import {
  Award, ShieldCheck, Users, TrendingUp, Cpu, Globe,
  Wrench, Zap, HeartHandshake, CheckCircle2, ArrowRight
} from 'lucide-react'

export const metadata = {
  title: 'About Us | iHAVEGPU',
  description: 'ผู้นำด้านการจัดสเปคคอมพิวเตอร์ระดับ High-End ของประเทศไทย',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-24 selection:bg-yellow-500 selection:text-white">

      {/* ================= HERO SECTION ================= */}
      <div className="relative bg-surface-card border-b border-border-main overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-neutral-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 pt-8 pb-24 md:pb-32 relative z-10">

          {/* ✅ แก้ไข: วางไว้ซ้ายบนสุด และใช้สี neutral-500 ให้เป็นมาตรฐานเดียวกัน */}
          <div className="flex items-center gap-2 text-sm text-txt-muted mb-12 justify-start">
            <Link href="/" className="hover:text-foreground transition-colors">หน้าแรก</Link>
            <span className="text-txt-muted text-xs font-bold">{'>'}</span>
            <span className="text-foreground font-medium">เกี่ยวกับเรา</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-8 shadow-lg shadow-neutral-200">
              <Award size={14} className="text-yellow-500" /> Since 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-foreground leading-[1.1]">
              Crafting Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900">
                Ultimate Machine
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-txt-muted max-w-3xl mx-auto leading-relaxed font-light mb-12">
              iHAVEGPU ไม่ใช่แค่ร้านขายอุปกรณ์คอมพิวเตอร์ แต่เราคือ "Artisan" <br className="hidden md:block" />
              ผู้สร้างสรรค์งานศิลปะในรูปแบบของ High-End PC เพื่อเกมเมอร์และโปรเฟสชั่นแนล
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-border-light pt-12">
              {[
                { label: "Custom Builds", value: "5,000+" },
                { label: "Happy Clients", value: "98%" },
                { label: "Warranty Years", value: "10 Years" },
                { label: "Support", value: "24/7" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-txt-muted uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= OUR STORY ================= */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop"
                alt="Our Workshop"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-neutral-100 rounded-full -z-10"></div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              From Passion to Profession: <br />
              <span className="text-txt-muted">The iHAVEGPU Story</span>
            </h2>
            <div className="space-y-6 text-txt-secondary text-lg font-light leading-relaxed">
              <p>
                จุดเริ่มต้นของเราเกิดจากความหลงใหลในเทคโนโลยีและการประกอบคอมพิวเตอร์ เราเชื่อว่าคอมพิวเตอร์หนึ่งเครื่อง
                ไม่ใช่แค่การนำชิ้นส่วนมาประกอบเข้าด้วยกัน แต่คือการผสาน "ประสิทธิภาพ" เข้ากับ "สุนทรียภาพ"
              </p>
              <p>
                ตลอดระยะเวลาที่ผ่านมา เรามุ่งมั่นพัฒนามาตรฐานการประกอบ (Cable Management), การเลือกใช้อุปกรณ์ (Part Selection),
                และการทดสอบระบบ (System Stress Test) เพื่อให้มั่นใจว่าลูกค้าจะได้รับเครื่องที่ดีที่สุด
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= OUR PROCESS ================= */}
      <div className="bg-surface-bg py-24 mt-24 border-y border-border-main">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The iHAVEGPU Standard</h2>
            <p className="text-txt-muted max-w-2xl mx-auto">มาตรฐานการทำงานระดับมืออาชีพที่เรายึดถือในทุกขั้นตอน</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "1. Consultation", desc: "วิเคราะห์ความต้องการและงบประมาณ เพื่อจัดสเปคที่คุ้มค่าที่สุด" },
              { icon: Wrench, title: "2. Precision Build", desc: "ประกอบด้วยความประณีต เก็บสายไฟเนียนกริบทุกจุด (Cable Management)" },
              { icon: Zap, title: "3. Stress Test", desc: "ทดสอบระบบเต็มรูปแบบ 24 ชม. เพื่อความเสถียรก่อนส่งมอบ" },
              { icon: CheckCircle2, title: "4. Premium Care", desc: "บริการหลังการขาย และการรับประกันแบบ On-site Service" },
            ].map((step, i) => (
              <div key={i} className="bg-surface-card p-8 rounded-xl border border-border-main shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-neutral-900/20">
                  <step.icon size={24} />
                </div>
                <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-sm text-txt-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= WHY CHOOSE US ================= */}
      <div className="max-w-7xl mx-auto px-6 mt-24 mb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
            <p className="text-txt-muted leading-relaxed mb-8">
              เราไม่ได้ขายแค่สินค้า แต่เราขายความมั่นใจ ประสบการณ์ และความเป็นมืออาชีพ
              นี่คือเหตุผลที่ลูกค้ากว่า 98% กลับมาใช้บริการเราซ้ำ
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
              Contact Our Experts <ArrowRight size={16} />
            </Link>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {[
              { title: "Authentic 100%", desc: "สินค้าทุกชิ้นเป็นของแท้ มือ 1 รับประกันศูนย์ไทย ไม่มีการย้อมแมว" },
              { title: "Expert Advice", desc: "ให้คำแนะนำโดยผู้เชี่ยวชาญตัวจริง ไม่เชียร์ขายของเกินความจำเป็น" },
              { title: "Fast Shipping", desc: "จัดส่งรวดเร็วด้วยขนส่งเอกชน พร้อมประกันสินค้าเสียหายเต็มวงเงิน" },
              { title: "Lifetime Support", desc: "ปรึกษาปัญหาทางเทคนิคได้ตลอดอายุการใช้งาน ฟรีไม่มีค่าใช้จ่าย" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-txt-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}