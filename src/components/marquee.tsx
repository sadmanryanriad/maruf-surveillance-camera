import { brands } from "@/lib/site";

/** Infinite brand strip after the hero. Pure CSS (respects reduced motion). */
export function Marquee() {
  const items = [...brands, ...brands];
  return (
    <section className="relative border-y border-line bg-surface/40 py-8">
      <p className="hud mb-6 text-center text-muted">
        Certified installers of the brands you trust
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max">
          <div className="marquee-track flex shrink-0 items-center gap-16 pr-16">
            {items.map((b, i) => (
              <span
                key={`a-${i}`}
                className="font-display whitespace-nowrap text-2xl font-semibold text-muted/70"
              >
                {b}
              </span>
            ))}
          </div>
          <div
            aria-hidden
            className="marquee-track flex shrink-0 items-center gap-16 pr-16"
          >
            {items.map((b, i) => (
              <span
                key={`b-${i}`}
                className="font-display whitespace-nowrap text-2xl font-semibold text-muted/70"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
