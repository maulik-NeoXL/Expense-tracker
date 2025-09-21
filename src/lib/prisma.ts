import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Set default DATABASE_URL if not provided (only for development)
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  process.env.DATABASE_URL = `file:${dbPath}`
}

// Create Prisma client with error handling
let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
} catch (error) {
  console.error('Failed to create Prisma client:', error)
  // Create a mock client that throws errors when used
  prisma = new Proxy({} as PrismaClient, {
    get() {
      throw new Error('Database not available')
    }
  })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
