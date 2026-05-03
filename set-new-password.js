const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash('Admin@123', 10);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@auxiron.com' },
    update: { password: hash },
    create: { email: 'admin@auxiron.com', password: hash }
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
  .finally(() => process.exit(0));
