import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      appUrl: process.env.APP_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      currentUrl: request.url,
      origin: request.nextUrl.origin,
      expectedCallbackUrl: `${request.nextUrl.origin}/api/auth/google/callback`,
      configuredCallbackUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`,
      headers: {
        host: request.headers.get('host'),
        'x-forwarded-host': request.headers.get('x-forwarded-host'),
        'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      },
    };

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json(
      {
        error: 'Debug failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
