import { NextRequest } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Import everything dynamically to avoid build-time issues
  const { getGoogleUser } = await import('@/lib/google-auth');
  const { createSession } = await import('@/lib/session');
  const { PrismaClient } = await import('@prisma/client');

  // Configure allowed domains and their default roles
  const ALLOWED_DOMAINS = {
    'akqa.com': 'viewer',
    // 'gmail.com': 'viewer',
  } as const;

  // Configure admin emails (these get admin role)
  const ADMIN_EMAILS = [
    'bhuvesh.singla@akqa.com',
    // Add more admin emails here
  ];

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log('🔍 OAuth callback received:', { code: !!code, error });

  if (error) {
    console.error('❌ Google OAuth error:', error);
    return Response.redirect(
      `${request.nextUrl.origin}/?error=oauth_error`,
      302
    );
  }

  if (!code) {
    console.error('❌ No authorization code received');
    return Response.redirect(`${request.nextUrl.origin}/?error=no_code`, 302);
  }

  let prisma: InstanceType<typeof PrismaClient> | null = null;

  try {
    prisma = new PrismaClient();
    console.log('🚀 Starting Google user fetch...');

    // Get user info from Google - pass the origin for dynamic callback URL
    const googleUser = await getGoogleUser(code, request.nextUrl.origin);
    console.log('✅ Google user fetched:', {
      email: googleUser.email,
      name: googleUser.name,
    });

    // Check if domain is allowed
    const domain = googleUser.email.split('@')[1];
    console.log('🔍 Checking domain:', domain);

    if (!ALLOWED_DOMAINS[domain as keyof typeof ALLOWED_DOMAINS]) {
      console.log(`❌ Access denied for domain: ${domain}`);
      return Response.redirect(
        `${request.nextUrl.origin}/?error=unauthorized_domain`,
        302
      );
    }

    console.log('✅ Domain authorized:', domain);

    // Check if user exists in our database
    console.log('🔍 Checking if user exists in database...');
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      console.log('🆕 Creating new user...');
      // Create new user with appropriate role
      const isAdmin = ADMIN_EMAILS.includes(googleUser.email);
      const role = isAdmin
        ? 'admin'
        : ALLOWED_DOMAINS[domain as keyof typeof ALLOWED_DOMAINS];

      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          role,
        },
      });

      console.log(`✅ Created new user: ${user.email} with role: ${user.role}`);
    } else {
      console.log(
        `✅ Existing user logged in: ${user.email} with role: ${user.role}`
      );
    }

    console.log('🍪 Creating session...');
    // Create session
    createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image || undefined,
    });

    console.log('🎉 Redirecting to dashboard...');
    // Redirect to dashboard
    return Response.redirect(`${request.nextUrl.origin}/dashboard`, 302);
  } catch (error) {
    console.error('❌ Detailed error in Google OAuth callback:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error,
      // Add debug info
      requestUrl: request.url,
      origin: request.nextUrl.origin,
      code: code,
      hasGoogleCredentials: !!(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
      appUrl: process.env.APP_URL,
    });
    return Response.redirect(
      `${request.nextUrl.origin}/?error=auth_failed&debug=${encodeURIComponent(error instanceof Error ? error.message : 'unknown')}`,
      302
    );
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
