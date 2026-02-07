// app/admin/chat/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Send, Loader2 } from 'lucide-react'

export default function AdminChatPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rooms, setRooms] = useState<any[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/chat/rooms')
      const data = await res.json()
      if (Array.isArray(data)) setRooms(data)
    } catch (error) {
      console.error("Failed to fetch rooms")
    }
  }

  // Fetch Messages
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

  // Scroll bottom
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
    <div className="h-[calc(100vh-100px)] bg-white rounded-xl border border-slate-200 shadow-sm flex overflow-hidden">
      
      {/* Sidebar: รายชื่อลูกค้า */}
      <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 font-bold text-lg flex items-center gap-2">
           <User className="text-slate-500" /> แชทลูกค้า ({rooms.length})
        </div>
        <div className="overflow-y-auto flex-1">
          {rooms.map(room => (
            <div 
              key={room.id} 
              onClick={() => setSelectedRoomId(room.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition ${selectedRoomId === room.id ? 'bg-white border-l-4 border-l-black shadow-sm' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm truncate">{room.user.name || room.user.email}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(room.updatedAt).toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {room.messages[0]?.message || '...'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main: ห้องแชท */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedRoomId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedRoom?.user.image ? <img src={selectedRoom.user.image} className="w-full h-full object-cover" /> : <User size={20} />}
               </div>
               <div>
                 <h2 className="font-bold">{selectedRoom?.user.name}</h2>
                 <p className="text-xs text-slate-400">{selectedRoom?.user.email}</p>
               </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               {messages.map((msg: any) => {
                 const isAdmin = msg.senderRole === 'ADMIN'
                 return (
                   <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${isAdmin ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                        {msg.message}
                      </div>
                      {/* ✅ เพิ่ม Timestamp */}
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
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

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t flex gap-3">
               <input 
                 className="flex-1 bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-black"
                 placeholder="พิมพ์ข้อความตอบกลับ..."
                 value={input}
                 onChange={e => setInput(e.target.value)}
               />
               <button type="submit" disabled={sending} className="bg-black text-white px-6 rounded-lg font-bold hover:bg-neutral-800 transition disabled:opacity-50">
                 {sending ? <Loader2 className="animate-spin" /> : <Send size={18} />}
               </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
             <User size={64} className="mb-4 opacity-50" />
             <p>เลือกรายการแชททางซ้ายมือ</p>
          </div>
        )}
      </div>
    </div>
  )
}