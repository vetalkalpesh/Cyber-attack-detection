import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"

const protectedRoutes = ["/dashboard", "/admin", "/api/alerts", "/api/devices"]
const publicRoutes = ["/login", "/"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // Get session from cookie
  const cookie = request.cookies.get("session")?.value
  const session = await decrypt(cookie)

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  // Redirect to dashboard if accessing login with valid session
  if (path === "/login" && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
  }

  // Redirect root to dashboard if authenticated, otherwise to login
  if (path === "/") {
    if (session?.userId) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
    } else {
      return NextResponse.redirect(new URL("/login", request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
