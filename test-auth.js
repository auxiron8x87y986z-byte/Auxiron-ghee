const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

async function main() {
  const pool = mariadb.createPool("mariadb://root@localhost:3306/auxiron");
  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Looking up user...");
  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: 'admin@auxiron.com' }
    });
    console.log("User found:", user ? user.email : "null");
    if (user) {
      console.log("Hash in DB:", user.password);
      console.log("Comparison:", await bcrypt.compare('admin123', user.password));
    }
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit();
}
main();
