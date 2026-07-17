"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

// The 3D scene is client-only (WebGL). Load it without SSR and show a quiet
// placeholder while it hydrates.
const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="hud text-white/55">initializing optics…</span>
    </div>
  ),
});

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function LiveClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { hour12: false });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  // null on first paint avoids a server/client hydration mismatch.
  return <span suppressHydrationWarning>{time ?? "--:--:--"}</span>;
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16" aria-label="Introduction">
      {/* Ambient monitoring grid + glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade opacity-70" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,var(--primary-glow),transparent_60%)] opacity-20 blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-16">
        {/* Copy */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-live absolute inline-flex h-full w-full rounded-full bg-live" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            <span className="hud text-muted">Maruf · Security Systems</span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            Eyes on everything
            <br />
            that <span className="text-primary-strong">matters to you</span>.
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Professionally designed and installed surveillance systems for homes and
            businesses. Clean installs, sharp footage day and night, and monitoring
            that reaches you wherever you are.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/quote"
              className="group rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-surface transition-all hover:shadow-[0_10px_40px_-10px_var(--primary-glow)]"
            >
              Get a free quote
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="#services"
              className="rounded-xl border border-line bg-surface/60 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary-strong"
            >
              Explore services
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.dl
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-7"
          >
            {[
              { k: "500+", v: "Systems installed" },
              { k: "24/7", v: "Active monitoring" },
              { k: "4K", v: "Ultra-HD clarity" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-3xl font-bold tracking-tight">
                  {s.k}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* 3D stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="relative order-first aspect-square w-full lg:order-last lg:aspect-[4/5]"
        >
          {/* Framed monitor viewport — always dark (it's a live feed), so the
              light-shelled camera pops in both light and dark themes. */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_120%_at_70%_10%,#0f1b26,#070b11_72%)] shadow-[0_40px_100px_rgba(0,0,0,.5),inset_0_1px_0_rgba(255,255,255,.05)]">
            <div className="bg-grid-feed animate-gridpan mask-fade absolute inset-0" />
          </div>
          <CornerBrackets />

          {/* Scanline sweep */}
          <div className="pointer-events-none absolute inset-4 overflow-hidden rounded-2xl">
            <div className="animate-scan absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[rgba(34,211,238,.22)] to-transparent" />
          </div>

          {/* Canvas */}
          <div className="absolute inset-0">
            <HeroScene />
          </div>

          {/* HUD readouts (light — they sit on the dark feed) */}
          <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-live absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff4d4d]" />
            </span>
            <span className="hud text-[#ff6b6b]">REC · CAM 01</span>
          </div>
          <div className="pointer-events-none absolute right-6 top-6 hud text-white/55">
            <LiveClock />
          </div>
          <div className="pointer-events-none absolute bottom-6 left-6 hud text-[#5fe0ea]">
            ◎ Tracking
          </div>
          <div className="pointer-events-none absolute bottom-6 right-6 hud text-white/55">
            4K · 24/7 · AI DETECT
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CornerBrackets() {
  const base = "absolute h-6 w-6 border-[#22d3ee]/50";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2`} />
    </>
  );
}
