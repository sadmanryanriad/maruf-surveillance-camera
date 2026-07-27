import { NextResponse } from "next/server";
import { getCurrentAdminSession, isRoleAtLeast } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import Setting from "@/models/Setting";
import { logActivity } from "@/models/ActivityLog";

export async function GET() {
  try {
    await connectToDatabase();
    let setting = await Setting.findOne().lean();
    if (!setting) {
      setting = await Setting.create({
        phone: "+880 1760-345435",
        email: "hello@maruf-security.com",
        address: "24 Watchtower Ave, Suite 300, Metro City",
        hours: "Mon-Sat · 8am-8pm",
        telegramChatIds: ["1240674937"],
      });
    }

    return NextResponse.json({ setting });
  } catch (err) {
    console.error("Error fetching site settings:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getCurrentAdminSession();
  if (!session || !isRoleAtLeast(session.role, "admin")) {
    return NextResponse.json(
      { error: "Forbidden: Only Admin role can update site settings." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { phone, email, address, hours } = body as {
      phone?: string;
      email?: string;
      address?: string;
      hours?: string;
    };

    await connectToDatabase();
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting({});
    }

    if (phone !== undefined) setting.phone = phone.trim();
    if (email !== undefined) setting.email = email.trim();
    if (address !== undefined) setting.address = address.trim();
    if (hours !== undefined) setting.hours = hours.trim();

    await setting.save();

    // Audit Activity Log
    await logActivity(
      { email: session.email, name: session.name, role: session.role },
      "CONTACT_INFO_UPDATED",
      `Updated site contact details (Phone: ${setting.phone}, Email: ${setting.email}, Address: ${setting.address}, Hours: ${setting.hours})`
    );

    return NextResponse.json({ success: true, setting });
  } catch (err) {
    console.error("Error updating site settings:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
