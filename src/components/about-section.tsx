import Image from "next/image";
import { values } from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Story */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-primary mb-3.5">
              — About us
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Started by installers, not salespeople.
            </h2>
            <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-muted">
              <p>
                Silhouette Security Solutions began with a simple frustration: too many security systems were
                sold by the box and installed in a hurry, leaving the exact blind spots
                they were meant to cover.
              </p>
              <p>
                So we built the opposite. Every job starts with a walk of the property
                and an honest conversation about what actually needs watching. Then we
                design, install, and stand behind it.
              </p>
              <p>
                Today we protect homes and families across Worthing and West Sussex — and
                we still answer the phone ourselves.
              </p>
            </div>
          </Reveal>

          {/* Authentic Installation Photography Panel */}
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface shadow-xl group">
              <Image
                src="/images/about-install.jpg"
                alt="Professional security technician neatly installing outdoor CCTV camera on British residential home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-white/90 font-mono tracking-wider">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 backdrop-blur-md border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
                  PRECISION INSTALLATION
                </span>
                <span className="hidden sm:inline-block rounded-full bg-slate-950/80 px-3 py-1.5 backdrop-blur-md border border-white/10 text-white/80">
                  WORTHING & WEST SUSSEX
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Values */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="// What we stand for"
            title="Three things we never cut corners on."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_50px_-20px_var(--primary-glow)]">
                  <span className="hud text-muted/70">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
