import type { Metadata } from "next";
import { values } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { StatsBand } from "@/components/stats-band";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { ApertureMark } from "@/components/logo";
import { AmbientOrbs } from "@/components/ambient-orbs";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Maruf is a local surveillance specialist — certified installers, honest advice, and systems built to keep watching for years.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="// About Maruf"
        title="We install the systems we'd trust with our own homes."
        subtitle="A local team of certified installers who treat coverage as a craft — not a box of cameras."
        crumb="About"
      />

      {/* Story */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="hud mb-4 text-primary-strong">// Our story</p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Started by installers, not salespeople.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                Maruf began with a simple frustration: too many security systems were
                sold by the box and installed in a hurry, leaving the exact blind spots
                they were meant to cover.
              </p>
              <p>
                So we built the opposite. Every job starts with a walk of the property
                and an honest conversation about what actually needs watching. Then we
                design, install, and stand behind it.
              </p>
              <p>
                Today we protect hundreds of homes and businesses across the city — and
                we still answer the phone ourselves.
              </p>
            </div>
          </Reveal>

          {/* Stylized visual panel */}
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface to-surface-2">
              <div className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-70" />
              <AmbientOrbs />
              <div className="animate-floaty absolute inset-0 flex items-center justify-center text-primary">
                <ApertureMark className="h-40 w-40 opacity-90" />
              </div>
              <span className="hud absolute left-5 top-5 text-live">● REC</span>
              <span className="hud absolute bottom-5 right-5 text-muted">EST. 2013</span>
              <span className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-primary/60" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-primary/60" />
            </div>
          </Reveal>
        </div>
      </section>

      <StatsBand />

      {/* Values */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="// What we stand for"
            title="Three things we never cut corners on."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
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
      </section>

      <CtaBand />
    </>
  );
}
