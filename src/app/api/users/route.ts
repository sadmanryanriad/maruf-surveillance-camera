import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentAdminSession, isRoleAtLeast } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ users, currentRole: session.role });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getCurrentAdminSession();
  if (!session || !isRoleAtLeast(session.role, "admin")) {
    return NextResponse.json(
      { error: "Forbidden: Only Admin role can create new users." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { email, password, name, role } = body as {
      email: string;
      password: string;
      name: string;
      role: "admin" | "viewer";
    };

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email address already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: role === "admin" ? "admin" : "viewer",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getCurrentAdminSession();
  if (!session || !isRoleAtLeast(session.role, "admin")) {
    return NextResponse.json(
      { error: "Forbidden: Only Admin role can delete users." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (id === session.userId) {
      return NextResponse.json({ error: "You cannot delete your own active account." }, { status: 400 });
    }

    await connectToDatabase();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "User deleted." });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
