import Link from "next/link";
import type { ReactNode } from "react";
import { AmbientOrbs } from "./ambient-orbs";
import { Reveal } from "./reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumb,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  crumb: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-60" />
      <AmbientOrbs />
      {/* Scanline sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--primary-glow)_10%,transparent)] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <nav className="hud mb-6 flex items-center gap-2 text-muted" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-primary-strong">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{crumb}</span>
          </nav>
          <p className="hud mb-4 text-primary-strong">{eyebrow}</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
