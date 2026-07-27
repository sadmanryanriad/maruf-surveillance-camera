"use client";

import { brands } from "@/lib/site";
import { motion } from "motion/react";

/** Infinite brand strip after the hero. */
export function Marquee() {
  const items = [...brands, ...brands];
  return (
    <section className="relative border-y border-line bg-surface/40 py-8">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-muted">
        Certified installers of the brands you trust
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max hover:[&>div]:![animation-play-state:paused]">
          <motion.div
            animate={{ x: "-100%" }}
            transition={{ ease: "linear", duration: 32, repeat: Infinity }}
            className="flex shrink-0 items-center gap-16 pr-16"
          >
            {items.map((b, i) => (
              <span
                key={`a-${i}`}
                className="whitespace-nowrap text-xl font-medium text-muted/70"
              >
                {b}
              </span>
            ))}
          </motion.div>
          <motion.div
            aria-hidden
            animate={{ x: "-100%" }}
            transition={{ ease: "linear", duration: 32, repeat: Infinity }}
            className="flex shrink-0 items-center gap-16 pr-16"
          >
            {items.map((b, i) => (
              <span
                key={`b-${i}`}
                className="whitespace-nowrap text-xl font-medium text-muted/70"
              >
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
