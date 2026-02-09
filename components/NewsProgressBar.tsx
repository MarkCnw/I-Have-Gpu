'use client'

import { useEffect, useState } from 'react'

export default function NewsProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = (totalScroll / windowHeight) * 100
      setScrollProgress(scroll)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-red-600 z-[60] transition-all duration-150 ease-out" 
      style={{ width: `${scrollProgress}%` }}
    />
  )
}