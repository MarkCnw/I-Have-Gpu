// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // แปลงไฟล์เป็น Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // สร้างชื่อไฟล์ใหม่ (ป้องกันชื่อซ้ำ)
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const fileName = `${timestamp}-${safeName}`

    // (สำหรับ Localhost) บันทึกลง public/uploads
    // ⚠️ ถ้าขึ้น Production ให้เปลี่ยนส่วนนี้ไปใช้ Supabase/S3 SDK แทน
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    
    // สร้างโฟลเดอร์ถ้ายังไม่มี
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // folder exists, ignore
    }

    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // ส่ง URL กลับไปให้ Frontend
    const fileUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ success: true, url: fileUrl })

  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}