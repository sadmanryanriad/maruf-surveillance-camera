"use client";

import { useEffect, useState } from "react";
import { LeadStatus, LeadType } from "@/models/Lead";

interface LeadNote {
  author: string;
  text: string;
  createdAt: string;
}

interface MongoLead {
  _id: string;
  id?: string;
  type: LeadType;
  name: string;
  email?: string;
  phone: string;
  propertyType?: string;
  cameraCount?: string;
  preferredDate?: string;
  service?: string;
  notes?: string;
  status: LeadStatus;
  isBookmarked?: boolean;
  isArchived?: boolean;
  adminNotes?: LeadNote[];
  telegramSent?: boolean;
  telegramSentAt?: string;
  telegramError?: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<MongoLead[]>([]);
  const [currentRole, setCurrentRole] = useState<"admin" | "viewer">("viewer");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const [activeNotesLead, setActiveNotesLead] = useState<MongoLead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setCurrentRole(data.currentRole || "viewer");
      }
    } catch {
      setErrorMsg("Failed to load leads list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function handleStatusChange(id: string, newStatus: LeadStatus) {
    if (currentRole !== "admin") {
      setErrorMsg("Permission Denied: Viewer accounts are read-only.");
      return;
    }

    setUpdatingId(id);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to update lead status.");
        return;
      }

      setLeads((prev) =>
        prev.map((l) => (l._id === id || l.id === id ? { ...l, status: newStatus } : l))
      );
    } catch {
      setErrorMsg("Network error updating status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleBookmark(id: string, currentVal: boolean) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBookmarked: !currentVal }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l._id === id || l.id === id ? { ...l, isBookmarked: !currentVal } : l))
        );
      }
    } catch {
      console.error("Failed to toggle bookmark");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleAddAdminNote(e: React.FormEvent) {
    e.preventDefault();
    if (!activeNotesLead || !newNoteText.trim()) return;

    const targetId = activeNotesLead._id || activeNotesLead.id || "";
    try {
      const res = await fetch(`/api/leads/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteText: newNoteText.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.lead) {
        setLeads((prev) =>
          prev.map((l) => (l._id === targetId || l.id === targetId ? data.lead : l))
        );
        setActiveNotesLead(data.lead);
        setNewNoteText("");
      }
    } catch {
      alert("Error saving note.");
    }
  }

  async function handleDeleteLead(id: string) {
    if (currentRole !== "admin") {
      setErrorMsg("Permission Denied: Viewer accounts cannot delete leads.");
      return;
    }

    if (!confirm("Are you sure you want to delete this lead?")) return;

    setUpdatingId(id);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to delete lead.");
        return;
      }

      setLeads((prev) => prev.filter((l) => l._id !== id && l.id !== id));
    } catch {
      setErrorMsg("Error deleting lead.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleArchiveLead(id: string, isArchivedVal: boolean) {
    if (currentRole !== "admin") {
      setErrorMsg("Permission Denied: Viewer accounts cannot archive leads.");
      return;
    }

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: isArchivedVal }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l._id === id || l.id === id ? { ...l, isArchived: isArchivedVal } : l))
        );
      }
    } catch {
      setErrorMsg("Error archiving lead.");
    } finally {
      setUpdatingId(null);
    }
  }

  const archivedCount = leads.filter((l) => l.isArchived).length;

  const filteredLeads = leads.filter((lead) => {
    if (lead.isArchived) return false;
    if (filterType !== "all" && lead.type !== filterType) return false;
    if (filterStatus !== "all" && lead.status !== filterStatus) return false;
    if (onlyBookmarked && !lead.isBookmarked) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(term);
      const matchPhone = lead.phone.toLowerCase().includes(term);
      const matchEmail = lead.email?.toLowerCase().includes(term) || false;
      const matchNotes = lead.notes?.toLowerCase().includes(term) || false;
      if (!matchName && !matchPhone && !matchEmail && !matchNotes) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            Leads & Customer Inquiries
          </h1>
          <p className="mt-1 text-sm text-muted">
            MongoDB lead store with bookmarks, internal admin notes, and status workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard/leads/archive"
            className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-foreground hover:bg-surface-2 transition-all"
          >
            📁 Archived Leads ({archivedCount}) →
          </a>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              currentRole === "admin"
                ? "bg-[#c8102e]/10 text-[#c8102e] border border-[#c8102e]/30"
                : "bg-primary/10 text-primary border border-primary/30"
            }`}
          >
            ROLE: {currentRole}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-[#c8102e]/40 bg-[#c8102e]/10 p-3.5 text-xs font-semibold text-[#c8102e] flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold text-sm">×</button>
        </div>
      )}

      {/* Toolbar & Search */}
      <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, phone, email, notes…"
            className="w-full sm:max-w-md rounded-xl border border-line bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />

          <button
            onClick={() => setOnlyBookmarked((v) => !v)}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
              onlyBookmarked
                ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-line bg-surface-2 text-muted hover:text-foreground"
            }`}
          >
            {onlyBookmarked ? "⭐ Showing Bookmarked Leads" : "☆ Show Bookmarked Only"}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Type:
            </label>
            <div className="flex rounded-xl bg-surface-2 p-1 border border-line text-xs font-semibold">
              {["all", "quote", "book", "contact"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`rounded-lg px-3 py-1.5 uppercase transition-all ${
                    filterType === t
                      ? "bg-foreground text-background font-bold shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Status:
            </label>
            <div className="flex rounded-xl bg-surface-2 p-1 border border-line text-xs font-semibold">
              {["all", "new", "contacted", "in_progress", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`rounded-lg px-3 py-1.5 uppercase transition-all ${
                    filterStatus === s
                      ? "bg-foreground text-background font-bold shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            Loading MongoDB leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            No leads found matching filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 uppercase font-bold text-muted border-b border-line">
                <tr>
                  <th className="px-4 py-4 text-center">⭐</th>
                  <th className="px-4 py-4">Inquiry</th>
                  <th className="px-6 py-4">Client Contact</th>
                  <th className="px-6 py-4">Request Specs</th>
                  <th className="px-6 py-4">Client Notes</th>
                  <th className="px-6 py-4">Status & Action</th>
                  <th className="px-4 py-4">Telegram</th>
                  <th className="px-4 py-4">Notes</th>
                  <th className="px-6 py-4">Date</th>
                  {currentRole === "admin" && <th className="px-6 py-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredLeads.map((lead) => {
                  const targetId = lead._id || lead.id || "";
                  return (
                    <tr key={targetId} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleBookmark(targetId, Boolean(lead.isBookmarked))}
                          className="text-base hover:scale-125 transition-transform"
                          title="Bookmark Lead"
                        >
                          {lead.isBookmarked ? "⭐" : "☆"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-surface-2 border border-line px-2.5 py-1 font-extrabold uppercase text-[10px]">
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{lead.name}</div>
                        <div className="text-muted text-[11px]">{lead.phone}</div>
                        {lead.email && <div className="text-muted text-[11px]">{lead.email}</div>}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {lead.propertyType && <div>Prop: <strong>{lead.propertyType}</strong></div>}
                        {lead.cameraCount && <div>Cams: <strong>{lead.cameraCount}</strong></div>}
                        {lead.preferredDate && <div>Date: <strong>{lead.preferredDate}</strong></div>}
                        {lead.service && <div>Service: <strong>{lead.service}</strong></div>}
                        {!lead.propertyType && !lead.cameraCount && !lead.service && "—"}
                      </td>
                      <td className="px-6 py-4 text-muted max-w-xs leading-relaxed">
                        {lead.notes || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {currentRole === "admin" ? (
                          <select
                            value={lead.status}
                            disabled={updatingId === targetId}
                            onChange={(e) => handleStatusChange(targetId, e.target.value as LeadStatus)}
                            className="rounded-lg border border-line bg-background px-2.5 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                          >
                            <option value="new">🔴 NEW</option>
                            <option value="contacted">🟡 CONTACTED</option>
                            <option value="in_progress">🔵 IN PROGRESS</option>
                            <option value="completed">🟢 COMPLETED</option>
                          </select>
                        ) : (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                              lead.status === "new"
                                ? "bg-[#c8102e]/10 text-[#c8102e]"
                                : lead.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {lead.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {lead.telegramSent ? (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" title="Sent via Telegram Bot">
                            ✈️ Sent
                          </span>
                        ) : lead.telegramError ? (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 border border-amber-500/30" title={lead.telegramError}>
                            ⚠️ Failed
                          </span>
                        ) : (
                          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-muted border border-line">
                            🕒 Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setActiveNotesLead(lead)}
                          className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary"
                        >
                          📝 ({lead.adminNotes?.length || 0})
                        </button>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      {currentRole === "admin" && (
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleArchiveLead(targetId, true)}
                            disabled={updatingId === targetId}
                            className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-surface transition-colors"
                            title="Move to Archived Leads"
                          >
                            📁 Archive
                          </button>
                          <button
                            onClick={() => handleDeleteLead(targetId)}
                            disabled={updatingId === targetId}
                            className="rounded-lg border border-[#c8102e]/30 px-2.5 py-1 text-[11px] font-bold text-[#c8102e] hover:bg-[#c8102e] hover:text-white transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Internal Admin Notes Modal */}
      {activeNotesLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Internal Notes — {activeNotesLead.name}
                </h3>
                <p className="text-xs text-muted">Client Phone: {activeNotesLead.phone}</p>
              </div>
              <button
                onClick={() => setActiveNotesLead(null)}
                className="font-bold text-muted hover:text-foreground text-lg"
              >
                ✕
              </button>
            </div>

            {/* Existing Notes List */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
              {!activeNotesLead.adminNotes || activeNotesLead.adminNotes.length === 0 ? (
                <p className="text-xs text-muted italic">No internal notes added yet.</p>
              ) : (
                activeNotesLead.adminNotes.map((n, i) => (
                  <div key={i} className="rounded-xl border border-line bg-surface-2 p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <strong className="text-primary">{n.author}</strong>
                      <span className="text-muted">{new Date(n.createdAt).toLocaleString("en-GB")}</span>
                    </div>
                    <p className="text-foreground leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddAdminNote} className="space-y-3 pt-2 border-t border-line">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write an internal note or update about this lead..."
                rows={3}
                required
                className="w-full rounded-xl border border-line bg-background p-3 text-xs text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNotesLead(null)}
                  className="rounded-xl border border-line bg-surface-2 px-4 py-2 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
