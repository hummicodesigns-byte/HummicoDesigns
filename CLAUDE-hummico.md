# CLAUDE.md — Hummico Designs Website (project-specific)

> My global rules in `~/.claude/CLAUDE.md` also apply. This file only covers what's specific to
> this project and overrides the global file where they differ.

## Project
- Astro site rebuilding a client-approved demo into a fast, SEO-ready website for
  **Hummico Designs** — a Houston, Texas herbal tea gift box business (sister-run small business).
- Products are sold on **Etsy**; this site links out to Etsy (no on-site checkout yet).
- Domain: hummicodesigns.com

## Why Astro here (exception to my global Next.js default)
- This is a mostly-static content/marketing site, which is exactly the case where Astro is the
  right call — minimal JavaScript, maximum speed, real static HTML. Stay with Astro for this
  project; do not migrate it to Next.js.

## The reference demo
- The original demo (Vite + React) is added as a working directory at:
  `C:\Users\DELL\OneDrive\Desktop\hummico`
- Reproduce its design **faithfully** — same layout, sections, colors, fonts, spacing, and
  images. Use the demo's real content and real images. Do not redesign, "improve," or add
  sections that aren't in the demo. (This overrides any from-scratch design guidance for the
  parts being reproduced.)

## Project-specific hard rule
- **All content must be real, static HTML in the Astro output** — every heading, product name,
  and line of copy present in View Source, never rendered only by client-side JavaScript. This
  is the whole reason this project uses Astro. Verify it on every page.

## Tech & structure
- Convert the demo's React components into `.astro` components (static HTML). Keep something as a
  React island ONLY if it genuinely needs browser interactivity (e.g. mobile menu, carousel).
- Reuse the demo's CSS. Copy needed images into this project's `public/` or `src/assets/`.
- Structure: `src/layouts/BaseLayout.astro` (shared head/header/footer), `src/pages/` (one file
  per page), `src/components/` (page sections).
- Dev server: `npm run dev` → `http://localhost:4321`. There is no `serve.mjs` and no port 3000.

## Staged workflow
- Do only what the current prompt asks, then stop and report. Build order will be: (1) reproduce
  the homepage design in Astro, (2) verify real HTML, (3) remaining pages, (4) SEO + schema +
  robots.txt + llms.txt + sitemap, (5) blog. **Do not start SEO work until explicitly told** —
  it follows a separate SEO brief I'll provide.
