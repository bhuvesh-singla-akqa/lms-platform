import { google } from 'googleapis';

// Create a fresh OAuth client for each request to handle dynamic URLs
function createOAuth2Client(callbackUrl: string) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth not configured');
  }

  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl
  );
}

export function getGoogleAuthUrl(origin?: string) {
  // Construct callback URL dynamically based on current origin
  const callbackUrl = origin
    ? `${origin}/api/auth/google/callback`
    : `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;
  const client = createOAuth2Client(callbackUrl);

  console.log('🔗 Generating Google auth URL with redirect:', callbackUrl);

  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    include_granted_scopes: true,
  });
}

export async function getGoogleUser(code: string, origin?: string) {
  // Construct callback URL dynamically based on current origin
  const callbackUrl = origin
    ? `${origin}/api/auth/google/callback`
    : `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;
  const client = createOAuth2Client(callbackUrl);

  try {
    console.log(
      '🔑 Exchanging code for tokens with callback URL:',
      callbackUrl
    );
    const { tokens } = await client.getToken(code);
    console.log('✅ Tokens received, setting credentials...');

    client.setCredentials(tokens);

    console.log('👤 Fetching user info from Google...');
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();

    console.log('✅ User info received from Google:', {
      id: data.id,
      email: data.email,
      name: data.name,
    });

    return {
      id: data.id!,
      email: data.email!,
      name: data.name!,
      picture: data.picture,
    };
  } catch (error) {
    console.error('❌ Error in getGoogleUser:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error,
      callbackUrl,
    });
    throw new Error(
      `Failed to get user info from Google: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
