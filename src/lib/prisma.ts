import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma_new_v6: PrismaClient | undefined;
};

const connectionString = process.env["DATABASE_URL"] || 
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`;

const adapter = new PrismaMariaDb(connectionString);

export const prisma = globalForPrisma.prisma_new_v6 ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new_v6 = prisma;
