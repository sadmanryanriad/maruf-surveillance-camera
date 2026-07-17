"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Field, TextArea } from "./ui/field";
import { Button } from "./ui/button";

export function ContactForm() {
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
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start gap-4 rounded-2xl border border-primary/40 bg-surface p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-primary-strong">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            <h3 className="font-display text-xl font-semibold">Message received.</h3>
            <p className="text-sm text-muted">
              Thanks for reaching out — we&apos;ll be in touch within one business day.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>
              Send another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="c-name" name="name" label="Name" placeholder="Jordan Rivera" required />
              <Field id="c-email" name="email" type="email" label="Email" placeholder="you@email.com" required />
            </div>
            <Field id="c-phone" name="phone" label="Phone (optional)" placeholder="+1 (555) 000-0000" />
            <TextArea id="c-message" name="message" label="How can we help?" rows={4} placeholder="Tell us about your property and what you'd like to protect…" required />
            <Button type="submit" size="lg" disabled={sending} className="justify-self-start">
              {sending ? "Sending…" : "Send message"}
              {!sending && <span aria-hidden>→</span>}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
