import type { Metadata } from "next";
import { plans, paymentMethods } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Special Deals & Packages | Maruf Surveillance",
  description:
    "Tailored residential CCTV packages for homes in Worthing and West Sussex. High-spec 4K cameras, free video doorbell deals, and zero monthly subscriptions.",
};

const familyDeals = [
  {
    badge: "LIMITED OFFER",
    title: "Free Smart Video Doorbell",
    desc: "Receive a free smart WiFi video doorbell included with any full home camera installation package.",
    highlight: "£149 Value Included Free",
  },
  {
    badge: "LOCAL SERVICE",
    title: "Free On-Site Security Survey",
    desc: "We visit your property across Worthing & West Sussex, map all entry points, and provide an exact fixed quote.",
    highlight: "100% Free & No Obligation",
  },
  {
    badge: "ZERO RUNNING COSTS",
    title: "No Monthly Subscription Fees",
    desc: "Unlike Ring or Nest, your footage saves to your own encrypted secure local storage with instant free mobile access forever.",
    highlight: "Save £100+ Every Year",
  },
];

export default function DealsPage() {
  const plan = plans[0]; // Customised to you

  return (
    <>
      <PageHeader
        eyebrow="// Exclusive Deals & Packages"
        title="Family home security, tailored to you."
        subtitle="One straightforward, fully customisable option. No bloated packages, no hidden costs, and zero monthly fees."
        crumb="Deals"
      />

      {/* Main Customised Plan Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-primary/50 bg-surface p-6 sm:p-10 md:p-12 shadow-[0_24px_70px_-25px_var(--primary-glow)]">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="hud rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-[var(--on-primary)]">
                  All-in-one residential package
                </span>
                <span className="font-mono text-xs font-semibold text-primary">
                  Worthing & West Sussex Local Specialist
                </span>
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {plan.blurb}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-muted">
                      · {plan.cadence}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted">
                    Every install includes site survey, hardware, weatherproof cabling, smartphone app setup, and 3-year warranty.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href="/quote" variant="primary" size="lg">
                      Request custom quote
                    </ButtonLink>
                    <ButtonLink href="/book" variant="outline" size="lg">
                      Book free survey
                    </ButtonLink>
                  </div>
                </div>

                {/* Features List */}
                <div className="rounded-2xl border border-line bg-surface-2 p-6 sm:p-8">
                  <h3 className="hud mb-4 text-xs font-bold uppercase tracking-wider text-primary">
                    Everything included in your installation:
                  </h3>
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Family Deals Highlight Grid */}
          <div className="mt-16 sm:mt-24">
            <SectionHeading
              eyebrow="// Local Family Offers"
              title="Exclusive Worthing & West Sussex Perks."
              align="center"
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {familyDeals.map((deal, idx) => (
                <Reveal key={deal.title} delay={idx * 0.1}>
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all hover:border-primary/40 hover:-translate-y-1">
                    <div>
                      <span className="hud text-[10px] font-bold tracking-wider text-primary">
                        {deal.badge}
                      </span>
                      <h4 className="mt-2 font-display text-lg font-bold text-foreground">
                        {deal.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {deal.desc}
                      </p>
                    </div>
                    <div className="mt-5 border-t border-line pt-4">
                      <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                        {deal.highlight}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Payment methods */}
          <Reveal className="mt-14">
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface/50 px-6 py-8 text-center">
              <p className="hud text-muted">Convenient payment methods</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {paymentMethods.map((m) => (
                  <span
                    key={m}
                    className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground/80"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted">
                Interest-free instalment options available. No monthly recurring camera charges.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="// Common Questions"
            title="Installation & pricing questions answered."
            align="center"
          />
          <Faq />
        </div>
      </section>

      <CtaBand
        title="Ready to secure your family home?"
        subtitle="Book a free on-site survey anywhere in Worthing & West Sussex or get a quick quote online."
        primary={{ label: "Get a free quote", href: "/quote" }}
        secondary={{ label: "Book a survey", href: "/book" }}
      />
    </>
  );
}
