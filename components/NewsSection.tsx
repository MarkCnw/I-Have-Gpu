'use client'

import { PlayCircle } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const videos = [
  {
    id: "eI5d2Wlq0Y0",
    title: { th: "จัดสเปคคอมงบ 20,000 เล่นได้ทุกเกม?", en: "Budget 20K Build: Can It Run Every Game?", jp: "予算2万バーツPC：全ゲーム対応？" },
    duration: "10:24"
  },
  {
    id: "Qd5s5-Gg3aE",
    title: { th: "รีวิวเคสคอมพิวเตอร์ ดีไซน์ล้ำ ระบายความร้อนเทพ", en: "PC Case Review: Futuristic Design & Extreme Cooling", jp: "PCケースレビュー：先進デザイン＆極冷却" },
    duration: "08:15"
  },
  {
    id: "dQw4w9WgXcQ",
    title: { th: "พาชมบรรยากาศหน้าร้าน iHAVEGPU สาขาใหม่", en: "iHAVEGPU New Branch Store Tour", jp: "iHAVEGPU新店舗ツアー" },
    duration: "12:40"
  }
]

export default function NewsSection() {
  const { locale } = useLanguageStore()

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-1 h-8 bg-foreground rounded-full"></span> {t('newsSection.title', locale)}
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Featured Video */}
        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-border-light relative group cursor-pointer">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{t('newsSection.featuredTitle', locale)}</h3>
            <p className="text-txt-muted text-sm mt-2">
              {t('newsSection.featuredDesc', locale)}
            </p>
          </div>
        </div>

        {/* Right: More Videos List */}
        <div className="flex flex-col justify-start">
          <div className="bg-surface-bg p-6 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <PlayCircle size={20} className="text-red-600" /> {t('newsSection.moreVideos', locale)}
            </h4>
            <div className="space-y-3">
              {videos.map((v, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between p-3 bg-surface-card rounded-xl border border-transparent hover:border-red-100 hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <PlayCircle size={16} />
                    </div>
                    <span className="text-sm font-medium text-txt-secondary group-hover:text-red-600 transition-colors line-clamp-1">
                      {v.title[locale]}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-txt-muted bg-surface-bg px-2 py-1 rounded">
                    {v.duration}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-surface-card border border-border-main text-txt-secondary rounded-xl text-sm font-bold hover:bg-surface-card-hover transition-colors">
              {t('newsSection.viewAll', locale)}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}