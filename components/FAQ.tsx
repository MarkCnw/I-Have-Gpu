// components/FAQ.tsx
'use client'
import { useState } from 'react'
import { 
  ChevronDown, HelpCircle, ShieldCheck, 
  Truck, Wrench, CreditCard, MessageCircle, 
  Search, Sparkles 
} from 'lucide-react'

const FAQ_DATA = [
  {
    question: "สินค้าที่สั่งจาก iHAVEGPU เป็นของแท้และมีประกันไหม?",
    answer: "สินค้าทุกชิ้นเป็นของแท้ 100% มือหนึ่งแกะกล่อง และมีการรับประกันศูนย์ไทยตั้งแต่ 1-3 ปี (ขึ้นอยู่กับประเภทสินค้า) หากมีปัญหาภายใน 7 วันแรก ทางเรามีบริการเปลี่ยนตัวใหม่ให้ทันทีครับ",
    icon: <ShieldCheck size={20} className="text-emerald-500" />
  },
  {
    question: "มีบริการประกอบคอมพิวเตอร์และจัดสายไฟให้ด้วยไหม?",
    answer: "เรามีบริการประกอบคอมพิวเตอร์โดยช่างมืออาชีพฟรี! พร้อมระบบการจัดสายไฟที่เน้นความสวยงามและการระบายอากาศที่ดีที่สุด (Cable Management) ก่อนส่งมอบเรามีการทดสอบ Stress Test ทุกเครื่องครับ",
    icon: <Wrench size={20} className="text-blue-500" />
  },
  {
    question: "ใช้เวลานานแค่ไหนในการจัดส่งสินค้า?",
    answer: "สำหรับการสั่งซื้ออุปกรณ์แยกชิ้น จะใช้เวลา 1-2 วันทำการ หากเป็นเครื่องประกอบเสร็จ จะใช้เวลา 2-3 วันทำการ (รวมเวลาประกอบและทดสอบระบบ) เราจัดส่งฟรีทั่วประเทศโดยขนส่งเอกชนชั้นนำครับ",
    icon: <Truck size={20} className="text-orange-500" />
  },
  {
    question: "มีระบบผ่อนชำระผ่านบัตรเครดิตไหม?",
    answer: "มีครับ เรายินดีรับชำระผ่านบัตรเครดิตและมีโปรโมชั่นผ่อน 0% นานสูงสุด 10 เดือน กับธนาคารชั้นนำที่ร่วมรายการ รวมถึงรองรับการชำระผ่านทาง QR Code และการโอนเงินผ่านธนาคาร",
    icon: <CreditCard size={20} className="text-purple-500" />
  },
  {
    question: "จะเลือก Power Supply (PSU) อย่างไรให้เพียงพอต่อสเปค?",
    answer: "หลักการง่ายๆ คือการนำวัตต์ของ CPU และ GPU มารวมกันแล้วบวกเผื่อไว้อีกประมาณ 150-200W หรือใช้ระบบจัดสเปคหน้าเว็บของเราที่จะคำนวณวัตต์ที่แนะนำให้โดยอัตโนมัติครับ",
    icon: <Sparkles size={20} className="text-yellow-500" />
  },
  {
    question: "ปัญหา 'คอขวด' (Bottleneck) คืออะไร?",
    answer: "คือสภาวะที่อุปกรณ์ชิ้นหนึ่งแรงเกินไปจนอีกชิ้นทำงานตามไม่ทัน เช่น ใช้การ์ดจอตัวท็อปแต่ใช้ CPU รุ่นต่ำเกินไป ทำให้การ์ดจอทำงานได้ไม่เต็มประสิทธิภาพ แนะนำให้เลือกสเปคที่สมดุลกันครับ",
    icon: <HelpCircle size={20} className="text-red-500" />
  },
  {
    question: "iHAVEGPU มีหน้าร้านอยู่ที่ไหนบ้าง?",
    answer: "ปัจจุบันเรามีสำนักงานใหญ่และสาขาครอบคลุมหลายพื้นที่ เช่น กรุงเทพฯ (รามอินทรา), ปทุมธานี และนครนายก ลูกค้าสามารถเลือกมารับสินค้าเองที่สาขาหรือเข้ามาปรึกษาการจัดสเปคได้โดยตรงครับ",
    icon: <ShieldCheck size={20} className="text-indigo-500" />
  },
  {
    question: "ทางร้านรับติดตั้ง Windows และโปรแกรมต่างๆ ไหม?",
    answer: "เรามีบริการติดตั้ง Windows 11 Home/Pro (ลิขสิทธิ์แท้) และลง Driver พื้นฐานให้พร้อมใช้งานทันทีเมื่อเครื่องถึงมือลูกค้า ส่วนโปรแกรมลิขสิทธิ์อื่นๆ สามารถปรึกษาทีมงานเพิ่มเติมได้ครับ",
    icon: <Wrench size={20} className="text-sky-500" />
  },
  {
    question: "ถ้าต้องการเปลี่ยนสเปคหลังจากสั่งซื้อไปแล้วทำได้ไหม?",
    answer: "หากออเดอร์ยังไม่อยู่ในขั้นตอนการประกอบ ลูกค้าสามารถติดต่อแอดมินเพื่อแจ้งเปลี่ยนอุปกรณ์ได้ครับ แต่หากประกอบเสร็จแล้วอาจมีค่าธรรมเนียมในการรื้อถอนและแก้ไขเล็กน้อย",
    icon: <HelpCircle size={20} className="text-neutral-500" />
  },
  {
    question: "ติดต่อฝ่ายเทคนิคหลังการขายได้ช่องทางไหน?",
    answer: "ลูกค้าสามารถติดต่อทีม Support ได้ผ่านทาง Line OA: @ihavegpu หรือโทรติดต่อ Call Center ของสาขาที่สั่งซื้อได้ตลอดเวลาทำการ เรายินดีดูแลจนกว่าปัญหาจะแก้ไขได้ครับ",
    icon: <MessageCircle size={20} className="text-pink-500" />
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="mt-32 pt-24 border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* ✅ Left Side: Static Header Section */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              <HelpCircle size={14} /> Help Center
            </div>
            <h2 className="text-5xl font-black text-black leading-[1.1] mb-6 tracking-tighter">
              คำถามที่พบบ่อย<br />
              <span className="text-neutral-300">& เกร็ดความรู้</span>
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-10 max-w-sm">
              ทุกข้อสงสัยเกี่ยวกับสินค้า การจัดส่ง และการประกอบคอมพิวเตอร์ เราเตรียมคำตอบไว้ให้คุณแล้วที่นี่
            </p>
            
            <div className="p-8 rounded-[2rem] bg-neutral-950 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="font-bold mb-2">ไม่พบคำตอบที่ต้องการ?</h4>
                  <p className="text-xs text-neutral-400 mb-6">ทีมแอดมินของเราพร้อมดูแลคุณผ่านช่องทาง Line และ Messenger ตลอดเวลาทำการ</p>
                  <button className="px-6 py-3 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors">
                    ติดต่อเจ้าหน้าที่
                  </button>
               </div>
               {/* Decorative Circle */}
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
            </div>
          </div>

          {/* ✅ Right Side: Accordion Section */}
          <div className="lg:w-2/3 space-y-4">
            {FAQ_DATA.map((item, idx) => (
              <div 
                key={idx} 
                className={`group rounded-[2.5rem] transition-all duration-500 border ${
                  openIndex === idx 
                    ? 'bg-white border-neutral-200 shadow-2xl shadow-neutral-200/50 scale-[1.02]' 
                    : 'bg-transparent border-transparent hover:bg-neutral-50'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-8 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      openIndex === idx ? 'bg-black text-white rotate-12' : 'bg-white shadow-sm text-neutral-400'
                    }`}>
                      {item.icon}
                    </div>
                    <span className={`text-lg font-bold transition-colors duration-500 ${
                      openIndex === idx ? 'text-black' : 'text-neutral-600 group-hover:text-black'
                    }`}>
                      {item.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    openIndex === idx ? 'bg-black border-black text-white rotate-180' : 'bg-transparent border-neutral-200 text-neutral-300'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-8 pb-8 ml-[72px]">
                    <div className="h-[2px] w-12 bg-neutral-100 mb-6 rounded-full" />
                    <p className="text-neutral-500 leading-relaxed text-base max-w-2xl">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}