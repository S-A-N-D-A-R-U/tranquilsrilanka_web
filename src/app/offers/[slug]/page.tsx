import { notFound } from "next/navigation";
import { getOfferBySlug, getOffers, getTours } from "@/lib/api";
import PageHero from "@/components/ui/PageHero";
import TourCard from "@/components/ui/TourCard";
import Link from "next/link";
import { Metadata } from "next";
import { SITE_NAME, truncate } from "@/lib/seo";

export const revalidate = 3600;

// Pre-render existing pages at build; new slugs are rendered on first visit and then cached
export async function generateStaticParams() {
  const items = await getOffers();
  return items.filter((i: { slug?: string }) => i.slug).map((i: { slug: string }) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return { title: "Offer Not Found" };

  const description = truncate(offer.shortDescription || offer.fullDescription || "");
  const url = `/offers/${offer.slug}`;

  return {
    title: offer.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: offer.title,
      description,
      url,
      siteName: SITE_NAME,
      images: [offer.image],
    },
  };
}

export default async function OfferDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [offer, allTours] = await Promise.all([getOfferBySlug(slug), getTours()]);

  if (!offer) {
    notFound();
  }

  // Find tours that are linked to this offer
  const relatedTours = allTours.filter((t: any) => 
    t.linkedOffers?.some((o: any) => o.slug === slug || o.id === offer.id)
  );

  return (
    <>
      <PageHero 
        image={offer.image} 
        eyebrow="Exclusive Deal" 
        title={offer.title} 
        subtitle={offer.validityText} 
      />

      <section className="container-page section-y">
        <div className="max-w-4xl mx-auto">
          {/* Badge & Info */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="bg-gradient-gold text-primary-foreground font-bold px-4 py-2 rounded-full shadow-gold text-lg">
              {offer.discountBadge}
            </span>
            <span className="text-muted-foreground font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {offer.validityText}
            </span>
          </div>

          {/* Full Description */}
          <div className="prose prose-lg prose-headings:font-display prose-headings:text-primary-deep prose-a:text-accent max-w-none mb-16">
            <p className="text-xl leading-relaxed text-muted-foreground whitespace-pre-line">
              {offer.fullDescription}
            </p>
          </div>

          {/* Related Tours */}
          <div className="border-t border-border pt-16">
            <h2 className="font-display text-3xl font-bold text-primary-deep mb-2">
              Tours included in this offer
            </h2>
            <p className="text-muted-foreground mb-8">
              Select one of the following tours to claim this deal.
            </p>

            {relatedTours.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTours.map((tour: any) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="bg-primary/5 p-8 rounded-2xl text-center border border-border">
                <p className="text-muted-foreground">
                  No tours are currently assigned to this offer. 
                </p>
                <Link href="/tours" className="btn-primary mt-6 inline-flex">
                  Browse All Tours
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-deep section-y text-primary-foreground text-center">
        <div className="container-page">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Claim this offer today</h2>
          <p className="mt-4 text-primary-foreground/75 max-w-xl mx-auto">
            Contact our travel experts and mention "{offer.title}" to secure your discount.
          </p>
          <Link href={`/contact?subject=${encodeURIComponent(`Offer: ${offer.title}`)}`} rel="nofollow" className="btn-gold mt-8">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
