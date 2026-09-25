import { getTourBySlug, getTours } from "@/lib/api";
import { notFound } from "next/navigation";
import TourClientPage from "./TourClientPage";
import { Metadata } from "next";
import { SITE_NAME, SITE_URL, jsonLdScript, truncate } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour Not Found" };

  const title = `${tour.title} — ${tour.duration}`;
  const description = truncate(tour.overview);
  const url = `/tours/${tour.slug || tour.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [tour.image],
      type: "article",
    },
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  const tours = await getTours();

  if (!tour) {
    notFound();
  }

  const url = `${SITE_URL}/tours/${tour.slug || tour.id}`;
  // Only publish a rating when the tour actually has reviews — never invent one
  const hasRating = Number(tour.reviews) > 0 && Number(tour.rating) > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: tour.title,
        image: [tour.image, ...(tour.gallery || [])].map((src: string) => new URL(src, SITE_URL).href),
        description: tour.overview,
        url,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: tour.price,
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        },
        ...(hasRating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tour.rating,
            reviewCount: tour.reviews,
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tours", item: `${SITE_URL}/tours` },
          { "@type": "ListItem", position: 3, name: tour.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <TourClientPage tour={tour} tours={tours} />
    </>
  );
}
