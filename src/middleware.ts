import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const sessionCookie = req.cookies.get("maruf_admin_session");

  // Protect /dashboard and /admin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!sessionCookie || !sessionCookie.value) {
      const fullPath = `${pathname}${search}`;
      const loginUrl = new URL(`/login?callbackUrl=${encodeURIComponent(fullPath)}`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated admins from /login to callbackUrl or /dashboard
  if (pathname === "/login") {
    if (sessionCookie && sessionCookie.value) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/dashboard";
      const targetUrl = new URL(callbackUrl, req.url);
      return NextResponse.redirect(targetUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/admin", "/login"],
};
