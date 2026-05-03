import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma_new_v6: PrismaClient | undefined;
};

const pool = mariadb.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const adapter = new PrismaAdapter(pool);

export const prisma = globalForPrisma.prisma_new_v6 ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new_v6 = prisma;
