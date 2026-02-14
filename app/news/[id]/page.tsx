// app/news/[id]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Link as LinkIcon, Bookmark } from 'lucide-react'
import { notFound } from 'next/navigation'
import { NEWS_DATA } from '@/lib/news-data' // ✅ Import ข้อมูลข่าว
import NewsProgressBar from '@/components/NewsProgressBar'

// ✅ ใช้ Server Component เป็นหลัก
export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const newsId = Number(id)
  const news = NEWS_DATA.find(n => n.id === newsId)

  // กรองข่าวที่เกี่ยวข้อง (ไม่รวมข่าวปัจจุบัน)
  const relatedNews = NEWS_DATA.filter(n => n.id !== newsId).slice(0, 3)

  if (!news) return notFound()

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-red-100 selection:text-red-600">

      {/* ✅ Client Component สำหรับ Progress Bar */}
      <NewsProgressBar />

      {/* 🧭 Glassmorphism Header */}
      <nav className="sticky top-0 z-50 bg-surface-card/80 backdrop-blur-xl border-b border-border-light/50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-txt-muted hover:text-foreground transition-all group">
            <div className="p-1.5 rounded-full hover:bg-surface-bg transition-colors">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="hidden sm:inline">Back to News</span>
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-txt-muted hover:text-foreground hover:bg-surface-bg rounded-full transition-all">
              <Bookmark size={20} />
            </button>
            <button className="p-2.5 text-txt-muted hover:text-foreground hover:bg-surface-bg rounded-full transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-12 pb-32">
        <div className="grid lg:grid-cols-[1fr_350px] gap-16">

          {/* ✍️ Main Article Area */}
          <article>
            {/* News Header */}
            <header className="mb-12 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-sm uppercase tracking-[0.2em]">
                  {news.category}
                </span>
                <div className="h-px flex-1 bg-border-light" />
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight italic">
                {news.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 py-8 border-y border-border-light">
                <div className="flex items-center gap-3">
                  {/* ⚠️ ใช้ <img> ธรรมดาเพื่อเลี่ยงปัญหา config */}
                  <div className="w-12 h-12 bg-surface-bg rounded-full overflow-hidden border-2 border-surface-card shadow-sm ring-1 ring-border-light">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(news.author)}&background=random`}
                      alt="author"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-txt-muted font-bold leading-none mb-1">Written by</p>
                    <p className="text-sm font-black text-foreground leading-none">{news.author}</p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] uppercase tracking-widest text-txt-muted font-bold leading-none mb-2">Published</p>
                    <p className="text-sm font-bold text-txt-secondary">{news.date}</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] uppercase tracking-widest text-txt-muted font-bold leading-none mb-2">Read Time</p>
                    <p className="text-sm font-bold text-txt-secondary flex items-center gap-1.5">
                      <Clock size={14} className="text-red-500" /> 5 Min
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Hero Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 shadow-2xl group bg-surface-bg">
              <Image
                src={news.img}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                priority
              />
            </div>

            {/* Content Body */}
            <div
              className="prose prose-slate dark:prose-invert prose-xl max-w-none 
                prose-headings:text-foreground prose-headings:font-black prose-headings:italic
                prose-p:text-txt-secondary prose-p:leading-[1.8] prose-p:text-lg
                prose-strong:text-foreground prose-strong:font-bold
                prose-ul:my-8 prose-li:text-txt-secondary prose-li:mb-2
                prose-h3:text-3xl prose-h3:mt-16 prose-h3:mb-6
                prose-blockquote:border-l-red-600 prose-blockquote:bg-surface-bg prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl"
              dangerouslySetInnerHTML={{ __html: news.fullContent || news.desc }}
            />

            {/* Tags & Bottom Action */}
            <div className="mt-20 p-8  rounded-3xl text-foreground flex flex-col md:flex-row items-center justify-between gap-8">


            </div>
          </article>

          {/* 🏛️ Sidebar Area (ข่าวอื่นๆ) */}
          <aside className="space-y-12">
            <div className="sticky top-28">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-txt-muted">Related Articles</h2>
              </div>

              <div className="space-y-10">
                {relatedNews.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group block space-y-4">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-surface-bg shadow-sm border border-border-light">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{item.category}</span>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-red-600 transition-colors leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-txt-muted font-bold">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Newsletter Box */}

            </div>
          </aside>

        </div>
      </main>

      {/* Footer Nav */}
      <footer className="py-12 border-t border-border-light bg-surface-bg/50">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-txt-muted text-xs font-bold">© 2025 iHAVEGPU Technology News. All rights reserved.</p>
          <div className="flex gap-8 text-xs font-bold text-txt-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
            <Link href="/pc-builder" className="hover:text-foreground transition-colors">PC Builder</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}