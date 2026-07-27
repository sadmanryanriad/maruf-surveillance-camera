import { NextResponse } from "next/server";
import { verifyUserCredentials, setAdminSessionCookie, AdminSession } from "@/lib/auth-session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email address and password are required." },
        { status: 400 }
      );
    }

    const auth = await verifyUserCredentials(email, password);
    if (auth.error || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Authentication failed." },
        { status: 401 }
      );
    }

    const session: AdminSession = {
      userId: auth.user._id.toString(),
      email: auth.user.email,
      name: auth.user.name,
      role: auth.user.role,
      issuedAt: Date.now(),
    };

    await setAdminSessionCookie(session);

    // Audit log
    const { logActivity } = await import("@/models/ActivityLog");
    logActivity(
      { email: session.email, name: session.name, role: session.role },
      "LOGIN",
      `Signed in to console from role ${session.role.toUpperCase()}`
    );

    return NextResponse.json({
      success: true,
      role: session.role,
      name: session.name,
      email: session.email,
    });
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
