// src/middleware.ts
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAuthPage = nextUrl.pathname.startsWith('/auth');
  const isApiRoute = nextUrl.pathname.startsWith('/api');
  
  // Public routes that don't require authentication
  const publicRoutes = ['/'];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Redirect unauthenticated users to login page
  if (!isLoggedIn && !isAuthPage && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl));
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Role-based access control
  if (isLoggedIn) {
    const userRole = session.user.role;
    
    // Admin routes
    if (nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    
    // Business owner routes
    if (nextUrl.pathname.startsWith('/business') && userRole !== 'business_owner') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    
    // Event organizer routes
    if (nextUrl.pathname.startsWith('/events/manage') && userRole !== 'event_organizer' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  return NextResponse.next();
})

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
