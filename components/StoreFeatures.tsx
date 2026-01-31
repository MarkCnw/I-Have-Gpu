// components/StoreFeatures.tsx
'use client'
import { ShieldCheck, Truck, Wrench, Headphones } from 'lucide-react'

const FEATURES = [
  {
    icon: <ShieldCheck size={32} className="text-black" />,
    title: "Official Warranty",
    desc: "สินค้าแท้ 100% รับประกันศูนย์ไทยทุกชิ้น"
  },
  {
    icon: <Truck size={32} className="text-black" />,
    title: "Fast Delivery",
    desc: "จัดส่งฟรีทั่วประเทศ ถึงมือภายใน 1-2 วัน"
  },
  {
    icon: <Wrench size={32} className="text-black" />,
    title: "Expert Assembly",
    desc: "บริการประกอบคอมฯ โดยช่างมืออาชีพ"
  },
  {
    icon: <Headphones size={32} className="text-black" />,
    title: "24/7 Support",
    desc: "ให้คำปรึกษาจัดสเปคฟรี ตลอด 24 ชม."
  }
]

export default function StoreFeatures() {
  return (
    <div className="w-full px-6 mb-16">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-50 border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-neutral-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}