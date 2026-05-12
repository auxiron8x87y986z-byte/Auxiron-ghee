const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

const rawConnectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/auxiron_ghee';
const connectionString = rawConnectionString.replace('mysql://', 'mariadb://');
const pool = mariadb.createPool(connectionString);
const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  const existingAdmins = await prisma.$queryRaw`SELECT * FROM AdminUser LIMIT 1`;
  const existingAdmin = existingAdmins[0];

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.$executeRaw`
      INSERT INTO AdminUser (name, email, password, updatedAt) 
      VALUES ('Super Admin', 'admin@auxiron.com', ${hashedPassword}, NOW())
    `;
    console.log('Seeded default admin (admin@auxiron.com / Admin@123)');
  } else {
    const isCurrentPasswordAdmin123 = await bcrypt.compare('Admin@123', existingAdmin.password);
    if (!isCurrentPasswordAdmin123) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await prisma.$executeRaw`
        UPDATE AdminUser 
        SET password = ${hashedPassword}, updatedAt = NOW() 
        WHERE id = ${existingAdmin.id}
      `;
      console.log('Updated existing admin password to Admin@123');
    } else {
      console.log('Admin already exists with Admin@123.');
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
