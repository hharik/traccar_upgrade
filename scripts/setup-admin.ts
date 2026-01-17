import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@followtrack.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = 'System Administrator';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', email);
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
  console.log('\n⚠️  Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
