import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User, { IUser } from "@/models/User";

export type AdminRole = "admin" | "viewer";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  issuedAt: number;
}

const COOKIE_NAME = "maruf_admin_session";

export async function verifyUserCredentials(email: string, password: string): Promise<{ user?: IUser; error?: string }> {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return { error: "Invalid email address or password." };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: "Invalid email address or password." };
    }

    return { user };
  } catch (err) {
    console.error("Database connection error during login:", err);
    return { error: "Database error. Please try again." };
  }
}

export async function setAdminSessionCookie(session: AdminSession): Promise<void> {
  const cookieStore = await cookies();
  const rawPayload = JSON.stringify(session);
  const encoded = Buffer.from(rawPayload).toString("base64");

  cookieStore.set(COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie || !cookie.value) return null;

    const rawPayload = Buffer.from(cookie.value, "base64").toString("utf-8");
    const session = JSON.parse(rawPayload) as AdminSession;

    // Check expiry (7 days)
    if (Date.now() - session.issuedAt > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function isRoleAtLeast(sessionRole: AdminRole, requiredRole: AdminRole): boolean {
  if (requiredRole === "viewer") return true;
  if (requiredRole === "admin") return sessionRole === "admin";
  return false;
}
