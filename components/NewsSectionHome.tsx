// components/NewsSectionHome.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { NEWS_DATA } from '@/lib/news-data'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function NewsSectionHome() {
    const { locale } = useLanguageStore()

    return (
        <>
            <h2 className="text-2xl font-bold mb-10 flex items-center gap-2 text-foreground">
                <span className="w-1 h-8 bg-foreground rounded-full"></span> {t('home.newsTitle', locale)}
            </h2>
            <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer border border-border-main">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/h15-0I2JxOo"
                            title="YouTube video"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{t('home.featuredVideoTitle', locale)}</h3>
                    <p className="text-txt-secondary text-sm">{t('home.featuredVideoDesc', locale)}</p>
                </div>

                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {NEWS_DATA.map((post) => (
                        <Link
                            key={post.id}
                            href={`/news/${post.id}`}
                            className="flex gap-5 group cursor-pointer p-2 rounded-2xl hover:bg-surface-card-hover transition"
                        >
                            <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-border-light">
                                <Image
                                    src={post.img}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition duration-500"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-bold text-foreground line-clamp-1 group-hover:text-red-500 transition-colors">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-txt-secondary mt-1 line-clamp-2">
                                    {post.desc}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-txt-muted mt-2 uppercase tracking-widest">
                                    {t('home.readMore', locale)} <ArrowUpRight size={12} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}
