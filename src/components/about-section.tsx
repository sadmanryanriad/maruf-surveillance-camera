import { values } from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { ApertureMark } from "./logo";
import { AmbientOrbs } from "./ambient-orbs";

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
                Today we protect homes and families across Worthing and West Sussex — and
                we still answer the phone ourselves.
              </p>
            </div>
          </Reveal>

          {/* Stylized visual panel */}
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface to-surface-2 shadow-lg">
              <div className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-70" />
              <AmbientOrbs />
              <div className="animate-floaty absolute inset-0 flex items-center justify-center text-primary">
                <ApertureMark className="h-32 sm:h-40 w-auto opacity-90" />
              </div>
              <span className="hud absolute left-5 top-5 text-live">● LIVE</span>
              <span className="hud absolute bottom-5 right-5 text-muted">LOCAL & INDEPENDENT</span>
              <span className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-primary/60" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-primary/60" />
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
