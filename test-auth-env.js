require('dotenv').config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

async function main() {
  const pool = mariadb.createPool({ host: '127.0.0.1', user: 'root', password: '', database: 'auxiron' });
  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Attempting to query...");
    const user = await prisma.adminUser.findFirst();
    console.log("Success! Found:", user?.email);
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit();
}
main();
