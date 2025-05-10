import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/landingpage" ||
    path.startsWith("/blog") ||
    path.startsWith("/business") ||
    path.startsWith("/destinations") ||
    path.startsWith("/events") ||
    path.startsWith("/packages") ||
    path.startsWith("/about") ||
    path.startsWith("/chatbot")

  // Define authentication paths
  const isAuthPath =
    path === "/login" ||
    path === "/signup" ||
    path.startsWith("/(auth)") ||
    path.startsWith("/auth/") ||
    path === "/forgot-password" ||
    path === "/reset-password" ||
    path === "/verify-email" ||
    path === "/verify-code"

  // Update the token check to also look for access_token
  const token = request.cookies.get("token")?.value || request.cookies.get("access_token")?.value || ""

  // Add a check for protected paths that should redirect to login if not authenticated
  const isProtectedPath =
    path === "/profile" ||
    path === "/home" ||
    path.startsWith("/business/my-") ||
    path.startsWith("/blog/my-") ||
    path === "/business/register" ||
    path === "/blog/create"

  // If trying to access a protected route without being logged in, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url)
    // Add the current path as a redirect parameter
    loginUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and trying to access auth pages, redirect to home
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
