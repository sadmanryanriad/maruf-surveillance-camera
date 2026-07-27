import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("maruf_admin_session");

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated admins from /login to /dashboard
  if (pathname === "/login") {
    if (sessionCookie && sessionCookie.value) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
