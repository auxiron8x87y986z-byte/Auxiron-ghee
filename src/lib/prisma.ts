import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { createPool } from 'mariadb'
import { getDatabaseUrl } from './db-utils'
import { validateEnv } from './env'

// Validate environment variables on startup
validateEnv();

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
  pool: any | undefined
  adapter: any | undefined
}

if (!globalForPrisma.prisma) {
  const rawConnectionString = getDatabaseUrl();
  // Ensure the protocol is correct for the mariadb driver
  const connectionString = rawConnectionString.replace('mysql://', 'mariadb://');
  
  console.log('Initializing Prisma Client with MariaDB adapter...');
  
  // Create pool with optimized production settings
  const pool = createPool({
    uri: connectionString,
    connectionLimit: 20,
    idleTimeout: 30000,
    checkExpirationInterval: 10000,
    acquireTimeout: 20000, // Increase timeout to prevent early failures
  });

  const adapter = new PrismaMariaDb(pool);
  
  globalForPrisma.pool = pool;
  globalForPrisma.adapter = adapter;
  globalForPrisma.prisma = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

// Export the singleton instance
export const prisma = globalForPrisma.prisma!;

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
    // Check if it's a connection pool timeout
    if (error.message?.includes('pool timeout')) {
      console.error("❌ Prisma Pool Timeout Detected. Ensure database is accessible and connection limit is sufficient.");
    } else {
      console.error("Prisma DB fetch failed:", error.message || error);
    }
  }
  
  return fallback;
}
