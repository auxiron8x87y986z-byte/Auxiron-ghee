const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const rawConnectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/auxiron_ghee';
const connectionString = rawConnectionString.replace('mysql://', 'mariadb://');
const pool = mariadb.createPool(connectionString);
const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash('Admin@123', 10);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@auxiron.com' },
    update: { password: hash },
    create: { email: 'admin@auxiron.com', password: hash, name: 'Admin' }
  });
  
  console.log("Password successfully updated to Admin@123");
  
  // Verify it works immediately
  const user = await prisma.adminUser.findUnique({ where: { email: 'admin@auxiron.com' } });
  if (user) {
    const isValid = await bcrypt.compare('Admin@123', user.password);
    console.log("Verification:", isValid ? "SUCCESS" : "FAILED");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
  });
