
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Special offers & deals",
  description: "Discover Sri Lanka",
};

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { getOffers } from "@/lib/api";

export default async function Offers() {
  const offers = await getOffers();
  return (
    <>
      <PageHero image="/about.webp" eyebrow="Limited Offers" title="Special offers & deals" subtitle="Hand-picked savings on our most-loved itineraries." />

      <section className="container-page section-y">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-7">
          {offers.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <p>No special offers are available at the moment. Please check back later!</p>
            </div>
          ) : (
            offers.map((o: any) => (
              <div key={o.id} className="group card-surface overflow-hidden hover:shadow-elegant transition">
                <div className="relative h-64 overflow-hidden">
                  <img src={o.image} alt={o.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/60 to-transparent" />
                  <span className="absolute top-4 left-4 bg-gradient-gold text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-gold">{o.discountBadge}</span>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl font-bold text-primary-deep">{o.title}</h3>
                  <p className="mt-3 text-muted-foreground line-clamp-3">{o.shortDescription}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-accent">{o.validityText}</span>
                    <Link href={`/offers/${o.slug}`} className="btn-primary !py-2.5 !px-5 text-xs">View details <ChevronRight className="h-3.5 w-3.5" /></Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-primary-deep section-y text-primary-foreground text-center">
        <div className="container-page">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Ready to unlock your dream tour?</h2>
          <p className="mt-4 text-primary-foreground/75 max-w-xl mx-auto">Tell our team about your trip and we'll match you with the best available offer.</p>
          <Link href="/plan-form" className="btn-gold mt-8">Plan Your Tour</Link>
        </div>
      </section>
    </>
  );
}