import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define paths that should be excluded from middleware processing
const excludedPaths = ["/api/auth", "/_next", "/favicon.ico", "/images"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for excluded paths
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  try {
    // Get the token with the secret
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    const isAuthenticated = !!token

    // Define protected routes
    const protectedRoutes = ["/profile", "/itinerary"]

    // Define auth routes
    const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-code"]

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

    // Check if current path is an auth route
    const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

    // Redirect logic
    if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // Continue to the page even if there's an error
  }

  return NextResponse.next()
}

// Configure middleware to run on all paths except excluded ones
export const config = {
  matcher: [
    // Match all paths except excluded ones
    "/((?!api/auth|_next|favicon.ico).*)",
  ],
}
