import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { items: [], data: [], total: 0, page: 1, limit: 10, user: null, authenticated: false },
      { status: 200 }
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', url.pathname);
  requestHeaders.set('x-url', request.url);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|favicon.png|favicon.svg|site.webmanifest|sw.js|og-image.svg).*)',
  ],
};
