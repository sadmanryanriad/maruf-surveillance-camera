import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ logs });
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
