# Tranquil Sri Lanka — Code, SEO & Security Audit

**Site:** https://www.tranquilsrilanka.com
**Stack:** Next.js 16.2 (App Router), React 19.2, MongoDB/Mongoose, Tailwind v4, framer-motion
**Audit date:** 2026-09-26
**Method:** Every route, component, model, action and config file was read by hand. `eslint` and `tsc --noEmit` were run, and each image path the code uses was checked against `public/`.

---

## 1. Executive summary

| Area | Status | Headline |
|---|---|---|
| Technical SEO | 🔴 Poor | 3 key landing pages (Contact, Plan a Trip, Transfers) have **no title/description** because the whole page is a Client Component; no canonical URLs; activities/offers missing from sitemap; "Tours" menu is not crawlable |
| On-page SEO | 🟠 Weak | Placeholder descriptions ("Discover Sri Lanka") on 5 pages; homepage H1 is a rotating slide caption ("Golden Beaches"); blog post has two H1s |
| Structured data | 🟠 Risky | Tour schema invents a **5★ rating from 1 review** when none exists; activity page hard-codes "4.8★"; JSON-LD not escaped |
| Server vs Client components | 🟠 Over-clientified | 17 `"use client"` files; whole pages and static marketing sections ship as JS and start hidden (`opacity:0`) until hydration → slower LCP |
| Performance / Core Web Vitals | 🟠 Weak | `images.unoptimized: true` + plain `<img>` everywhere (22 lint warnings); every page is `revalidate = 0` (DB hit on every request, no caching); duplicate DB queries per request |
| Broken assets | 🔴 | **11 image paths used by live pages do not exist in `public/`** (homepage hero fallback, testimonials, blog/contact/plan-form/about heroes) |
| Security | 🔴 | Stored XSS via blog `dangerouslySetInnerHTML`; HTML injection in all notification emails; no validation / rate-limit / anti-spam on 4 server actions + 1 unused public API route; no security headers |
| Code quality | 🟠 | 46 ESLint errors (30 `any`), dead code, fake newsletter form, footer links pointing to wrong pages, stray Windows path in a className |
| Legal / trust | 🟠 | No Privacy Policy / Terms page (links go to /contact) while collecting personal data from EU/UK travellers |

TypeScript compiles cleanly (`tsc --noEmit` passes). Git history contains no committed secrets (`.env*` is ignored).

---

## 2. Priority fix list

### P0 — fix first (visible damage to rankings, users or security)

1. Move `"use client"` **off** `contact/page.tsx`, `plan-form/page.tsx` and `transfer/page.tsx` so they can export `metadata` (§3.1).
2. Restore or replace the 11 missing images (§6.1).
3. Sanitize blog HTML before rendering, and HTML-escape all user input in emails (§7.1, §7.2).
4. Remove the fabricated `aggregateRating` fallback and the hard-coded `4.8` rating (§4.3).
5. Make the Tours menu real `<Link>`s and add `/offers`, activities and offers to the sitemap (§3.4, §3.5).

### P1 — next

6. Add a `title.template`, canonical URLs, Twitter cards and a default OG image in the root layout (§3.2, §3.3).
7. Replace placeholder meta descriptions (§4.1) and fix the heading structure (§4.2).
8. Switch `revalidate = 0` to ISR plus `React.cache` for data getters (§5.2).
9. Add input validation, a honeypot and rate-limiting to the forms; delete the unused `/api/contact` (§7.3).
10. Add security headers (§7.4).

### P2 — improvements

11. Split big Client Components into server-rendered content with small client "islands" (§5.1).
12. Enable image optimisation / `next/image` (§6.2).
13. Add `not-found.tsx`, `error.tsx`, Privacy/Terms pages, a BreadcrumbList schema, a FAQPage schema and TouristTrip schema (§4.4, §8).
14. Clean up ESLint errors and dead code (§8).

---

