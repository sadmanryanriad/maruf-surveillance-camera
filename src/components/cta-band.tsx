import { site } from "@/lib/site";
import { ButtonLink } from "./ui/button";
import { Reveal } from "./reveal";
import { AmbientOrbs } from "./ambient-orbs";

export function CtaBand({
  title = "Ready to see what you've been missing?",
  subtitle = "Book a free site survey. We'll map your coverage and quote the system that fits — no pressure.",
  primary = { label: "Get a free quote", href: "/quote" },
  secondary,
}: {
  title?: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="px-5 py-16 sm:px-8">
      <Reveal>
        {/* Fixed dark panel in both themes — a deliberate contrast card. */}
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#22d3ee]/20 bg-[linear-gradient(130deg,#0c1a22,#0a1017)] px-6 py-14 text-white shadow-[0_40px_100px_rgba(0,0,0,.45)] sm:px-12">
          <div className="bg-grid-feed pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_120%_at_80%_0%,#000,transparent)]" />
          <AmbientOrbs
            orbs={[
              { size: 360, top: "-6rem", right: "-6rem", color: "#22d3ee", duration: 16 },
              { size: 240, bottom: "-5rem", left: "10%", color: "#6aa8ff", duration: 20, delay: 1 },
            ]}
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="hud mb-3 text-[#7de8f5]">// Get started</p>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base text-white/70">{subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href={primary.href} variant="accent" size="lg">
                {primary.label}
              </ButtonLink>
              <ButtonLink
                href={secondary?.href ?? `tel:${site.phone.replace(/[^+\d]/g, "")}`}
                variant="outline"
                size="lg"
                className="border-white/25 bg-transparent text-white hover:border-white/60 hover:text-white"
              >
                {secondary?.label ?? site.phone}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
