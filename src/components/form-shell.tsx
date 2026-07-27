"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";

export function FormShell({
  children,
  submitLabel,
  successTitle,
  successBody,
  formType = "quote",
}: {
  children: ReactNode;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  formType?: "quote" | "book" | "contact";
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = (formData.get("name") as string) || "Inquirer";
      const email = (formData.get("email") as string) || "";
      const phone = (formData.get("phone") as string) || "N/A";
      const propertyType = (formData.get("propertyType") as string) || "";
      const cameraCount = (formData.get("cameras") as string) || "";
      const service = (formData.get("service") as string) || "";
      const preferredDate = (formData.get("date") as string) || "";
      const notes = (formData.get("notes") as string) || (formData.get("address") as string) || "";

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          name,
          email,
          phone,
          propertyType,
          cameraCount,
          preferredDate,
          service,
          notes,
        }),
      });
    } catch (err) {
      console.error("Failed to submit lead to API:", err);
    } finally {
      setSending(false);
      setSent(true);
    }
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
