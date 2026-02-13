// components/CustomerChat.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function CustomerChat() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch messages (Polling)
  useEffect(() => {
    if (!isOpen || !session) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAdmin = (session.user as any)?.role === 'ADMIN'
    if (isAdmin) return

    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/chat/messages', { cache: 'no-store' })
        if (!res.ok) throw new Error('Fetch error')

        const data = await res.json()
        if (Array.isArray(data)) setMessages(data)
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [isOpen, session])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isOpen])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setSending(true)
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      if (!res.ok) throw new Error('Send failed')

      setInput('')

      // Fetch immediately
      const fetchRes = await fetch('/api/chat/messages', { cache: 'no-store' })
      const data = await fetchRes.json()
      if (Array.isArray(data)) setMessages(data)

    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  // Hide chat for Admin or Non-logged in users
  if (!session) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any)?.role === 'ADMIN') return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-surface-card w-[350px] h-[450px] rounded-2xl shadow-2xl flex flex-col border border-border-main overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold">ฝ่ายบริการลูกค้า</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-surface-bg space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-txt-muted text-sm mt-10">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>สอบถามเพิ่มเติมได้เลยครับ</p>
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              messages.map((msg: any) => {
                const isMe = msg.senderRole === 'USER'
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-surface-card border border-border-main text-foreground rounded-tl-none'}`}>
                      {msg.message}
                    </div>
                    {/* ✅ เพิ่ม Timestamp */}
                    <span className="text-[10px] text-txt-muted mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-surface-card border-t border-border-main flex gap-2">
            <input
              className="flex-1 bg-surface-bg rounded-full px-4 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-foreground"
              placeholder="พิมพ์ข้อความ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={sending} className="bg-black text-white p-2 rounded-full hover:bg-neutral-800 disabled:opacity-50">
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2"
        >
          <MessageCircle size={24} />
          <span className="font-bold text-sm hidden md:block">ติดต่อเรา</span>
        </button>
      )}
    </div>
  )
}