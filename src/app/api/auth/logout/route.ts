import { cookies } from 'next/headers';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    // Manually construct the Set-Cookie header string
    const cookie = [
      'auth-token=;',
      'Path=/;',
      'HttpOnly;',
      process.env.NODE_ENV === 'production' ? 'Secure;' : '',
      'Max-Age=0;',
      'SameSite=Lax;',
    ].join(' ');

    return new Response(null, {
      status: 302,
      headers: {
        'Set-Cookie': cookie,
        Location: `${url.origin}/`,
      },
    });
  } catch (error) {
    const url = new URL(request.url);
    return new Response(null, {
      status: 302,
      headers: { Location: `${url.origin}/` },
    });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
