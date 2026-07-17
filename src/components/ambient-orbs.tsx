"use client";

import { motion, useReducedMotion } from "motion/react";

type Orb = {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color: string;
  delay?: number;
  duration?: number;
};

const DEFAULT_ORBS: Orb[] = [
  { size: 420, top: "-6rem", right: "-8rem", color: "var(--primary-glow)", duration: 14 },
  { size: 300, bottom: "-4rem", left: "-6rem", color: "#6aa8ff", duration: 18, delay: 1 },
  { size: 180, top: "40%", left: "55%", color: "var(--primary)", duration: 12, delay: 0.5 },
];

/** Slow, blurred colour orbs drifting behind content. Purely decorative. */
export function AmbientOrbs({
  orbs = DEFAULT_ORBS,
  className = "",
}: {
  orbs?: Orb[];
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {orbs.map((o, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            background: `radial-gradient(circle, ${o.color}, transparent 68%)`,
            opacity: 0.16,
          }}
          animate={
            reduced
              ? undefined
              : { y: [0, -24, 0], x: [0, 14, 0], scale: [1, 1.08, 1] }
          }
          transition={{
            duration: o.duration ?? 14,
            delay: o.delay ?? 0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