## 3. Technical SEO

### 3.1 🔴 Whole pages are Client Components, so they have no metadata

A file marked `"use client"` **cannot export `metadata` or `generateMetadata`**. These routes therefore fall back to the root layout's generic homepage title and description. They end up as duplicate titles in Google, on pages with high commercial intent:

| Route | File | Effect |
|---|---|---|
| `/contact` | `src/app/contact/page.tsx:1` | Title = homepage title |
| `/plan-form` | `src/app/plan-form/page.tsx:1` | Title = homepage title |
| `/transfer` | `src/app/transfer/page.tsx:1` | Title = homepage title. This page has great keyword content (airport transfer routes and prices) that is all shipped as JS. |
| `/tours/[slug]/book` | `src/app/tours/[slug]/book/page.tsx` | Server page, but exports no metadata. It should also be `noindex`. |

**Fix pattern:**
```tsx
// src/app/transfer/page.tsx  (Server Component — no "use client")
export const metadata = {
  title: "Airport & Inter-City Transfers in Sri Lanka",
  description: "Private airport pickups from CMB to Colombo, Kandy, Galle, Ella… fixed prices, English-speaking chauffeurs.",
  alternates: { canonical: "/transfer" },
};
export default function Page() {
  return (<>
    <PageHero … />              {/* static content rendered on server */}
    <FeaturesAndRoutes />       {/* server */}
    <TransferForm />            {/* only the form is "use client" */}
  </>);
}
```
Apply the same split to `contact` and `plan-form`: the form becomes `ContactForm.tsx` with `"use client"`, and the page stays on the server.

### 3.2 🟠 No title template, so page titles are inconsistent

`src/app/layout.tsx:21` sets a plain string title. As a result, some pages add the brand by hand (`| Tranquil Sri Lanka`) and others don't (`"Seat-in-Coach Tours"`, `"Everything you need to know"`, `"Special offers & deals"`, and every tour detail title).

```ts
title: {
  default: "Tranquil Sri Lanka — Tailor-Made Sri Lanka Tours & Travel",
  template: "%s | Tranquil Sri Lanka",
},
```
Then remove the hand-written `| Tranquil Sri Lanka` suffixes from `activities/[slug]`, `blog/[slug]` and `things-to-do`.

### 3.3 🟠 Missing canonical, Twitter card, default OG image and robots metadata

- **No `alternates.canonical` anywhere.** `ToursClient` rewrites the URL to `/tours?type=round&category=…` on every visit (`src/app/tours/ToursClient.tsx:36-41`), and Categories links to `/tours?category=…`. This creates many duplicate URLs for the same page. Add a canonical to every page, e.g. `alternates: { canonical: "/tours" }` and `` `/tours/${slug}` `` on detail pages.
- **No `twitter` metadata**, and **no default OG image**. There is no `opengraph-image` file and the layout has no `images` entry, so shared links for the homepage, about and other pages show no preview image. Add `src/app/opengraph-image.jpg` (1200×630).
- Child `openGraph` objects **replace** the parent's entirely. Tour, activity and blog pages lose `siteName`, `url` and `locale`. Repeat those fields, or spread a shared `baseOpenGraph` object.
- `logo` and `image` in the Organization JSON-LD point to `favicon.ico` (`layout.tsx:40-41`). Google needs a logo of at least 112×112 in PNG, JPG or SVG, so use `/logo.png`.
- Add `alternates.languages` / `hreflang` only if you add translations. The navbar "🌐 EN" button (`Navbar.tsx:91`) currently does nothing and misleads users.

### 3.4 🔴 Sitemap is incomplete (`src/app/sitemap.ts`)

