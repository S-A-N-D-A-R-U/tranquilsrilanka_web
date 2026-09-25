# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Next.js 16.2 / React 19.2 docs matching the installed version live in `node_modules/next/dist/docs/` — consult them rather than relying on memory (e.g. route `params` are a `Promise` and must be awaited).

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build (`output: "standalone"`, images unoptimized; see `next.config.ts`)
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`, `eslint-config-next`)
- `npx tsx scripts/seed_database.ts` — **wipes** the `tours` and `activities` collections and reseeds them from `src/data/tours.ts` / `src/data/activities.ts` (maps each item's `id` to `slug`)

There is no test suite. Other files in `scripts/` are one-off codemods/migration helpers from the original port, not part of the workflow.

## Environment

`.env.local` must define `MONGODB_URI` — `src/lib/mongodb.ts` throws at import time without it, so any page touching `@/lib/api` fails. Mail vars: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM` (`src/lib/mailer.ts` also accepts `EMAIL_USER`/`EMAIL_PASS`/`CONTACT_EMAIL`).

## Architecture

Marketing/booking site for "Tranquil Sri Lanka" tours, using the App Router under `src/app` with `@/*` → `src/*`.

**Data flow:** MongoDB (Mongoose) is the source of truth; this repo has no admin UI for editing content.
- `src/models/` — Mongoose schemas: `Tour` (references `Offer` via `linkedOffers`), `Activity`, `Offer`, `Post`, `HeroSlide`.
- `src/lib/mongodb.ts` — cached global connection (survives HMR).
- `src/lib/api.ts` — the only data-access layer. Every getter connects, runs a `.lean()` query, and passes results through `serializeDocument`, which JSON round-trips and renames `_id` → `id`. Getters swallow errors and return `[]`/`null`, so a DB failure renders empty pages rather than throwing. Offers are filtered by `isActive: true`.
- `src/data/types.ts` — TS types (`Tour`, `Activity`, …) used by client components. The rest of `src/data/*.ts` is static seed data, no longer read by pages.

**Page pattern:** route `page.tsx` files are async Server Components that fetch via `@/lib/api`, export `metadata`/`generateMetadata`, set `export const revalidate = 0` (always dynamic), and pass plain serialized data to a co-located `"use client"` component (`ToursClient.tsx`, `TourClientPage.tsx`, `ThingsToDoClient.tsx`, `book/ClientPage.tsx`) that handles filtering/interaction. Detail routes are keyed by `slug` and call `notFound()` when missing. `sitemap.ts` and `robots.ts` are generated from DB data.

**Forms / email:** plan-form, transfer, contact and tour booking submit through Server Actions in `src/app/actions/formActions.ts`, which build HTML and send via `sendEmail` in `src/lib/mailer.ts` (Gmail transporter). `src/app/api/contact/route.ts` is a separate, older POST endpoint with its own transporter config.

**UI:** Tailwind CSS v4 (via `@tailwindcss/postcss`, theme in `src/app/globals.css`), `framer-motion` for animation (shared helpers in `src/lib/motion.ts`, `components/ui/Reveal.tsx`), icons from `lucide-react` and `react-icons`. `components/home/` holds homepage sections (`ExploreMap.tsx` uses SVG paths from `SriLankaPaths.ts`; root `map.svg`/`map.json`/`districts.json` are its source assets), `components/layout/` the Navbar/Footer/WhatsApp button, `components/ui/` shared cards and headers.
