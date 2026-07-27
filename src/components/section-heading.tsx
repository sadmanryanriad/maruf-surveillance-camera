import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const alignment =
    align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";
  const cleaned = eyebrow.replace(/^(\/\/|\/|-|—)\s*/, "").trim();
  const formattedEyebrow = `— ${cleaned}`;
  return (
    <Reveal className={`${alignment} ${className}`}>
      <p className="font-sans text-xs font-bold uppercase tracking-wider text-primary mb-3.5">
        {formattedEyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>
      )}
    </Reveal>
  );
}
