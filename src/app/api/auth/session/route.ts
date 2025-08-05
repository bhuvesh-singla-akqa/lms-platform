import { getSession } from '@/lib/session';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = getSession();

    if (session) {
      return Response.json(session);
    } else {
      return Response.json(null, { status: 401 });
    }
  } catch (error) {
    console.error('Session API error:', error);
    return Response.json(null, { status: 500 });
  }
}
