import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if it's an admin path (excluding login)
  const isAdminPath = path.startsWith('/admin') && !path.includes('/admin/login')

  // Get admin session from cookies
  const adminSession = request.cookies.get('adminSession')?.value

  // If it's an admin path and no session exists, redirect to login
  if (isAdminPath && !adminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If there's a session and trying to access login, redirect to dashboard
  if (adminSession && path === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}