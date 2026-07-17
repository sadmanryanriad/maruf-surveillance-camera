import Link from "next/link";
import { site, socials } from "@/lib/site";
import { ApertureMark } from "./logo";
import { SocialIcon } from "./social-icons";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Services", href: "/#services" },
      { label: "Payments", href: "/payments" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Get a quote", href: "/quote" },
      { label: "Book now", href: "/book" },
      { label: "Contact us", href: "/#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-primary">
              <ApertureMark className="h-7 w-7" />
            </span>
            <span className="font-display text-lg font-bold">
              {site.name}
              <span className="text-primary">.</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline} Professional surveillance for homes and businesses across
            the city.
          </p>
          <div className="mt-6 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-primary hover:text-primary-strong"
              >
                <SocialIcon icon={s.icon} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="hud mb-4 text-muted">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary-strong"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h3 className="hud mb-4 text-muted">Reach us</h3>
          <ul className="space-y-2.5 text-sm text-foreground/80">
            <li>
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="transition-colors hover:text-primary-strong">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-primary-strong">
                {site.email}
              </a>
            </li>
            <li className="text-muted">{site.address}</li>
            <li className="text-muted">{site.hours}</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row sm:px-8">
          <p className="hud text-muted">
            © {new Date().getFullYear()} {site.name} · Surveillance systems
          </p>
          <p className="hud text-muted/70">Licensed · Insured · Certified installers</p>
        </div>
      </div>
    </footer>
  );
}
