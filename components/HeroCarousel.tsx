// components/HeroCarousel.tsx
'use client'

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ข้อมูลสไลด์: ปรับรูปและคำคมให้ดู "แพง"
const SLIDES = [
  {
    id: 1,
    // 1. หัวข้อหลัก (Title)
    title: "Welcome to iHAVEGPU", 
    // 2. คำบรรยายรอง (Subtitle)
    subtitle: "Discover the best PC components and gaming gears for your ultimate setup.",
    // 3. รูปภาพ (Image URL) - แนะนำขนาด 1920x700
    image: "https://images.unsplash.com/photo-1708481480603-b47ea65c80b6?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "High Performance",
    subtitle: "Experience the power of next-gen graphics cards and processors.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2542&auto=format&fit=crop", 
    color: "bg-neutral-900"
  },
  {
    id: 3,
    title: "Unleash The Beast",
    subtitle: "Dominate every game with our extreme performance custom builds.",
    // รูปแล็ปท็อปเท่ๆ
    image: "https://images.unsplash.com/photo-1597840900616-664e930c29df?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    color: "bg-emerald-950"
  }
]

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }) // ปรับเวลาเป็น 6 วิ ให้คนอ่านทัน
  ])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="w-full px-6 mt-6 mb-12 group">
      <div className="max-w-[1400px] mx-auto relative rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
        
        {/* Carousel Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {SLIDES.map((slide) => (
              <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 min-h-[400px] md:min-h-[500px]">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear hover:scale-110" // เพิ่ม Effect ซูมช้าๆ
                  />
                  {/* Gradient Overlay: ทำให้ตัวหนังสือชัดขึ้น */}
                  <div className={`absolute inset-0 opacity-40 mix-blend-multiply ${slide.color}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>
                </div>

                {/* Content: เอาปุ่มออกแล้ว เน้นตัวหนังสือ */}
                <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-20 max-w-3xl text-white">
                  <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/20 text-neutral-200">
                    Premium Selection
                  </span>
                  
                  <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
                    {slide.title}
                  </h2>
                  
                  <p className="text-lg md:text-2xl text-neutral-300 font-light max-w-lg leading-relaxed drop-shadow-md border-l-4 border-white/30 pl-6">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons (Minimal Style) */}
        <button 
          onClick={scrollPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={scrollNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator (จุดบอกตำแหน่งสไลด์) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
           {SLIDES.map((_, index) => (
             <div key={index} className="w-2 h-2 rounded-full bg-white/30 backdrop-blur-sm"></div>
           ))}
        </div>

      </div>
    </div>
  )
}