import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";
import { AmbientOrbs } from "./ambient-orbs";

const contactRows = [
  { label: "Call", value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` },
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Visit", value: site.address },
  { label: "Hours", value: site.hours },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <AmbientOrbs
        orbs={[
          { size: 380, top: "0", left: "-8rem", color: "var(--primary-glow)", duration: 16 },
        ]}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Info */}
        <Reveal>
          <p className="hud mb-4 text-primary-strong">// Contact us</p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Let&apos;s talk about
            <br />
            your coverage.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Questions, a new install, or upgrading an old system — send a note and a
            real person gets back to you.
          </p>

          <dl className="mt-10 grid gap-5 sm:grid-cols-2">
            {contactRows.map((row) => (
              <div key={row.label} className="border-l-2 border-primary/40 pl-4">
                <dt className="hud text-muted">{row.label}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {row.href ? (
                    <a href={row.href} className="transition-colors hover:text-primary-strong">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
