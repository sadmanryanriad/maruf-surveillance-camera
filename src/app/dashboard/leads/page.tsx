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
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
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

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="/dashboard/leads/archive"
            className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-foreground hover:bg-surface-2 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            📁 Archived Leads ({archivedCount}) →
          </a>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
              currentRole === "admin"
                ? "bg-[#c8102e]/10 text-[#c8102e] border border-[#c8102e]/30"
                : "bg-primary/10 text-primary border border-primary/30"
            }`}
          >
            ROLE: {currentRole}
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search leads by name, phone, email, notes…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-xl border border-line bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              onlyBookmarked
                ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-line bg-background text-muted hover:text-foreground"
            }`}
          >
            ★ Show Bookmarked Only
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line text-xs font-semibold">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted uppercase text-[10px] tracking-wider font-bold">Type:</span>
            {["all", "quote", "book", "contact"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-full px-3 py-1 uppercase text-[11px] font-bold transition-colors ${
                  filterType === t
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted uppercase text-[10px] tracking-wider font-bold">Status:</span>
            {["all", "new", "contacted", "in_progress", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-full px-3 py-1 uppercase text-[11px] font-bold transition-colors ${
                  filterStatus === s
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-[#c8102e]/30 bg-[#c8102e]/10 p-3.5 text-xs font-medium text-[#c8102e]">
          {errorMsg}
        </div>
      )}

      {/* Main Leads Table */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            Loading leads database…
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            No matching leads found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 uppercase font-bold text-muted border-b border-line">
                <tr>
                  <th className="px-3 py-4 text-center">★</th>
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
                  const isTooltipOpen = activeTooltipId === targetId;

                  return (
                    <tr key={targetId} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-3 py-4 text-center">
                        <button
                          onClick={() => handleToggleBookmark(targetId, !!lead.isBookmarked)}
                          className={`text-base transition-transform hover:scale-125 ${
                            lead.isBookmarked ? "text-amber-500" : "text-muted/40 hover:text-amber-500"
                          }`}
                          title={lead.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                        >
                          ★
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 font-extrabold uppercase text-[10px] whitespace-nowrap ${
                            lead.type === "quote"
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : lead.type === "book"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-surface-2 text-foreground border border-line"
                          }`}
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{lead.name}</div>
                        <div className="text-muted text-[11px] font-mono whitespace-nowrap">{lead.phone}</div>
                        {lead.email && <div className="text-muted text-[11px]">{lead.email}</div>}
                      </td>
                      <td className="px-6 py-4 text-muted min-w-[140px]">
                        <div>
                          {lead.propertyType && <div>Prop: <strong>{lead.propertyType}</strong></div>}
                          {lead.cameraCount && <div>Cams: <strong>{lead.cameraCount}</strong></div>}
                          {lead.service && <div>Service: <strong>{lead.service}</strong></div>}
                          {!lead.propertyType && !lead.service && "—"}
                        </div>
                      </td>

                      {/* Client Notes Column with Non-Overlapping Interactive Tooltip */}
                      <td className="px-6 py-4 max-w-xs relative">
                        <div
                          title={lead.notes}
                          onMouseEnter={() => setActiveTooltipId(targetId)}
                          onMouseLeave={() => setActiveTooltipId(null)}
                          className="line-clamp-2 leading-relaxed text-foreground cursor-help"
                        >
                          {lead.notes || "—"}
                        </div>

                        {/* Interactive Tooltip Card cleanly positioned below text */}
                        {isTooltipOpen && lead.notes && lead.notes.length > 20 && (
                          <div className="absolute top-full mt-1.5 left-2 z-[99] w-72 rounded-2xl border border-primary/40 bg-surface p-4 text-xs shadow-2xl text-foreground leading-relaxed transition-all pointer-events-none">
                            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-primary mb-1.5">
                              <span>💬</span> Full Client Note:
                            </div>
                            <p className="whitespace-normal break-words text-foreground font-normal">
                              {lead.notes}
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {currentRole === "admin" ? (
                          <select
                            value={lead.status}
                            disabled={updatingId === targetId}
                            onChange={(e) => handleStatusChange(targetId, e.target.value as LeadStatus)}
                            className="rounded-xl border border-line bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none shadow-xs cursor-pointer"
                          >
                            <option value="new">🔴 NEW</option>
                            <option value="contacted">🟡 CONTACTED</option>
                            <option value="in_progress">🔵 IN PROGRESS</option>
                            <option value="completed">🟢 COMPLETED</option>
                          </select>
                        ) : (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase whitespace-nowrap ${
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

                      {/* Single Line Telegram Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {lead.telegramSent ? (
                          <span
                            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                            title="Sent via Telegram Bot"
                          >
                            <span>✈️</span>
                            <span>SENT</span>
                          </span>
                        ) : lead.telegramError ? (
                          <span
                            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-amber-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs"
                            title={lead.telegramError}
                          >
                            <span>⚠️</span>
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-surface-2 px-3 py-1.5 text-[10px] font-extrabold uppercase text-muted border border-line shadow-xs">
                            <span>🕒</span>
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => setActiveNotesLead(lead)}
                          className="rounded-xl border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary transition-colors whitespace-nowrap"
                        >
                          📝 ({lead.adminNotes?.length || 0})
                        </button>
                      </td>
                      <td className="px-6 py-4 text-muted font-mono whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      {currentRole === "admin" && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleArchiveLead(targetId, true)}
                            disabled={updatingId === targetId}
                            className="rounded-xl border border-line bg-surface-2 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                            title="Move to Archived Leads"
                          >
                            📁 Archive
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

            <div className="max-h-60 overflow-y-auto space-y-3 p-1">
              {!activeNotesLead.adminNotes || activeNotesLead.adminNotes.length === 0 ? (
                <p className="text-xs text-muted italic text-center py-4">
                  No internal notes added yet.
                </p>
              ) : (
                activeNotesLead.adminNotes.map((n, idx) => (
                  <div key={idx} className="rounded-xl border border-line bg-surface-2 p-3 text-xs space-y-1">
                    <div className="flex justify-between text-[10px] text-muted font-mono">
                      <span><strong>{n.author}</strong></span>
                      <span>{new Date(n.createdAt).toLocaleString("en-GB")}</span>
                    </div>
                    <p className="text-foreground leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            {currentRole === "admin" && (
              <form onSubmit={handleAddAdminNote} className="space-y-2 pt-2 border-t border-line">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type an internal note about this client or site survey…"
                  rows={3}
                  className="w-full rounded-xl border border-line bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveNotesLead(null)}
                    className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary/90"
                  >
                    Add Internal Note
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
