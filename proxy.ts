// Next.js 16+ route interception (replaces middleware.ts)
// - Redirects unauthenticated users away from protected routes
// - Redirects authenticated users away from auth pages
// Must match backend config.cookie.refreshTokenName
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REFRESH_COOKIE = 'refreshToken';

// Route groups (teacher), (school) are stripped from URLs in Next.js App Router
const PROTECTED_PREFIXES = ['/dashboard', '/jobs', '/applications', '/interviews', '/profile', '/notifications', '/support'];
const AUTH_PAGES = ['/login', '/register', '/verify-otp', '/choose-role', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_COOKIE);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/jobs/:path*',
    '/applications/:path*',
    '/interviews/:path*',
    '/profile/:path*',
    '/notifications/:path*',
    '/support/:path*',
    '/login',
    '/register',
    '/verify-otp',
    '/choose-role',
    '/forgot-password',
  ],
};
