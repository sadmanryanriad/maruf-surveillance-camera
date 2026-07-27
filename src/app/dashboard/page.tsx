import Link from "next/link";
import { getCurrentAdminSession } from "@/lib/auth-session";
import { connectToDatabase } from "@/lib/db";
import Lead from "@/models/Lead";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const session = await getCurrentAdminSession();

  let leads: Array<{
    _id: string;
    type: string;
    name: string;
    phone: string;
    propertyType?: string;
    service?: string;
    notes?: string;
    status: string;
    createdAt: Date | string;
  }> = [];

  try {
    await connectToDatabase();
    const rawLeads = await Lead.find().sort({ createdAt: -1 }).lean();
    leads = rawLeads.map((l) => ({
      _id: l._id.toString(),
      type: l.type,
      name: l.name,
      phone: l.phone,
      propertyType: l.propertyType,
      service: l.service,
      notes: l.notes,
      status: l.status,
      createdAt: l.createdAt,
    }));
  } catch (err) {
    console.error("Failed to load leads from MongoDB on dashboard overview:", err);
  }

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const inProgressLeads = leads.filter((l) => l.status === "in_progress" || l.status === "contacted").length;
  const completedLeads = leads.filter((l) => l.status === "completed").length;

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Role Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            System Overview
          </h1>
          <p className="mt-1 text-sm text-muted">
            Monitor client inquiries, quote requests, and surveillance installation leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
              session?.role === "admin"
                ? "bg-[#c8102e]/10 text-[#c8102e] border border-[#c8102e]/30"
                : "bg-primary/10 text-primary border border-primary/30"
            }`}
          >
            ROLE: {session?.role}
          </span>
          <Link
            href="/dashboard/leads"
            className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background transition-all hover:bg-primary hover:text-white"
          >
            Manage All Leads →
          </Link>
        </div>
      </div>

      {/* Role Access Notice */}
      {session?.role === "viewer" ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
          <span>
            ℹ️ You are signed in with <strong>VIEWER (Read-Only)</strong> permissions. You can view all metrics and leads, but status edits and deletions are restricted to Admin accounts.
          </span>
        </div>
      ) : (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs text-primary-strong flex items-center justify-between">
          <span>
            ⚡ You are signed in as <strong>ADMIN</strong>. You have full privileges to update lead statuses, manage installations, and export inquiries.
          </span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
        {[
          { label: "Total Inquiries", val: totalLeads, desc: "All time submissions", color: "border-line" },
          { label: "New Leads", val: newLeads, desc: "Awaiting first contact", color: "border-[#c8102e]/40 bg-[#c8102e]/5" },
          { label: "Active / In Progress", val: inProgressLeads, desc: "Survey or quote pending", color: "border-amber-500/40 bg-amber-500/5" },
          { label: "Completed Installs", val: completedLeads, desc: "Fully resolved & installed", color: "border-emerald-500/40 bg-emerald-500/5" },
        ].map((m) => (
          <div
            key={m.label}
            className={`rounded-2xl border ${m.color} bg-surface p-5 sm:p-6 shadow-sm`}
          >
            <span className="block text-xs font-bold uppercase tracking-wider text-muted">
              {m.label}
            </span>
            <span className="mt-2 block font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              {m.val}
            </span>
            <span className="mt-1 block text-xs text-muted font-sans">{m.desc}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-line">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Recent Submissions
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Latest inquiries received from website visitors (MongoDB Live)
            </p>
          </div>

          <Link
            href="/dashboard/leads"
            className="text-xs font-bold text-primary hover:underline"
          >
            View all ({totalLeads}) →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted">
            No submissions recorded in database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 uppercase font-bold text-muted border-b border-line">
                <tr>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Client Name</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Details</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date (Local)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-surface-2 border border-line px-2.5 py-1 font-extrabold uppercase text-[10px]">
                        {lead.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">{lead.name}</td>
                    <td className="px-6 py-4 text-muted">{lead.phone}</td>
                    <td className="px-6 py-4 text-muted max-w-xs truncate">
                      {lead.propertyType || lead.service || lead.notes || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          lead.status === "new"
                            ? "bg-[#c8102e]/10 text-[#c8102e]"
                            : lead.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted font-mono text-[11px]">
                      {new Date(lead.createdAt).toLocaleString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
