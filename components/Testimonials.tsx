// components/Testimonials.tsx
'use client'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const TESTIMONIALS = [
  {
    name: "Donald Trump",
    role: "Former President & Businessman",
    image: "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RG9uYWxkJTIwVHJ1bXB8ZW58MHx8MHx8fDA%3D",
    quote: {
      th: "ผมรู้จักคอมพิวเตอร์ดี ผมมีคอมพิวเตอร์ที่ดีที่สุด แล้วการ์ดจอพวกนี้ล่ะ? มันสุดยอดมาก iHAVEGPU กำลังทำให้การเล่นเกมกลับมายิ่งใหญ่อีกครั้ง เฟรมเรตมหาศาล แข็งแกร่งสุดๆ!",
      en: "I know computers. I have the best computers. And these GPUs? Tremendous. iHAVEGPU is making gaming great again. Huge framerates. Very strong!",
      jp: "私はコンピューターに詳しい。最高のコンピューターを持っている。そしてこのGPU？素晴らしい。iHAVEGPUはゲーミングを再び偉大にしている。驚異のフレームレート！"
    }
  },
  {
    name: "Mark Zuckerberg",
    role: "Meta CEO & Human?",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Mark_Zuckerberg_in_September_2025_%28cropped%29.jpg/376px-Mark_Zuckerberg_in_September_2025_%28cropped%29.jpg",
    quote: {
      th: "Metaverse ต้องการการ์ดจอพวกนี้ มันดีมากสำหรับการเชื่อมต่อผู้คนผ่าน FPS ที่สูง ผมเป็นมนุษย์จริงๆ นะ และผมก็ชอบคอมพิวเตอร์พวกนี้มาก",
      en: "The Metaverse needs these GPUs. They're great for connecting people through high FPS. I am definitely a human, and I really enjoy these computers.",
      jp: "メタバースにはこれらのGPUが必要です。高FPSで人々をつなぐのに最適です。私は間違いなく人間で、このコンピューターが大好きです。"
    }
  },
  {
    name: "MrBeast",
    role: "Philanthropist & Creator",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/MrBeast_2023_%28cropped%29.jpg/500px-MrBeast_2023_%28cropped%29.jpg",
    quote: {
      th: "ผมแจกคอมพิวเตอร์เล่นเกม 100 เครื่องจาก iHAVEGPU! พวกเขามีบริการที่ดีที่สุดและส่งไวที่สุด กดซับไว้เพื่อลุ้นรับเครื่องหนึ่งไปเลย!",
      en: "I gave away 100 gaming PCs from iHAVEGPU! They have the best service and fastest shipping. Subscribe now for a chance to win one!",
      jp: "iHAVEGPUのゲーミングPCを100台プレゼントしました！最高のサービスと最速配送。チャンネル登録して当選チャンスを掴もう！"
    }
  },
  {
    name: "IShowSpeed",
    role: "Legendary Streamer",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/IShowSpeed_at_Chinatown_%28Portrait%29_04.jpg/500px-IShowSpeed_at_Chinatown_%28Portrait%29_04.jpg",
    quote: {
      th: "SEWYYYYYY! iHAVEGPU มันบ้าไปแล้ว! FPS มันไวมากจนผมมองไม่ทันเลย! โฮ่ง โฮ่ง โฮ่ง! ร้านที่ดีที่สุดในโลก!",
      en: "SEWYYYYYY! iHAVEGPU is INSANE! The FPS is so fast I can't even see it! BARK BARK BARK! Best store in the world!",
      jp: "SEWYYYYYY！iHAVEGPUはヤバい！FPSが速すぎて目が追いつかない！ワンワンワン！世界最高のストア！"
    }
  },
  {
    name: "Albert Einstein",
    role: "Theoretical Physicist",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Albert_Einstein_Head_cleaned.jpg/500px-Albert_Einstein_Head_cleaned.jpg",
    quote: {
      th: "จินตนาการนั้นสำคัญ แต่คอมพิวเตอร์ที่ใช้ RTX 5090 นั้นเร็วกว่าในเชิงสัมพัทธภาพ E=mc^2 โดยที่ 'c' คือความเร็วสัญญาณนาฬิกาของเครื่องจาก iHAVEGPU",
      en: "Imagination is important, but an RTX 5090 computer is relatively faster. E=mc² where 'c' is the clock speed of an iHAVEGPU build.",
      jp: "想像力は大切ですが、RTX 5090搭載PCは相対的にもっと速い。E=mc²の'c'はiHAVEGPUマシンのクロック速度です。"
    }
  },
  {
    name: "Elon Musk",
    role: "Technoking of Tesla",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/500px-Elon_Musk_-_54820081119_%28cropped%29.jpg",
    quote: {
      th: "การจัดสเปคคอมที่นี่เร็วกว่าการปล่อยจรวด Falcon 9 เสียอีก ค่าความหน่วงเกือบจะเท่ากับระดับ Neuralink แล้ว น่าประทับใจมาก iHAVEGPU",
      en: "Building a PC here is faster than a Falcon 9 launch. Latency is nearly Neuralink-level. Very impressive, iHAVEGPU.",
      jp: "ここでのPC構築はFalcon 9のローンチより速い。レイテンシーはNeuralink並み。非常に印象的です、iHAVEGPU。"
    }
  },
  {
    name: "Gordon Ramsay",
    role: "Multi-Michelin Starred Chef",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Gordon_Ramsay_%28cropped%29.jpg/500px-Gordon_Ramsay_%28cropped%29.jpg",
    quote: {
      th: "ในที่สุด ก็เจอคอมพิวเตอร์ที่ไม่ 'ดิบ'! การจัดสายไฟนั้นประณีตมาก และประสิทธิภาพมันช่าง 'งดงาม'! นี่แหละคือการจัดสเปคระดับ 5 ดาว!",
      en: "Finally, a PC that isn't 'RAW'! The cable management is exquisite and the performance is 'BEAUTIFUL'! This is a 5-star build!",
      jp: "ついに「生焼け」じゃないPCに出会えた！ケーブルマネジメントは絶品で、パフォーマンスは「ビューティフル」！これぞ5つ星のビルドだ！"
    }
  }
]

