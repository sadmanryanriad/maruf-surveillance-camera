"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  createdAt: string;
}

export default function ArchivedLeadsPage() {
  const [archivedLeads, setArchivedLeads] = useState<MongoLead[]>([]);
  const [currentRole, setCurrentRole] = useState<"admin" | "viewer">("viewer");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        const all: MongoLead[] = data.leads || [];
        setArchivedLeads(all.filter((l) => l.isArchived));
        setCurrentRole(data.currentRole || "viewer");
      }
    } catch {
      console.error("Failed to load archived leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function handleRestoreLead(id: string) {
    if (currentRole !== "admin") return;
    setUpdatingId(id);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: false }),
      });

      if (res.ok) {
        setArchivedLeads((prev) => prev.filter((l) => l._id !== id && l.id !== id));
      }
    } catch {
      alert("Error restoring lead.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteLead(id: string) {
    if (currentRole !== "admin") return;
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;
    setUpdatingId(id);

    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArchivedLeads((prev) => prev.filter((l) => l._id !== id && l.id !== id));
      }
    } catch {
      alert("Error deleting lead.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            📁 Archived Leads
          </h1>
          <p className="mt-1 text-sm text-muted">
            Stored historical inquiries removed from the active leads dashboard.
          </p>
        </div>

        <Link
          href="/dashboard/leads"
          className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          ← Back to Active Leads
        </Link>
      </div>

      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            Loading archived leads…
          </div>
        ) : archivedLeads.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            No archived leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 uppercase font-bold text-muted border-b border-line">
                <tr>
                  <th className="px-4 py-4">Inquiry</th>
                  <th className="px-6 py-4">Client Contact</th>
                  <th className="px-6 py-4">Request Specs</th>
                  <th className="px-6 py-4">Client Notes</th>
                  <th className="px-6 py-4">Date</th>
                  {currentRole === "admin" && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {archivedLeads.map((lead) => {
                  const targetId = lead._id || lead.id || "";
                  return (
                    <tr key={targetId} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-surface-2 border border-line px-2.5 py-1 font-extrabold uppercase text-[10px]">
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{lead.name}</div>
                        <div className="text-muted text-[11px] font-mono">{lead.phone}</div>
                        {lead.email && <div className="text-muted text-[11px]">{lead.email}</div>}
                      </td>
                      <td className="px-6 py-4 text-muted relative group">
                        <div className="line-clamp-2">
                          {lead.propertyType && <div>Prop: <strong>{lead.propertyType}</strong></div>}
                          {lead.cameraCount && <div>Cams: <strong>{lead.cameraCount}</strong></div>}
                          {lead.service && <div>Service: <strong>{lead.service}</strong></div>}
                          {!lead.propertyType && !lead.service && "—"}
                        </div>
                        {(lead.propertyType || lead.service) && (
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-64 rounded-xl border border-line bg-surface p-3 text-xs shadow-2xl text-foreground leading-relaxed pointer-events-none">
                            <span className="block font-bold text-[10px] uppercase text-primary mb-1">📋 Request Specs:</span>
                            {lead.propertyType && <div>Property: <strong>{lead.propertyType}</strong></div>}
                            {lead.cameraCount && <div>Cameras: <strong>{lead.cameraCount}</strong></div>}
                            {lead.preferredDate && <div>Preferred Date: <strong>{lead.preferredDate}</strong></div>}
                            {lead.service && <div>Service: <strong>{lead.service}</strong></div>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-xs relative group">
                        <div className="line-clamp-2 leading-relaxed text-foreground cursor-help">
                          {lead.notes || "—"}
                        </div>
                        {lead.notes && lead.notes.length > 20 && (
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-72 rounded-xl border border-line bg-surface p-3 text-xs shadow-2xl text-foreground leading-relaxed pointer-events-none transition-all">
                            <span className="block font-bold text-[10px] uppercase text-primary mb-1">💬 Full Client Note:</span>
                            {lead.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted font-mono">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      {currentRole === "admin" && (
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleRestoreLead(targetId)}
                            disabled={updatingId === targetId}
                            className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          >
                            ↩ Restore
                          </button>
                          <button
                            onClick={() => handleDeleteLead(targetId)}
                            disabled={updatingId === targetId}
                            className="rounded-xl border border-[#c8102e]/30 px-3 py-1.5 text-xs font-bold text-[#c8102e] hover:bg-[#c8102e] hover:text-white transition-all shadow-sm"
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
    </div>
  );
}
