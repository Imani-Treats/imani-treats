import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('admin_token')?.value;
  
  // Protect all /admin routes except the login page itself
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (token !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // If already logged in, prevent going back to the login page
  if (path === '/admin/login' && token === 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};