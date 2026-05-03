import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma_new_v6: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma_new_v6 ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new_v6 = prisma;
