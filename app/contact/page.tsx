// app/contact/page.tsx
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle, Send } from 'lucide-react'
import Link from 'next/link' // ✅ เพิ่มการ import Link สำหรับ Breadcrumb

export const metadata = {
  title: 'Contact Us | iHAVEGPU',
  description: 'ช่องทางการติดต่อและแผนที่ร้าน iHAVEGPU',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-neutral-900 pb-24">
      
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-16 md:pb-20 text-center">
            
          {/* ✅ เพิ่มส่วน Breadcrumb Navigation ตรงนี้ */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8 justify-center md:justify-start">
            <Link href="/" className="hover:text-black transition-colors">หน้าแรก</Link>
            <span className="text-neutral-300 text-xs font-bold">{'>'}</span>
            <span className="text-neutral-900 font-medium">ติดต่อเรา</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-600 mb-6">
            <MessageCircle size={16} /> Get in Touch
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-neutral-900">
            Contact Us
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            ทีมงาน iHAVEGPU พร้อมให้คำปรึกษาและบริการคุณด้วยความเป็นมืออาชีพ <br className="hidden md:block" />
            ติดต่อเราได้ทุกช่องทางที่คุณสะดวก
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid lg:grid-cols-3 gap-12">

        {/* LEFT: Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          {/* Card 1: Main Info */}
          <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold border-b border-neutral-100 pb-4">Head Office</h3>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-neutral-50 rounded-lg text-yellow-600">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Location</h4>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                  123 Tech Tower, 15th Floor, <br />
                  Sukhumvit Road, Bangkok 10110
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-neutral-50 rounded-lg text-yellow-600">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Phone</h4>
                <p className="text-sm text-neutral-500 mt-1">02-123-4567 (Office)</p>
                <p className="text-sm text-neutral-500">089-999-9999 (Hotline)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-neutral-50 rounded-lg text-yellow-600">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Email</h4>
                <p className="text-sm text-neutral-500 mt-1">support@ihavegpu.com</p>
                <p className="text-sm text-neutral-500">sales@ihavegpu.com</p>
              </div>
            </div>
          </div>

          {/* Card 2: Business Hours */}
          <div className="bg-neutral-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="flex items-center gap-3 mb-6">
                <Clock className="text-yellow-500" size={24} />
                <h3 className="text-lg font-bold">Business Hours</h3>
             </div>
             <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-bold text-white">09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-bold text-white">10:00 - 17:00</span>
                </li>
                <li className="flex justify-between text-neutral-500">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
             </ul>
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 md:p-10 rounded-xl border border-neutral-200 shadow-sm h-full">
            <h3 className="text-2xl font-bold mb-2">Send us a Message</h3>
            <p className="text-neutral-500 mb-8 text-sm">เราจะตอบกลับภายใน 24 ชั่วโมงทำการ</p>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-all bg-neutral-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Phone Number</label>
                  <input type="tel" placeholder="08x-xxx-xxxx" className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-all bg-neutral-50/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-all bg-neutral-50/50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-all bg-neutral-50/50">
                  <option>สอบถามข้อมูลสินค้า (Product Inquiry)</option>
                  <option>แจ้งปัญหาการใช้งาน (Technical Support)</option>
                  <option>ติดตามสถานะคำสั่งซื้อ (Order Status)</option>
                  <option>เคลมสินค้า (Warranty Claim)</option>
                  <option>อื่นๆ (Others)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Message</label>
                <textarea rows={5} placeholder="รายละเอียดเพิ่มเติม..." className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-all bg-neutral-50/50 resize-none"></textarea>
              </div>

              <button type="button" className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}