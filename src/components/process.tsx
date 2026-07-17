import { processSteps } from "@/lib/site";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

export function Process() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="// How it works"
          title="From first knock to fully watched — in four steps."
          intro="A clear path with no jargon and no surprises. You always know what happens next."
        />

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent lg:block" />

          {processSteps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <div className="group relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface font-display text-lg font-bold text-primary-strong transition-colors group-hover:border-primary group-hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]">
                  {step.n}
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
