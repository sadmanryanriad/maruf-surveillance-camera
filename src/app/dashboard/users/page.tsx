"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserItem {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
  createdAt: string;
}

export default function UsersAndSettingsPage() {
  const [currentRole, setCurrentRole] = useState<"admin" | "viewer">("viewer");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [chatIds, setChatIds] = useState<string[]>([]);
  const [newChatId, setNewChatId] = useState("");
  const [loading, setLoading] = useState(true);

  // Site Contact Details & WhatsApp state
  const [contactPhone, setContactPhone] = useState("+880 1790-424860");
  const [contactEmail, setContactEmail] = useState("hello@maruf-security.com");
  const [contactAddress, setContactAddress] = useState("24 Watchtower Ave, Suite 300, Metro City");
  const [contactHours, setContactHours] = useState("Mon-Sat · 8am-8pm");
  const [whatsappNumber, setWhatsappNumber] = useState("8801790424860");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Create user state
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "viewer">("viewer");
  const [userMsg, setUserMsg] = useState<{ text: string; isError: boolean } | null>(null);

  async function loadData() {
    try {
      const [uRes, tRes, sRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/settings/telegram"),
        fetch("/api/settings"),
      ]);

      if (uRes.ok) {
        const data = await uRes.json();
        setUsers(data.users || []);
        setCurrentRole(data.currentRole || "viewer");
      }

      if (tRes.ok) {
        const tData = await tRes.json();
        setChatIds(tData.telegramChatIds || []);
      }

      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.setting) {
          setContactPhone(sData.setting.phone || "+880 1790-424860");
          setContactEmail(sData.setting.email || "hello@maruf-security.com");
          setContactAddress(sData.setting.address || "24 Watchtower Ave, Suite 300, Metro City");
          setContactHours(sData.setting.hours || "Mon-Sat · 8am-8pm");
          setWhatsappNumber(sData.setting.whatsappNumber || "8801790424860");
        }
      }
    } catch {
      console.error("Failed to load users & settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleSaveClick(e: React.FormEvent) {
    e.preventDefault();
    setConfirmModalOpen(true);
  }

  async function confirmSaveContactInfo() {
    setConfirmModalOpen(false);
    setSavingContact(true);

    const toastId = toast.loading("Saving public site contact details...");

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: contactPhone,
          email: contactEmail,
          address: contactAddress,
          hours: contactHours,
          whatsappNumber: whatsappNumber,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update contact info.", { id: toastId });
        return;
      }

      toast.success("Site contact details & floating WhatsApp updated live!", { id: toastId });
    } catch {
      toast.error("Network error updating contact info.", { id: toastId });
    } finally {
      setSavingContact(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPwdMsg({ text: data.error || "Password change failed.", isError: true });
        return;
      }

      setPwdMsg({ text: "Password updated successfully!", isError: false });
      setOldPassword("");
      setNewPassword("");
      toast.success("Password updated successfully!");
    } catch {
      setPwdMsg({ text: "Error changing password.", isError: true });
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setUserMsg(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail.trim(),
          name: newUserName.trim(),
          password: newUserPassword.trim(),
          role: newUserRole,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setUserMsg({ text: data.error || "Failed to create user.", isError: true });
        toast.error(data.error || "Failed to create user.");
        return;
      }

      setUserMsg({ text: `User ${newUserEmail} created successfully!`, isError: false });
      toast.success(`User ${newUserEmail} created!`);
      setNewUserEmail("");
      setNewUserName("");
      setNewUserPassword("");
      loadData();
    } catch {
      setUserMsg({ text: "Error creating user.", isError: true });
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete user.");
        return;
      }

      toast.success("User deleted.");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Error deleting user.");
    }
  }

  async function handleAddChatId(e: React.FormEvent) {
    e.preventDefault();
    if (!newChatId.trim()) return;

    const updated = Array.from(new Set([...chatIds, newChatId.trim()]));
    try {
      const res = await fetch("/api/settings/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramChatIds: updated }),
      });
      const data = await res.json();

      if (res.ok) {
        setChatIds(data.telegramChatIds || updated);
        setNewChatId("");
        toast.success("Telegram Chat ID added!");
      }
    } catch {
      toast.error("Failed to update Telegram Chat IDs.");
    }
  }

  async function handleRemoveChatId(idToRemove: string) {
    const updated = chatIds.filter((id) => id !== idToRemove);
    try {
      const res = await fetch("/api/settings/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramChatIds: updated }),
      });
      const data = await res.json();

      if (res.ok) {
        setChatIds(data.telegramChatIds || updated);
        toast.success("Telegram Chat ID removed.");
      }
    } catch {
      toast.error("Failed to remove Telegram Chat ID.");
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
          Users & Security Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage site contact details, system administrators, password security, and Telegram notifications.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Manage Site Contact Information & Live Preview */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Site Contact Information
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Update phone, email, address, hours, and floating WhatsApp number.
            </p>
          </div>

          <form onSubmit={handleSaveClick} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                disabled={currentRole !== "admin"}
                onChange={(e) => setContactPhone(e.target.value)}
                required
                className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                disabled={currentRole !== "admin"}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Office / Visit Address
              </label>
              <input
                type="text"
                value={contactAddress}
                disabled={currentRole !== "admin"}
                onChange={(e) => setContactAddress(e.target.value)}
                required
                className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Working Hours
              </label>
              <input
                type="text"
                value={contactHours}
                disabled={currentRole !== "admin"}
                onChange={(e) => setContactHours(e.target.value)}
                required
                className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Floating WhatsApp Phone Number (Digits Only)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                disabled={currentRole !== "admin"}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="8801790424860"
                required
                className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
              />
            </div>

            {currentRole === "admin" && (
              <button
                type="submit"
                disabled={savingContact}
                className="rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-60"
              >
                {savingContact ? "Saving..." : "Save Contact Info"}
              </button>
            )}
          </form>

          {/* Live Site Preview Component */}
          <div className="pt-4 border-t border-line space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-primary">
              🖥️ Live Site Contact Card Preview:
            </span>
            <div className="rounded-2xl border border-primary/30 bg-surface-2 p-5 shadow-inner space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-2 border-primary/50 pl-3">
                  <span className="block text-[10px] font-bold text-muted uppercase">CALL</span>
                  <span className="font-semibold text-foreground">{contactPhone}</span>
                </div>
                <div className="border-l-2 border-primary/50 pl-3">
                  <span className="block text-[10px] font-bold text-muted uppercase">EMAIL</span>
                  <span className="font-semibold text-foreground truncate block">{contactEmail}</span>
                </div>
                <div className="border-l-2 border-primary/50 pl-3">
                  <span className="block text-[10px] font-bold text-muted uppercase">VISIT</span>
                  <span className="font-semibold text-foreground">{contactAddress}</span>
                </div>
                <div className="border-l-2 border-primary/50 pl-3">
                  <span className="block text-[10px] font-bold text-muted uppercase">HOURS</span>
                  <span className="font-semibold text-foreground">{contactHours}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-line text-[11px] text-muted">
                <span>Floating WhatsApp Button Target:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  https://wa.me/{whatsappNumber.replace(/[^0-9]/g, "")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Self Password Card */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-5">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Change My Password
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Update your account password securely.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                New Password (min 6 chars)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              Update Password
            </button>

            {pwdMsg && (
              <div
                className={`rounded-xl border p-3 text-xs font-medium ${
                  pwdMsg.isError
                    ? "border-[#c8102e]/30 bg-[#c8102e]/10 text-[#c8102e]"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {pwdMsg.text}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Telegram Notification Chat IDs Settings */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-5">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Telegram Notification Routing
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Target Telegram Chat IDs to receive real-time lead alerts from website forms.
          </p>
        </div>

        {currentRole === "admin" ? (
          <form onSubmit={handleAddChatId} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newChatId}
              onChange={(e) => setNewChatId(e.target.value)}
              placeholder="Enter Chat ID (e.g. 1240674937)"
              className="flex-1 rounded-xl border border-line bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/90"
            >
              Add ID
            </button>
          </form>
        ) : (
          <p className="text-xs text-muted">
            Only Admin accounts can add or remove Telegram Chat IDs.
          </p>
        )}

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted">
            Active Telegram Chat Recipients ({chatIds.length}):
          </label>
          {chatIds.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-surface-2 p-4 text-center text-xs font-semibold text-muted">
              No Telegram Chat IDs configured yet. Add a Chat ID above to enable real-time lead alerts.
            </div>
          ) : (
            <div className="space-y-2 max-w-md">
              {chatIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3.5 py-2 text-xs font-mono font-semibold text-foreground"
                >
                  <span>🆔 {id}</span>
                  {currentRole === "admin" && (
                    <button
                      onClick={() => handleRemoveChatId(id)}
                      className="text-[11px] font-bold text-[#c8102e] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin User Management Section */}
      {currentRole === "admin" && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create User Form */}
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-5">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Create New Console User
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Add an Admin or Viewer account to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Account Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as "admin" | "viewer")}
                  className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="admin">ADMIN (Full Access)</option>
                  <option value="viewer">VIEWER (Read Only)</option>
                </select>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sm"
              >
                Create Account
              </button>

              {userMsg && (
                <div
                  className={`rounded-xl border p-3 text-xs font-medium ${
                    userMsg.isError
                      ? "border-[#c8102e]/30 bg-[#c8102e]/10 text-[#c8102e]"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {userMsg.text}
                </div>
              )}
            </form>
          </div>

          {/* Console Users List */}
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-5">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Registered Console Accounts
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Active administrators and viewers in MongoDB database.
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-muted">Loading users list...</div>
            ) : (
              <div className="divide-y divide-line rounded-xl border border-line overflow-hidden">
                {users.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <div className="font-bold text-foreground">{u.name}</div>
                      <div className="text-muted text-[11px]">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          u.role === "admin"
                            ? "bg-[#c8102e]/10 text-[#c8102e]"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {u.role}
                      </span>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-[11px] font-bold text-[#c8102e] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">
              Confirm Contact Details Update
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Are you sure you want to update the public site contact details and WhatsApp floating button link across the live website?
            </p>
            <div className="rounded-xl bg-surface-2 border border-line p-3 text-xs space-y-1">
              <div>📞 Phone: <strong>{contactPhone}</strong></div>
              <div>✉ Email: <strong>{contactEmail}</strong></div>
              <div>💬 WhatsApp: <strong>{whatsappNumber}</strong></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="rounded-xl border border-line bg-surface-2 px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSaveContactInfo}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
              >
                Yes, Update Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
