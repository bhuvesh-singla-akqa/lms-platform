const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Get admin details from command line arguments or environment variables
    const name = process.argv[2] || process.env.ADMIN_NAME || 'Admin User';
    const email = process.argv[3] || process.env.ADMIN_EMAIL;

    if (!email) {
      console.error('❌ Please provide an email address:');
      console.log(
        'Usage: node scripts/setup-admin.js "Admin Name" "admin@example.com"'
      );
      console.log('Or set ADMIN_NAME and ADMIN_EMAIL environment variables');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(
        `✅ User with email ${email} already exists with role: ${existingUser.role}`
      );
      return;
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name,
        email,
        role: 'contentAdmin',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`🔑 Role: ${adminUser.role}`);
    console.log('');
    console.log(
      '🎉 You can now sign in with your Google account using this email!'
    );
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
