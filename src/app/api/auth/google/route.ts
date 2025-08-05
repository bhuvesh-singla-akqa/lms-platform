import { getGoogleAuthUrl } from '@/lib/google-auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check if we have the required environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('❌ Google OAuth not configured');
      const url = new URL(request.url);
      return Response.redirect(
        `${url.origin}/?error=oauth_not_configured`,
        302
      );
    }

    const url = new URL(request.url);
    const authUrl = getGoogleAuthUrl(url.origin);
    console.log('✅ Redirecting to Google OAuth:', authUrl);

    // Return a proper redirect response instead of using Next.js redirect()
    return Response.redirect(authUrl, 302);
  } catch (error) {
    console.error('❌ Error initiating Google auth:', error);
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/?error=auth_failed`, 302);
  }
}
