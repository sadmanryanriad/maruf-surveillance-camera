"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("maruf@gmail.com");
  const [password, setPassword] = useState("Changeme123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email address and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Login failed. Please check your credentials.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-block mb-3">
            <Logo className="h-10 w-auto" />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Console Sign In
          </h1>
          <p className="mt-2 text-sm text-muted">
            Admin portal for Maruf Security Systems.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maruf@gmail.com"
                required
                autoFocus
                className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 shadow-md"
            >
              {loading ? "Signing In..." : "Sign In to Admin Portal"}
            </Button>
          </form>

          {errorMsg && (
            <div className="mt-5 rounded-xl border border-[#c8102e]/30 bg-[#c8102e]/10 p-3.5 text-xs font-medium text-[#c8102e]">
              {errorMsg}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-4 text-center">
            <p className="text-[11px] text-muted">
              Default Admin: <strong className="text-foreground">maruf@gmail.com</strong> | Password: <strong className="text-foreground">Changeme123</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
