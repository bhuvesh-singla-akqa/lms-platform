const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const email = process.argv[2] || 'bhuvesh.singla@akqa.com';

    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true, sessions: true },
    });

    if (user) {
      console.log('🔍 User found:');
      console.log('- ID:', user.id);
      console.log('- Name:', user.name);
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('- Accounts:', user.accounts.length);
      console.log('- Sessions:', user.sessions.length);
      console.log('- Created:', user.createdAt);

      if (user.accounts.length > 0) {
        console.log('\n🔗 Account details:');
        user.accounts.forEach(acc => {
          console.log('  - Provider:', acc.provider);
          console.log('  - Provider Account ID:', acc.providerAccountId);
          console.log('  - Type:', acc.type);
        });
      } else {
        console.log(
          '\n⚠️  NO OAUTH ACCOUNTS LINKED - This causes OAuthAccountNotLinked error'
        );
      }

      if (user.sessions.length > 0) {
        console.log('\n📅 Active sessions:', user.sessions.length);
      }
    } else {
      console.log('❌ User not found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
