const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setUserRole() {
  try {
    const email = process.argv[2] || process.env.USER_EMAIL;
    const role = process.argv[3] || process.env.USER_ROLE || 'contentAdmin';

    if (!email) {
      console.error('❌ Please provide an email address:');
      console.log(
        'Usage: node scripts/set-user-role.js "user@example.com" "contentAdmin"'
      );
      console.log('Available roles: viewer, contentAdmin, admin');
      process.exit(1);
    }

    if (!['viewer', 'contentAdmin', 'admin'].includes(role)) {
      console.error(
        '❌ Invalid role. Available roles: viewer, contentAdmin, admin'
      );
      process.exit(1);
    }

    console.log(`🔧 Setting role for: ${email} to ${role}`);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!existingUser) {
      console.log(
        '❌ User not found. Please make sure the user has logged in via Google OAuth first.'
      );
      return;
    }

    // Check if user has OAuth accounts (properly created by NextAuth)
    if (existingUser.accounts.length === 0) {
      console.log('⚠️  User exists but has no OAuth accounts linked.');
      console.log(
        'This suggests the user was created manually. Please run fix-oauth-link.js first.'
      );
      return;
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
    });

    console.log('✅ User role updated successfully!');
    console.log(`📧 Email: ${updatedUser.email}`);
    console.log(`👤 Name: ${updatedUser.name}`);
    console.log(`🔑 Role: ${updatedUser.role}`);
    console.log(
      `🔗 OAuth Accounts: ${existingUser.accounts.map(acc => acc.provider).join(', ')}`
    );
    console.log('');
    console.log('🎉 You can now access the dashboard with full permissions!');
  } catch (error) {
    console.error('❌ Error setting user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setUserRole();
