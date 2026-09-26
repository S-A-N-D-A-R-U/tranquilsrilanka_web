"use client";

import { useRef, useState, useMemo } from "react";
import CmsImage from "@/components/ui/CmsImage";
import Link from "next/link";
import { Clock, MapPin, Star, Check, X, ChevronRight, CalendarX, Wallet, Users, User, ChevronLeft, Plus, Minus, Tag } from "lucide-react";
import TourCard from "@/components/ui/TourCard";
import type { Tour } from "@/data/types";

export default function TourClientPage({ tour, tours }: { tour: any, tours: Tour[] }) {
  const gallery = tour.gallery && tour.gallery.length ? tour.gallery : [tour.image];
  const formattedPrice = tour.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const originalPrice = tour.originalPrice ? tour.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : null;
  const locationLabel = tour.destinations.join(", ");

  type RelatedFilter = "day" | "round" | "special";
  const [relatedFilter, setRelatedFilter] = useState<RelatedFilter>(tour.type === "day" ? "day" : "round");

  const isSpecial = (t: any) =>
    t.categories.some((c: string) => /special|adventure|honeymoon|wildlife|luxur/i.test(c)) || t.isPopular;

  const related = useMemo(() => {
    const others = tours.filter((t) => t.id !== tour.id);
    let pool = others;
    if (relatedFilter === "day") pool = others.filter((t) => t.type === "day");
    else if (relatedFilter === "round") pool = others.filter((t) => t.type === "round");
    else pool = others.filter(isSpecial);

    const scored = pool
      .map((t) => ({ t, score: t.categories.filter((c: string) => tour.categories.includes(c)).length }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.t);

    const list = scored.length ? scored : pool.length ? pool : others;
    return list.slice(0, 6);
  }, [relatedFilter, tour.id, tour.categories]);

  const filterTabs: { id: RelatedFilter; label: string; icon: string }[] = [
    { id: "day", label: "Day Tours", icon: "☀️" },
    { id: "round", label: "Round Tours", icon: "🗺️" },
    { id: "special", label: "Special Activities", icon: "✨" },
  ];

  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="relative h-[55vh] md:h-[65vh] min-h-[420px] w-full overflow-hidden">
        <CmsImage src={tour.image} alt={tour.title} fill sizes="100vw" loading="eager" fetchPriority="high" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/40 to-primary-deep/10" />
        <div className="container-page relative h-full flex flex-col justify-end pb-10 text-white">
          <Link href="/tours" className="text-xs uppercase tracking-widest text-accent mb-3 inline-flex items-center gap-2 link-underline">← All tours</Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {tour.categories.map((c: string) => (
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
              {tour.highlights.map((h: string, i: number) => (
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
                {tour.inclusions.map((it: string) => (
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
                {tour.exclusions.map((it: string) => (
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
              {tour.itinerary.map((step: any, i: number) => (
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
                {gallery.map((src: string, idx: number) => (
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

      {/* Related Tours */}
      {related.length > 0 && (
        <section className="border-t border-border bg-background">
          <div className="container-page section-y">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-deep mt-2">Related Tours</h2>
                <p className="text-muted-foreground mt-2 max-w-xl">Hand-picked journeys that share the spirit of this experience.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => scrollBy(-1)}
                  className="hidden md:grid h-11 w-11 rounded-full border border-border bg-card text-primary-deep place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition shadow-soft"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => scrollBy(1)}
                  className="hidden md:grid h-11 w-11 rounded-full border border-border bg-card text-primary-deep place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition shadow-soft"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Filter toggle */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filterTabs.map((tab) => {
                const active = relatedFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRelatedFilter(tab.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-soft"
                        : "bg-card text-primary-deep border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {related.length === 0 ? (
               <div className="card-surface p-10 text-center text-muted-foreground">
                 No related tours found in this category.
               </div>
            ) : (
              <div
                ref={scrollerRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {related.map((t) => (
                  <div
                    key={t.id}
                    className="snap-start flex-shrink-0 w-[85%] sm:w-[55%] md:w-[42%] lg:w-[32%]"
                  >
                    <TourCard tour={t} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link href="/tours" className="btn-outline inline-flex">
                View All Tours <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ArrowRightIcon() {
  return <ChevronRight className="h-4 w-4" />;
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
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
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="card-surface p-6 md:p-8">
      <span className="eyebrow">Good to know</span>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-deep mt-3">Frequently Asked Questions</h2>
      <div className="mt-6 divide-y divide-border">
        {FAQS.map((f, i) => {
          const active = open === i;
          return (
            <div key={i} className="py-4">
              <button
                onClick={() => setOpen(active ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <span className="font-semibold text-primary-deep">{f.q}</span>
                <span className="h-8 w-8 rounded-full bg-accent-soft text-accent grid place-items-center flex-shrink-0">
                  {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${active ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
