import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use a more robust connection string logic
const databaseUrl = process.env.DATABASE_URL || 
  `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'auxiron_ghee'}`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const useRemoteDb = process.env.USE_REMOTE_DB === "true";

export async function dbFetch<T>(exec: () => Promise<T>, fallback: T): Promise<T> {
  // If we are in production or USE_REMOTE_DB is true, always try to fetch
  if (process.env.NODE_ENV === 'production' || useRemoteDb) {
    try {
      return await exec();
    } catch (error) {
      console.error("Prisma DB fetch failed:", error);
      return fallback;
    }
  }
  
  return fallback;
}

