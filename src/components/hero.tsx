"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const POSTER = "https://assets.mixkit.co/videos/23028/23028-thumb-720-0.jpg";
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate min-h-[85vh] flex items-center overflow-hidden bg-slate-950 pt-20 pb-20 sm:pt-28 sm:pb-28 text-white" aria-label="Introduction">
      {/* Full-width Background Video */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <video
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
              el.setAttribute("muted", "");
              el.setAttribute("playsinline", "");
              const p = el.play();
              if (p !== undefined) {
                p.catch(() => {
                  document.addEventListener("click", () => el.play(), { once: true });
                });
              }
            }
          }}
          className="h-full w-full object-cover opacity-75 dark:opacity-85 filter brightness-95 contrast-105 scale-105 transition-opacity duration-500"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/hero-surveillance.mp4" type="video/mp4" />
        </video>

        {/* High-legibility Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />
        <div className="bg-grid-feed animate-gridpan absolute inset-0 opacity-25 pointer-events-none" />

        {/* Scanline Sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-scan absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent via-[rgba(34,211,238,.18)] to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 w-full">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
          className="max-w-2xl"
        >
          {/* Live Feed Badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-live absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff4d4d]" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7de8f5]">
              LIVE FEED · SEE IT IN ACTION
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]"
          >
            Your property, watched
            <br />
            in <span className="text-[#22d3ee]">real time</span>.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 font-sans"
          >
            Crisp day-and-night footage, streamed to your phone and backed up the moment it&apos;s captured. This is what peace of mind looks like.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 rounded-full bg-[#22d3ee] px-7 py-3.5 text-sm font-bold text-[#04222b] transition-all hover:bg-[#7de8f5] shadow-lg shadow-[#22d3ee]/20"
            >
              Get a free quote
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-white/20"
            >
              Book a survey
            </Link>
          </motion.div>

          {/* Trust Stats */}
          <motion.dl
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-7"
          >
            {[
              { k: "500+", v: "Systems installed" },
              { k: "24/7", v: "Active monitoring" },
              { k: "4K", v: "Ultra-HD clarity" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-3xl font-extrabold tracking-tight text-white">
                  {s.k}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-white/70 font-sans">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
