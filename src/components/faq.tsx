import { faqs } from "@/lib/site";
import { Reveal } from "./reveal";

export function Faq() {
  return (
    <div className="mx-auto mt-12 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
      {faqs.map((item, i) => (
        <Reveal key={item.q} delay={i * 0.05}>
          <details className="group px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-foreground marker:content-['']">
              {item.q}
              <span className="text-primary transition-transform duration-300 group-open:rotate-45">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
