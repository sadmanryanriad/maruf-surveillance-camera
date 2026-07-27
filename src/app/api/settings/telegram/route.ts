import { NextResponse } from "next/server";
import { getCurrentAdminSession, isRoleAtLeast } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import Setting from "@/models/Setting";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({ telegramChatIds: ["1240674937"] });
    }

    return NextResponse.json({ telegramChatIds: setting.telegramChatIds });
  } catch (err) {
    console.error("Error fetching Telegram settings:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getCurrentAdminSession();
  if (!session || !isRoleAtLeast(session.role, "admin")) {
    return NextResponse.json(
      { error: "Forbidden: Only Admin role can update notification settings." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { telegramChatIds } = body as { telegramChatIds: string[] };

    if (!Array.isArray(telegramChatIds)) {
      return NextResponse.json({ error: "telegramChatIds must be an array of strings." }, { status: 400 });
    }

    await connectToDatabase();
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting({ telegramChatIds: [] });
    }

    // Clean and unique chat IDs
    setting.telegramChatIds = Array.from(new Set(telegramChatIds.map((id) => id.trim()).filter(Boolean)));
    await setting.save();

    return NextResponse.json({ success: true, telegramChatIds: setting.telegramChatIds });
  } catch (err) {
    console.error("Error updating Telegram settings:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
