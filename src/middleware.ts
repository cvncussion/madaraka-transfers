import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") {
      const token = req.nextauth.token
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") {
          return token !== null
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
