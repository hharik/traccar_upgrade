import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/landing', '/api/auth/login', '/api/auth/session'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Get session token from cookies
  const token = request.cookies.get('session')?.value;

  // If trying to access protected route without token, redirect to login
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access login page, redirect to map
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/map', request.url));
  }

  // Validate session for protected API routes
  if (pathname.startsWith('/api/') && !isPublicPath) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Admin-only routes
    if (pathname.startsWith('/api/admin/')) {
      try {
        // Validate session and check role
        const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
          headers: {
            Cookie: `session=${token}`,
          },
        });

        const data = await response.json();
        
        if (!data.user || data.user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Forbidden - Admin access required' },
            { status: 403 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};
