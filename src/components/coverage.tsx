"use client";

import { useState } from "react";
import { coverageCams } from "@/lib/site";
import { Reveal } from "./reveal";

const bullets = [
  "Overlapping fields eliminate blind spots at entries",
  "Optimized placement means fewer cameras, lower cost",
  "Documented coverage plan handed to you at closeout",
];

export function Coverage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="coverage" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Copy */}
        <Reveal>
          <p className="hud mb-4 text-primary-strong">// Coverage design</p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Every angle mapped before we mount a thing.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            We model your property and simulate each camera&apos;s field of view — so you
            get total coverage with zero blind spots and no wasted hardware.{" "}
            <span className="text-foreground">Hover a camera to see its cone.</span>
          </p>
          <ul className="mt-7 space-y-3.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-foreground/85">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Floor plan (dark panel in both themes so cyan cones pop) */}
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_120%_at_30%_10%,#0e1a24,#080c12)] p-3.5 shadow-[0_30px_70px_rgba(0,0,0,.45)]">
            <svg viewBox="0 0 480 360" className="block h-auto w-full">
              <defs>
                <pattern id="fp" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M30 0H0V30" fill="none" stroke="rgba(34,211,238,.07)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="480" height="360" fill="url(#fp)" />

              {/* walls */}
              <g stroke="#2b3d4e" strokeWidth="3" fill="none" strokeLinejoin="round">
                <rect x="40" y="40" width="400" height="280" rx="4" />
                <path d="M40 160 H210 V40" />
                <path d="M210 160 H320 M320 160 V320" />
                <path d="M320 210 H440" />
              </g>
              <g fill="#4d5f70" fontSize="12" fontFamily="var(--font-display), sans-serif">
                <text x="120" y="110">LOBBY</text>
                <text x="255" y="110">OFFICE</text>
                <text x="120" y="250">FLOOR</text>
                <text x="370" y="270">DOCK</text>
              </g>

              {coverageCams.map((c, idx) => {
                const hov = hovered === idx;
                const a = (c.dir * Math.PI) / 180;
                const half = (c.spread * Math.PI) / 180;
                const p1x = c.x + Math.cos(a - half) * c.reach;
                const p1y = c.y + Math.sin(a - half) * c.reach;
                const p2x = c.x + Math.cos(a + half) * c.reach;
                const p2y = c.y + Math.sin(a + half) * c.reach;
                const r = (n: number) => Math.round(n * 10) / 10;
                return (
                  <g key={idx}>
                    <polygon
                      points={`${c.x},${c.y} ${r(p1x)},${r(p1y)} ${r(p2x)},${r(p2y)}`}
                      fill="#22d3ee"
                      stroke="#22d3ee"
                      style={{
                        opacity: hov ? 0.32 : 0.12,
                        strokeWidth: hov ? 1.5 : 0.5,
                        transition: "opacity .3s, stroke-width .3s",
                        pointerEvents: "none",
                      }}
                    />
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={16}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHovered(idx)}
                      onMouseLeave={() => setHovered(null)}
                    />
                    <circle cx={c.x} cy={c.y} r={6} fill="#22d3ee" />
                  </g>
                );
              })}
            </svg>
            <div className="hud absolute bottom-5 left-5 text-white/45">
              Live coverage plan · {coverageCams.length} cameras
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