- **Activity pages `/activities/[slug]` are missing**, even though they are some of the site's best long-tail pages.
- **Offer pages `/offers/[slug]` and `/offers` are missing.**
- `/plan-form` is missing (optional).
- `lastModified: new Date()` on every tour and static route tells Google that everything changes on every crawl, which Google learns to ignore. Use the document's `updatedAt`: `Tour` and `Activity` have `timestamps`, but `getTours` would need to return them.
- Blog entries include posts with an `externalLink`, whose `/blog/[slug]` page is just a "Go to External Link" stub (`blog/[slug]/page.tsx:39-46`). Exclude them from the sitemap and return `notFound()` or `redirect(post.externalLink)` for them instead.
- The sitemap runs 2 full-collection DB queries on **every** request. Add `export const revalidate = 3600`.

### 3.5 🔴 Primary navigation is not crawlable

`src/components/layout/Navbar.tsx:40-45, 104-111, 148-149`: "Tours → Round Tour / Day Tour" are `<button onClick={router.push(...)}>` elements. **Crawlers do not click buttons**, so the main menu never links to `/tours` at all. The Hero CTA is also a button (`Hero.tsx:91`). Replace them with:
```tsx
<Link href="/tours?type=round">Round Tours</Link>
<Link href="/tours?type=day">Day Tours</Link>
```
Also consider real, indexable routes such as `/tours/round-tours` and `/tours/day-tours`, each with its own title, description and H1. "Day tours Sri Lanka" and "Sri Lanka round tour" are separate search intents.

**Footer** (`Footer.tsx:24-39`): "Cultural Tours", "Adventure Tours", "Wildlife Safari", "Beach Holidays" and "Honeymoon" all link to plain `/tours`. Point them at `/tours?category=culture` and so on, or better, at dedicated category landing pages. "FAQs", "Terms", "Privacy", "Cookie Policy", "Sitemap" and "Travel Insurance" all link to `/contact`, which is misleading for users and search engines. TripAdvisor and Twitter links are `href="#"`. The address link goes to the bare `https://maps.google.com`.

### 3.6 🟠 Tour listing: filtering hides content from the first HTML response

`/tours` only renders `type === "round"` tours in the server HTML (`ToursClient.tsx:29`). Day tours are only reachable through a client-side tab (a `<button>`), so the listing page never links to them. Once the navbar uses real `?type=day` links (§3.5), crawlers can reach them. Dedicated routes would be better still.

### 3.7 Missing special files

