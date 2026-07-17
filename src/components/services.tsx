import { services } from "@/lib/site";
import { Reveal } from "./reveal";
import { ServiceIcon } from "./service-icon";

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <Reveal className="max-w-2xl">
          <p className="hud mb-4 text-primary-strong">// What we do</p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            One team, from first survey to the last cable.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Maruf handles the whole job in-house — designing coverage, installing
            hardware, and keeping it running. No subcontractors, no guesswork.
          </p>
        </Reveal>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.08}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_50px_-20px_var(--primary-glow)]">
                {/* Top accent line reveals on hover */}
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />

                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-primary-strong ring-1 ring-inset ring-[color-mix(in_srgb,var(--primary)_22%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)]">
                    <ServiceIcon id={service.id} className="h-6 w-6" />
                  </div>
                  <span className="hud text-muted/70">{service.code}</span>
                </div>

                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-line pt-4">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-xs text-foreground/80"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
