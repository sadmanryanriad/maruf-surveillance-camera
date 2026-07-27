"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { testimonials } from "@/lib/site";
import { SectionHeading } from "./section-heading";

export function Testimonials() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const count = testimonials.length;
  const active = testimonials[i];
  const initials = active.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const go = (n: number) => setI(((n % count) + count) % count);

  return (
    <section id="reviews" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="What our clients say"
          align="center"
        />

        <div className="relative mt-12 overflow-hidden rounded-[20px] border border-line bg-surface-2 p-8 sm:p-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:gap-10 items-start">
            {/* Red quote mark */}
            <div className="font-serif italic text-5xl sm:text-7xl font-bold text-[#c8102e] leading-none select-none">
              “
            </div>

            {/* Content area with fixed relative min-height to prevent resizing jump */}
            <div className="flex flex-col justify-between min-h-[220px] sm:min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col justify-between flex-1"
                >
                  <p className="font-serif italic text-lg sm:text-2xl leading-relaxed text-foreground mb-6">
                    {active.quote}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-5 mt-auto">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground font-sans font-bold text-sm text-background">
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm sm:text-base">
                          {active.name}
                        </div>
                        <div className="text-xs sm:text-sm text-muted">
                          {active.role}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5 items-center">
                        {testimonials.map((_, n) => (
                          <button
                            key={n}
                            onClick={() => go(n)}
                            aria-label={`Go to review ${n + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              n === i ? "w-5 bg-primary" : "w-2 bg-line"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => go(i - 1)}
                          aria-label="Previous review"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => go(i + 1)}
                          aria-label="Next review"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
