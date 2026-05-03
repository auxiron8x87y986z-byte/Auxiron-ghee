const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.AdminUser.findFirst();
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.AdminUser.create({
      data: {
        name: 'Super Admin',
        email: 'admin@auxiron.com',
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
    console.log('Seeded default admin (admin@auxiron.com / Admin@123)');
  } else {
    // Also upgrade the existing admin if the password isn't hashed
    if (!existingAdmin.password.startsWith('$2a$') && !existingAdmin.password.startsWith('$2b$')) {
       const hashedPassword = await bcrypt.hash('Admin@123', 10);
       await prisma.AdminUser.update({
         where: { id: existingAdmin.id },
         data: { 
           password: hashedPassword,
           updatedAt: new Date()
         }
       });
       console.log('Upgraded existing admin password to hash (Admin@123)');
    }
    console.log('Admin already exists.');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
