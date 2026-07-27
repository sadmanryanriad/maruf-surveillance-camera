import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import Lead, { LeadType } from "@/models/Lead";
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
    // Fallback to local file store if DB fails
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

    let leadDoc: Record<string, unknown> | null = null;

    // Fault-tolerant DB Save: Try saving to MongoDB first
    try {
      await connectToDatabase();
      const newLead = await Lead.create({
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
      });
      leadDoc = {
        id: newLead._id.toString(),
        type: newLead.type,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        propertyType: newLead.propertyType,
        cameraCount: newLead.cameraCount,
        preferredDate: newLead.preferredDate,
        service: newLead.service,
        notes: newLead.notes,
        createdAt: newLead.createdAt,
      };
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
      leadDoc = {
        id: fallbackLead.id,
        type: fallbackLead.type,
        name: fallbackLead.name,
        email: fallbackLead.email,
        phone: fallbackLead.phone,
        propertyType: fallbackLead.propertyType,
        cameraCount: fallbackLead.cameraCount,
        preferredDate: fallbackLead.preferredDate,
        service: fallbackLead.service,
        notes: fallbackLead.notes,
        createdAt: fallbackLead.createdAt,
      };
    }

    // Fault-tolerant Telegram Notification: Attempt Telegram dispatch asynchronously
    if (leadDoc) {
      sendLeadTelegramNotification({
        id: (leadDoc.id as string) || "N/A",
        type: (leadDoc.type as LeadType) || "contact",
        name: (leadDoc.name as string) || name,
        email: (leadDoc.email as string) || email,
        phone: (leadDoc.phone as string) || phone,
        propertyType: leadDoc.propertyType as string,
        cameraCount: leadDoc.cameraCount as string,
        preferredDate: leadDoc.preferredDate as string,
        service: leadDoc.service as string,
        notes: leadDoc.notes as string,
        createdAt: (leadDoc.createdAt as Date) || new Date(),
      }).catch((tgErr) => {
        console.error("Telegram notification error:", tgErr);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully.",
      leadId: leadDoc?.id,
    });
  } catch (err) {
    console.error("Error in POST /api/leads:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
