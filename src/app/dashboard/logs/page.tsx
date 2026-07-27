"use client";

import { useEffect, useState } from "react";

interface LogItem {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: "admin" | "viewer";
  action: string;
  details: string;
  createdAt: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");

  async function fetchLogs() {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {
      console.error("Failed to load activity logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (roleFilter !== "all" && log.userRole !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            Activity & Audit Logs
          </h1>
          <p className="mt-1 text-sm text-muted">
            Real-time audit trail of actions performed by Admin and Viewer console accounts.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-foreground hover:bg-surface-2 transition-all"
        >
          🔄 Refresh Logs
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <label className="text-xs font-bold uppercase tracking-wider text-muted">
          Filter by Role:
        </label>
        <div className="flex rounded-xl bg-surface-2 p-1 border border-line text-xs font-semibold">
          {["all", "admin", "viewer"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-lg px-3 py-1.5 uppercase transition-all ${
                roleFilter === r
                  ? "bg-foreground text-background font-bold shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            Loading activity logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted">
            No audit log entries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 uppercase font-bold text-muted border-b border-line">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Console User</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="px-6 py-4 text-muted font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-GB")}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      <div>{log.userName}</div>
                      <div className="text-muted text-[11px] font-normal">{log.userEmail}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          log.userRole === "admin"
                            ? "bg-[#c8102e]/10 text-[#c8102e]"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {log.userRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-foreground">
                      <span className="rounded-lg bg-surface-2 border border-line px-2 py-1 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted leading-relaxed max-w-md">
                      {log.details}
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
