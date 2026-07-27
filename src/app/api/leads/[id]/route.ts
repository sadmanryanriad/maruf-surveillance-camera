import { NextResponse } from "next/server";
import { getCurrentAdminSession, isRoleAtLeast } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import Lead, { LeadStatus } from "@/models/Lead";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, isBookmarked, noteText } = body as {
      status?: LeadStatus;
      isBookmarked?: boolean;
      noteText?: string;
    };

    await connectToDatabase();
    const lead = await Lead.findById(id);
    if (!lead) {
      // Try local fallback store if not in MongoDB
      const { updateLeadStatus } = await import("@/lib/leads-store");
      if (status) {
        const updatedFallback = updateLeadStatus(id, status);
        if (updatedFallback) return NextResponse.json({ success: true, lead: updatedFallback });
      }
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    if (status !== undefined) {
      if (!isRoleAtLeast(session.role, "admin")) {
        return NextResponse.json(
          { error: "Forbidden: Only Admin role can update lead status." },
          { status: 403 }
        );
      }
      lead.status = status;
    }

    if (isBookmarked !== undefined) {
      lead.isBookmarked = isBookmarked;
    }

    if (noteText && noteText.trim()) {
      lead.adminNotes.push({
        author: session.name || session.email,
        text: noteText.trim(),
        createdAt: new Date(),
      });
    }

    await lead.save();
    return NextResponse.json({ success: true, lead });
  } catch (err) {
    console.error("Error updating lead:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session || !isRoleAtLeast(session.role, "admin")) {
    return NextResponse.json(
      { error: "Forbidden: Only Admin role can delete leads." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const deleted = await Lead.findByIdAndDelete(id);

    if (!deleted) {
      const { deleteLead } = await import("@/lib/leads-store");
      deleteLead(id);
    }

    return NextResponse.json({ success: true, message: "Lead deleted." });
  } catch (err) {
    console.error("Error deleting lead:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
