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

**Git flow:** `main` auto-deploys to production on Vercel. Branch features/fixes off `development` (`fix/…`, `feat/…`, `perf/…`), PR into `development`, then release `development` → `main`. `report.md` is the audit/fix backlog.

## Environment

All variables are documented in `.env.example` (copy to `.env.local`). `.env.local` must define `MONGODB_URI` — `src/lib/mongodb.ts` throws at import time without it, so any page touching `@/lib/api` fails (including `next build`, which pre-renders detail pages from the DB). Mail: `src/lib/mailer.ts` uses the Gmail transport with `EMAIL_USER`/`MAIL_USER` + `EMAIL_PASS`/`MAIL_PASS`, recipient `CONTACT_EMAIL` → `MAIL_FROM` → sender. `REVALIDATE_SECRET` enables `POST /api/revalidate`.

## Architecture

Marketing/booking site for "Tranquil Sri Lanka" tours, using the App Router under `src/app` with `@/*` → `src/*`.

**Data flow:** MongoDB (Mongoose) is the source of truth. Content is edited in a separate admin app (sibling repo `../serene-admin`), which calls this site's `/api/revalidate` after each save.
- `src/models/` — Mongoose schemas: `Tour` (references `Offer` via `linkedOffers`), `Activity`, `Offer`, `Post`, `HeroSlide`.
- `src/lib/mongodb.ts` — cached global connection (survives HMR).
- `src/lib/api.ts` — the only data-access layer (`server-only`). Each getter is built with `cachedQuery`: `unstable_cache` (1h, tagged per collection: `tours`, `activities`, `hero-slides`, `offers`, `posts`) wrapped in React `cache()` for per-request dedupe. Errors throw inside the cache (so failures aren't cached) and return `[]`/`null` outside it. Results go through `serializeDocument` (`_id` → `id`). List getters exclude heavy detail-only fields; offers are filtered by `isActive: true`.
- `src/app/api/revalidate/route.ts` — `POST` with `Authorization: Bearer $REVALIDATE_SECRET`, body `{ tags?: [...] }`, calls `revalidateTag(tag, { expire: 0 })`.
- `src/data/types.ts` — TS types (`Tour`, `Activity`, …) used by client components. The rest of `src/data/*.ts` is static seed data, no longer read by pages.

**Page pattern:** route `page.tsx` files are async Server Components that fetch via `@/lib/api`, export `metadata`/`generateMetadata` (root layout sets `title.template` `"%s | Tranquil Sri Lanka"`; pages set `alternates.canonical`), use `export const revalidate = 3600` (ISR), and pass plain serialized data to a co-located `"use client"` component (`ToursClient.tsx`, `TourClientPage.tsx`, `ThingsToDoClient.tsx`, `ContactClient.tsx`, `PlanFormClient.tsx`, `TransferClient.tsx`, `book/ClientPage.tsx`). Keep `page.tsx` a Server Component so it can export metadata — never put `"use client"` on a page. Detail routes are keyed by `slug`, pre-render via `generateStaticParams`, and call `notFound()` when missing. Avoid `loading.tsx` files: streaming starts with status 200 (so `notFound()`/`redirect()` below it can no longer set 404/307), and without JavaScript visitors see only the skeleton. Pages are ISR-cached, so skeletons add little. `sitemap.ts` (hourly) and `robots.ts` are generated from DB data. SEO helpers (`SITE_URL`, `truncate`, `stripHtml`, `jsonLdScript` — always use it for JSON-LD) live in `src/lib/seo.ts`.

**Forms / email:** plan-form, transfer, contact and tour booking submit through Server Actions in `src/app/actions/formActions.ts`: each validates with a zod schema (including the `website` honeypot from `components/ui/Honeypot.tsx`) and builds the email with `emailRows`, which HTML-escapes every value. Never interpolate user input into email HTML directly. Blog HTML must go through `sanitizeRichText` (`src/lib/sanitize.ts`) before `dangerouslySetInnerHTML`.

**Security headers:** CSP and friends are set in `next.config.ts` `headers()`. The iframe allow-list there (`frame-src`) must match `allowedIframeHostnames` in `src/lib/sanitize.ts`. CSP uses `'unsafe-inline'` rather than nonces because nonces would force dynamic rendering and break ISR.

**UI:** Tailwind CSS v4 (via `@tailwindcss/postcss`, theme in `src/app/globals.css`, `@tailwindcss/typography` for `prose` rich text), `framer-motion` for animation (`components/ui/Reveal.tsx`); images use `next/image`, with `components/ui/CmsImage.tsx` for DB-provided URLs (Cloudinary is in `images.remotePatterns`), icons from `lucide-react` and `react-icons`. `components/home/` holds homepage sections (`ExploreMap.tsx` uses SVG paths from `SriLankaPaths.ts`; root `map.svg`/`map.json`/`districts.json` are its source assets), `components/layout/` the Navbar/Footer/WhatsApp button, `components/ui/` shared cards and headers.
