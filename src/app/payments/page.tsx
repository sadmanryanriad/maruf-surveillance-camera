import type { Metadata } from "next";
import { plans, paymentMethods } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Plans & payments",
  description:
    "Transparent pricing for home and business surveillance. Flexible payment methods and interest-free financing options.",
};

export default function PaymentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="// Plans & payments"
        title="Straightforward pricing. Flexible ways to pay."
        subtitle="Every plan is a fixed, all-in price — survey, hardware, and installation included. Pay up front or spread it out."
        crumb="Payments"
      />

      {/* Plans */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.1}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                    plan.featured
                      ? "border-primary/60 bg-surface shadow-[0_24px_70px_-30px_var(--primary-glow)]"
                      : "border-line bg-surface hover:border-primary/40"
                  }`}
                >
                  {plan.featured && (
                    <span className="hud absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[0.6rem] text-[var(--on-primary)]">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{plan.blurb}</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="font-display text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="mb-1 text-xs text-muted">{plan.cadence}</span>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <span className="mt-0.5 text-primary-strong">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <ButtonLink
                    href={plan.id === "enterprise" ? "/quote" : "/book"}
                    variant={plan.featured ? "accent" : "outline"}
                    size="lg"
                    className="mt-8 w-full"
                  >
                    {plan.id === "enterprise" ? "Request a quote" : "Choose plan"}
                  </ButtonLink>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Payment methods */}
          <Reveal className="mt-14">
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface/50 px-6 py-8 text-center">
              <p className="hud text-muted">Accepted payment methods</p>
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
                Interest-free financing available over 6 or 12 months on Business &
                Enterprise systems.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="// Questions"
            title="Payment questions, answered."
            align="center"
          />
          <Faq />
        </div>
      </section>

      <CtaBand
        title="Not sure which plan fits?"
        subtitle="Tell us about your property and we'll recommend the right coverage and price."
        primary={{ label: "Get a free quote", href: "/quote" }}
        secondary={{ label: "Book a survey", href: "/book" }}
      />
    </>
  );
}
