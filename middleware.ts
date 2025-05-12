import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true"
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ["/challenges", "/dashboard", "/protocols"]

  // Public routes
  const publicRoutes = ["/", "/login"]

  // If trying to access protected route without being logged in
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access login page while already logged in
  if (publicRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/challenges", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
