import { PrismaClient } from '@prisma/client'
import { validateEnv } from './env'

// Validate environment variables on startup
validateEnv();

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma

export const useRemoteDb = process.env.USE_REMOTE_DB === "true";

export async function dbFetch<T>(exec: () => Promise<T>, fallback: T): Promise<T> {
  // During Next.js build, we might not have a DB connection.
  // We should gracefully fail and return the fallback.
  try {
    // If we're in production (including build) or useRemoteDb is true, attempt the fetch.
    if (process.env.NODE_ENV === 'production' || useRemoteDb) {
      return await exec();
    }
  } catch (error: any) {
    console.error("Prisma DB fetch failed:", error.message || error);
  }
  
  return fallback;
}
