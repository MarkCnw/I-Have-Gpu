// app/api/ai/builder/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const products = await prisma.product.findMany({
      where: { isArchived: false, stock: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      take: 50, 
      select: { id: true, name: true, price: true, category: true, specs: true }
    })

    
    const miniProducts = products.map((p: any) => {
      const s = p.specs || {}
      const specStr = [s.socket, s.memory_type, s.wattage].filter(Boolean).join(' ')
      return { id: p.id, n: p.name, p: p.price, c: p.category, s: specStr }
    })

    
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })
    
   
    const prompt = `
      Role: PC Spec Expert.
      Inventory (n=name, p=price, c=category, s=specs):
      ${JSON.stringify(miniProducts)}

      User Request: "${message}"

      Rules:
      1. Pick compatible items.
      2. If vague, build full set.
      3. Response JSON ONLY: {"reason": "อธิบายภาษาไทย", "selectedIds": ["id1"]}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const cleanJson = text.replace(/```json|```/g, '').trim()
    
    const aiData = JSON.parse(cleanJson)

    const recommendedProducts = await prisma.product.findMany({
      where: { id: { in: aiData.selectedIds } }
    })

    return NextResponse.json({
      reason: aiData.reason,
      products: recommendedProducts
    })

  } catch (error: any) {
    console.error("AI Error:", error)
    if (error.message?.includes('429')) {
        
        return NextResponse.json({ error: "🔥 AI พลังหมดชั่วคราว (Quota เต็ม) กรุณารอสักครู่..." }, { status: 429 })
    }
    return NextResponse.json({ error: "AI Error: " + error.message }, { status: 500 })
  }
}