- No `src/app/not-found.tsx`, so 404s render the unstyled default page.
- No `src/app/error.tsx`.
- No `manifest.ts` (web app manifest / theme colour).
- `robots.ts` disallows `/admin/`, which doesn't exist. That is harmless, but also add `disallow: ['/tours/*/book']` or put `noindex` on the booking pages (thin, duplicate form pages).

---

## 4. On-page SEO & content

### 4.1 🟠 Placeholder / weak meta descriptions

| Page | File | Current description |
|---|---|---|
| `/about` | `about/page.tsx:6` | "Discover Sri Lanka" |
| `/blog` | `blog/page.tsx:10-11` | Title **"Tranquil Sri Lanka"**, description "Discover Sri Lanka" |
| `/offers` | `offers/page.tsx:8` | "Discover Sri Lanka" |
| `/seat-in-coach` | `seat-in-coach/page.tsx:6` | "Discover Sri Lanka" |
| `/travel-guide` | `travel-guide/page.tsx:5-6` | Title "Everything you need to know", description "Discover Sri Lanka" |
| `/offers/[slug]` | `offers/[slug]/page.tsx` | **No `generateMetadata` at all** |

Write unique 140–160 character descriptions that target real queries. For example, `/travel-guide` could use the title "Sri Lanka Travel Guide 2026 — Best Time to Visit, Visa, Currency & Tips".

Other description problems:
- `tours/[slug]` uses `tour.overview.slice(0,160)`, which cuts mid-word. Trim at a word boundary and add "…".
- `blog/[slug]:18` uses `post.content.substring(0,160).replace(/<[^>]+>/g,'')`, which cuts **before** stripping tags. HTML posts get descriptions like `"<p><img src=…"` that end up as a few words or empty. Strip first, then trim, or use `post.excerpt`, which already exists in the model.

### 4.2 🟠 Heading structure

- **Homepage H1** is the rotating slide title, e.g. "Golden Beaches" (`Hero.tsx:69`). It changes every 7s, its words are animated from `opacity:0`, and it contains none of the target keywords (Sri Lanka tours / travel agency). Use one static H1 such as *"Tailor-Made Sri Lanka Tours by Local Experts"*, and make the slide captions `<p>` or `<h2>`.
- **Blog post has two `<h1>`s**: one from `PageHero`, then another inside the card (`blog/[slug]/page.tsx:73-78, 83`). Give `PageHero` a prop that renders its title as a `<p>` there.
- The `PageHero` H1 is split into `<span>`s per word (`PageHero.tsx:57-63`). Text extraction usually still works, but screen readers may read the words separately. Add `aria-label={title}` to the `<h1>`.
- Tour itinerary renders every day title **twice** as `<h3>` (mobile and desktop copies, `TourClientPage.tsx:150,157`). Crawlers see duplicate headings. Render once and change the layout with CSS.
- Things-to-do and tours listing cards use `<h3>` with no `<h2>` above them in some layouts, so the heading levels skip.

### 4.3 🔴 Structured data problems

- **Fabricated rating** — `tours/[slug]/page.tsx:47-51`: `ratingValue: tour.rating || 5.0, reviewCount: tour.reviews || 1`. Tours with no reviews publish a made-up 5★ from 1 review. This breaks Google's review snippet policy and can lead to a manual action. Only output `aggregateRating` when real reviews exist, and make sure those numbers come from a genuine review source.
- **Hard-coded rating on activity pages** — `activities/[slug]/page.tsx:45` shows "4.8" for every activity.
- **Schema type**: tours use `Product`. Consider `TouristTrip` (with `itinerary` → `ItemList` of `Place`) combined with an `Offer`, or keep `Product` but add `brand`, `sku` and a real `url`. `availability: InStock` is always set.
- **Article schema** (`blog/[slug]:48-59`) is missing `publisher` (with logo), `mainEntityOfPage`, `description` and `author.url`.
- **No `BreadcrumbList`** on tour, activity, blog or offer pages. Breadcrumbs also help users, and none are visible on the page.
- **No `FAQPage`** for the FAQ block on every tour page. Note that the FAQ text is identical on every tour (`TourClientPage.tsx:317-323`). That duplicated boilerplate is a weak signal. Write tour-specific FAQs, or move the generic ones to a single `/faq` page.
- The layout's `TravelAgency` schema has no `geo`, `openingHours`, `priceRange` or `areaServed`. Add them for local SEO, and also link a Google Business Profile.
- **JSON-LD is not escaped** (see §7.1). If a title contains `</script>`, it breaks out of the tag.

### 4.4 Content / trust signals

- Inconsistent claims: Footer says "Trusted by **10k+** travelers" (`Footer.tsx:52`), while Stats and About say "**500+** happy travellers". Google's quality raters and users notice contradictions like this.
- Testimonials are hard-coded and their photos are missing (§6.1). Pull real reviews from TripAdvisor or Google, and link the TripAdvisor profile (currently `#`).
- Image `alt` text: gallery images use `alt="Journey 1"` (`TourClientPage.tsx:177`). Use descriptive alts such as "Sigiriya Rock at sunrise — {tour.title}". Decorative hero images correctly use `alt=""`.
- Blog: `externalLink` posts open in a new tab through `next/link` without `rel="noopener noreferrer"` (`blog/page.tsx:30`, `LatestNews.tsx:23,38`). Use `<a rel="noopener noreferrer">` for external links, or add `rel` to the Link.
- Dates render with `toLocaleDateString()` on the server, in the server's locale. Use a fixed format (e.g. `en-GB`) and `<time dateTime=…>`.

---

## 5. Server vs Client Components

### 5.1 🟠 Too much is `"use client"`

These 17 files are Client Components:

```
app/contact/page.tsx            app/plan-form/page.tsx         app/transfer/page.tsx
app/tours/ToursClient.tsx       app/tours/[slug]/TourClientPage.tsx
app/tours/[slug]/book/ClientPage.tsx   app/things-to-do/ThingsToDoClient.tsx
components/home/Hero.tsx  About.tsx  Categories.tsx  ExploreMap.tsx  PopularTours.tsx
components/layout/Navbar.tsx  Footer.tsx
components/ui/PageHero.tsx  Reveal.tsx  SectionHeader.tsx
```

Client Components are still server-side rendered, so their text does reach crawlers. The costs are:
1. **More JS to download and hydrate**, which hurts INP/TBT on the mobile networks many travellers use.
2. **Content starts invisible.** framer-motion's `initial={{ opacity: 0 }}` is written into the SSR HTML as `style="opacity:0"`. The page is `<Reveal>`-wrapped section by section (`app/page.tsx:29-38`), and each `SectionHeader`, `About`, `Categories` card and hero H1 word also starts at `opacity:0`. Until hydration finishes, the whole homepage below the fold is invisible and so is the LCP text. If JS fails, it stays invisible. This directly delays **LCP** and gives Google a render where content is hidden.
3. **Metadata cannot be exported** from pages marked `"use client"` (§3.1).
4. **Larger payload.** Tour detail sends the **entire tours collection** to the client (`tours/[slug]/page.tsx:62` → `TourClientPage`) just to compute 6 related tours. The home page also sends all tours and activities to `ExploreMap` and `PopularTours`.

**Recommended split:**

| Component | Should be | Keep client-only |
|---|---|---|
| `TourClientPage` (379 lines) | Server: hero, overview, highlights, inclusions, itinerary, gallery, sidebar | `<RelatedToursCarousel related={…}>` (tabs + scroll) and `<FaqAccordion>`, or use native `<details>/<summary>`, which needs no JS |
| `Footer` | Server | `<NewsletterForm>` only |
| `Navbar` | Server shell with real `<Link>`s | `<MobileMenu>`, `<ScrollAwareHeader>` |
| `About`, `Categories`, `PopularTours`, `SectionHeader` | Server | Put entrance animation in CSS (`@starting-style` / `animation-timeline: view()`) or a tiny wrapper that **doesn't hide content by default** |
| `PageHero` | Server | Ken-Burns effect can be a CSS keyframe |
| `Hero` | Server-render first slide + static H1 | Slider controls as a client island |
| `ToursClient`, `ThingsToDoClient` | Server-render the full list, filtered by `searchParams` (the page already receives them) | Filter controls only |
| `ExploreMap` | Server-render all regions' tour links (e.g. hidden with CSS) so crawlers see them | Region switching |
| `contact`, `plan-form`, `transfer` | Server page + metadata | Form component only |

Also make `Reveal` progressive: don't hide content when JS hasn't run. For example, use `initial={false}` on the server, or gate the animation on a `data-js` attribute.

### 5.2 🟠 Caching and data fetching

- **Every page has `export const revalidate = 0`**, so each request opens MongoDB, runs full-collection queries and renders from scratch. There is no CDN caching and TTFB is slow, which hurts crawl budget and Core Web Vitals. Tours and blog content changes rarely. Use `export const revalidate = 3600` (ISR), or Next 16's `"use cache"` / `cacheTag` with `revalidateTag` when the admin edits content. Check `node_modules/next/dist/docs/` for the version-specific caching API before implementing.
- **Duplicate queries per request.** `generateMetadata` and the page component each call `getTourBySlug` and `getActivityBySlug`. Next only dedupes `fetch`, not Mongoose, so wrap the getters in `React.cache()`:
  ```ts
  import { cache } from "react";
  export const getTourBySlug = cache(async (slug: string) => { … });
  ```
- **Sequential awaits** on the homepage (`app/page.tsx:23-25`) and tour page (`tours/[slug]/page.tsx:32-33`) should run in parallel: `const [tours, activities, slides] = await Promise.all([...])`.
- `LatestNews` fetches **all** posts and then filters in JS. `getTours()` returns full documents (itineraries and all) for card listings. Add `.select()` projections and `.limit()`.
- `api.ts` swallows every DB error and returns `[]`. If the DB is down, Google gets **HTTP 200 pages saying "No tours"** and may drop them from the index. Throw so that `error.tsx` returns a 5xx, or at least don't cache or serve empty lists as normal pages.

---

## 6. Performance & assets

### 6.1 🔴 Missing images (404s on live pages)

These paths are referenced but **do not exist in `public/`**:

| File | Missing |
|---|---|
| `components/home/Hero.tsx:9-12` (fallback slides) | `/img23.jpg`, `/img2.jpg`, `/img25.jpg`, `/img20.jpg` |
| `components/home/Testimonials.tsx:5-7` | `/img12.jpg`, `/img17.jpg`, `/img21.jpg` |
| `app/blog/page.tsx:21` (hero) | `/img6.jpg` |
| `app/contact/page.tsx:40` (hero) | `/img17.jpg` |
| `app/plan-form/page.tsx:38` (hero) | `/img20.jpg` |
| `app/about/page.tsx:51` | `/img9.jpg` |

`src/data/*.ts` also references `/img4…img22`, which would matter if the seed script were run. If these files live only on the production server, commit them. Otherwise they are broken hero images, which means blank LCP elements.

### 6.2 🟠 Image optimisation is turned off

- `next.config.ts:5` sets `images: { unoptimized: true }`, and all images are plain `<img>` (22 ESLint warnings). Every visitor downloads full-size originals. For example, `hill_country.webp` is 734 KB, and `public/` totals 4.7 MB.
- Most `<img>` tags have no `width`/`height`, which causes **CLS**. The navbar logo (`Navbar.tsx:69`) shifts layout on every page.
- **Fix:** remove `unoptimized` (it works with `output: "standalone"`), use `next/image` with `sizes` and `priority` for the LCP image (hero or first slide), and add `images.remotePatterns` for any CDN hosting CMS images.
- Hero preloads all other slide images on idle (`Hero.tsx:36-38`). Fine once optimised, but at current sizes it wastes mobile bandwidth.

### 6.3 Other performance notes

- Two icon libraries are used (`lucide-react` and `react-icons`). `react-icons/fa` is only used in the Footer and WhatsApp button. Use lucide or inline SVGs to drop a dependency.
- `Playfair_Display` loads 5 weights and `DM_Sans` loads 5 weights, 10 font files in total. Trim them to the weights actually used.
- Infinite animations (`animate-ping` on the WhatsApp button, pulse glow, the scroll indicator, and the SVG `<animate>` on the map) run constantly and ignore `prefers-reduced-motion`.
- `ExploreMap.tsx:44` `useMemo` is missing `tours` and `activities` from its deps (ESLint `exhaustive-deps`).

---

## 7. Security

### 7.1 🔴 Stored XSS: blog HTML and JSON-LD

- `blog/[slug]/page.tsx:87`: `<div dangerouslySetInnerHTML={{ __html: post.content }} />` renders DB content **unsanitized**. Anyone who can write a post, or anyone who compromises the DB, the admin panel or its credentials, can run scripts on the public site. Sanitize on write **and** on render with `isomorphic-dompurify` or `sanitize-html`, using an allow-list of tags.
- All JSON-LD blocks (`layout.tsx:72`, `tours/[slug]/page.tsx:56`, `blog/[slug]/page.tsx:64`) use `JSON.stringify(...)` directly. A title containing `</script><script>…` breaks out of the tag. Escape the output:
  ```ts
  const safeJson = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
  ```

### 7.2 🔴 HTML injection in notification emails

`src/app/actions/formActions.ts` (all 4 actions) and `src/app/api/contact/route.ts:32-36` put raw user input into email HTML: `<p>${data.message}</p>`. An attacker can inject links, fake content or tracking pixels into emails your staff trust and act on (phishing). The **subject** line also takes raw input (`data.subject`, `data.name`). Escape every value:
```ts
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
```
and strip `\r\n` from values used in the subject.

### 7.3 🔴 Forms: no validation, no spam protection, no rate limiting

- Server Actions are public POST endpoints. The `data: any` inputs (`formActions.ts:5,29,50,68`) are never validated server-side. Client-side `required` attributes don't protect anything. Validate with `zod`: required fields, an email format check, max lengths (e.g. 5 000 chars for a message) and allowed values.
- There is no honeypot field, CAPTCHA (Cloudflare Turnstile is free) or rate limit. A bot can flood your Gmail inbox, and Gmail will throttle or lock the account, which **stops real booking emails**.
- Set `replyTo: data.email` so staff can reply directly. It is currently missing in `mailer.ts`.
- **`src/app/api/contact/route.ts` is unused.** Nothing calls it, yet it is a live, unauthenticated email-sending endpoint with its own transporter config. Delete it.
- `mailer.ts:3-7` passes both `service: "gmail"` and `host`/`port`. `service` overrides the host. Pick one, and note that the env vars in `.env.local` (`MAIL_HOST`, `MAIL_PORT`) are ignored here. Gmail needs an **App Password**. For deliverability, consider a transactional provider (Resend, SES, Postmark) with SPF/DKIM on `tranquilsrilanka.com`, and send **from** your own domain rather than `@gmail.com`.

### 7.4 🟠 Missing security headers

`next.config.ts` sets no headers. Add them via `async headers()`:
- `Content-Security-Policy` (at least `frame-ancestors 'self'`, `object-src 'none'`, `base-uri 'self'`)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Also set `poweredByHeader: false`.

### 7.5 Other security notes

- `mongodb.ts` throws at **module import** if `MONGODB_URI` is missing. That means `next build` fails in CI without DB credentials. Move the check inside `connectToDatabase()`.
- The Mongoose connection has no `serverSelectionTimeoutMS` or `maxPoolSize` tuning. A DB outage makes each request hang for about 30s.
- `scripts/check-db.js:4` has an empty hard-coded `uri`. It looks like a credential was removed. Make sure that string was never committed; git history was checked and it is clean. Read the value from `process.env` instead.
- `dotenv` is in `dependencies` but only scripts use it. Move it to `devDependencies`.
- Run `npm audit` regularly. `nodemailer` has had header-injection CVEs in the past.

---

## 8. Code quality & bugs

**ESLint:** 80 problems (46 errors, 34 warnings):

| Rule | Count |
|---|---|
| `@typescript-eslint/no-explicit-any` | 30 |
| `@next/next/no-img-element` | 22 |
| `react/no-unescaped-entities` | 15 |
| `@typescript-eslint/no-unused-vars` | 10 |
| `react-hooks/exhaustive-deps` | 2 |
| `react-hooks/set-state-in-effect` | 1 (`Navbar.tsx:31`) |

**Bugs and cleanups:**
- `About.tsx:17`: `className="relative rounded-3xl c:\Users\Sandaruwan\Downloads\img22.webp"`. A local Windows path was pasted into a className. Remove it; it was probably meant to be `overflow-hidden`.
- The **newsletter form is fake** (`Footer.tsx:60-69`): it shows "subscribed" but stores nothing. Either wire it to a list (Mailchimp/Brevo) or remove it, because it misleads visitors.
- The navbar language button (`EN`) does nothing.
- On the activity page, "Book this experience" links to `/contact` with no activity context (`activities/[slug]/page.tsx:79`). Pass `?activity=slug`, or add a booking action like the one tours have.
- The offer CTA "Contact Us" links to `/plan-form` (`offers/[slug]/page.tsx:87`).
- The `prose` classes are used on blog and offer pages, but `@tailwindcss/typography` is **not installed** (`globals.css` only has `@import "tailwindcss"`). HTML blog posts render with no heading, list or paragraph styling. Install the plugin and add `@plugin "@tailwindcss/typography";`.
- `lib/api.ts`: `serializeDocument` uses `JSON.parse(JSON.stringify())` and results are typed `any`. Define real types in one place (`src/data/types.ts` and `src/models/*` duplicate the shapes), and have the getters return `Tour[]`, `Activity[]` and so on.
- The duplicated `id`/`slug` fallbacks (`tour.slug || tour.id`) suggest old data. Make `slug` required everywhere and drop the fallbacks.
- `src/data/*.ts`, `scripts/fix_*.js`, `scripts/migrate_pages.js` and `scripts/test_fetch.ts` are one-off leftovers. Remove them or move them into an `archive/` folder. Root `map.svg`, `map.json` and `districts.json` are source assets; keep them out of the deploy.
- `README.md` is still the create-next-app template. Document setup, env vars and the seed script.
- There is no test suite. At minimum, add a smoke test that builds, then fetches `/`, `/tours`, one tour, `/sitemap.xml` and `/robots.txt`, and asserts 200 plus a `<title>`.

**Legal / compliance:**
- There is no Privacy Policy, Terms, or Cookie Policy page, but the forms collect names, emails, phone numbers and travel dates, many of them from UK/EU visitors (GDPR). Add real `/privacy` and `/terms` pages and link them from the forms and footer.

---

## 9. Suggested SEO growth opportunities

These go beyond the fixes above:

1. **Destination landing pages** such as `/destinations/sigiriya`, `/destinations/ella` and `/destinations/yala`. `ExploreMap` already groups regions and keywords, so reuse that data to build indexable pages listing matching tours and activities.
2. **Category landing pages** such as `/tours/wildlife-safari` and `/tours/honeymoon`, instead of `?category=` query strings.
3. **Build out the travel guide.** It is currently one page. Split it into articles such as "Best time to visit Sri Lanka", "Sri Lanka ETA visa guide" and "Kandy to Ella train", and link them from tours. These are high-volume informational queries.
4. **Internal linking:** link tour itinerary stops to destination pages, and link activities to related tours.
5. **Reviews:** collect first-party reviews (with real `Review` schema) or embed a TripAdvisor or Google widget.
6. **Google Business Profile** for the Kandy office, with NAP (name, address, phone) matching the JSON-LD and footer exactly.
7. **Measurement:** add Google Search Console verification (`metadata.verification.google`) and privacy-friendly analytics, then monitor Core Web Vitals in Search Console after the fixes above.

---

## 10. Quick verification checklist (after fixes)

- [ ] `view-source:` on `/contact`, `/transfer` and `/plan-form` shows a unique `<title>` and meta description
- [ ] Every page has exactly one `<h1>` and a `<link rel="canonical">`
- [ ] `/sitemap.xml` lists tours, activities, offers and blog posts, with real `lastmod` values
- [ ] Rich Results Test (search.google.com/test/rich-results) passes for a tour, blog post and the homepage
- [ ] PageSpeed Insights (mobile): LCP < 2.5s, CLS < 0.1, INP < 200ms on `/` and a tour page
- [ ] No 404s in the browser Network tab on `/`, `/blog`, `/contact`, `/plan-form` and `/about`
- [ ] Submitting a form with `<b>test</b>` in the message shows literal text in the email
- [ ] securityheaders.com grade A or better
- [ ] `npm run lint` passes with 0 errors
