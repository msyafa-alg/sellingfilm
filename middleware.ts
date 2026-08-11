import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientComponent } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createServerClientComponent()

  const { data: { user } } = await supabase.auth.getUser()

  const protectedRoutes = ['/dashboard', '/checkout', '/course', '/api']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout/:path*',
    '/course/:path*',
    '/api/:path*',
    '/',
  ],
}
