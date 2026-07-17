<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Maruf — Surveillance Camera Installation (marketing site)

Demo marketing website for **Maruf**, a business that installs surveillance / CCTV
camera systems for homes and businesses. Goal of the site: look stunning + modern,
build trust, and drive visitors to **Get a Quote** / **Book Now**.

> This file is the single source of truth for agents. `CLAUDE.md` only imports it
> (`@AGENTS.md`) — put durable project instructions here, not in `CLAUDE.md`.

## Stack

- **Next.js 16** (App Router, `src/` dir, TypeScript, Turbopack). Server Components by
  default; add `"use client"` only for interactivity/browser APIs.
- **Tailwind CSS v4** — configured in CSS (`src/app/globals.css` via `@import "tailwindcss"`
  and `@theme inline`). There is **no `tailwind.config.js`**.
- **3D hero:** `three` + `@react-three/fiber` (v9) + `@react-three/drei` (v10).
- **Animation:** `motion` (v12, the successor to framer-motion). Import from `motion/react`.
- Fonts via `next/font/google`.

## Design system (light theme first)

Theming is **token-based** and dark mode is **live**. All colors are semantic CSS
variables in `src/app/globals.css`:

- Light values live in `:root`; dark overrides live under `.dark, [data-theme="dark"]`.
- **Dark mode is driven by `data-theme="dark"` on `<html>`, resolved on the server** from a
  `theme` cookie in `layout.tsx` (so the first HTML is correct — no flash). The nav
  `ThemeToggle` flips the attribute and writes the cookie. We use a **data attribute, not a
  class**, because React controls `<html>`'s `className` and drops a script-added class on
  hydration. Reading the cookie makes routes dynamically rendered — that's intended.
- Do **not** hardcode hex in components — use token utilities (`bg-background`,
  `text-foreground`, `text-muted`, `border-line`, `text-primary`, `text-[var(--on-primary)]`,
  `text-[var(--rating)]`, etc.) or `var(--token)`. Default is light.
- **Never** use `@media (prefers-color-scheme: dark)` for colors — it fights the strategy.
- A few panels are **intentionally dark in both themes** (a live-feed look): the hero 3D
  monitor, the coverage floor-plan, the video section, and the CTA band. Light text on those
  is correct by design.

Palette (tokens): `--background` (cool signal-white), `--surface` (white),
`--foreground` (deep control-room navy), `--muted` (slate), `--primary` (lens cyan),
`--on-primary` (text on primary fills), `--rating` (star gold), `--line` (hairline),
`--live` (recording red, tiny use only).

Type roles: **display** = Space Grotesk, **body** = IBM Plex Sans, **mono/HUD** = IBM Plex Mono.

**Signature element:** the hero security camera is a real 3D object that *rotates to
follow the cursor* — "we keep watch." The camera model + lighting are **ported from the
client's own "Sentra" Claude-Design mock** (`security-camera.tsx`, `hero-scene.tsx`).
Surveillance-native motifs (field-of-view beam, focus reticle, monitoring grid, mono HUD,
LIVE dot) carry the identity. Spend boldness there; keep everything else quiet. Respect
`prefers-reduced-motion` everywhere (motion helpers + the video section already do).

## Structure

```
src/
  app/
    layout.tsx        # fonts, metadata, <html>/<body>, SiteHeader + <main> + SiteFooter
    page.tsx          # Home = Hero + Marquee + VideoSection + Services + Coverage
                      #        + StatsBand + Process + Testimonials + ContactSection
    about/page.tsx    # About us
    quote/page.tsx    # Get a quote (QuoteForm)
    book/page.tsx     # Book now (BookForm)
    payments/page.tsx # Plans & payments (plans + methods + FAQ)
    globals.css       # Tailwind + design tokens + base + utilities + keyframes
  components/
    ui/               # primitives: Button/ButtonLink, Field/TextArea/SelectField
    ...               # sections + shared: hero (+hero-scene, security-camera),
                      #   marquee (brands), video-section, services, coverage, stats-band,
                      #   process, testimonials, contact-section, cta-band, faq,
                      #   ambient-orbs, counter, reveal, section-heading, page-header,
                      #   theme-toggle, logo, forms (contact/quote/book + form-shell),
                      #   site-header, site-footer
  lib/site.ts         # site config + all static data (nav, services, plans, faqs, ...)
.claude/skills/       # installed skills (see below)
```

- Header + footer live in `layout.tsx` (shared by every route). Pages return only their
  sections; interior pages start with `<PageHeader>` and usually end with `<CtaBand>`.
- **Contact** is a form section (`ContactSection`, `id="contact"`) at the bottom of Home.
- **Forms are demo-only**: `FormShell` (and `ContactForm`) validate client-side and show a
  success state after a simulated delay — no data is sent anywhere. Wire a real backend
  before launch.
- Animation helpers: `AmbientOrbs` (drifting blobs), `Marquee` (CSS `.marquee-track`),
  `Counter` (count-up on scroll), `Reveal` (fade/rise in view). All respect reduced motion.

## Installed skills (`.claude/skills/`)

- `frontend-design` (Anthropic) — design-lead methodology for distinctive, non-templated UI.
- `modern-web-design` — modern design trends / interaction / a11y / perf checklists.
- `react-three-fiber` — R3F patterns + starter for the 3D hero.
- `motion-framer` — `motion` animation patterns (variants, gestures, scroll).
- `next-dev-loop` (Vercel) — verify runtime behavior in a running `next dev`.

Vercel's Next.js "best practices" is delivered via this `AGENTS.md` + the bundled docs in
`node_modules/next/dist/docs/` (Vercel folded the standalone skill into AGENTS.md).

## Conventions

- Keep the 3D `<Canvas>` behind a client wrapper with `next/dynamic` (`ssr: false`).
- Reference files as clickable paths; match surrounding code style.
- Verify changes with `npm run build` and/or the `next-dev-loop` skill before calling done.
