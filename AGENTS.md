<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 Guidelines
Next.js 16 contains breaking changes. Read guides in `node_modules/next/dist/docs/` before altering core framework patterns.
<!-- END:nextjs-agent-rules -->

# Maruf — Surveillance Camera Installation

Marketing website for Maruf (commercial & residential CCTV/surveillance installation).
Primary conversion goal: **Get a Quote** & **Book Now**.

## Tech Stack & Tools
- **Framework:** Next.js 16 (App Router, `src/`, TypeScript, Turbopack). React Server Components by default; `"use client"` only when browser APIs or interactivity are needed.
- **Package Manager:** `pnpm` (use `pnpm dev`, `pnpm build`, `pnpm lint`).
- **Styling:** Tailwind CSS v4 (`src/app/globals.css` with `@import "tailwindcss"` & `@theme inline`; no `tailwind.config.js`).
- **3D Hero:** `three`, `@react-three/fiber` (v9), `@react-three/drei` (v10). Keep `<Canvas>` dynamically imported (`ssr: false`).
- **Animations:** `motion` (v12, import from `motion/react`). Respect `prefers-reduced-motion`.
- **Fonts:** Manrope (display & body), IBM Plex Mono (HUD/code) via `next/font/google`.

## Design System & Theming
- **Token-Driven:** Semantic CSS variables in `src/app/globals.css`. Never hardcode hex codes in components—use token utilities (`bg-background`, `text-foreground`, `text-muted`, `border-line`, `text-primary`, etc.).
- **Theme Switching:** Driven by `data-theme="dark"` attribute on `<html>` (resolved server-side via `theme` cookie in `layout.tsx`). Default is light. Never use `@media (prefers-color-scheme: dark)` overrides.
- **Intentionally Dark Panels:** Certain elements maintain a dark live-feed HUD aesthetic across both themes: hero live feed banner, floor-plan coverage map, and CTA band.
- **Tokens:** `--background`, `--surface`, `--foreground`, `--muted`, `--primary` (cyan), `--on-primary`, `--rating` (gold), `--line`, `--live` (recording red).

## Architecture & Code Guidelines
- **Routes:** `src/app/` (`/`, `/about`, `/quote`, `/book`, `/payments`).
- **Components:** `src/components/` (shared sections, primitives in `ui/`, forms in `forms/`).
- **Static Data:** Centralized in `src/lib/site.ts`.
- **Forms:** Client-side validated mock shells (`FormShell`, `ContactForm`) displaying simulated submission state.
## Verification
- Always verify changes with `pnpm build` before completing tasks.

## Senior Engineer Mindset & Guidelines
**Act as a senior engineer, not a blind executor:**
- **Challenge mistakes**: Never follow instructions blindly. If a request is flawed, suboptimal, or risky, question it plainly, explain tradeoffs, and propose better alternatives before writing code.
- **Proactively optimize**: Continuously identify performance, architecture, SEO, and UX opportunities and propose them to the owner.
- **Permission for sensitive ops**: Never execute destructive actions, schema/database migrations, financial edits, or infrastructure modifications without explicit permission.
- **Smart verification & living docs**: Before committing, reason if internal docs need updating and keep them in sync. **Calibrate checks by impact**: run full tests/builds/lint only for code/logic changes; for doc-only (`.md`) changes, skip tests, builds, and CI log babysitting entirely; for minor copy/UI tweaks, run fast local checks without redundant full build steps.

