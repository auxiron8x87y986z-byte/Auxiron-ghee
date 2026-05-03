const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

async function main() {
  const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'auxiron',
    connectionLimit: 10,
  });
  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });

  const hash = await bcrypt.hash('admin123', 10);
  
  await prisma.adminUser.update({
    where: { email: 'admin@auxiron.com' },
    data: { password: hash }
  });
  
  console.log("Updated password!");
  process.exit(0);
}

main().catch(console.error);
