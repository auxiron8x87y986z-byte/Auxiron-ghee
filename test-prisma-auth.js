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

  console.log("Looking up user...");
  const user = await prisma.adminUser.findUnique({
    where: { email: 'admin@auxiron.com' }
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log("Found user:", user.email);
  console.log("User password hash:", user.password);
  
  const isValid = await bcrypt.compare('admin123', user.password);
  console.log("Is password valid?", isValid);
}

main().then(() => process.exit(0)).catch(console.error);
