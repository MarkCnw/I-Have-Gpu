// components/Footer.tsx
import Link from 'next/link'
import Image from 'next/image' // Import Image component
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-800 font-sans">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand Info */}
          <div>
            <Link href="/" className="inline-block mb-6">
               {/* ✅ ใช้ Image component แทนข้อความ */}
               <Image 
                 src="/logo.svg" 
                 alt="iHAVEGPU Logo" 
                 width={160} 
                 height={40} 
                 className="h-10 w-auto object-contain brightness-0 invert" // brightness-0 invert เพื่อเปลี่ยนสี logo เป็นสีขาว (ถ้า svg เดิมเป็นสีดำ)
               />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              ร้านอุปกรณ์คอมพิวเตอร์ระดับ Hi-End สำหรับ Gamers และ Creators 
              เราคัดสรรเฉพาะสินค้าคุณภาพ ของแท้ 100% พร้อมบริการหลังการขายที่คุณวางใจได้
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Facebook size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Twitter size={18} /></Link>
            </div>
          </div>

          {/* 2. Shop Categories */}
          <div>
            <h3 className="text-white font-bold mb-6">Shop</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/?category=GPU" className="hover:text-white transition">Graphics Cards</Link></li>
              <li><Link href="/?category=CPU" className="hover:text-white transition">Processors</Link></li>
              <li><Link href="/?category=MOTHERBOARD" className="hover:text-white transition">Motherboards</Link></li>
              <li><Link href="/?category=CASE" className="hover:text-white transition">Cases & Cooling</Link></li>
              <li><Link href="/?category=LAPTOP" className="hover:text-white transition">Gaming Laptops</Link></li>
            </ul>
          </div>

          {/* 3. Customer Support */}
          <div>
            <h3 className="text-white font-bold mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/orders" className="hover:text-white transition">Order Status</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition">Warranty & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Shipping Info</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>123 Cyber Tower, Ratchada,<br/>Bangkok 10400, Thailand</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>02-999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@ihavegpu.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 iHAVEGPU Store. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}