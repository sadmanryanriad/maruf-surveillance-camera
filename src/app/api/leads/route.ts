import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import Lead, { LeadType, ILead } from "@/models/Lead";
import { sendLeadTelegramNotification } from "@/lib/telegram";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ leads, currentRole: session.role });
  } catch (err) {
    console.error("Database error in GET /api/leads:", err);
    const { getAllLeads } = await import("@/lib/leads-store");
    const fallbackLeads = getAllLeads();
    return NextResponse.json({ leads: fallbackLeads, currentRole: session.role, isFallback: true });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type,
      name,
      email,
      phone,
      propertyType,
      cameraCount,
      preferredDate,
      service,
      notes,
    } = body as {
      type: LeadType;
      name: string;
      email?: string;
      phone: string;
      propertyType?: string;
      cameraCount?: string;
      preferredDate?: string;
      service?: string;
      notes?: string;
    };

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const leadType: LeadType = ["quote", "book", "contact"].includes(type) ? type : "contact";

    let leadDoc: ILead | null = null;
    let fallbackId: string | null = null;

    // Fault-tolerant DB Save
    try {
      await connectToDatabase();
      leadDoc = await Lead.create({
        type: leadType,
        name: name.trim(),
        email: email?.trim(),
        phone: phone.trim(),
        propertyType,
        cameraCount,
        preferredDate,
        service,
        notes: notes?.trim(),
        status: "new",
        isBookmarked: false,
        adminNotes: [],
        telegramSent: false,
      });
    } catch (dbErr) {
      console.error("MongoDB save failed, falling back to local file store:", dbErr);
      const { createLead } = await import("@/lib/leads-store");
      const fallbackLead = createLead({
        type: leadType,
        name: name.trim(),
        email: email?.trim(),
        phone: phone.trim(),
        propertyType,
        cameraCount,
        preferredDate,
        service,
        notes: notes?.trim(),
      });
      fallbackId = fallbackLead.id;
    }

    // Telegram Notification Dispatch with per-lead status tracking
    const targetLeadId = leadDoc ? leadDoc._id.toString() : fallbackId || "N/A";

    sendLeadTelegramNotification({
      id: targetLeadId,
      type: leadType,
      name,
      email,
      phone,
      propertyType,
      cameraCount,
      preferredDate,
      service,
      notes,
      createdAt: leadDoc ? leadDoc.createdAt : new Date(),
    })
      .then(async (results) => {
        const allOk = results.length > 0 && results.every((r) => r.ok);
        const errDescs = results
          .filter((r) => !r.ok)
          .map((r) => r.description)
          .filter(Boolean)
          .join("; ");

        if (leadDoc) {
          try {
            await connectToDatabase();
            leadDoc.telegramSent = allOk;
            leadDoc.telegramSentAt = new Date();
            if (!allOk) {
              leadDoc.telegramError = errDescs || "Failed to deliver Telegram message.";
            }
            await leadDoc.save();
          } catch (updateErr) {
            console.error("Error updating lead Telegram status in DB:", updateErr);
          }
        }
      })
      .catch((err) => {
        console.error("Telegram notification error:", err);
      });

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully.",
      leadId: targetLeadId,
    });
  } catch (err) {
    console.error("Error in POST /api/leads:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
