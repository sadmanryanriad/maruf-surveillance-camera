import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentAdminSession } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { oldPassword, newPassword } = body as { oldPassword: string; newPassword: string };

    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Old password and new password (min 6 chars) are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
