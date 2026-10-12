"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  return (
    <section className="relative isolate min-h-[85vh] flex items-center overflow-hidden bg-slate-950 pt-20 pb-20 sm:pt-28 sm:pb-28 text-white" aria-label="Introduction">
      {/* Background Hero Image */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/reolink-omvi-3i-garden.webp"
          alt="Reolink WiFi smart security camera protecting family garden with boy and dog"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] filter brightness-[0.88] contrast-[1.05] scale-[1.02] transition-transform duration-700"
        />

        {/* Clean, high-contrast, welcoming overlay working in both light & dark themes */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/50" />
        <div className="bg-grid-feed animate-gridpan absolute inset-0 opacity-15 pointer-events-none" />

        {/* Subtle Warm Ambience / Scanline Accent */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[rgba(34,211,238,.12)] to-transparent" />
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
          {/* Location Badge / Tag */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-slate-900/80 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7de8f5]">
              LOCAL TO YOU · WEST SUSSEX & WORTHING
            </span>
          </motion.div>

          {/* Live Feed Pill */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 flex items-center gap-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-live absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff4d4d]" />
              </span>
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/90 uppercase">
                Family Home Protection · Active
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4rem]"
          >
            Security you control{" "}
            <br className="hidden sm:inline" />
            <span className="text-[#22d3ee]">and we support</span>.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 font-sans"
          >
            Smart, crystal-clear surveillance tailored for your family, pets, garden, and driveway. Streamed straight to your phone with zero monthly fees and friendly local support.
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
              Book home survey
            </Link>
          </motion.div>

          {/* Trust Stats */}
          <motion.dl
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-7"
          >
            {[
              { k: "500+", v: "Homes protected" },
              { k: "Local", v: "Worthing & Sussex" },
              { k: "4K & WiFi", v: "Smart pet & yard view" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
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
