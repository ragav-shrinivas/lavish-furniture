import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('lavish_admin')?.value;
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;
    if (!token || !sessionToken || token !== sessionToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|frames|uploads|products).*)'],
};
