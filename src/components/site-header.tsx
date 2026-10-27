"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Logo } from "./logo";
import { ButtonLink } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

const SECTION_IDS = ["home", "about", "services", "contact"];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);

      // Only run scrollspy when on the home page
      if (pathname !== "/") return;

      const scrollPosition = window.scrollY + 140;

      // Bottom of page check (contact section)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        setActiveSection("contact");
        return;
      }

      // Check each section from bottom to top
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const id = SECTION_IDS[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === "/" && href.includes("#")) {
      e.preventDefault();
      const id = href.replace("/#", "").replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
        setOpen(false);
        window.history.pushState(null, "", `#${id}`);
      }
    } else {
      setOpen(false);
    }
  };

  const isNavActive = (href: string) => {
    if (pathname === "/") {
      const id = href.replace("/#", "").replace("#", "");
      return activeSection === id;
    }
    return pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-md bg-surface/95" : "shadow-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo className="h-11 sm:h-12 md:h-14 w-auto" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Primary">
          {nav.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-all duration-200 relative py-1 ${
                  active
                    ? "text-primary font-bold"
                    : "text-foreground/80 font-medium hover:text-primary"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <ButtonLink href="/book" variant="primary" size="md">
            Get a survey now
          </ButtonLink>
        </div>

        {/* Mobile & tablet controls */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <ThemeToggle />
          <ButtonLink href="/book" variant="primary" size="sm" className="hidden sm:inline-flex">
            Get a survey now
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-foreground"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-background/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4" aria-label="Mobile">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted w-max">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Worthing & West Sussex · Local to you
            </div>
            {nav.map((item) => {
              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`border-b border-line py-3 text-base font-medium last:border-0 transition-colors ${
                    active ? "text-primary font-bold" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-4">
              <ButtonLink href="/book" variant="primary" size="md" className="w-full" onClick={() => setOpen(false)}>
                Get a survey now
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
