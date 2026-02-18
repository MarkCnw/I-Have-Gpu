// auth.ts (เพิ่ม console.log เพื่อ Debug)
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // 🔥 จุดที่ 1: ดูว่าได้รับค่าอะไรมาบ้าง
        console.log("1. Login Attempt:", credentials)

        const parsedCredentials = loginSchema.safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          
          // 🔥 จุดที่ 2: ค้นหา User
          const user = await prisma.user.findUnique({ where: { email } })
          console.log("2. User found:", user ? "YES" : "NO")
          
          if (!user) return null

          // 🔥 จุดที่ 3: เทียบรหัสผ่าน
          const passwordsMatch = await bcrypt.compare(password, user.password)
          console.log("3. Password Match:", passwordsMatch)
          
          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        } else {
            console.log("Validation Failed")
        }
        return null
      },
    }),
  ],
  // ... (ส่วน callbacks เหมือนเดิม)
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role 
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login', 
  }
})