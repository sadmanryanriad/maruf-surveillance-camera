import { stats } from "@/lib/site";
import { Counter } from "./counter";
import { Reveal } from "./reveal";

export function StatsBand() {
  return (
    <section className="px-5 py-8 sm:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 rounded-3xl border border-line bg-surface/60 p-8 sm:p-10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <div className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-xs leading-snug text-muted sm:text-sm">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
