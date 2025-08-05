const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixOAuthLink() {
  try {
    const email =
      process.argv[2] || process.env.USER_EMAIL || 'bhuvesh.singla@akqa.com';
    const name = process.argv[3] || process.env.USER_NAME || 'Bhuvesh Singla';

    console.log(`🔧 Fixing OAuth linking for: ${email}`);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!existingUser) {
      console.log('❌ User not found. Please run setup-admin.js first.');
      return;
    }

    // Check if user already has OAuth accounts linked
    if (existingUser.accounts.length > 0) {
      console.log('✅ User already has OAuth accounts linked.');
      console.log(
        'Linked accounts:',
        existingUser.accounts.map(acc => acc.provider)
      );
      return;
    }

    console.log(
      '🔍 Found user without OAuth accounts. This causes the OAuthAccountNotLinked error.'
    );
    console.log(
      '💡 Solution: Remove the manually created user so NextAuth can create it properly.'
    );

    // Delete the user (this will cascade delete sessions due to schema)
    await prisma.user.delete({
      where: { email },
    });

    console.log('✅ Manually created user removed successfully!');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Go to your app and try logging in with Google again');
    console.log(
      '2. NextAuth will now create the user properly with OAuth account linking'
    );
    console.log(
      '3. After successful login, run this script again to set the correct role:'
    );
    console.log(`   node scripts/set-user-role.js "${email}" "contentAdmin"`);
  } catch (error) {
    console.error('❌ Error fixing OAuth link:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOAuthLink();
