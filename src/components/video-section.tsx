"use client";

import { useReducedMotion } from "motion/react";
import { ButtonLink } from "./ui/button";
import { Reveal } from "./reveal";

// Free stock footage from Mixkit (Mixkit License — royalty-free, no attribution
// required). For production, self-host or license footage of Maruf's own work.
const VIDEO_720 = "https://assets.mixkit.co/videos/23028/23028-720.mp4";
const VIDEO_360 = "https://assets.mixkit.co/videos/23028/23028-360.mp4";
const POSTER = "https://assets.mixkit.co/videos/23028/23028-thumb-720-0.jpg";

export function VideoSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background video (decorative) */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {reduced ? (
          <img src={POSTER} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER}
          >
            <source src={VIDEO_720} type="video/mp4" />
            <source src={VIDEO_360} type="video/mp4" />
          </video>
        )}
        {/* Legibility + brand tint over the footage */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,18,.82),rgba(6,10,18,.62)_45%,rgba(6,10,18,.9))]" />
        <div className="bg-grid-feed animate-gridpan absolute inset-0 opacity-40" />
        {/* scanline sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-scan absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent via-[rgba(34,211,238,.14)] to-transparent" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <Reveal className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-live absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff4d4d]" />
            </span>
            <span className="hud text-[#7de8f5]">Live feed · See it in action</span>
          </div>
          <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Your property, watched
            <br />
            in real time.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            Crisp day-and-night footage, streamed to your phone and backed up the moment
            it&apos;s captured. This is what peace of mind looks like.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/quote" variant="accent" size="lg">
              Get a free quote
            </ButtonLink>
            <ButtonLink
              href="/book"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-white hover:border-white/60 hover:text-white"
            >
              Book a survey
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
