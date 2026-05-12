import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env["DATABASE_URL"] || 
  `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || ''}@127.0.0.1:3306/${process.env.DB_NAME || 'auxiron_ghee'}`;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaMariaDb(connectionString);
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma;
export const useRemoteDb = process.env.USE_REMOTE_DB === "true";

export async function dbFetch<T>(exec: () => Promise<T>, fallback: T): Promise<T> {
  if (!useRemoteDb) {
    return fallback;
  }

  try {
    return await exec();
  } catch (error) {
    console.error("Prisma DB fetch failed:", error);
    return fallback;
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
