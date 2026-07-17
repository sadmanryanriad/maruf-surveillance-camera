"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { testimonials } from "@/lib/site";
import { SectionHeading } from "./section-heading";

export function Testimonials() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const count = testimonials.length;
  const active = testimonials[i];
  const initials = active.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  const go = (n: number) => setI(((n % count) + count) % count);

  // Autoplay, paused when the tab is hidden.
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setI((v) => (v + 1) % count);
    }, 6000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section id="reviews" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="// Trusted locally" title="What clients say" align="center" />

        <div className="relative mt-12 min-h-[16rem] overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-11">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary/50" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 7H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2M20 7h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2" />
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mt-5 font-display text-xl leading-relaxed sm:text-2xl">
                {active.quote}
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] font-display font-bold text-primary-strong">
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold">{active.name}</div>
                    <div className="text-sm text-muted">{active.role}</div>
                  </div>
                </div>
                <div className="text-[var(--rating)]" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, n) => (
                <button
                  key={n}
                  onClick={() => go(n)}
                  aria-label={`Go to review ${n + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    n === i ? "w-6 bg-primary" : "w-2 bg-line"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go(i - 1)}
                aria-label="Previous review"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line transition-colors hover:border-primary hover:text-primary-strong"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button
                onClick={() => go(i + 1)}
                aria-label="Next review"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line transition-colors hover:border-primary hover:text-primary-strong"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
