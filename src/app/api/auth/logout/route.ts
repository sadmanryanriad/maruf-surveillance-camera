import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth-session";

export async function POST(req: Request) {
  await clearAdminSessionCookie();
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get("callbackUrl") || "/login";
  return NextResponse.redirect(new URL(callbackUrl, req.url));
}

export async function GET(req: Request) {
  await clearAdminSessionCookie();
  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get("callbackUrl") || "/login";
  return NextResponse.redirect(new URL(callbackUrl, req.url));
}
