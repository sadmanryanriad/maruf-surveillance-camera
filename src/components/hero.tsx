"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[82vh] sm:min-h-[85vh] flex items-center overflow-hidden bg-slate-950 pt-24 pb-16 sm:pt-32 sm:pb-28 text-white scroll-mt-20"
      aria-label="Introduction"
    >
      {/* Background Hero Image */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/reolink-omvi-3i-garden.webp"
          alt="Reolink WiFi smart security camera protecting family garden with boy and dog"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[33%_center] scale-[1.08] translate-y-[2.5%] sm:object-[center_30%] sm:scale-105 sm:translate-x-[4%] sm:translate-y-0 filter brightness-[0.88] contrast-[1.05] transition-transform duration-500"
        />

        {/* High-legibility gradient that ensures text contrast while keeping family and camera visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 sm:via-slate-950/60 to-slate-950/30 sm:to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/30" />
        <div className="bg-grid-feed animate-gridpan absolute inset-0 opacity-15 pointer-events-none" />

        {/* Subtle Warm Ambience / Scanline Accent */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[rgba(34,211,238,.12)] to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 w-full">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
          className="max-w-[270px] sm:max-w-xl lg:max-w-2xl"
        >
          {/* Main Headline */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[4rem]"
          >
            Security you control <br />
            <span className="text-[#22d3ee]">and we support</span>.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-5 max-w-[250px] sm:max-w-xl text-base sm:text-lg leading-relaxed text-white/85 font-sans"
          >
            Smart, crystal-clear surveillance tailored to you, keeping your family and property safe. Streamed straight to your phone with friendly local support.
          </motion.p>

          {/* Action CTA */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#22d3ee] px-8 py-3.5 sm:py-4 text-base font-bold text-[#04222b] transition-all hover:bg-[#7de8f5] shadow-lg shadow-[#22d3ee]/25 w-full sm:w-auto"
            >
              Get a survey now
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
