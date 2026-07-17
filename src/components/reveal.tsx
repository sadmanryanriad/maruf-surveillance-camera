"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fade + rise into view once. Respects prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  // Keep `initial`/`whileInView` constant so server and client render the same
  // markup (useReducedMotion is null on the server). Reduced motion only
  // collapses the timing to instant.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduced ? 0 : 0.6, ease, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
