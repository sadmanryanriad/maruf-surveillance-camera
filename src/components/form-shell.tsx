"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";

export function FormShell({
  children,
  submitLabel,
  successTitle,
  successBody,
}: {
  children: ReactNode;
  submitLabel: string;
  successTitle: string;
  successBody: string;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // Demo only — no data leaves the browser.
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-4 rounded-2xl border border-primary/40 bg-surface p-8"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-primary-strong">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          <h3 className="font-display text-xl font-semibold">{successTitle}</h3>
          <p className="text-sm text-muted">{successBody}</p>
          <Button variant="outline" onClick={() => setSent(false)}>
            Start over
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8"
        >
          {children}
          <Button type="submit" size="lg" disabled={sending} className="justify-self-start">
            {sending ? "Sending…" : submitLabel}
            {!sending && <span aria-hidden>→</span>}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
