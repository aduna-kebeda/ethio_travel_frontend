import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const protectedPaths = [
    "/profile",
    "/business/my-business",
    "/business/register",
    "/business/edit",
    "/blog/create",
    "/blog/edit",
    "/blog/my-posts",
    "/settings",
  ]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((prefix) => path.startsWith(prefix))

  // Get the token from cookies
  const token = request.cookies.get("access_token")?.value

  // If the path requires authentication and there's no token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url))
  }

  // If the user is authenticated and trying to access login/signup pages, redirect to home
  if (token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