export default function Testimonials() {
  const { locale } = useLanguageStore()

  return (
    <section className="mt-32 pt-16 border-t border-border-main overflow-hidden">
      <div className="text-center mb-16 px-6">
        <p className="text-xs font-bold text-txt-muted uppercase tracking-[0.2em] mb-3">{t('testimonials.subtitle', locale)}</p>
        <h2 className="text-4xl font-black text-foreground tracking-tight">{t('testimonials.title', locale)}</h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-60 bg-gradient-to-r from-surface-bg via-surface-bg/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-60 bg-gradient-to-l from-surface-bg via-surface-bg/80 to-transparent z-10 pointer-events-none" />

        <Marquee
          speed={45}
          pauseOnHover={true}
          direction="left"
          className="py-12"
        >
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="mx-6 w-[380px] md:w-[480px] bg-surface-card p-10 rounded-[3rem] relative group hover:bg-black transition-all duration-700 cursor-default border border-border-main hover:border-black hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] shadow-sm"
            >
              <Quote
                className="absolute top-8 right-10 text-border-light group-hover:text-neutral-800 transition-colors duration-500"
                size={56}
              />

              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-surface-card shadow-xl bg-surface-bg group-hover:border-neutral-800 transition-colors duration-500">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground group-hover:text-white transition-colors duration-500">{item.name}</p>
                  <p className="text-[10px] font-bold text-txt-muted uppercase tracking-widest group-hover:text-neutral-500 transition-colors duration-500">{item.role}</p>
                </div>
              </div>

              <p className="text-txt-secondary leading-relaxed italic text-base group-hover:text-neutral-200 transition-colors duration-500 min-h-[90px] relative z-10">
                &quot;{item.quote[locale]}&quot;
              </p>

              <div className="absolute bottom-6 right-10 w-12 h-1 bg-border-light group-hover:bg-neutral-800 transition-colors duration-500 rounded-full" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}