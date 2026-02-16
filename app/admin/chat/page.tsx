// app/admin/chat/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Send, Loader2 } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const SidebarSkeleton = () => (
  <div className="p-4 border-b border-border-main animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="h-4 w-32 bg-skeleton rounded" />
      <div className="h-3 w-10 bg-skeleton-light rounded" />
    </div>
    <div className="h-3 w-48 bg-skeleton-light rounded" />
  </div>
)

export default function AdminChatPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rooms, setRooms] = useState<any[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { locale } = useLanguageStore()

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/chat/rooms')
      const data = await res.json()
      if (Array.isArray(data)) setRooms(data)
    } catch (error) {
      console.error("Failed to fetch rooms")
    } finally {
      setIsLoadingRooms(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedRoomId) return
    try {
      const res = await fetch(`/api/chat/messages?roomId=${selectedRoomId}`)
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    } catch (error) {
      console.error("Failed to fetch messages")
    }
  }

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [selectedRoomId])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedRoomId) return

    setSending(true)
    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, roomId: selectedRoomId })
      })
      setInput('')
      fetchMessages()
    } finally {
      setSending(false)
    }
  }

  const selectedRoom = rooms.find(r => r.id === selectedRoomId)

  return (
    <div className="h-[calc(100vh-100px)] bg-surface-card rounded-xl border border-border-main shadow-sm flex overflow-hidden">

      {/* Sidebar */}
      <div className="w-1/3 border-r border-border-main bg-surface-bg flex flex-col">
        <div className="p-4 border-b border-border-main font-bold text-lg flex items-center gap-2 text-foreground">
          <User className="text-txt-muted" /> {t('admin.customerChat', locale)} ({rooms.length})
        </div>
        <div className="overflow-y-auto flex-1">
          {isLoadingRooms ? (
            [...Array(6)].map((_, i) => <SidebarSkeleton key={i} />)
          ) : (
            rooms.map(room => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`p-4 border-b border-border-main cursor-pointer hover:bg-surface-card transition ${selectedRoomId === room.id ? 'bg-surface-card border-l-4 border-l-foreground shadow-sm' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm truncate text-foreground">{room.user.name || room.user.email}</span>
                  <span className="text-[10px] text-txt-muted">
                    {new Date(room.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-txt-muted truncate">
                  {room.messages[0]?.message || '...'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-surface-card">
        {selectedRoomId ? (
          <>
            <div className="p-4 border-b border-border-main flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-bg rounded-full flex items-center justify-center overflow-hidden border border-border-main">
                {selectedRoom?.user.image ? <img src={selectedRoom.user.image} className="w-full h-full object-cover" /> : <User size={20} className="text-txt-muted" />}
              </div>
              <div>
                <h2 className="font-bold text-foreground">{selectedRoom?.user.name}</h2>
                <p className="text-xs text-txt-muted">{selectedRoom?.user.email}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-bg/30">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {messages.map((msg: any) => {
                const isAdmin = msg.senderRole === 'ADMIN'
                return (
                  <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${isAdmin ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-surface-card border border-border-main text-foreground rounded-tl-none'}`}>
                      {msg.message}
                    </div>
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
              })}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-border-main flex gap-3">
              <input
                className="flex-1 bg-surface-bg rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-foreground text-foreground placeholder:text-txt-muted border border-border-main"
                placeholder={t('admin.typeReply', locale)}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" disabled={sending} className="bg-foreground text-surface-card px-6 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50">
                {sending ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-txt-muted">
            <User size={64} className="mb-4 opacity-50" />
            <p>{t('admin.selectChat', locale)}</p>
          </div>
        )}
      </div>
    </div>
  )
} 