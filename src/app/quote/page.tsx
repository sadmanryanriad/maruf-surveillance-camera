import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { QuoteForm } from "@/components/quote-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Tell us about your property and get a tailored, fixed-price quote for your surveillance system within one business day.",
};

const perks = [
  { title: "Fixed-price, no surprises", body: "Your quote includes survey, hardware, install, and setup — all in." },
  { title: "Back within a day", body: "A real person reviews your details and replies within one business day." },
  { title: "Zero obligation", body: "It's free advice and a clear plan. Take it or leave it — no pressure." },
];

export default function QuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="// Get a quote"
        title="A clear, fixed price for exactly what you need."
        subtitle="Answer a few quick questions and we'll design coverage and price it — usually within a business day."
        crumb="Get a quote"
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
          {/* Reassurance */}
          <Reveal>
            <p className="hud mb-4 text-primary-strong">// Why request one</p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
              Know your options before you spend a cent.
            </h2>
            <ul className="mt-8 space-y-6">
              {perks.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-primary-strong">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
