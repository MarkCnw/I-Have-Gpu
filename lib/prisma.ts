// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // ให้มันพ่น SQL ออกมาดูเล่นใน Terminal ตอน dev
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma