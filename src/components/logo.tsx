import Link from "next/link";
import { site } from "@/lib/site";

/** Aperture / iris mark — the lens is Maruf's world. */
export function ApertureMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Maruf aperture mark"
      fill="none"
    >
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
      {/* Six iris blades. Round coords: Math.sin/cos can differ in the last
          bits between Node (SSR) and the browser, which would trip hydration. */}
      {Array.from({ length: 6 }).map((_, i) => {
        const r2 = (n: number) => Math.round(n * 1000) / 1000;
        const a = (i * Math.PI) / 3;
        const outer = r2(24 + Math.cos(a + Math.PI / 3) * 21);
        const outerY = r2(24 + Math.sin(a + Math.PI / 3) * 21);
        return (
          <line
            key={i}
            x1={r2(24 + Math.cos(a) * 6)}
            y1={r2(24 + Math.sin(a) * 6)}
            x2={outer}
            y2={outerY}
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.55"
          />
        );
      })}
      <circle cx="24" cy="24" r="6.5" fill="var(--primary)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 text-foreground"
      aria-label={`${site.name} home`}
    >
      <span className="text-primary transition-transform duration-300 group-hover:rotate-45">
        <ApertureMark className="h-8 w-8" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        {site.name}
        <span className="text-primary">.</span>
      </span>
    </Link>
  );
}
