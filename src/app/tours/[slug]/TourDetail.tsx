import type { ReactNode } from "react";
import CmsImage from "@/components/ui/CmsImage";
import Link from "next/link";
import { Clock, MapPin, Star, Check, X, ChevronRight, CalendarX, Wallet, Users, User, Plus, Minus, Tag } from "lucide-react";
import type { Tour } from "@/data/types";

const formatPrice = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Tour detail page body (Server Component). `related` is the client-side related-tours carousel. */
export default function TourDetail({ tour, related }: { tour: Tour; related: ReactNode }) {
  const gallery = tour.gallery && tour.gallery.length ? tour.gallery : [tour.image];
  const formattedPrice = formatPrice(tour.price);
  const originalPrice = tour.originalPrice ? formatPrice(tour.originalPrice) : null;
  const locationLabel = tour.destinations.join(", ");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="relative h-[55vh] md:h-[65vh] min-h-[420px] w-full overflow-hidden">
        <CmsImage src={tour.image} alt={tour.title} fill sizes="100vw" loading="eager" fetchPriority="high" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/40 to-primary-deep/10" />
        <div className="container-page relative h-full flex flex-col justify-end pb-10 text-white">
          <Link href="/tours" className="text-xs uppercase tracking-widest text-accent mb-3 inline-flex items-center gap-2 link-underline">← All tours</Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {tour.categories.map((c) => (
              <span key={c} className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/25">{c}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl max-w-4xl leading-[1.05]">{tour.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-white/90">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> {tour.duration}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" /> {locationLabel}</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" /> {tour.rating} ({tour.reviews})</span>
          </div>
        </div>
      </section>

      {/* Mobile sticky price bar */}
      <div className="lg:hidden bg-card border-b border-border p-4 sticky top-16 z-40 shadow-soft">
        <div className="container-page flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-display text-2xl font-bold text-primary-deep">${formattedPrice}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <Link href={`/tours/${tour.slug || tour.id}/book`} className="btn-primary">Book Now</Link>
        </div>
      </div>

      <div className="container-page section-y-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="card-surface p-6 md:p-8">
            <span className="eyebrow">About this tour</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-deep mt-3">Tour Overview</h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">{tour.overview}</p>
          </div>

          {/* Highlights */}
          <div className="card-surface p-6 md:p-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-deep">Tour Highlights</h2>
            <div className="gold-divider mt-3" />
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {tour.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-accent-soft text-accent grid place-items-center flex-shrink-0">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Included / Not Included */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card-surface p-6 md:p-8">
              <h3 className="font-display font-bold text-xl text-primary-deep mb-5">What's Included</h3>
              <ul className="space-y-3 text-sm">
                {tour.inclusions.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center flex-shrink-0 text-xs">✓</span>
                    <span className="text-foreground/85">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-surface p-6 md:p-8">
              <h3 className="font-display font-bold text-xl text-primary-deep mb-5">Not Included</h3>
              <ul className="space-y-3 text-sm">
                {tour.exclusions.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-red-100 text-red-600 grid place-items-center flex-shrink-0 text-xs"><X className="h-3 w-3" /></span>
                    <span className="text-foreground/85">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Itinerary */}
          <div className="card-surface p-6 md:p-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-deep text-center">Your Journey</h2>
            <div className="gold-divider mx-auto mt-3" />
            <div className="mt-10 space-y-10">
              {tour.itinerary.map((step, i) => (
                <div key={i} className="relative">
                  {i !== tour.itinerary.length - 1 && (
                    <div className="absolute left-[2.5rem] top-24 bottom-[-2.5rem] w-0.5 bg-gradient-to-b from-accent/60 to-transparent hidden md:block" />
                  )}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="flex md:block items-center gap-4 flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-emerald text-primary-foreground flex flex-col items-center justify-center shadow-elegant">
                        <span className="text-[10px] font-semibold tracking-widest opacity-90">DAY</span>
                        <span className="text-2xl font-display font-bold leading-none">{i + 1}</span>
                      </div>
                      <p aria-hidden="true" className="font-display text-lg font-bold text-primary-deep md:hidden">{step.title}</p>
                    </div>
                    <div className="flex-grow">
                      <div className="bg-muted/40 rounded-2xl p-5 md:p-6 border border-border/60">
                        <div className="md:flex items-center gap-3 md:mb-3">
                          <span className="hidden md:inline text-[11px] uppercase tracking-widest text-accent font-semibold">{step.day}</span>
                          <span className="hidden md:inline h-px w-6 bg-accent/40" />
                          <h3 className="sr-only md:not-sr-only font-display text-xl font-bold text-primary-deep">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journey in Frames */}
          {gallery.length > 1 && (
            <div className="card-surface p-6 md:p-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-deep">Journey in Frames</h2>
              <p className="text-muted-foreground text-sm mt-1">Moments captured along the route</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((src, idx) => (
                  <div
                    key={idx}
                    className={`relative overflow-hidden rounded-xl group ${idx === 0 ? "col-span-2 row-span-2 h-[320px]" : "h-[150px]"}`}
                  >
                    <CmsImage src={src} alt={`${tour.title} — photo ${idx + 1}`} fill sizes={idx === 0 ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 22vw, 50vw"} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          <FaqSection />
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="card-surface p-7 shadow-elegant overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-gold" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
              <div className="mt-2 flex items-baseline flex-wrap gap-3">
                {originalPrice && <span className="text-xl text-muted-foreground line-through">${originalPrice}</span>}
                <span className="font-display text-4xl font-bold text-primary-deep">${formattedPrice}</span>
                <span className="text-sm text-muted-foreground">/per person</span>
              </div>
              {tour.linkedOffers && tour.linkedOffers.length > 0 ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Available Offers</span>
                  {tour.linkedOffers.map((offer: any) => (
                    <Link href={`/offers/${offer.slug}`} key={offer.id || offer._id} className="flex items-start gap-2.5 p-3 rounded-lg bg-accent-soft border border-accent/20 hover:bg-accent/15 transition group">
                      <div className="h-6 w-6 rounded-full bg-accent/20 text-accent grid place-items-center flex-shrink-0 mt-0.5">
                        <Tag className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-accent group-hover:text-primary-deep transition-colors">{offer.discountBadge}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{offer.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : tour.isOfferAvailable && tour.offerPercentage ? (
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest bg-accent-soft text-accent px-3 py-1.5 rounded-full">
                  Save {tour.offerPercentage}%
                </div>
              ) : null}
              <Link href={`/tours/${tour.slug || tour.id}/book`} className="btn-primary w-full mt-6 text-base py-4">
                Book Now <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-outline w-full mt-3 block text-center">Talk to a specialist</Link>

              <div className="mt-7 space-y-5 pt-6 border-t border-border">
                <Feature icon={<CalendarX className="h-5 w-5" />} title="Free cancellation" desc="Cancel up to 24 hours in advance for a full refund." />
                <Feature icon={<Wallet className="h-5 w-5" />} title="Reserve now & pay later" desc="Keep your travel plans flexible — book your spot and pay nothing today." />
                <Feature icon={<Users className="h-5 w-5" />} title="Live tour guide" desc="English-speaking chauffeur guide" />
                <Feature icon={<User className="h-5 w-5" />} title="Private group" desc="Tailored to you and your travel companions." />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {related}
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-accent-soft text-accent grid place-items-center flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-sm text-primary-deep">{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const FAQS = [
  { q: "Is this tour private or shared?", a: "All our packages are fully private and tailored to your group, with a dedicated chauffeur-guide and air-conditioned vehicle throughout the journey." },
  { q: "Can the itinerary be customised?", a: "Absolutely. Treat the published itinerary as a starting point — we'll happily adjust days, hotels, pace and inclusions to suit you." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 24 hours before the start date. After that, standard hotel and supplier terms apply." },
  { q: "Do I need a visa to visit Sri Lanka?", a: "Most travellers need an ETA, which can be obtained online in minutes. We're glad to share the latest official link on request." },
  { q: "What's the best time to travel?", a: "Sri Lanka is a year-round destination. The west and south coasts shine Dec–Apr; the east coast and Cultural Triangle are best May–Sep." },
];

function FaqSection() {
  return (
    <div className="card-surface p-6 md:p-8">
      <span className="eyebrow">Good to know</span>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-deep mt-3">Frequently Asked Questions</h2>
      <div className="mt-6 divide-y divide-border">
        {FAQS.map((f, i) => (
          <details key={f.q} open={i === 0} className="group py-4">
            <summary className="w-full flex items-center justify-between gap-4 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="font-semibold text-primary-deep">{f.q}</span>
              <span className="h-8 w-8 rounded-full bg-accent-soft text-accent grid place-items-center flex-shrink-0">
                <Plus className="h-4 w-4 group-open:hidden" />
                <Minus className="h-4 w-4 hidden group-open:block" />
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
