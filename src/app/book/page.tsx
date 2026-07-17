import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BookForm } from "@/components/book-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Book now",
  description:
    "Book a free site survey or installation with Maruf. Pick a day and time that suits you and we'll confirm the details.",
};

const expect = [
  { n: "01", title: "Pick a slot", body: "Choose the day and time window that works for you." },
  { n: "02", title: "We confirm", body: "We'll call or email to lock in the exact time and details." },
  { n: "03", title: "We show up", body: "A certified installer arrives on time, ready to work." },
];

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="// Book now"
        title="Reserve a visit that fits your schedule."
        subtitle="Free site surveys, new installs, upgrades, and maintenance — pick a time and we'll take it from there."
        crumb="Book now"
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
          {/* What to expect */}
          <Reveal>
            <p className="hud mb-4 text-primary-strong">// What to expect</p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
              Three steps, then you&apos;re covered.
            </h2>
            <ol className="mt-8 space-y-6">
              {expect.map((e) => (
                <li key={e.n} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display font-bold text-primary-strong">
                    {e.n}
                  </span>
                  <div>
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="mt-1 text-sm text-muted">{e.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <BookForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
