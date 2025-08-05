import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/add-user', '/add-training'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // For now, just allow access - we'll handle auth in the components
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/add-user/:path*', '/add-training/:path*'],
};
